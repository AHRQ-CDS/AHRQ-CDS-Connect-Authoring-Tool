# CDS Authoring Tool User Guide

This document helps new users of the Clinical Decision Support Authoring Tool navigate the features of the application and acquire the knowledge of how to use the tool to build CDS artifacts.


### 1.1 Homepage
The homepage is the first page arrived at when entering the CDS Authoring Tool application and serves as a starting point for the user.

TODO: Add image - will be updated this sprint.

1. Main navigation
2. A quick link to get started on a new artifact. The user must be logged in to access this page.
3. A section explaining the role of the CDS Authoring Tool in the CDS Connect ecosystem, with links to the "Agency for Healthcare Research and Quality" and "CDS Connect Repository" websites.  

### 1.2 Main Navigation
This dark blue bar is present across the top of all pages and allows the user to traverse between different sections of the application.

The options on the navigation bar differ depending on whether a user is logged in to the application.

#### 1.2.1 Unauthenticated User Navigation
TODO: Where should the screenshots live?  
![Unauthenticated Nav Bar](Unauthenticated_NavBar.png) 

1. Clicking "Home" will return user to the Homepage.
2. Clicking "Documentation" will open the CDS Authoring Tool User Guide. (TODO: Check this is the workflow)
3. Clicking "Sign Up" will allow a user to register for an account for the CDS Authoring Tool. (TODO: Check this is the workflow)
4. Clicking "Feedback" opens the user's mail application to email questions, concerns, or general feedback to the CDS Authoring Tool creators.

#### 1.2.2 Authenticated User Navigation
![Authenticated Nav Bar](Authenticated_NavBar.png)

1. Clicking "Home" returns user to Homepage.
2. Clicking "Artifacts" navigates to the Artifacts page. When currently on this page, the background of this tab will be grey.
3. Clicking "Workspace" navigates to the Builder page with a new, blank artifact. When currently on this page, the background of this tab will be grey.
4. Clicking on "Documentation" opens the CDS Authoring Tool User Guide. (TODO: Check on workflow)
5. Clicking "Feedback" opens the user's mail application to email questions, concerns, or general feedback to the CDS Authoring Tool creators. (TODO: May need to change that list or clean it up)

TODO Add main headings for each? 2 vs 2.1
### 2.1 Artifacts Page
![Artifact Page](Artifact_Page.png)

1. "New Artifact" form  
  a. The field to enter the new artifact's name, which is required to create a new artifact.  
  b. The field to enter the new artifact's version number.  
  c. Submit button to create the new artifact and add it to the list below.  
2. Artifacts list  
  a. Pencil button opens a modal to edit the artifact information (edit modal detailed below).  
  b. The name of the artifact. This serves as a link, which upon clicking will open the artifact in the Builder page.  
  c. The version number of the artifact.  
  d. The date/time the artifact was last updated.  
  e. Button to delete the artifact entirely.  

### 2.2 Edit Artifact modal  
Upon clicking the pencil button, this modal will open allowing the user to edit an existing artifact's name and/or version number.

![Edit Artifact Modal](Artifact_Modal.png)

1. The field to edit the artifact's name, which cannot be blank.  
2. The field to edit the artifact's version number.  
3. "Save" button to confirm and save changes made to the artifact and close the modal.
4. "X" button to cancel changes made to the artifact and close the modal.


### 3.1 Builder page
The Builder page is the workspace for building artifacts in the CDS Authoring Tool.

![Builder Page](Builder_Page.png)

1. The Builder page header, which contains the name of the artifact currently being worked on and the artifact menu bar (3). This header will be present across all Builder page tabs (4).  
2. Pencil button opens a modal to edit the artifact name and version. For more details, see section 2.2 Edit Artifact modal.
3. The Builder page menu bar, which allows the user to perform actions on the entire artifact.  
  a. Clicking "Download CQL" will generate the CQL files for the current artifact and will download the result onto their computer inside a zip file. The zip file will contain a fold with the artifact's CQL code, as well as any necessary dependancies. It will also contain the corresponding ELM files for all CQL files.  
  b. Clicking "Save" will save all changes made to the artifact.  
4. The Builder page tabs, which divide the Builder page into workflow sections for building an artifact. This helps keep sections of the artifact organized for the user (more on each tab below in sections 3.7-3.12). TODO Check section numbers

### 3.2 Element Picker
The element picker is used to find and add elements into various sections of the artifact. This same module is used across the "Inclusions", "Exclusions", and "Subpopulations" sections of the application.

![Element Picker](Element_Picker.png)

1. The element search field. Click in this field to open the element dropdown (2). Type in this field to narrow the results in the dropdown by the term typed.
2. The element dropdown, which shows relevant elemets filtered by the category selected (4) and the search term (1).
3. An individual element which can be added to the artifact. The element name is displayed, and if looking in "All" categories, will be followed by the category type in parenthesis. Clicking on an element will add it to the artifact.
4. The category dropdown, which allows the user to select which category of elements they wish to filter results by.
5. Clicking "Browse" will launch the "Element Browse" modal.

### 3.3 Element Browse
Similar to the Element Picker, the Element Browse modal enables the user to have a more spacious area to search, view, and add elements to an artifact.

![Element Browse](Element_Browse.png)

