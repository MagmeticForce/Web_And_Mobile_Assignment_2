# Web_And_Mobile_Assignment_2

## The Less-than-equal-4-Click User Journey Funnel
* Starting state: The UI will show two sections: one for entering input, and one for displaying the output cards based on that input. The input will be entered via a form.
* Article 1: The Data Entry component comes into play with the input section, where the user will enter the necessary data into the fields of the form. The Real-Time Constraints component is applied by giving each field of the form a min and max value, such that the user cannot go below the min or above the max when inputting data; doing so wil display a visual error.
* Article 2: When the user clicks the Submit button, the data will be submitted and displayed in the output section.
* Article 3: The UI state changes by displaying a new card in the output section. The new card will have a label containnig the environmental status tag ("Optimal", "Warning", "Critical Hazard").
* Article 4: The user can interact with the output portion by either deleting and individual card, or purging all of the cards. This can be achieved via buttons that appear when at least one card is present.
* Terminal state: once the user has entered all of the information, the output section will contain one or more cards with varying status tag labels, depending on the needs of the user.

## Don Normal Usability & Constraint Audit
* The <label> tag specifies the item and unit expected in the input field. Furthermore, the <input> tags contain placeholder values, min/max attributes, and hint text to help guide the user.
* Upon clicking Sumbit, each dynamically-created output card will contain a tag indicating an environmental status, such as "Optimal", "Warning", and "Critical Hazard". This is handled by the underlying JavaScript, which uses comparisons in order to determine the appropiate tag to assign.
* Constraints are enforced vis the min and max attributes of the input field. The step attribute can futehr be used to help th user ensure they stay in-range.
* To notify the user that an out-of-bounds input has been entered, a <div> will be dynamically changed in order to display a visual "Error" pop-up. The id attribute will help the underlying JavaScript, and the rule attribute will be used to specify that it is an "alert."
* To remove accidental submissions, each dynamically-generated card will contain a "delete" button, allowing the user to remove the card from the output.
