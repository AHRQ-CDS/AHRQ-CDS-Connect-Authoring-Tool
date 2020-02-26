/* eslint max-len: ["error", 130] */
import React, { Component } from 'react';
import tocbot from 'tocbot';
import _ from 'lodash';
import { onVisitExternalLink } from '../utils/handlers';

function screenshotUrl(name) {
  return `${process.env.PUBLIC_URL}/assets/images/screenshots/${name}.png`;
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
              creation of production-ready CQL code. The project is based on "templates" (e.g. Condition, Observation,
              etc.), which can have value sets or codes applied to narrow in on more specific concepts. Expression
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
                    alt=""
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
                      alt=""
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
                      alt=""
                      src={screenshotUrl('Authenticated_NavBar')}
                    className="img-fluid img-thumbnail rounded mx-auto d-block" />
                  </p>

                  <ol>
                    <li>Clicking "Home" returns user to Homepage.</li>
                    <li>Clicking "Artifacts" navigates to the Artifacts page.</li>
                    <li>Clicking "Workspace" navigates to the Workspace page with a new, blank artifact.</li>
                    <li>Clicking "Testing" navigates to the Testing page.</li>
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
                    alt=""
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
                <h3 id="Edit_Artifact_Modal">2.2 Edit Artifact Modal</h3>

                <p>
                  Upon clicking the "Edit" button, the "Edit Artifact" modal will open allowing the user to edit an existing
                  artifact's name and/or version number.
                </p>

                <p>
                  <img
                    alt=""
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
                  <li>The "Cancel" button is used to cancel changes made to the artifact and close the modal.</li>
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
                    alt=""
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
                        Clicking "Download CQL" will allow the user to choose FHIR STU3 or DSTU2, then will generate the CQL
                        files for the current artifact and will download the result onto their computer inside a zip file.
                        The zip file will contain a folder with the artifact's CQL code, as well as any necessary dependencies.
                        It will also contain the corresponding ELM files for all CQL files.
                      </li>

                      <li>Clicking "Save" will save all changes made to the artifact.</li>
                    </ol>
                  </li>

                  <li>
                    The "Workspace Tabs" divide the workspace into workflow sections for building an artifact. This helps keep
                    sections of the artifact organized for the user (more on each tab below in sections 3.7-3.14).
                  </li>

                  <li>
                    The "Element Picker" allows the user to add and edit elements (more in section 3.2 below).
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
                    alt=""
                    src={screenshotUrl('Element_Picker')}
                  className="img-fluid img-thumbnail rounded mx-auto d-block" />
                </p>

                <ol>
                  <li>
                    An element picker. The "Add element" text indicates that by filling out this information, an element
                    will be added.
                  </li>

                  <li>
                    Click in the "Choose element type" dropdown to select a type of element. Type in this
                    field to narrow the results in the dropdown by the term typed.
                  </li>

                  <li>
                    Element types without a key icon do not require any authentication to use.
                  </li>

                  <li>
                    Element types with a key icon require authentication to use the National Library of Medicine's
                    (NLM) Value Set Authority Center (VSAC) integration. Users may authenticate using their
                    Unified Medical Language System (UMLS) credentials.  Users who do not have a UMLS account
                    can <a target="_blank" rel="nofollow noopener noreferrer" onClick={onVisitExternalLink}
                    href="https://uts.nlm.nih.gov//license.html">sign up</a> <i className="fa fa-external-link"></i> via
                    NLM.
                  </li>
                </ol>

                <div className="h4-wrapper">
                  <h4 id="Non_VSAC_Element_Picker">3.2.1 Non-VSAC Element Picker</h4>

                  <p>
                    If a non-VSAC element type is selected, the element picker will display as below.
                  </p>

                  <p>
                    <img
                      alt=""
                      src={screenshotUrl('Non_VSAC_Element_Picker')}
                    className="img-fluid img-thumbnail rounded mx-auto d-block" />
                  </p>

                  <ol>
                    <li>
                      Based on the element type that was previously selected, this dropdown will include
                      elements within that type.
                    </li>

                    <li>
                      One of the types can be selected from this dropdown to finalize picking a non-VSAC
                      element. Typing into this dropdown also narrows the results in the dropdown by the
                      term typed.
                    </li>
                  </ol>
                </div>

                <div className="h4-wrapper">
                  <h4 id="VSAC_Element_Picker">3.2.2 VSAC Element Picker</h4>

                  <p>
                    If a VSAC element type is selected, the element picker will display as below.
                  </p>

                  <p>
                    <img
                      alt=""
                      src={screenshotUrl('VSAC_Element_Picker')}
                    className="img-fluid img-thumbnail rounded mx-auto d-block" />
                  </p>

                  <p>
                    An "Authenticate VSAC" button will appear. Clicking this button will open a modal that
                    prompts the user for a username and password. Note that this username and password will
                    be those for the UMLS license, not the username and password required for the CDS
                    Authoring Tool.
                  </p>

                  <p>
                    <img
                      alt=""
                      src={screenshotUrl('VSAC_Element_Picker_Authenticated')}
                    className="img-fluid img-thumbnail rounded mx-auto d-block" />
                  </p>

                  <ol>
                    <li>
                      The "VSAC Authenticated" label displays to indicate successful authentication.
                    </li>

                    <li>
                      The "Add Value Set" button allows the user to add a value set to the element.
                      A separate picker for a value set will appear after clicking this button.
                    </li>

                    <li>
                      The "Add Code" button allows the user to add a code to the element.
                      A separate picker for a code will appear after clicking this button.
                    </li>
                  </ol>

                  <p>
                    If the user chooses to add a value set, the following modal will appear.
                  </p>

                  <p>
                    <img
                      alt=""
                      src={screenshotUrl('VSAC_Value_Set')}
                    className="img-fluid img-thumbnail rounded mx-auto d-block" />
                  </p>

                  <ol>
                    <li>
                      This text box prompts the user to enter a search term for a value set that they would like
                      to add.
                    </li>

                    <li>
                      Clicking the "Search" button causes a search through the value sets, by the search term
                      provided by the user.
                    </li>

                    <li>
                      A list of value sets that match the search term will appear after a successful search.
                    </li>

                    <li>
                      Each value set that matched the search term will show its name, OID, steward,
                      and the number of codes it contains.
                    </li>

                    <li>
                      The number of value sets that matched the search term is displayed in the corner of the modal.
                    </li>

                    <li>
                      The "Close" button will cancel adding a value set, and will return to the base element picker.
                    </li>
                  </ol>

                  <p>
                    If the user selects a value set from the list, the following modal appears.
                  </p>

                  <p>
                    <img
                      alt=""
                      src={screenshotUrl('VSAC_Value_Set_Selected')}
                    className="img-fluid img-thumbnail rounded mx-auto d-block" />
                  </p>

                  <ol>
                    <li>
                      This text box now displays the value set that the user previously selected.
                    </li>

                    <li>
                      Clicking the "Select" button adds the value set to the element, and returns to the base
                      element picker, now with the added value set.
                    </li>

                    <li>
                      A list of codes that are within the selected value set.
                    </li>

                    <li>
                      Each code within the selected value set will show its code, name, and code system.
                    </li>

                    <li>
                      The button with the back arrow will return to the value set picker, allowing the user
                      to select a different value set than the one that is currently selected.
                    </li>

                    <li>
                      The "Close" button will cancel adding a value set, and will return to the base element picker.
                    </li>
                  </ol>

                  <p>
                    If the user instead chooses to add a code, rather than a value set, the following modal will appear.
                  </p>

                  <p>
                    <img
                      alt=""
                      src={screenshotUrl('VSAC_Code')}
                    className="img-fluid img-thumbnail rounded mx-auto d-block" />
                  </p>

                  <ol>
                    <li>
                      This text box allows the user to enter a code to validate.
                    </li>

                    <li>
                      This dropdown allows the user to select the code system that corresponds to the code that was
                      previously entered.
                    </li>

                    <li>
                      The "Validate" button searches for a match for the selected code and code system.
                    </li>

                    <li>
                      If validation of the code and code system was successful, "Validation Successful!" will appear
                      in the corner of the modal to indicate this success.
                    </li>

                    <li>
                      The code that matched the user input will be displayed.
                    </li>

                    <li>
                      Clicking the "Select" button adds the code to the element, and returns to the base
                      element picker, now with the added code.
                    </li>

                    <li>
                      The "X" button will cancel adding a code, and will return to the base element picker.
                    </li>
                  </ol>

                </div>
              </div>

              <div className="h3-wrapper">
                <h3 id="Elements">3.3 Elements</h3>

                <p>
                  Elements are the main building blocks for an artifact. Each artifact represents different conditions,
                  medications, demographics, etc. Using a combination of elements together in groups (covered below in
                  Section 3.6 "Logic Elements") helps the user define different populations for the artifact.
                </p>

                <p>
                  <img
                    alt=""
                    src={screenshotUrl('VSAC_Element')}
                  className="img-fluid img-thumbnail rounded mx-auto d-block" />
                </p>

                <ol>
                  <li>
                    The name of the type of element appears at the top of the element, in this case it is a "Condition".
                  </li>

                  <li>
                    The user can specify the name of this element in the text box next to the element type.
                  </li>

                  <li>
                    The "Outdent" button moves the element out of the current group it belongs to.
                  </li>

                  <li>
                    The "Indent" button moves the element inside a new group.
                  </li>

                  <li>
                    The "Hide" element button expands or collapses the current element (which helps preserve space
                    and keep the workspace tidy).
                  </li>

                  <li>
                    Clicking the "Remove" element button will delete the element.
                  </li>

                  <li>
                    A warning appears, asking to add expressions to change the return type (more in Section 3.4
                    "Expressions").
                  </li>

                  <li>
                    A text box used to add a comment to the element. See the "Comments" section below for more details.
                  </li>

                  <li>
                    In the case of a VSAC element, the value sets and codes added to the element are listed.
                  </li>

                  <li>
                    The eye icon next to a value set can be clicked to open a modal listing all codes within the value set.
                  </li>

                  <li>
                    The "Remove" button next to a value set or code can be clicked to remove that value set or code from
                    the element.
                  </li>

                  <li>
                    The "Return Type" gives the current return type of this element based on the Expressions (more in
                    Section 3.4 "Expressions").
                  </li>

                  <li>The "Add Expression" button adds an expression to this element (more in Section 3.4
                  "Expressions").</li>
                </ol>

                <p>Non-VSAC elements require additional fields to be filled in, and don't support adding expressions.</p>

                <p>
                  <img
                    alt=""
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
                    Some elements do not support expressions. These elements will not have an "Add Expression" button. For
                    example, "Gender" does not have any expressions that can be applied to it, and automatically returns a
                    Boolean value.
                  </li>
                </ol>
              </div>

              <div className="h3-wrapper">
                <h3 id="Expressions">3.4 Expressions</h3>

                <p>
                  Expressions modify an Element to define or narrow its intent. Many Elements will start as a list,
                  which if left as such, <em>will generate invalid CQL</em> when used in Inclusions, Exclusions, or
                  Subpopulations. Since elements are used in boolean logic (e.g., and, or), the user must ensure that
                  the Return Type of every Element returns a "Boolean" value (e.g., true or false). To achieve this,
                  the user can apply Expressions to narrow or filter the previous Expression further. For example, one
                  could start with a list of Diabetes Conditions, then apply the "Confirmed" Expression to find the
                  conditions with a Confirmed status, then apply "Exists" to achieve a Boolean Return Type
                  (pictured below).
                </p>

                <p>
                  Expressions chain onto one another in succession. The Return Type from the first Expression applied will
                  narrow the types of Expressions that can be applied as the second, and so on. The CDS Authoring Tool
                  performs this filtering for the user automatically.
                </p>

                <p>
                  Expressions are also visually represented as a single phrase on each element. The phrase compiles all
                  Expressions applied to an element into a single phrase. Value Sets, Codes, and any additional fields
                  on an element are also included. The Expression Phrase serves as a way to quickly describe the value
                  of the Element. As any of the values change, the phrase updates automatically.
                </p>

                <p>
                  <img
                    alt=""
                    src={screenshotUrl('Expressions_on_Element')}
                  className="img-fluid img-thumbnail rounded mx-auto d-block" />
                </p>

                <ol>
                  <li>
                    The "Expression" list shows all expressions applied to the element so far (in this example "Confirmed"
                    and "Exists").
                  </li>

                  <li>
                    The last Expression that has been applied will appear at the bottom of the Expression list, directly above
                    the "Return Type" label.  In this case, the "Exists" expression is used to determine if the list of
                    Confirmed Diabetes Conditions has items or is empty.
                  </li>

                  <li>
                    The last Expression can be removed by clicking the "Remove last expression" button on the far right side
                    of the Expression item. Because of the nature of the Expression chaining, only the last Expression can be
                    deleted. If the user wishes to delete an Expression higher up in the list, they must first delete all the
                    ones below it.
                  </li>

                  <li>
                    The Expression Phrase for the element. It includes the Expressions and Value Sets added to the element.
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
                <h3 id="Comments">3.5 Comments</h3>
                <p>
                  Comments can be added to any element in the Workspace and are a good way to provide additional information
                  about an element. Recommended uses of comments include:
                </p>
                <ul>
                  <li>
                    Providing a rationale for why the element is created or indicating a decision that was made when
                    creating the element and why that decision was made
                  </li>
                  <li>
                    Providing a simple summary of complex logic that is encapsulated in the element, or just further
                    explaining the element built
                  </li>
                  <li>
                    Indicating a source from which the element's logic is derived and providing any necessary references
                  </li>
                  <li>
                    Indicating a section of logic that implementers may want to modify based on specific site needs
                  </li>
                </ul>
                <p>
                  All comments are added to the generated CQL above the element's definition. However, they are not
                  executed as part of the artifact and just serve as an annotation to the element.
                </p>

                <p>
                  <img
                    alt=""
                    src={screenshotUrl('Comment_on_Element')}
                    className="img-fluid img-thumbnail rounded mx-auto d-block" />
                </p>

                <ol>
                  <li>
                    The text box for a comment. The comment can be multiple lines and can be as long as desired.
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
                    alt=""
                    src={screenshotUrl('Basic_Logic_Element')}
                  className="img-fluid img-thumbnail rounded mx-auto d-block" />
                </p>

                <ol>
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
                    alt=""
                    src={screenshotUrl('Nested_Logic_Element')}
                  className="img-fluid img-thumbnail rounded mx-auto d-block" />
                </p>

                <ol>
                  <li>
                    A nested Logic Element is represented by a darker colored grey background.
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
                  Exclusion Criteria" (more in section 3.11 Recommendations). Most interactions required to build
                  Subpopulations are covered in above sections, but Subpopulations has a few differences.
                </p>

                <p>
                  Subpopulations are presented as a list of named populations, which can be expanded or collapsed. The
                  following shows a collapsed Subpopulation.
                </p>

                <p>
                  <img
                    alt=""
                    src={screenshotUrl('Collapsed_Subpopulation')}
                  className="img-fluid img-thumbnail rounded mx-auto d-block" />
                </p>

                <ol>
                  <li>
                    In this example, the Subpopulation "AgeBetween18And25" is collapsed. Clicking the right facing arrows
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
                    alt=""
                    src={screenshotUrl('Expanded_Subpopulation')}
                  className="img-fluid img-thumbnail rounded mx-auto d-block" />
                </p>

                <ol>
                  <li>
                    The name of the Subpopulation can be edited when the Subpopulation is expanded using the "Subpopulation
                    Title" field.
                  </li>

                  <li>Clicking "Done" will save changes to and collapse the Subpopulation.</li>

                  <li>
                    The content of a Subpopulation is built the same as Inclusions and Exclusions. It uses items covered
                    in above sections (Elements, Logic Elements, Element Picker, etc.).
                  </li>
                </ol>
              </div>

              <div className="h3-wrapper">
                <h3 id="BaseElements">3.10 Base Elements</h3>
                <div className="h4-wrapper">
                  <h4 id="Single_Base_Elements">3.10.1 Single Base Elements</h4>

                  <p>
                    Base Elements can be used to create individual elements, which do not need to be contained within a
                    Conjunction Group. Elements created in this tab can be added to the Inclusions, Exclusions, and
                    Subpopulations Tabs.
                  </p>

                  <p>
                    <img
                      alt=""
                      src={screenshotUrl('Base_Element')}
                      className="img-fluid img-thumbnail rounded mx-auto d-block" />
                  </p>
                  <ol>
                    <li>
                      A base element. Individual base elements work similarly to Elements added to Inclusions, Exclusions,
                      and Subpopulations. Value Sets and Codes can be added to VSAC Elements, and Expressions can be added.
                    </li>
                    <li>
                      No "Select conjunction type" dropdown is present between Base Elements. This is because each element is
                      separate from the others on the tab. They are not part of a Logic Element.
                    </li>
                    <li>
                      The Element Picker (Section 3.2) used to add additional Base Elements.
                    </li>
                  </ol>

                  <p>
                    Base Elements can be used within the Inclusions, Exclusions, and Subpopulations tabs. They can be added
                    using the "Base Elements" option in the Element Picker.
                  </p>

                  <p>
                    <img
                      alt=""
                      src={screenshotUrl('Base_Element_in_Use')}
                      className="img-fluid img-thumbnail rounded mx-auto d-block" />
                  </p>
                  <ol>
                    <li>
                      The background color of Base Element uses differs from other Elements used to easily differentiate it.
                    </li>
                    <li>
                      The full expression phrase of the original Base Element is visible. Additional Expressions
                      that are added will become part of the phrase.
                    </li>
                    <li>
                      The Base Element use specifies the original Base Element name to easily identify its origin.
                      <ol type='a'>
                        <li>
                          Clicking the link icon next to the original Base Element name switches to the Base Elements tab
                          and scrolls down to that Base Element's definition.</li>
                      </ol>
                    </li>
                    <li>
                      Expressions can be added to Base Element uses the same as any other Element. Expressions that can be
                      added to the return type of the Base Element will be available. Additional expressions are available
                      in the same way as all other Elements.
                    </li>
                  </ol>

                  <p>
                    Once a Base Element is used within Inclusions, Exclusions, or Subpopulations, the original Base Element
                    cannot be deleted and it's return type cannot change.
                  </p>
                  <p>
                    <img
                      alt=""
                      src={screenshotUrl('Base_Element_Cant_Change')}
                      className="img-fluid img-thumbnail rounded mx-auto d-block" />
                  </p>
                  <ol>
                    <li>
                      The Base Element cannot be deleted while it is in use.
                    </li>
                    <li>
                      Applied expressions cannot be removed if doing so would change the Base Element's return type. In order
                      to remove the expression, first delete all uses of the Base Element in the artifact.
                    </li>
                    <li>
                      Expressions can be added to the Base Element while it is used, as long as the return type of the
                      Base Element does not change. Expressions that would change the return type are not available in the
                      list. In order to add expressions that would change the return type, first remove all uses of the
                      Base Element in the artifact.
                    </li>
                  </ol>
                </div>

                <div className="h4-wrapper">
                  <h4 id="Base_Element_List_Groups">3.10.2 Base Element List Groups</h4>
                  <p>
                    Base Elements can also be a list of elements. Similar to Logic Elements, Lists combine multiple
                    elements into one group, which can be combined with a Union or an Intersection. Lists can be added to
                    Base Elements by choosing "List Operations" from the Element Picker and choosing "Intersect" or "Union".
                  </p>

                  <p>
                    <img
                      alt=""
                      src={screenshotUrl('List_Group')}
                      className="img-fluid img-thumbnail rounded mx-auto d-block" />
                  </p>

                  <ol>
                    <li>
                      The name of the overall List Group.
                    </li>
                    <li>
                      The return type of the overall List Group. This will update automatically as additional elements are
                      added to the list.
                    </li>
                    <li>
                      An element in the List Group. Elements can be added to the group using the Element Picker, similarly
                      to how Logic Groups work. Expressions can be added to each element.
                    </li>
                    <li>
                      Between every element in a List Group, there is a logic type dropdown. The options are "Union" or
                      "Intersect". The dropdown can be changed at any point while building the List Group. Note that within
                      any particular List Group, only one option can be chosen, similar to conjunction types in Logic Groups.
                    </li>
                  </ol>

                  <p>
                    Like individual Base Elements, List Groups can be used within Inclusions, Exclusions, or Subpopulations.
                    They are added using the Base Elements option in the Element Picker. Once a Base Element List Group is used,
                    some functionality of the original List is disabled.
                  </p>

                  <p>
                    <img
                      alt=""
                      src={screenshotUrl('List_Group_in_Use')}
                      className="img-fluid img-thumbnail rounded mx-auto d-block" />
                  </p>
                  <ol>
                    <li>
                      The List Group cannot be deleted while it is in use.
                    </li>
                    <li>
                      Elements within the List Group cannot be deleted while the list is in use.
                    </li>
                    <li>
                      Applied expressions on elements within the List Group cannot be removed if doing so would change the
                      element's return type.
                    </li>
                    <li>
                      Expressions can be added to elements while the List Group is used, as long as the return type of the
                      element does not change. Expressions that would change the return type are not available.
                    </li>
                    <li>
                      New elements cannot be added to the List Group while it is in use.
                    </li>
                  </ol>
                </div>

                <div className="h4-wrapper">
                  <h4 id="Base_Element_Logic_Elements">3.10.3 Base Element Logic Elements</h4>
                  <p>
                    Base Elements can also be a Logic Element. Base Element Logic Elements work the same as Logic Elements
                    in other tabs; they combine multiple elements into one group using an And or an Or. For more information
                    about Logic Elements, see Section 3.6. Logic Elements in this tab also work very similarly to List Groups
                    in this tab. They can be added to Base Elements by choosing "List Operations" and choosing "And" or "Or".
                  </p>

                  <p>
                    <img
                      alt=""
                      src={screenshotUrl('Base_Element_Logic_Element')}
                      className="img-fluid img-thumbnail rounded mx-auto d-block" />
                  </p>
                  <ol>
                    <li>
                      The name of the overall Logic Element.
                    </li>
                    <li>
                      The return type of the overall Logic Element. This will update automatically as additional elements
                      are added to the group. The return type can only be Boolean when there are multiple elements in the group.
                    </li>
                    <li>
                      An element in the Logic Element. Expressions can be added to each element. Elements can be nested,
                      similar to Logic Elements in other tabs.
                    </li>
                    <li>
                      The logic type dropdown for Logic Elements. The options are "And" or "Or", and the choice can be changed
                      at any point while building the Logic Element.
                    </li>
                  </ol>

                  <p>
                    Like Base Element List Groups, Base Element Logic Groups can be used within Inclusions, Exclusions, or
                    Subpopulations. Once a Base Element List Group is used, the same functionality is disabled as List Groups.
                    Additionally, Logic Elements cannot indent or outdent any elements contained within it when it is in use.
                  </p>
                </div>

              </div>

              <div className="h3-wrapper">
                <h3 id="Recommendations">3.11 Recommendations</h3>

                <p>
                  Recommendations are the resulting notices that should be delivered to the clinician after the CDS
                  Artifact is executed. Recommendations are written as free text and can have an accompanying Rationale.
                  Most Recommendations will apply to the population that meets Inclusion logic and does not meet Exclusions
                  logic. Subpopulations, either the default options or the subpopulations the user built, can be applied to
                  a Recommendation.
                </p>

                <p>
                  <img
                    alt=""
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
                    alt=""
                    src={screenshotUrl('Recommendation_with_Rationale')}
                  className="img-fluid img-thumbnail rounded mx-auto d-block" />
                </p>

                <p>The "Rationale" free text field is used to enter the Rationale for the Recommendation.</p>

                <p>
                  Recommendations can be further filtered by Subpopulations to target different Recommendations for different
                  groups within the general target population.
                </p>

                <p>
                  <img
                    alt=""
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
                <h3 id="Parameters">3.12 Parameters</h3>

                <p>
                  Parameters allow the user to create named, reusable values that can be supplied by the CDS execution
                  environment at run-time. Parameters can be defined with or without default values. The naming of the
                  Parameter should be readable and communicate its intent within the resulting CQL code. An example of
                  this might be a Parameter called "AllowGradeC" to indicate if grade C recommendation should be
                  returned or not. It might default to "true", but individual implementations can choose to override it
                  to "false" if they do not allow or want Grade C recommendations. Parameters are optional additions to
                  the artifact. They can be used in building Inclusions, Exclusions, and Subpopulations, and can be
                  used in Error Handling.
                </p>

                <p>
                  <img
                    alt=""
                    src={screenshotUrl('Parameters')}
                  className="img-fluid img-thumbnail rounded mx-auto d-block" />
                </p>

                <ol>
                  <li>
                    Each light grey box is an individual Parameter object.
                  </li>

                  <li>
                    Parameters should be aptly named using the "Parameter Name" field.
                  </li>

                  <li>
                    The "Delete Parameter" button deletes a Parameter.
                  </li>

                  <li>
                    Parameters should be assigned a type from the "Parameter Type" dropdown.
                  </li>

                  <li>
                    Parameters can optionally have a default value, assigned by the user via
                    the input method for the given selected type.
                  </li>

                  <li>
                    The "New parameter" button adds a new Parameter to the list.
                  </li>
                </ol>
              </div>

              <div className="h3-wrapper">
                <h3 id="Handle_Errors">3.13 Handle Errors</h3>

                <p>
                  The "Handle Errors" tab is an area to optionally direct the system how to handle various errors that may
                  be encountered when running the CDS Artifact. This allows the user to define what error messages to display
                  when certain situations are encountered, such as when data is missing. Error handling is built by chaining
                  together "If" statements, which say "if this condition is met, then deliver this error message."
                </p>

                <p>
                  <img
                    alt=""
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
                    alt=""
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

                  <li>The user-defined Subpopulations and Parameters will be displayed along with the three default options.</li>
                </ol>
              </div>

              <div className="h3-wrapper">
                <h3 id="External_CQL">3.14 External CQL</h3>

                <p>
                  The "External CQL" tab is an area to upload CQL files into the CDS Authoring Tool in order to add external
                  functionality into an artifact. This is useful in the case that a CQL file has a definition or parameter
                  that an artifact being created in the Authoring Tool could utilize.
                </p>

                <p>
                  <img
                    alt=""
                    src={screenshotUrl('External_CQL')}
                  className="img-fluid img-thumbnail rounded mx-auto d-block" />
                </p>

                <ol>
                  <li>
                    The upload area to add external CQL files into an artifact. These files can be uploaded individually, or
                    in zip files containing multiple CQL files.
                  </li>

                  <li>
                    The table displaying the external CQL files that have been uploaded for the artifact, and some relevant
                    details about these files.
                  </li>

                  <li>
                    A "View" button for an external CQL file, which displays a modal containing information about the contents
                    of this file.
                  </li>

                  <li>
                    A "Delete" button for an external CQL file, which removes this file from the artifact. This button will be
                    disabled for a file if it is being used in another tab of the artifact, or if the file is a dependency of
                    another uploaded external CQL file.
                  </li>
                </ol>

                <p>
                  Once an external CQL file has been uploaded, any of its definitions or parameters can be used within
                  Inclusions, Exclusions, Subpopulations, or Base Elements. This is done by selecting the "External CQL"
                  option in the Element Picker.
                </p>

                <p>
                  <img
                    alt=""
                    src={screenshotUrl('External_CQL_Element')}
                  className="img-fluid img-thumbnail rounded mx-auto d-block" />
                </p>

                <ol>
                  <li>
                    The name of the definition or parameter being used in this external CQL element, as well as the name of the
                    external CQL file that contains it.
                  </li>

                  <li>
                    As with all other elements, expressions can be added to external CQL elements so they can be used as needed
                    in the artifact being built.
                  </li>
                </ol>
              </div>
            </div>

            <div className="h2-wrapper">
              <h2 id="Testing_Artifacts">4. Testing Artifacts</h2>

              <div className="h3-wrapper">
                <h3 id="Testing_Page">4.1 Testing Page</h3>

                <p>
                  The Testing tab is the main location to test that artifacts are behaving as expected when their CQL is executed
                  against synthetic patients.
                </p>

                <p>
                  <img
                    alt=""
                    src={screenshotUrl('Testing_Artifacts')}
                  className="img-fluid img-thumbnail rounded mx-auto d-block" />
                </p>

                <ol>
                  <li>
                    The upload area allows the user to upload synthetic patients that can be used for testing CQL made from
                    artifacts. Note that the synthetic patients must be contained in a FHIR STU3 or DSTU2 Bundle, in JSON format.
                    To easily generate synthetic patients in this format, see <a target="_blank"
                    rel="nofollow noopener noreferrer" onClick={onVisitExternalLink}
                    href="https://github.com/synthetichealth/synthea">Synthea </a>
                    <i className="fa fa-external-link"></i>.
                  </li>

                  <li>
                    A banner indicating that the user must log in to VSAC to execute CQL on a patient.
                  </li>

                  <li>
                    A button that opens a modal, allowing the user to authenticate to VSAC.
                  </li>

                  <li>
                    A disabled "Execute CQL on Selected Patients" button that will only be enabled once the user has authenticated
                    with VSAC and has selected patients to test.
                  </li>

                  <li>
                    A table that displays some information about any patients associated to the user that are already in the
                    database, and allows users to select patients to test.
                  </li>

                  <li>
                    A "View" button that displays a modal to view the JSON FHIR Bundle of a given patient in detail.
                  </li>

                  <li>
                    A "Delete" button that will open a modal allowing the user to delete the patient from the database.
                  </li>
                </ol>

                <p>
                  After the user successfully authenticates with VSAC, CQL execution is possible.
                </p>

                <p>
                  <img
                    alt=""
                    src={screenshotUrl('Testing_Authenticated')}
                  className="img-fluid img-thumbnail rounded mx-auto d-block" />
                </p>

                <ol>
                  <li>
                    The banner has now changed to indicate that CQL execution on a patient is possible.
                  </li>

                  <li>
                    The button for VSAC authentication now indicates that the authentication is complete.
                  </li>

                  <li>
                    The "Execute CQL on Selected Patients" button is now enabled. Clicking on this button
                    opens the Execute CQL Modal.
                  </li>

                  <li>
                    Any patient that is checked on the left side of the table has been selected for testing.
                  </li>

                  <li>
                    A patient that has been selected cannot be deleted until it is deselected.
                  </li>
                </ol>
              </div>

              <div className="h3-wrapper">
                <h3 id="Execute_CQL_Modal">4.2 Execute CQL Modal</h3>

                <p>
                  The Execute CQL Modal allows the user to choose an artifact whose CQL should be run against the selected
                  patient.
                </p>

                <p>
                  <img
                    alt=""
                    src={screenshotUrl('Execute_CQL_Modal')}
                  className="img-fluid img-thumbnail rounded mx-auto d-block" />
                </p>

                <ol>
                  <li>
                    A dropdown that displays all of the user's artifacts that are FHIR compatible with the selected patients.
                    This allows the user to choose which artifact should be used for CQL execution.
                  </li>

                  <li>
                    A section listing all of the artifact's parameters and their default values, allowing the user to change
                    these parameter values for testing purposes.
                  </li>

                  <li>
                    The "Execute CQL" button which runs the selected artifact's CQL against the selected patients for testing.
                    The artifact CQL that is used for testing automatically matches the patients' FHIR version.
                  </li>
                </ol>
              </div>

              <div className="h3-wrapper">
                <h3 id="CQL_Execution_Results">4.3 CQL Execution Results</h3>

                <p>
                  After CQL execution is finished, the results of the CQL execution are displayed.
                </p>

                <p>
                  <img
                    alt=""
                    src={screenshotUrl('CQL_Execution_Results')}
                  className="img-fluid img-thumbnail rounded mx-auto d-block" />
                </p>

                <ol>
                  <li>
                    The name of the artifact whose CQL was tested.
                  </li>

                  <li>
                    An indication of how many patients tested met the Artifact's inclusion criteria and exclusion criteria.
                  </li>

                  <li>
                    The collapsed execution results for one of the tested patients. This can be expanded by clicking
                    on the patient's name.
                  </li>

                  <li>
                    The expanded execution results for one of the tested patients. This can be collapsed by clicking
                    on the patient's name. Details of the results are as follows.
                  </li>

                  <ul>
                    <li>
                      An indication of whether the patient met the Artifact's inclusion criteria. In this case,
                      the patient did meet the inclusion criteria.
                    </li>

                    <li>
                      An indication of whether the patient met the Artifact's exclusion criteria. In this case,
                      the patient did not meet the exclusion criteria.
                    </li>

                    <li>
                      The Recommendation from the artifact, given the result of the CQL execution.
                    </li>

                    <li>
                      The Rationale for the Recommendation from the artifact.
                    </li>


                    <li>
                      Any Errors that occurred during the CQL Execution. In this case, there were no errors.
                    </li>
                  </ul>
                </ol>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
