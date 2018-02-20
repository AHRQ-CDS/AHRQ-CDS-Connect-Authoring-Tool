/* eslint max-len: ["error", 130] */
import React, { Component } from 'react';
import tocbot from 'tocbot';
import _ from 'lodash';

function screenshotUrl(name) {
  return `${process.env.PUBLIC_URL}/assets/images/userguide_screenshots/${name}.png`;
}

export default class UserGuide extends Component {
  componentDidMount() {
    tocbot.init({
      tocSelector: '.userguide-toc',
      contentSelector: '.userguide-wrapper',
      headingSelector: 'h1, h2, h3, h4',
      positionFixedSelector: '.userguide-toc',
      collapseDepth: 0 // 0 collapses 6 expands all
    });

    this.userGuide = document.querySelector('.userguide');
    this.userGuideStyle = window.getComputedStyle(this.userGuide);
    this.toc = document.querySelector('.userguide-toc');
    this.throttledScrollListener = _.throttle(this.scrollListener.bind(this), 50);

    document.addEventListener('scroll', this.throttledScrollListener, { passive: true });
    document.addEventListener('resize', this.throttledScrollListener, { passive: true });
  }

  componentWillUnmount() { // eslint-disable-line class-methods-use-this
    tocbot.destroy();

    document.removeEventListener('scroll', this.throttledScrollListener, { passive: true });
    document.removeEventListener('resize', this.throttledScrollListener, { passive: true });
  }

  scrollListener() {
    const { userGuide, toc } = this;
    const { bottom } = userGuide.getBoundingClientRect();
    const windowBottom = window.innerHeight || document.documentElement.clientHeight;

    if ((bottom + parseInt(this.userGuideStyle.paddingBottom, 10)) <= windowBottom) {
      toc.classList.add('at-bottom');
      userGuide.classList.add('is-position-relative');
    } else if (toc.classList.contains('at-bottom')) {
      toc.classList.remove('at-bottom');
      userGuide.classList.remove('is-position-relative');
    }
  }

