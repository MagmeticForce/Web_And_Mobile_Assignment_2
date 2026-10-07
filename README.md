# Web_And_Mobile_Assignment_2

## The Less-than-equal-4-Click User Journey Funnel
* Starting state: The UI will show two sections: one for entering input, and one for displaying the output cards based on that input. The input will be entered via a form.
* Article 1: The Data Entry component comes into play with the input section, where the user will enter the necessary data into the fields of the form. The Real-Time Constraints component is applied by giving each field of the form a min and max value, such that the user cannot go below the min or above the max when inputting data; doing so wil display a visual error.
* Article 2: When the user clicks the Submit button, the data will be submitted and displayed in the output section.
* Article 3: The UI state changes by displaying a new card in the output section. The new card will have a label containnig the environmental status tag ("Optimal", "Warning", "Critical Hazard").
* Article 4: The user can interact with the output portion by either deleting and individual card, or purging all of the cards. This can be achieved via buttons that appear when at least one card is present.
* Terminal state: once the user has entered all of the information, the output section will contain one or more cards with varying status tag labels, depending on the needs of the user. If the page is refreshed, the output cards will remain.

## Don Norman Usability & Constraint Audit
* The <label> tag specifies the item and unit expected in the input field. Furthermore, the <input> tags contain placeholder values, min/max attributes, and hint text to help guide the user.
* Upon clicking Sumbit, each dynamically-created output card will contain a tag indicating an environmental status, such as "Optimal", "Warning", and "Critical Hazard". This is handled by the underlying JavaScript, which uses comparisons in order to determine the appropiate tag to assign.
* Constraints are enforced vis the min and max attributes of the input field. The step attribute can futehr be used to help th user ensure they stay in-range.
* To notify the user that an out-of-bounds input has been entered, a <div> will be dynamically changed in order to display a visual "Error" pop-up. The id attribute will help the underlying JavaScript, and the rule attribute will be used to specify that it is an "alert."
* To remove accidental submissions, each dynamically-generated card will contain a "delete" button, allowing the user to remove the card from the output.

## Component, DOM Tree & Event Target Architecture

```html
* <body> [STATIC]
  * <header class="portal-header"> (CSS: flex on row, space-between, centered) [STATIC]
    * <div class="header-content"> [STATIC]
      * <div class=brand> [STATIC]
        * <span class="brand=icon"> [STATIC]
        * <h1> [STATIC] (Text: Greenhouse Sensor Logger)
  * <main class="portal-container"> (CSS: flex on row, space-between, centered) [STATIC]
    * <aside class="panel form-panel"> [STATIC]
      * <h2 class="panel-title"> [STATIC]
      * <div class="alert alert-danger hidden"> [DYNAMIC]
    * <form> [STATIC]
      * <div class="form-wrapper"> (CSS: flex on column, space-between, centered)
        * <div class="form-group"> [STATIC] 
          * <label class="form-label"> [STATIC]
            * <span class="required"> (Text: *) [STATIC]
          * <input class="form-control" type="number" name="pH" min="0" max="14" placeholder="6" required> [STATIC]
        * <div class="form-group"> [STATIC] 
          * <label class="form-label"> [STATIC]
            * <span class="required"> (Text: *) [STATIC]
          * <input class="form-control" type="number" name="EC (mS/cm)" min="0" max="10" placeholder="1.8" required> [STATIC]
        * <div class="form-group"> [STATIC] 
          * <label class="form-label"> [STATIC]
            * <span class="required"> (Text: *) [STATIC]
          * <input class="form-control" type="number" name="Air Temperature (°F)" min="-4" max="140" placeholder="75" required> [STATIC]
        * <div class="form-group"> [STATIC] 
          * <label class="form-label"> [STATIC]
            * <span class="required"> (Text: *) [STATIC]
          * <input class="form-control" type="number" name="Relative Humidity" min="0" max="100" placeholder="65" required> [STATIC]
        * <div type="submit" class="button button-primary button-block"> (JavaScript event: type: submit) [STATIC]
    * <section class="panel records-panel"> (CSS: flex on column, space-between, centered)
      * <header class="records-header">
        * <h2 class="panel-title">
        * <button class="button button-outline-danger button-small"> (JavaScript event: type: click)
      * <div class="empty-state"> [DYNAMIC]
        * <span class="empty-icon"> [DYNAMIC]
        * <p> [DYNAMIC] (Text: No active records logged.)
      * <ul class="records-grid"> [DYNAMIC]
        * <li class="record-card"> [DYNAMIC]
  * <footer class="portal-footer"> (flex on column, space-between, center) [STATIC]
    * <p> (copyright text) [STATIC]
```

## Data Schema

```
const loggerSchema = {
  phInput: "float",
  electricalConductivity: "float",
  airTemperature: "float",
  relativeHumidity: "float",
};
```