1. The element search field. Type in this field to narrow the results in the element list (3) by the term typed.
2. The element category list. Clicking on a category will filter the results in the element list (3) by the selected category. The selected category is highlighted with a grey background.
3. The element list is the result of the filtering by category and search term within the modal. Click on an element (name or "+" button) to add it to the artifact and close the modal.
4. Clicking "Close" with close the modal without adding any elements to the artifact.

### 3.4 Elements
Elements are the main building blocks for an artifact. Each artifact represents different conditions, medications, demographics, etc. Using a combinations of elements together in groups (covered below in "Element Groups" (TODO-which section is that?)) helps the user define different populations for the artifact.

![Element](Element.png)

1. The name of the type of element, in this case the "Diabetes" condition.
2. Move this element out of the current group it belongs to. (Outdent)
3. Move this element inside a new group. (Indent)
4. Clicking this button allows the user to select a saved preset to use for this particular element type.
  a. Upon clicking the "Presets" button (4), a dropdown menu will appear to pick the appropriate preset to apply.
5. Save the current element configuration as a preset.
6. Expand or collapse the current element (helps preseve space and keep workspace tidy).
7. Clicking "X" on an element will delete it.
8. The name of this specific element which the user can specify in the field.
9. The current "Return Type" of this element based on the Expressions (more in section 3.5 Expressions).
10. Add an expression to this element (more in section 3.6 Expressions).

Some elements require additional fields to be filled in, or don't support adding Expressions.

![Gender Element](Gender_Element.png)

1. Some elements have more fields to fill in beyond just the "Element Name". This element ("Gender") requires the user to select which gender is desired, using the select menu. Fill out every field in an element to ensure proper CQL code is generated.
2. Some elements do not support "Expressions". This element ("Gender") does not have any expressions that can be applied to it, and automatically returns a Boolean value.

### 3.5 Expressions
Expressions modify an Element to define or narrow its intent. Many Elements will start as a list, which if left as such, _will generate invalid CQL_. The user must ensure that the Return Type of every Element returns a "Boolean" value. To achieve this, the user can apply Expressions to narrow or filter the previous Expression further. For example, one could start with a list of conditions, then apply the "Most Recent" Expression to find the most recent condition in the list, then apply "Quantity Value" and "Value Comparison" to achieve a Boolean Return Type (pictured below).

Expressions chain onto one another in succession. The Return Type from the first Expression applied will narrow the types of Expressions that can be applied as the second, and so on. The CDS Authoring Tool performs this filtering for the user automatically. 

![Expressions on an Element](Expressions_on_Element.png) 
1. The list of Expressions applied to the element so far (in this example "Most Recent", "Quantity Value", and a comparison).
2. The last Expression that has been applied will appear at the bottom of the Expression list, directly above the "Return Type" label. In this example, the last Expression is a comparison. Note that the comparison Expression has additional fields that need to be filled in. With comparisons, it is acceptable to fill in one or both sides of the comparison.
3. The last Expression can be removed by clicking the "X" button on the far right side of the Expression item. Because of the nature of the Expression chaining, only the last most Expression can be deleted. If the user wishes to delete an Expression higher up in the list, they must first delete all the ones below it.
4. The "Return Type" of the Element will always be listed at the end of the Expressions list.
5. Clicking the "Add Expression" button will reveal a list (to the right of the button) of relevant Expressions that can be applied on the Element.  
  a. Clicking a revealed Expression button will add that Expression to the Element.

### 3.6 Logic Elements
Logic Elements are groups of Elements tied together by a particular conjunction, "And" or "Or". By stringing Elements together with conjunctions, a set of logic can be created to define a population.

![Basic Logic Element](Basic_Logic_Element.png)
1. The outermost light gray box is the first level ("root", or "main") Logic Element, which houses all other Elements and ties them together with a conjunction (2).
2. Between every Element inside a Logic Element group, there will be a dropdown denoting the conjunction used to tie them together. The options for conjunctions are "And" or "Or". Note that within any particular group, the same conjunction must be used. For instance, in the example above, if one changes the first occurance of the conjunction (the first (2) marker) to "Or", the second conjunction will also update to "Or". This avoids creating ambiguous logic for the system to interpret. The user can think of "And" as meaning every Element must be true, while "Or" means at least one of the Elements must be true.
3. Every Logic Element will have an Element Picker (Section 3.2) at the bottom to allow the user to add new Elements to the group.

Logic Elements can also be "nested", which is to say, Logic Elements can have other Logic Elements inside them. Logic Elements can be nested as much as the user desires. Using the Indent/Outdent buttons helps the user quickly group and ungroup individual Elements and entire Logic Element groups.

![Nested Logic Element](Nested_Logic_Element.png)
1. Once again, the outermost Logic Element here is represented as the light grey box.
2. A nested Logic Element, represented by a level of indentation as well as a darker colored grey background.
3. Nested Logic Elements can be named using the "Group Name" field, similar to Elements.
4. Entire Logic Element groups can be indented or outdented, similar to individual Elements. This helps the user move entire groups, rather than just one Element at a time.
5. Again, note that every logic element group will have its own Element Picker, allowing the user to add more Elements or nested Logic Elements to the group.

### 3.7 Inclusions
  

