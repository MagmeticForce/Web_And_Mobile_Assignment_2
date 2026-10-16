// Declare a IFFE function
(function () {
  "use strict()"; // Makes JavaScript throw errors if things are incorrect

  const STORAGE_KEY = "greenhouse_sensor_logger_v1";

  // Bring in the HTML elements (DOM objects) and store it as JS objects:
  // We use the document API
  const sensorForm = document.getElementById("data-form");
  const errorbanner = document.getElementById("form-error-banner");
  const recordsList = document.getElementById("records-list");
  const logsCount = document.getElementById("logs-count");
  const emptyState = document.getElementById("empty-state");
  const buttonClearAll = document.getElementById("button-clear-all");
  const inputName = document.getElementById("bay-name");
  const inputPh = document.getElementById("ph");
  const inputEc = document.getElementById("ec");
  const inputRelativeHumidity = document.getElementById("relative-humidity");
  const inputTemperature = document.getElementById("air-temperature");

  // Initialize the state (of the web page)
  let records = loadRecords();

  // Initialize the UI call, or render:
  render();

  // READ operations
  function loadRecords() {
    try {
      // establish connection with our specific data storage
      const stored_output = localStorage.getItem(STORAGE_KEY); // localStorage is built-in to the browser.
      return stored_output ? JSON.parse(stored_output) : [];
    } catch (error) {
      // could not connect to the database
      console.error("Failed to load records from your data storage.", error);
      return [];
    }
  }

  // WRITE operations
  function saveRecords() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
    } catch (error) {
      console.error("Failed to write to your data storage.", error);
    }
  }

  // Processing logic to create dynamic badges for classification (Warning, Critical, etc)
  function evaluateRisk(
    phInput,
    ecInput,
    temperatureInput,
    relativeHumidityInput,
  ) {
    // console.log(phInput + " " + temperatureInput + " " + ecInput + " " + relativeHumidityInput)
    

    // if (phInput < 5.0 || phInput > 7.5) {console.log("pH, which is" + phInput + ": check!");}
    // if (temperatureInput < 55.0 || temperatureInput > 95.0) {console.log("Temperature, which is" + temperatureInput + ": check!");}
    // if (ecInput < 0.2 || ecInput > 4.5) {console.log("ec, which is " + ecInput + ": check!");}
    // if (relativeHumidityInput < 30 || relativeHumidityInput > 90) {console.log("Relative Humidity, which is " + relativeHumidityInput + ": check!");}

    if (
        (phInput < 5.0 || phInput > 7.5) && 
        (temperatureInput < 55.0 || temperatureInput > 95.0) && 
        (ecInput < 0.2 || ecInput > 4.5) && 
        (relativeHumidityInput < 30 || relativeHumidityInput > 90)
       ) 
    {
      return { level: "critical", label: "Critical" };
    }
    else{console.log("non-critical!");}
    if (
        (phInput >= 5.5 && phInput <= 6.5) && 
        (temperatureInput >= 64.4 && temperatureInput <= 71.6) && 
        (ecInput >= 1.0 && ecInput <= 2.0) && 
        (relativeHumidityInput >= 50 && relativeHumidityInput <= 70)
       ) 
    {
        return { level: "optimal", label: "Optimal" };
    }
    else{console.log("non-optimal!");}
    return { level: "warning", label: "Warning" };
  }

  // Input form validation
  // Throw error immediately if user is trying to enter something wrong
  function validateInput(dataInput) {
    const errors = []; // For going throuh each input field is, looking at what the error message is, and append that to the array.
    if (!dataInput.name.trim()) {
      errors.push("Bay name is a required field");
    }
    if (
        isNaN(dataInput.ph) ||
        dataInput.ph < 0 ||
        dataInput.ph > 14
       ) 
    {
      errors.push("pH must be a number and between 0 and 14.");
    }
    if (
        isNaN(dataInput.ec) ||
        dataInput.ec < 0 ||
        dataInput.ec > 10
       ) 
    {
      errors.push("EC must be a number and between 0 and 10.");
    }
    if (
        isNaN(dataInput.relativeHumidity) || 
        dataInput.relativeHumidity < 0 || 
        dataInput.relativeHumidity > 100
       ) 
    {
      errors.push("Relative Humidity be a number and between 0 and 100.");
    }
    if (
        isNaN(dataInput.temp) || 
        dataInput.temp < -4 || 
        dataInput.temp > 140
       ) 
    {
        errors.push("Air temperature must be a number and between -4 and 140 °F");
    }
    return errors;
  }

  sensorForm.addEventListener("submit", (event) => {
    event.preventDefault(); // relevant to web forms such that they don't reload on submission.

    // Create JavaScript object:
    const formData = {
      id: crypto.randomUUID(),
      name: inputName.value,
      ph: parseFloat(inputPh.value, 10),
      ec: parseFloat(inputEc.value),
      relativeHumidity: parseInt(inputRelativeHumidity.value, 10),
      temp: parseFloat(inputTemperature.value),
      timestamp: new Date().toLocaleTimeString([], {hour: "2-digit", minute: "2-digit"}),
    };

    const validationErrors = validateInput(formData);

    if (validationErrors.length > 0) {
      displayError(validationErrors.join(" "));
      return;
    }

    hideError();

    formData.risk = evaluateRisk(
      formData.ph,
      formData.ec,
      formData.temp,
      formData.relativeHumidity,
    );

    // Add this to the records array that is keeping track of all user input.
    // Shift all elements rightwards and add formData:
    records.unshift(formData);

    saveRecords();

    // Reset the user form after the data is committed to dataStore
    sensorForm.reset();

    // bring the focus to the first input so that user can enter new data
    inputName.focus();

    render();
  });

  // Delete all event
  buttonClearAll.addEventListener("click", (event) => {
    if (records.length === 0) return;

    if (confirm("Are you sure you want to delete all records?")) {
      records = [];
      saveRecords(); // Reset data store
      render();
    }
  });

  // Delete individual card.
  recordsList.addEventListener("click", (event) => {
    // Identify which particular button got pressed, which particular
    // card is being deleted:
    const target = event.target;
    if (target.classList.contains("button-discharge")) {
      const recordId = target.dataset.id; // dataset refers to the data-id attribute, which is used to uniquely identify the record.
      records = records.filter(function (recordIterator) {
        return recordIterator.id !== recordId;
      });
      saveRecords(); // Reset data store
      render();
    }
  });

    // DOM render function
    function render() {
        // We need to know how any records we want to render.
        // To do this, we use our Active Logs and grab from there.
        logsCount.textContent = records.length;
        if (records.length === 0) {
        emptyState.classList.remove("hidden");
        recordsList.innerHTML = "";
        return;
        }

        // if we didn't return...
        emptyState.classList.add("hidden");

        // Create a virtual DOM.
        const fragment = document.createDocumentFragment();
        records.forEach(function (recInput) {
        const li = document.createElement("li");
        li.className = "record-card-status-" + recInput.risk.level;
        li.innerHTML = `
                    <div class="card-top">
                        <div>
                            <div class="record-name-text">${escapeHTML(recInput.name)}</div>
                            <div class="time-stamp">Logged at: ${recInput.timestamp}</div>
                            <span class="status-badge ${recInput.risk.level}">${recInput.risk.label}</span>
                        </div>

                        <div class="stats">
                            <div class="stat-item"> <span>pH</span> ${recInput.ph} </div>
                            <div class="stat-item"> <span>EC</span> ${recInput.ec} </div>
                            <div class="stat-item"> <span>Relative Humidity</span> ${recInput.relativeHumidity} </div>
                            <div class="stat-item"> <span>Air Temperature</span> ${recInput.temp.toFixed(1)}°F </div>
                        </div>
                        <button class="button button-outline-danger button-small button-discharge" data-id="${recInput.id}">
                            Remove Record
                        </button>

                    </div>`;
        // Add child to the virtual DOM
        fragment.appendChild(li);
        });

        // Add the fragment to the real DOM:
        recordsList.innerHTML = "";
        recordsList.appendChild(fragment);
    }

    // Display error messsage is entry is incorrect.
    function displayError(messageInput) {
      errorbanner.textContent = messageInput;
      errorbanner.classList.remove("hidden");
    }

    // Dynamically hide error message on correct input
    function hideError() {
      errorbanner.textContent = "";
      errorbanner.classList.add("hidden");
    }

    // Sanitize user input so that they are unable to inject malicious code.
    function escapeHTML(stringInput) {
      // Repalce &'s, <'s, and >'s. Do this globally across all codes.
      return stringInput.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
    }
})();
