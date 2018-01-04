# DRAFT: VSAC Architecture Plan

In general, we need to remove information that was saved on an individual element, such as value set OIDs, and instead leave it up to the user to identify the information. Once the user has selected the value, the vast majority of the code to create the CQL will remain the same.

We need to replace the information we have in the `api/data/valueSets.js` file with information that comes from the user.
This file currently contains element specific information, which was designed to take some complexity away from the users.
However, with a more generalized approach, we have to give more options back to the user.

valueSets.js:

- OIDs
  - Value sets
    - All value set OIDs are defined in `api/data/valueSets.js`
    - These are applied to the CQL output in `api/handlers/cqlHandler.js`
    - It should be simple to apply an OID that was stored based on user's selection from UI.
      - TODO: Decide on the best way to store this type of information.
    - The UI should allow the user to select multiple value sets for one element. These multiple value sets can be looped over in cqlHandler similar to how it is now.
  - Codes and Concepts
    - The user will also have the option to enter individual codes, rather than a value set.
    - (Possibly) The user can choose to group individual codes into a concept.
    - These codes and concepts are applied to the CQL output in `api/handlers/cqlHandler.js`. They can be similarly applied once chosen by the user.


- Units
  - The user will need to use a dropdown/search/plain text box to choose the correct unit when comparing values. We cannot provide units per element using the generic approach.
  - User chosen option will feed the same places the unit is used now (cqlHandler.js).
  - Future versions: Possibly use suggestions in codes as to the correct unit to choose


- Checking inclusion in another value set
  - Right now, this is done using a pre-selected value set defined in `api/data/valueSets.js` (checkInclusionInVS key).
  - Instead, the user will need to search VSAC again for the correct value set to choose from.
  - cqlHandler already provides the templates for add in the the value set to the CQL. Changes will just need to be made to where the information comes in from (like above).


- Medication Statement versus Medication Order
  - The CQL for each of these differs. It is based off of a string defined in `api/data/valueSets.js` now.
  - We could leave this specification off and create both a MedicationOrder and a MedicationStatement for each value set chosen.
    - This approach is not yet supported in cqlHandler, but could be added.
    - CHECK: This may not be a valid approach. In that case, the user would have to select if it was an order or a statement.


There is also some information in `api/data/formTemplates.js` that will need to be taken out. Instead, we will need to give the user more options.

- suppressedModifiers
  - This is a list of modifiers that were determined to be invalid or not yet compatible with certain individual elements.
  - This list will may need to be made more generic to apply to full types of elements (Observation, Medication, etc).
  - Most cases, this list will need to be removed and more options will be given to the users. 
    - For example, we can no longer decide for the user if a Quantity Value or a Concept Value is appropriate. Instead, both options will be displayed in the Expressions list.