  render() { // eslint-disable-line class-methods-use-this
    return (
      <div className="userguide" id="maincontent">
        <div className="userguide-toc toc" id="toc"></div>

        <div className="userguide-wrapper">
          <div className="userguide-guide">
            <h1 id="CDS_Authoring_Tool_User_Guide">CDS Authoring Tool User Guide</h1>

            <p>
              The Clinical Decision Support (CDS) Authoring Tool is a web-based application aimed at simplifying the
              creation of production-ready CQL code. The project is based on "concept templates" (e.g. gender, HDL
              Cholesterol, etc.), which allow for additional clinical concepts to be included in the future. Concept
              modifiers are included to allow for more flexible definitions (e.g. most recent, value comparisons, etc.).
            </p>

            <p>
              The CDS Authoring Tool is part of the CDS Connect project, sponsored by the Agency for Healthcare
              Research and Quality (AHRQ), and developed under contract with AHRQ by MITRE's CMS Alliance to Modernize
              Healthcare (CAMH) FFRDC.
            </p>

            <p>
              This document helps new users of the CDS Authoring Tool navigate the features of the application and
              acquire the knowledge of how to use the tool to build CDS artifacts.
            </p>

            <div className="h2-wrapper">
              <h2 id="Homepage_and_Navigation">1. Homepage and Navigation</h2>

              <div className="h3-wrapper">
                <h3 id="Homepage">1.1 Homepage</h3>

                <p>
                  The homepage is the first page arrived at when entering the CDS Authoring Tool application and serves as a
                  starting point for the user.
                </p>

                <p>
                  <img
                    alt="Homepage"
                    src={screenshotUrl('Homepage')}
                    className="img-fluid img-thumbnail rounded mx-auto d-block" />
                </p>

                <ol>
                  <li>Main navigation for the CDS Authoring Tool.</li>

                  <li>
                    The Login button opens a form for the user to log in to the CDS Authoring Tool. The user must enter the
                    username and password they created when signing up for an account with the CDS Authoring Tool.
                  </li>

                  <li>The main content provides a brief introduction to the CDS Authoring Tool.</li>
                </ol>
              </div>

              <div className="h3-wrapper">
                <h3 id="Main_Nav">1.2 Main Navigation</h3>

                <p>
                  This dark blue bar is present across the top of all pages and allows the user to traverse between different
                  sections of the application. When currently on a page, the background of the tab will be grey.
                </p>

                <p>The options on the navigation bar differ depending on whether a user is logged in to the application.</p>

                <div className="h4-wrapper">
                  <h4 id="Unauthenticated_NavBar">1.2.1 Unauthenticated User Navigation</h4>

                  <p>
                    <img
                      alt="Unauthenticated Nav Bar"
                      src={screenshotUrl('Unauthenticated_NavBar')}
                      className="img-fluid img-thumbnail rounded mx-auto d-block" />
                  </p>

                  <ol>
                    <li>Clicking "Home" returns user to the Homepage.</li>
                    <li>Clicking "Documentation" opens the CDS Authoring Tool User Guide.</li>

                    <li>
                      Clicking "Sign Up" allows a user to register for an account for the CDS Authoring Tool. A separate form
                      will open, and the user must fill out the relevant information to request an account.
                    </li>

                    <li>
                      Clicking "Feedback" loads a contact form to submit questions, concerns, or general
                      feedback to the CDS Connect team.
                    </li>
                  </ol>
                </div>

                <div className="h4-wrapper">
                  <h4 id="Authenticated_NavBar">1.2.2 Authenticated User Navigation</h4>

                  <p>
                    <img
                      alt="Authenticated Nav Bar"
                      src={screenshotUrl('Authenticated_NavBar')}
                      className="img-fluid img-thumbnail rounded mx-auto d-block" />
                  </p>

                  <ol>
                    <li>Clicking "Home" returns user to Homepage.</li>
                    <li>Clicking "Artifacts" navigates to the Artifacts page.</li>
                    <li>Clicking "Workspace" navigates to the Workspace page with a new, blank artifact.</li>
                    <li>Clicking "Documentation" opens the CDS Authoring Tool User Guide.</li>

                    <li>
                      Clicking "Feedback" loads a contact form to submit questions, concerns, or general
                      feedback to the CDS Connect team.
                    </li>
                  </ol>
                </div>
              </div>
            </div>

            <div className="h2-wrapper">
              <h2 id="Manage_Artifacts">2. Manage Artifacts</h2>

              <div className="h3-wrapper">
                <h3 id="Artifacts_Page">2.1 Artifacts Page</h3>

                <p>
                  <img
                    alt="Artifact Page"
                    src={screenshotUrl('Artifact_List')}
                    className="img-fluid img-thumbnail rounded mx-auto d-block" />
                </p>

                <ol>
                  <li>"New Artifact" form
                    <ol type='a'>
                      <li>
                        The "Artifact Name" field is used to enter the new artifact's name, which is required to create a new
                        artifact.
                      </li>

                      <li>The "Version" field is used to enter the new artifact's version number.</li>
                      <li>The "New Artifact" button creates the new artifact and adds it to the list below.</li>
                    </ol>
                  </li>

                  <li>Artifacts list
                    <ol type='a'>
                      <li>The "Edit" button opens a modal to edit the artifact information (edit modal detailed below).</li>

                      <li>
                        The name of the artifact serves as a link, which upon clicking will open the artifact in the
                        Workspace.
                      </li>

                      <li>The "Version" specifies the version number of the artifact.</li>
                      <li>The "Updated" column specifies the date/time the artifact was last updated.</li>
                      <li>The "Delete" button opens a modal to confirm permanently deleting an artifact.</li>
                    </ol>
                  </li>
                </ol>
              </div>

              <div className="h3-wrapper">
                <h3 id="Edit_Artifact_Modal">2.2 Edit Artifact modal</h3>

                <p>
                  Upon clicking the "Edit" button, the "Edit modal" will open allowing the user to edit an existing artifact's
                  name and/or version number.
                </p>

                <p>
                  <img
                    alt="Edit Artifact Modal"
                    src={screenshotUrl('Artifact_Modal')}
                    className="img-fluid img-thumbnail rounded mx-auto d-block" />
                </p>

                <ol>
                  <li>
                    The "Artifact Name" field is used to edit the artifact's name, which cannot be blank. It is prepopulated
                    with the current name of the artifact.
                  </li>

                  <li>
                    The "Version" field is used to edit the artifact's version number. It is prepopulated with the current
                    version of the artifact.
                  </li>

                  <li>The "Save" button is used to confirm and save changes made to the artifact and close the modal.</li>
                  <li>The "Close Edit Modal" button is used to cancel changes made to the artifact and close the modal.</li>
                </ol>
              </div>
            </div>

            <div className="h2-wrapper">
              <h2 id="Building_Artifacts">3. Building Artifacts</h2>

              <div className="h3-wrapper">
                <h3 id="Workspace">3.1 Workspace</h3>

                <p>The Workspace tab is the main space for building artifacts in the CDS Authoring Tool.</p>

                <p>
                  <img
                    alt="Workspace"
                    src={screenshotUrl('Workspace')}
                    className="img-fluid img-thumbnail rounded mx-auto d-block" />
                </p>

                <ol>
                  <li>
                    The "Workspace Header" contains the name of the artifact currently being worked on and the workspace menu
                    bar (3). This header will be present across all workspace tabs (4).
                  </li>

                  <li>
                    The "Edit" button opens a modal to edit the artifact name and version. For more details, see section 2.2
                    Edit Artifact modal.
                  </li>

                  <li>
                    The "Workspace Menu Bar" allows the user to perform actions on the entire artifact.

                    <ol type='a'>
                      <li>
                        Clicking "Download CQL" will generate the CQL files for the current artifact and will download the
                        result onto their computer inside a zip file. The zip file will contain a folder with the artifact's
                        CQL code, as well as any necessary dependencies. It will also contain the corresponding ELM files for
                        all CQL files.
                      </li>

                      <li>Clicking "Save" will save all changes made to the artifact.</li>
                    </ol>
                  </li>

                  <li>
                    The "Workspace Tabs" divide the workspace into workflow sections for building an artifact. This helps keep
                    sections of the artifact organized for the user (more on each tab below in sections 3.7-3.12).
                  </li>
                </ol>
              </div>

              <div className="h3-wrapper">
                <h3 id="Element_Picker">3.2 Element Picker</h3>

                <p>
                  The element picker is used to find and add elements into various sections of the artifact. This same module
                  is used across the "Inclusions", "Exclusions", and "Subpopulations" sections of the application.
                </p>

                <p>
                  <img
                    alt="Element Picker"
                    src={screenshotUrl('Element_Picker')}
                    className="img-fluid img-thumbnail rounded mx-auto d-block" />
                </p>

                <ol>
                  <li>
                    The "Add Element" search field. Click in this field to open the "Add Element" dropdown (2). Type in this
                    field to narrow the results in the dropdown by the term typed.
                  </li>

                  <li>
                    The "Add Element" dropdown shows relevant elements filtered by the category selected (4) and the search
                    term (1).
                  </li>

                  <li>
                    Individual elements can be added to the artifact from the dropdown opened by the "Add Element" search
                    field. The element name is displayed, and if looking in "All" categories, will be followed by the
                    category type in parenthesis. Clicking on an element will add it to the artifact.
                  </li>

                  <li>
                    The "Narrow elements by category" dropdown allows the user to select which category of elements they
                    wish to filter results by.
                  </li>

                  <li>Clicking the "Browse" button will launch the "Element Browse" modal.</li>
                </ol>
              </div>

              <div className="h3-wrapper">
                <h3 id="Element_Browse">3.3 Element Browse</h3>

                <p>
                  Similar to the Element Picker, the Element Browse modal enables the user to have a more spacious area to
                  search, view, and add elements to an artifact.
                </p>

                <p>
                  <img
                    alt="Element Browse"
                    src={screenshotUrl('Element_Browse')}
                    className="img-fluid img-thumbnail rounded mx-auto d-block" />
                </p>

                <ol>
                  <li>
                    The "Search Elements" field allows a user to type in this field to narrow the results in the element list
                    (3) by the term typed.
                  </li>

                  <li>
                    The "Element Categories" list on the left contains all possible categories. Clicking on a category will
                    filter the results in the element list (3) by the selected category. The selected category is highlighted
                    with a grey background.
                  </li>

                  <li>
                    The "Element List" is the result of the filtering by category and search term within the modal. Click on
                    an element (name or "+" button) to add it to the artifact and close the modal.
                  </li>

                  <li>Clicking the "Close" button will close the modal without adding any elements to the artifact.</li>
                </ol>
              </div>

              <div className="h3-wrapper">
                <h3 id="Elements">3.4 Elements</h3>

                <p>
                  Elements are the main building blocks for an artifact. Each artifact represents different conditions,
                  medications, demographics, etc. Using a combination of elements together in groups (covered below in
                  Section 3.6 "Logic Elements") helps the user define different populations for the artifact.
                </p>

                <p>
                  <img
                    alt="Element"
                    src={screenshotUrl('Element')}
                    className="img-fluid img-thumbnail rounded mx-auto d-block" />
                </p>

                <ol>
                  <li>
                    The name of the type of element appears at the top of the element, in this case the "Diabetes" condition.
                  </li>

                  <li>The "Outdent" button moves the element out of the current group it belongs to.</li>
                  <li>The "Indent" button moves the element inside a new group.</li>

                  <li>
                    The "Hide" element button expands or collapses the current element (helps preserve space and keep
                    workspace tidy).
                  </li>

                  <li>Clicking the "Remove" element button will delete the element.</li>

                  <li>
                    The "Element Name" field provides the name of this specific element, which the user can specify in the
                    field.
                  </li>

                  <li>
                    The "Return Type" gives the current return type of this element based on the Expressions (more in section
                    3.5 Expressions).
                  </li>

                  <li>The "Add Expression" button adds an expression to this element (more in section 3.5 Expressions).</li>
                </ol>

                <p>Some elements require additional fields to be filled in, or don't support adding Expressions.</p>

                <p>
                  <img
                    alt="Gender Element"
                    src={screenshotUrl('Gender_Element')}
                    className="img-fluid img-thumbnail rounded mx-auto d-block" />
                </p>

                <ol>
                  <li>
                    Some elements have more fields to fill in beyond just the "Element Name". For example, the "Gender"
                    element requires the user to select which gender is desired, using the select menu. Fill out every field
                    in an element to ensure proper CQL code is generated.
                  </li>

                  <li>
                    Some elements do not support "Expressions". These elements will not have an "Add Expression" button. For
                    example, "Gender" does not have any expressions that can be applied to it, and automatically returns a
                    Boolean value.
                  </li>
                </ol>
              </div>

              <div className="h3-wrapper">
                <h3 id="Expressions">3.5 Expressions</h3>

                <p>
                  Expressions modify an Element to define or narrow its intent. Many Elements will start as a list, which if
                  left as such, <em>will generate invalid CQL</em>. The user must ensure that the Return Type of every Element
                  returns a "Boolean" value. To achieve this, the user can apply Expressions to narrow or filter the previous
                  Expression further. For example, one could start with a list of conditions, then apply the "Most Recent"
                  Expression to find the most recent condition in the list, then apply "Quantity Value" and "Value Comparison"
                  to achieve a Boolean Return Type (pictured below).
                </p>

                <p>
                  Expressions chain onto one another in succession. The Return Type from the first Expression applied will
                  narrow the types of Expressions that can be applied as the second, and so on. The CDS Authoring Tool
                  performs this filtering for the user automatically.
                </p>

                <p>
                  <img
                    alt="Expressions on an Element"
                    src={screenshotUrl('Expressions_on_Element')}
                    className="img-fluid img-thumbnail rounded mx-auto d-block" />
                </p>

                <ol>
                  <li>
                    The "Expression List" lists all expressions applied to the element so far (in this example "Most Recent",
                    "Quantity Value", and a comparison).
                  </li>

                  <li>
                    The last Expression that has been applied will appear at the bottom of the Expression list, directly above
                    the "Return Type" label. In this example, the last Expression is a comparison. Note that the comparison
                    Expression has additional fields that need to be filled in. With comparisons, it is acceptable to fill in
                    one or both sides of the comparison.
                  </li>

                  <li>
                    The last Expression can be removed by clicking the "Remove last expression" button on the far right side
                    of the Expression item. Because of the nature of the Expression chaining, only the last Expression can be
                    deleted. If the user wishes to delete an Expression higher up in the list, they must first delete all the
                    ones below it.
                  </li>

                  <li>The "Return Type" of the Element will always be listed at the end of the Expressions list.</li>

                  <li>
                    Clicking the "Add Expression" button will reveal a list (to the right of the button) of relevant
                    Expressions that can be applied on the Element.

                    <ol type='a'>
                      <li>Clicking a revealed Expression button will add that Expression to the Element.</li>
                    </ol>
                  </li>
                </ol>
              </div>

              <div className="h3-wrapper">
                <h3 id="Logic_Elements">3.6 Logic Elements</h3>

                <p>
                  Logic Elements are groups of Elements tied together by a particular conjunction, "And" or "Or". By stringing
                  Elements together with conjunctions, a set of logic can be created to define a population.
                </p>

                <p>
                  <img
                    alt="Basic Logic Element"
                    src={screenshotUrl('Basic_Logic_Element')}
                    className="img-fluid img-thumbnail rounded mx-auto d-block" />
                </p>

                <ol>
                  <li>
                    The outermost light grey box is the first level ("root", or "main") Logic Element, which houses all other
                    Elements and ties them together with a conjunction (2).
                  </li>

                  <li>
                    Between every Element inside a Logic Element group, there will be a "Select conjunction type" dropdown
                    denoting the conjunction used to tie them together. The options for conjunctions are "And" or "Or". Note
                    that within any particular group, the same conjunction must be used. For instance, in the example above,
                    if one changes the first occurrence of the conjunction (the first (2) marker) to "Or", the second
                    conjunction will also update to "Or". This avoids creating ambiguous logic for the system to interpret.
                    The user can think of "And" as meaning every Element must be true, while "Or" means at least one of the
                    Elements must be true.
                  </li>

                  <li>
                    Every Logic Element will have an Element Picker (Section 3.2) at the bottom to allow the user to
                    add new Elements to the group.
                  </li>
                </ol>

                <p>
                  Logic Elements can also be "nested", which is to say, Logic Elements can have other Logic Elements inside
                  them. Logic Elements can be nested as much as the user desires. Using the Indent/Outdent buttons helps the
                  user quickly group and ungroup individual Elements and entire Logic Element groups.
                </p>

                <p>
                  <img
                    alt="Nested Logic Element"
                    src={screenshotUrl('Nested_Logic_Element')}
                    className="img-fluid img-thumbnail rounded mx-auto d-block" />
                </p>

                <ol>
                  <li>Once again, the outermost Logic Element here is represented as the light grey box.</li>

                  <li>
                    A nested Logic Element is represented by a level of indentation as well as a darker colored grey
                    background.
                  </li>

                  <li>Nested Logic Elements can be named using the "Group Name" field, similar to Elements.</li>

                  <li>
                    Entire Logic Element groups can be indented or outdented, similar to individual Elements. This helps
                    the user move entire groups, rather than just one Element at a time.
                  </li>

                  <li>
                    Again, note that every logic element group will have its own Element Picker, allowing the user to
                    add more Elements or nested Logic Elements to the group.
                  </li>
                </ol>
              </div>

              <div className="h3-wrapper">
                <h3 id="Inclusions">3.7 Inclusions</h3>

                <p>
                  The Inclusions section uses Elements, Expressions, and Logic Elements to create a target population that is
                  qualified to receive a Recommendation from the Artifact. The Inclusions population, with the Exclusions
                  population filtered out, creates the general population for the Artifact. Every interaction required to
                  build Inclusions is covered in the above sections.
                </p>
              </div>

              <div className="h3-wrapper">
                <h3 id="Exclusions">3.8 Exclusions</h3>

                <p>
                  The Exclusions section uses Elements, Expressions, and Logic Elements to create a target population that is
                  generally excluded from receiving a Recommendation from the Artifact. The population matching Exclusions are
                  filtered out of the Inclusions population, which creates the general population for the Artifact. Every
                  interaction required to build Exclusions is covered in above sections.
                </p>
              </div>

              <div className="h3-wrapper">
                <h3 id="Subpopulations">3.9 Subpopulations</h3>

                <p>
                  The Subpopulations section uses Elements, Expressions, and Logic Elements to create named target
                  populations, which can then be applied to a Recommendation. This helps the user further filter the
                  general population created from the combination of Inclusions and Exclusions. There are two default
                  "Subpopulations" that can be applied to a recommendation, "Doesn't Meet Inclusion Criteria" and "Meets
                  Exclusion Criteria" (more in section 3.10 Recommendations). Most interactions required to build
                  Subpopulations are covered in above sections, but Subpopulations has a few differences.
                </p>

                <p>
                  Subpopulations are presented as a list of named populations, which can be expanded or collapsed. The
                  following shows a collapsed Subpopulation.
                </p>

                <p>
                  <img
                    alt="Collapsed Subpopulation"
                    src={screenshotUrl('Collapsed_Subpopulation')}
                    className="img-fluid img-thumbnail rounded mx-auto d-block" />
                </p>

                <ol>
                  <li>
                    In this example, the Subpopulation "CholesterolLessThan200" is collapsed. Clicking the right facing arrows
                    will expand the Subpopulation for editing.
                  </li>

                  <li>The "Edit" button is one way to expand the Subpopulation for editing.</li>
                  <li>The "Remove Subpopulation" button is used to delete the Subpopulation.</li>

                  <li>
                    The "New Subpopulation" button will add a new Subpopulation at the bottom of the list, ready for editing.
                  </li>
                </ol>

                <p>The following demonstrates an expanded Subpopulation, ready for editing.</p>

                <p>
                  <img
                    alt="Expanded Subpopulation"
                    src={screenshotUrl('Expanded_Subpopulation')}
                    className="img-fluid img-thumbnail rounded mx-auto d-block" />
                </p>

                <ol>
                  <li>
                    The name of the Subpopulation can be edited when the Subpopulation is expanded using the "Subpopulation
                    Title" field
                  </li>

                  <li>Clicking "Done" will save changes to and collapse the Subpopulation.</li>

                  <li>
                    The content of a Subpopulation is built the same as Inclusions and Exclusions. It uses items covered
                    in above sections (Elements, Logic Elements, Element Picker, etc.).
                  </li>
                </ol>
              </div>

              <div className="h3-wrapper">
                <h3 id="Recommendations">3.10 Recommendations</h3>

                <p>
                  Recommendations are the resulting notices that should be delivered to the clinician after the CDS
                  Artifact is executed. Recommendations are written as free text and can have an accompanying Rationale.
                  Most Recommendations will apply to the population that meets Inclusion logic and does not meet Exclusions
                  logic. Subpopulations, either the default options or the subpopulations the user built, can be applied to
                  a Recommendation.
                </p>

                <p>
                  <img
                    alt="Blank Recommendation"
                    src={screenshotUrl('Blank_Recommendation')}
                    className="img-fluid img-thumbnail rounded mx-auto d-block" />
                </p>

                <ol>
                  <li>A blank Recommendation is shown as the light grey box.</li>
                  <li>The "Remove Recommendation" button is used to delete a Recommendation.</li>

                  <li>
                    The Recommendation's content is written in free text using the "Recommendation" text area. This is the
                    message that the clinician will read in the EHR if the Recommendation is triggered.
                  </li>

                  <li>
                    Clicking the "Add rationale" button will append an additional free text field where the user can enter the
                    supporting evidence or reasoning for the Recommendation. This is covered below.
                  </li>

                  <li>
                    Recommendations can be further filtered by Subpopulations, which is performed by clicking the "Add
                    subpopulation" button. This will prepend an area above the Recommendation to add Subpopulations, covered
                    below.
                  </li>

                  <li>The "New recommendation" button adds a new Recommendation to the list of Recommendations.</li>
                </ol>

                <p>Any Recommendation supports having an optional accompanying Rationale, pictured below.</p>

                <p>
                  <img
                    alt="Recommendation with Rationale"
                    src={screenshotUrl('Recommendation_with_Rationale')}
                    className="img-fluid img-thumbnail rounded mx-auto d-block" />
                </p>

                <ol>
                  <li>The "Rationale" free text field is used to enter the Rationale for the Recommendation.</li>
                </ol>

                <p>
                  Recommendations can be further filtered by Subpopulations to target different Recommendations for different
                  groups within the general target population.
                </p>

                <p>
                  <img
                    alt="Recommendation with Subpopulations"
                    src={screenshotUrl('Recommendation_with_Subpopulations')}
                    className="img-fluid img-thumbnail rounded mx-auto d-block" />
                </p>

                <ol>
                  <li>
                    An applied Subpopulation on the Recommendation appears above the free text areas. This means this
                    Subpopulation's logic will have to evaluate to true for a given patient in order for the Recommendation
                    to be delivered.
                  </li>

                  <li>The "Remove" button removes the Subpopulation from the Recommendation.</li>

                  <li>
                    The "Add a subpopulation" field is used to search for and select the Subpopulations to apply to the
                    Recommendation. Search for Subpopulations by typing here. Click a Subpopulation in the dropdown list
                    below to add it to the Recommendation. Any subpopulation the user created and the two default
                    subpopulations will appear in the dropdown.
                  </li>

                  <li>
                    The "New Subpopulation" link adds a new Subpopulation in the Subpopulations tab and switches to the
                    Subpopulations tab.
                  </li>

                  <li>
                    "Doesn't Meet Inclusion Criteria" is one of the default Subpopulation options. This default option is
                    supplied to allow the user to add Recommendations for patients who did not meet the Inclusion criteria
                    and thus were not part of the general population for this CDS Artifact.
                  </li>

                  <li>
                    "Meets Exclusion Criteria" is one of the default Subpopulation options. This default option is supplied
                    to allow the user to add Recommendations for patients who met the Exclusion criteria and thus were not
                    part of the general population for this CDS Artifact.
                  </li>
                </ol>
              </div>

              <div className="h3-wrapper">
                <h3 id="Parameters">3.11 Parameters</h3>

                <p>
                  Parameters allow the user to create named, reusable Boolean values. They can be used to change the
                  logic in an artifact in different implementations of the artifact. The naming of the Parameter should
                  be readable and communicate its intent within the resulting CQL code. An example of this might be a
                  Parameter called "GradeCRecommendationEnabled". One user might choose to accept this value as true, while
                  another may prefer to set the GradeCRecommendation to false and not execute that part of the CQL code.
                  Parameters are optional additions to the artifact. They can be used in building Inclusions, Exclusions,
                  and Subpopulations, and can be used in Error Handling.
                </p>

                <p>
                  <img
                    alt="Parameters"
                    src={screenshotUrl('Parameters')}
                    className="img-fluid img-thumbnail rounded mx-auto d-block" />
                </p>

                <ol>
                  <li>Each light grey box is an individual Parameter object.</li>
                  <li>Parameters should be aptly named using the "Parameter Name" field.</li>
                  <li>The "Delete Parameter" button deletes a Parameter.</li>

                  <li>
                    Parameters can have a Boolean value ("True" or "False"), selected by the user with the "Select" dropdown.
                  </li>

                  <li>The "New parameter" button adds a new Parameter to the list.</li>
                </ol>
              </div>

              <div className="h3-wrapper">
                <h3 id="Handle_Errors">3.12 Handle Errors</h3>

                <p>
                  The "Handle Errors" tab is an area to optionally direct the system how to handle various errors that may
                  be encountered when running the CDS Artifact. This allows the user to define what error messages to display
                  when certain situations are encountered, such as when data is missing. Error handling is built by chaining
                  together "If" statements, which say "if this condition is met, then deliver this error message."
                </p>

                <p>
                  <img
                    alt="Errors"
                    src={screenshotUrl('Errors')}
                    className="img-fluid img-thumbnail rounded mx-auto d-block" />
                </p>

                <ol>
                  <li>
                    Each "If" statement will require a condition, which is selected by the user with the "Select" dropdown.
                    Conditions can include Subpopulations and Parameters the user created, as well as a few default options.
                    More below.
                  </li>

                  <li>
                    The user can opt to have a second "If" statement tied to the first, meaning both conditions must be met in
                    order to deliver the error. This is added using the "And Also If" button.
                  </li>

                  <li>
                    The "Then Clause" free text field is used to enter the error message associated with the "If" condition.
                  </li>

                  <li>
                    The user can add as many "If" statements to the error handling as desired. Clicking the "Or Else If..."
                    button will add another "If" statement to the list with a "Then Clause" free text field.
                  </li>

                  <li>
                    The final free text area, the "Else" text area, is used to define the error message that will be displayed
                    if none of the "If" conditions are met.
                  </li>
                </ol>

                <p>
                  Similar to Recommendations' Subpopulations, "If" statement conditions for errors support a few default
                  options available in the dropdown list.
                </p>

                <p>
                  <img
                    alt="Errors Conditions Options"
                    src={screenshotUrl('Errors_Condition_Options')}
                    className="img-fluid img-thumbnail rounded mx-auto d-block" />
                </p>

                <ol>
                  <li>
                    The "Recommendations is null" default option will be met if none of the user-defined recommendation
                    conditions are met.
                  </li>

                  <li>
                    The same as Recommendations' Subpopulations, the "Doesn't Meet Inclusion Criteria" condition will be met
                    for patients who did not meet the Inclusion criteria and thus were not part of the general population for
                    this CDS Artifact.
                  </li>

                  <li>
                    The same as Recommendations' Subpopulations, the "Meets Exclusion Criteria" condition will be met for
                    patients who meet the Exclusion criteria and thus were not part of the general population of this CDS
                    Artifact.
                  </li>

                  <li>The user-defined Subpopulations and Parameters will be displayed after the three default options.</li>
                </ol>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
