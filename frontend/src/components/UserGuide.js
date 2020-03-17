/* eslint max-len: ["error", 130] */
import React, { Component } from 'react';
import tocbot from 'tocbot';
import _ from 'lodash';
import { onVisitExternalLink } from '../utils/handlers';

function screenshotUrl(name) {
  return `${process.env.PUBLIC_URL}/assets/images/screenshots/${name}.png`;
}

/*
<img alt="" src={screenshotUrl('image_file_name')}
     className="img-fluid img-thumbnail rounded mx-auto d-block" />
*/

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
              The Clinical Decision Support (CDS) Authoring Tool is a web-based application to help CDS authors develop
              production-ready <a target="_blank" rel="nofollow noopener noreferrer" onClick={onVisitExternalLink}
              href="https://cql.hl7.org/">Health Level Seven (HL7) Clinical Quality Language (CQL)</a>
              <i className="fa fa-external-link"></i> logic without the need to fully understand the CQL specification.
            </p>
            <p>
              Authoring is based on defining elements using a broad type, such as Condition, and applying one or more
              value sets and codes to specify a more specific concept, such as Diabetes. These elements can be further
              refined using expression modifiers to indicate a specific status, a most recent value, a comparison against
              a specific value, and more.
            </p>
            <p>
              The CDS Authoring Tool is part of the <a href="https://cds.ahrq.gov/cdsconnect">CDS Connect</a> project,
              sponsored by the Agency for Healthcare Research and Quality (AHRQ), and developed under contract with AHRQ
              by MITRE's CMS Alliance to Modernize Healthcare (CAMH) FFRDC.
            </p>

            <div className="h2-wrapper">
              <h2 id="Starting">Starting with the CDS Authoring Tool</h2>
              <p>
                Before you can build CDS artifacts in the CDS Authoring Tool, you must have two accounts:
                <ol>
                  <li>A CDS Authoring Tool account</li>
                  <li>A UMLS Terminology Services account</li>
                </ol>
              </p>

              <div className="h3-wrapper">
                <h3 id="Requesting_CDS_AT_Account">Requesting a CDS Authoring Tool Account</h3>
                <p>
                  You must request a CDS Authoring Tool account in order to log into the CDS Authoring Tool.  This account
                  provides you with your own space within the CDS Authoring Tool to create and manage CDS artifacts.
                </p>
                {/* TODO: Insert image of SIGN UP button */}
                <p>
                  To request a CDS Authoring Tool account:
                  <ol>
                    <li>Navigate to <a href="https://cds.ahrq.gov/authoring/">https://cds.ahrq.gov/authoring/</a>.</li>
                    <li>Click on the "SIGN UP" button in the middle of the screen.</li>
                    <li>This will launch a new window with a form that must be filled out and submitted.</li>
                    <li>After your request is reviewed, you will receive an email with further instructions to set up your
                      account.</li>
                  </ol>
                </p>
              </div>

              <div className="h3-wrapper">
                <h3 id="Requesting_UTS_Account">Requesting a UMLS Terminology Services Account</h3>
                <p>
                  UMLS Terminology Services accounts are managed by the National Library of Medicine (NLM).  This account
                  is used within the CDS Authoring Tool to access services provided by the Value Set Authority Center (VSAC).
                  These services enable you to search for value sets, review value set contents, and test CQL that uses
                  value sets.
                </p>
                {/* TODO: Insert image of Sign Up link */}
                <p>
                  To request a UMLS Terminology Services account:
                  <ol>
                    <li>Navigate to <a target="_blank" rel="nofollow noopener noreferrer" onClick={onVisitExternalLink}
                      href="https://uts.nlm.nih.gov/home.html">https://uts.nlm.nih.gov/home.html</a>
                      <i className="fa fa-external-link"></i>.</li>
                    <li>Click on the "Request a License" link (in left pane) or "Sign Up" link (in banner).</li>
                    <li>Follow the instructions from NLM to create your account.</li>
                  </ol>
                </p>
              </div>

              <div className="h3-wrapper">
                <h3 id="Logging_In">Logging In to the CDS Authoring Tool</h3>
                <p>
                  Once you have a CDS Authoring Tool account, you can log in using your registered email address and password.
                  To log in, navigate to the CDS Authoring Tool home page and click the "Login" button in the Clinical Decision
                  Support Authoring Tool banner near the top of the page.
                </p>
                {/* TODO: Insert image of logging in */}
                <p>
                  If you encounter any issues logging in, click the "Feedback" link on the CDS Authoring Tool home page to
                  request support.
                </p>
              </div>
            </div>

            <div className="h2-wrapper">
              <h2 id="Creating_and_Managing_Artifacts">Creating and Managing Artifacts ("Artifacts" View)</h2>
              <p>
                You can create and manage CDS Artifacts by clicking the "Artifacts" link in the Clinical Decision Support
                Authoring banner near the top of the page.  This will bring you to the "Artifacts" view that contains a
                list of all your CDS artifacts.
              </p>
              {/* TODO: Screenshot of "Artifacts" page */}
              <p>
                Your list of artifacts can only be seen by you.  No other users have access to your artifacts or any of the
                content within them.  You can only share artifacts by downloading the CQL and distributing it yourself.
                If you have an artifact that may be useful to others, we encourage you to consider posting it on the CDS
                Connect Repository.
              </p>
              <div className="h3-wrapper">
                <h3 id="Creating_Artifacts">Creating New Artifacts</h3>
                <p>
                  To create a new artifact, click the "Create New Artifact" button in the "Artifacts" view.  This will reveal
                  a form, allowing you to enter an artifact name and version.  There are no specific rules about artifact names
                  or versions, but <a target="_blank" rel="nofollow noopener noreferrer" onClick={onVisitExternalLink}
                  href="http://hl7.org/fhir/uv/cpg/2019Sep/documentation-libraries.html">FHIR Clinical Guidelines</a>
                  <i className="fa fa-external-link"></i> suggests using the <a target="_blank"
                  rel="nofollow noopener noreferrer" onClick={onVisitExternalLink}
                  href="https://apr.apache.org/versioning.html">Apache APR Versioning Scheme</a>
                  <i className="fa fa-external-link"></i>.
                </p>
                {/* TODO: Screenshot of Create Artifact Form */}
                <p>
                  Once you've entered an artifact name and version, click the "Create" button. Your new artifact will appear
                  at the top of the artifact list.
                </p>
              </div>

              <div className="h3-wrapper">
                <h3 id="Managing_Artifacts">Managing Existing Artifacts</h3>
                <p>
                  The "Artifacts" view contains a list of existing artifacts, showing the following information and controls
                  for each artifact:
                  <ul>
                    <li>Name</li>
                    <li>Version</li>
                    <li>When it was last updated</li>
                    <li>"Edit Info" button</li>
                    <li>"Delete" button</li>
                  </ul>
                </p>
                {/* TODO: Screenshot of Artifact Listing */}
                <p>
                  To edit an artifact's logic, click the artifact's hyperlinked name. This will bring you to the artifact's
                  "Workspace" view.
                </p>
                <p>
                  To edit an artifact's name or version, click its "Edit Info" button. This will open a modal dialog with a
                  form for editing the name and version.
                </p>
                <p>
                  To delete an artifact, click its "Delete" button. This will open a modal dialog asking you to confirm that
                  you would like to delete the artifact.  After clicking the "Delete" button to confirm, the artifact will
                  be permanently deleted.  This cannot be undone.
                </p>
              </div>
            </div>

            <div className="h2-wrapper">
              <h2 id="Building_Artifacts">Building Artifacts ("Workspace" View)</h2>
              <p>
                The first step in building an artifact is to create a blank artifact. If you have not yet done this, see the
                previous section, <a href="#Managing_Artifacts">Creating and Managing Artifacts</a>. Once you've created an
                artifact, click on its hyperlinked name to go to its "Workspace" view.
              </p>
              <p>
                The workspace view contains a number of components that are used when building an artifact:
                <ul>
                  <li>
                    <strong>Artifact Name</strong>: The artifact name. Click the pencil to the left of the artifact name to
                    edit it.
                  </li>
                  <li>
                    <strong>Download CQL Button</strong>: Allows the author to download the artifact as FHIR-based CQL. When you
                    click this button, you can choose which version of FHIR to use in the exported CQL (DSTU2, STU3, or R4).
                  </li>
                  <li>
                    <strong>Save Button</strong>: Allows the author to explicitly save their progress. NOTE: Progress will also be
                    automatically saved at certain points during the editing workflow.
                  </li>
                  <li>
                    <strong>Workspace Tabs</strong>: A set of tabs for organizing the different aspects of the CDS Logic:
                    Inclusions, Exclusions, Subpopulations, Base Elements, Recommendations, Parameters, Handle Errors, and
                    External CQL.
                  </li>
                </ul>
              </p>

              {/* TODO: Screenshot of Workspace Header and Tabs */}

              <div className="h3-wrapper">
                <h3 id="Element_Picker">Creating and Editing Elements</h3>
                <p>
                  The CDS Authoring Tool allows authors to create CDS by building and combining "elements" in specific contexts.
                  Elements describe the criteria that is used to determine if a given patient qualifies for a CDS recommendation
                  ("Inclusions"), should be disqualified from a recommendation ("Exclusions"), or should receive a more specific
                  recommendation ("Subpopulations").
                </p>

                {/* TODO: Screenshot of Element Picker */}

                <p>
                  The general approach for creating elements is the same across all contexts:
                  <ol>
                    <li>
                      <strong>Select an element type</strong>, usually corresponding to a FHIR resource type (e.g., Condition
                      or Observation).
                    </li>
                    <li>
                      Depending on the type that was selected,
                      <ul>
                        <li>
                          <strong>Associate the element</strong> with at least one value set or code to give it more specific
                          meaning (e.g., "Diabetes" or "LDL Cholesterol Test"), and/or...
                        </li>
                        <li>
                        <strong>Provide additional information</strong> as prompted by specific forms.
                        </li>
                      </ul>
                    </li>
                    <li>
                      <strong>Modify the results</strong> using "expression modifiers" to further filter the results (e.g.,
                      "Verified"), get a specific property of the result (e.g., "Quantity Value"), or test the result (e.g.,
                      "> 130 mg/dL").
                    </li>
                  </ol>
                </p>

                {/* TODO: Screenshot of Completed Element  */}

                <div className="h4-wrapper">
                  <h4 id="Select_Element_Type">Select an Element Type</h4>
                  <p>
                    The first step to create an element is to select the element's type.  The element type will determine what
                    kind of data the element retrieves from the patient record. To select an element type, click in the dropdown
                    box next to the "Add element" label. Depending on your artifact you many see any or all of these choices:
                    <ul>
                      <li><strong>Allergy Intolerance</strong>: Instances of the FHIR AllergyIntolerance resource type</li>
                      <li><strong>Base Elements</strong>: Re-usable elements defined in the "Base Elements" tab</li>
                      <li><strong>Condition</strong>: Instances of the FHIR Condition resource type</li>
                      <li>
                        <strong>Demographics</strong>: Age or Gender as specified in an instance of the FHIR Patient resource type
                      </li>
                      <li><strong>Encounter</strong>: Instances of the FHIR Encounter resource type</li>
                      <li>
                        <strong>External CQL</strong>: Named CQL definitions from CQL files uploaded in the "External CQL" tab
                      </li>
                      <li><strong>Medication Statement</strong>: Instances of the FHIR MedicationStatement resource type</li>
                      <li>
                        <strong>Medication Request</strong>: Instances of the FHIR MedicationRequest(STU3/R4) or
                        MedicationOrder(DSTU2) resource type
                      </li>
                      <li><strong>Observation</strong>: Instances of the Observation resource type</li>
                      <li><strong>Parameters</strong>: Parameter values for parameters defined in the "Parameters" tab</li>
                      <li><strong>Procedure</strong>: Instances of the FHIR Procedure resource type</li>
                    </ul>
                    Click on the choice corresponding to the type of data this element should be based on.
                  </p>
                  {/* TODO: Screenshot of Selecting an Element  */}
                </div>

                <div className="h4-wrapper">
                  <h4 id="Associate_Element">Associate the Element</h4>
                  <p>
                    After choosing a type, you may need to associate it with a Value Set or Code. If you see a button labeled
                    "Authenticate VSAC", "Add Value Set", or "Add Code", then you have selected an element type which requires you
                    to narrow it down further via terminology. These types also show a small key icon next to the name to
                    indicate you will need to authenticate with the National Library of Medicine's Values Set Authority Center
                    (VSAC).
                  </p>
                  <p>
                    If you see an "Authenticate VSAC" button, you must click it and then enter in your UMLS Terminology Services
                    account username and password. This is not the same as your CDS Authoring Tool username and password. If
                    you do not have a UMLS Terminology Services account, see <a href="#Requesting_UTS_Account">Requesting a UMLS
                    Terminology Services Account</a>. After you authenticate, you will see two new buttons appear in your
                    element box: "Add Value Set" and "Add Code".
                  </p>
                  {/* TODO: Screenshot of Logging In to VSAC */}
                </div>

                <div className="h4-wrapper">
                  <h4 id="Add_Value_Set">Add Value Set</h4>
                  <p>
                    In the CDS Authoring Tool, authors use value sets to indicate a grouping of codes that should be used to
                    find matching items in a patient's health record. For example, a "Diabetes" value set might contain many
                    different codes that all indicate some diagnosis of Diabetes. These codes may differ in specificity or
                    sub-types (e.g., Type 1 Diabetes, Type 2 Diabetes) or may be from different code systems (e.g., ICD-9, ICD-10,
                    SNOMED-CT). If an author associates a value set with an element, then patient data need only match one of
                    the codes in the value set to be considered a match for the element.
                  </p>
                  <p>
                    To associate a value set with an element, click on the "Add Value Set" button. If you do not see an "Add
                    Value Set" button, first authenticate with the VSAC as described in the section above. After clicking the
                    "Add Value Set" button, a modal dialog will appear allowing you to search for a value set by keyword. Enter
                    a keyword representing the value set you want to find and click the "Search" button.
                  </p>
                  {/* TODO: Screenshot of Searching for Diabetes */}
                  <p>
                    After clicking "Search", a set of results will be displayed. Each item in the results represents a value set
                    in the VSAC, including its name, Object Identifier (OID), Steward, and the number of codes in the value set.
                    To see the contents of a specific value set in the results, click its name.
                  </p>
                  {/* TODO: Screenshot Clicking a Value Set name */}
                  <p>
                    After clicking on a specific value set, its full set of codes will be displayed. Each item in the list shows
                    a contained code, its name, and its system. This allows authors to confirm that the value set contents match
                    their intent. If this value set is not a good match or you want to inspect other value sets in the results,
                    click the left arrow button near the top of the dialog. Otherwise, click the "Select" button to confirm
                    the selection of the displayed value set.
                  </p>
                  <p>
                    NOTE: The VSAC recently introduced a new approach toward authoring value sets that allows value sets to be
                    defined using code filters. These value sets are called intensional value sets, and while the VSAC supports
                    authoring them, it does not yet support retrieving their contents over the FHIR interface that the CDS
                    Authoring Tool uses. If you select an intensional value set, an error will be displayed indicating that the
                    codes cannot be retrieved. You can, however, still select the value set if you are confident it is the one
                    you need.
                  </p>
                  {/* TODO: Screenshot Showing Value Set contents */}
                  <p>
                    Upon selection of the value set, the element will be updated with the value set association and a name
                    (which defaults to the value set name). Feel free to modify the name to more closely match the final intent
                    of the element. At this point, you can associate additional value sets or codes. These value sets and codes
                    will be treated as a unioned set, meaning that an item in a patient's health record need only match one of
                    any of them in order to be matched on the element as a whole.
                  </p>
                  <p>
                    Associated value sets will be reflected in the expression phrase as well as listed in the element's metadata.
                    You can review a value set's contents by clicking on the eye icon <span class="fa fa-eye" aria-hidden="true">
                    </span> to the right of the listed value set. You can delete the value set association by clicking the "X"
                    icon to the far right of the listed value set.
                  </p>
                  <p>
                    Depending on the context of the element, you may also see a warning message indicating that the element
                    does not have the correct return type. For example, if this is an element in the Inclusions or Exclusions
                    criteria, it must have a return type "boolean" (e.g., a true or false answer). This is because every element
                    in the criteria is combined using "and" or "or" clauses to arrive at an aggregate answer: true (the patient
                    meets the criteria) or false (the patient does not meet the criteria). To satisfy the requirement for a
                    specific return type, you must [modify the results](#Modify_Results) until the required return type is
                    achieved.
                  </p>
                  {/* TODO: Screenshot Showing Element w/ Associated Value Set */}
                </div>

                <div className="h4-wrapper">
                  <h4 id="Add_Code">Add Code</h4>
                  <p>
                    In cases where only a certain code should be used to match patient data for an element, authors can
                    associate a single code with an element without using a value set. This feature can also be used to support
                    matching on a code that is valid but is not a part of a value set that is also associated to the element.
                  </p>
                  <p>
                    To associate a specific code with an element, click on the "Add Code" button. If you do not see an "Add
                    Code" button, first authenticate with the VSAC as described above. After clicking the "Add Code" button, a
                    modal dialog will appear allowing you to enter a code and select the system from which it came. Currently,
                    the CDS Authoring Tool supports the following systems, which are also supported by the VSAC: SNOMED,
                    ICD-9, ICD-10, NCI, LOINC, and RXNORM. To choose a different code system, select "Other" in the code system
                    dropdown menu and provide the FHIR-compatible identifying URL for the code system. Once you've entered the
                    code and selected the appropriate system, click the "Validate" button.
                  </p>
                  {/* TODO: Screenshot of Entering Code */}
                  <p>
                    After clicking "Validate", the CDS Authoring Tool will send the code to the VSAC for validation. If the code
                    is from a supported code system and verified by VSAC, the CDS Authoring Tool will display the code, its
                    system, and its display text. You can confirm the selection by clicking on the "Select" button at the
                    bottom of the dialog.
                  </p>
                  {/* TODO: Screenshot of successfully validated code */}
                  <p>
                    If the code fails validation, this means the code is invalid or the code system is not supported. In either
                    case, an error will be shown at the bottom of the dialog. You can choose to modify the code and try again,
                    cancel the code selection process, or select the code despite the validation error. To cancel the code
                    selection, click the "Cancel" button at the bottom of the dialog. To select the code anyway, click the
                    "Select" button at the bottom of the dialog.
                  </p>
                  {/* TODO: Screenshot of validation failure */}
                  <p>
                    Upon selection of the code, the element will be updated with the code association and a name (which defaults
                    to the code's display text, if it is available). Feel free to modify the name to more closely match the final
                    intent of the element. At this point, you can associate additional codes or value sets. These codes and value
                    sets will be treated as a unioned set, meaning that an item in a patient's health record need only match one
                    of any of them in order to be matched on the element as a whole.
                  </p>
                  <p>
                    Associated codes will be reflected in the expression phrase as well as listed in the element's metadata.
                    You can delete the code association by clicking the "X" icon to the far right of the listed value set.
                  </p>
                  <p>
                    Depending on the context of the element, you may also see a warning message indicating that the element
                    does not have the correct return type. For more information see the last paragraph in the section above.
                  </p>
                  {/* TODO: Screenshot Showing Element w/ Associated Code */}
                </div>

                <div className="h4-wrapper">
                  <h4 id="Provide_Additional_Information">Provide Additional Information</h4>
                  <p>
                    All elements provide user-configurable fields for the element name as well as a comment. In some cases, the
                    element name may be pre-populated, but you may change the name if desired. It's considered a best practice
                    to reflect the intent of the element in its name. For example, if an element checks for an LDL cholesterol
                    test with a result over 130 mg/dL, then "LDL-c > 130 mg/dL" is a better name than just "LDL-c Test".
                  </p>
                  {/* TODO: Screenshot of updated Element name */}
                  <p>
                    The comments field allows authors to provide additional information about an element. Recommended uses
                    of comments include:
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
                    All comments are added to the generated CQL above the element's definition. However, they are not
                    executed as part of the artifact and just serve as an annotation to the element.
                  </p>
                  {/* TODO: Screenshot of Element w/ updated name and comments */}
                  <p>
                    Some element types reqest additional information. Currently, the following two element types require
                    additional information:
                    <ul>
                      <li>
                        <strong>Demographics -> Age Range</strong> requires at least one of: Minimum Age, Maximum Age; as well
                        as the unit of time (e.g., years).
                      </li>
                      <li>
                        <strong>Demographics -> Gender</strong> requires one of the following values to be selected: Male, Female,
                        Other, Unknown.
                      </li>
                    </ul>
                  </p>
                  {/* TODO: Screenshot of Age Range */}
                </div>

                <div className="h4-wrapper">
                  <h4 id="Modify_Results">Modify Results</h4>

                  <p>
                    Once you have the core element defined, including associated value sets and codes (if applicable), its
                    return type will be displayed near the bottom of the element. For elements with FHIR-based types (e.g.,
                    Condition, Observation, etc.), the return-type will be a list of items matching that type (e.g., List of
                    Conditions). In some cases, the default return type is incompatible with the context in which it is used and
                    should be modified to meet the requirements of the context. In other cases, the return type may be compatible,
                    but the author may want to further filter the results.
                  </p>
                  <p>
                    CDS Authors can use "modifier expressions" to further define or narrow an element's intent. For example, if
                    you have a "Condition" element associated with a "Diabetes" value set, its initial return type will be:
                    "List of Diabetes". You can then apply the "Confirmed" expression modifier to filter the results to only those
                    with a confirmed clinical status, and finally apply the "Exists" expression modifier to check that at least
                    one result for this query exists in the patient's record. Since the return type of the "Exists" expression
                    modifier is "Boolean", this satisfies the requirement for boolean return types in the Inclusions and
                    Exclusions tabs.
                  </p>
                  <p>
                    To apply an expression modifier to an element, click on the "Expressions" button near the bottom of the
                    element box. When you do this, a set of buttons will be displayed indicating the possible expression
                    modifiers that can be applied to the current element.
                  </p>
                  {/* TODO: Screenshot of Expression modifiers selecting Condition Confirmed */}
                  <p>
                    Expression modifiers can be chained onto one another in succession. The return type from the first expression
                    modifier that is applied will affect the types of expression modifiers that can be applied as the second, and
                    so on. The CDS Authoring Tool performs this filtering for the author automatically, always showing only the
                    expression modifiers that are valid in the current context.
                  </p>
                  {/* TODO: (MAYBE) Screenshot of Exists being chained on Confirmed */}
                  <p>
                    Expression modifiers and their value (when applicable) are shown as a list in the main body of the element
                    box. The element type, its associations, and its expression modifiers are also used to display a user-friendly
                    phrase that summarizes the calculated intent of the element. For the example above, the generated phrase
                    would be "There exists a confirmed condition with a code from Diabetes." As you modify the element, the CDS
                    Authoring Tool will update its expression phrase automatically.
                  </p>
                  <p>
                    If you need to remove expression modifiers, you must remove them one at a time, starting with the last one.
                    To remove an expression modifier, click on the "X" on the far right hand side of the expression modifier's
                    row in the element's content. It is currently not possible to directly remove expression modifiers in the
                    middle of the expression modifier list because this might change the current return type at that point and
                    render the rest of the expression modifier list invalid.
                  </p>
                  {/* TODO: Screenshot of whole element */}
                  <p>
                    To see the full set of expression modifiers applicable to each element and/or return type, click on the
                    "Data Types" tab on the <a href="documentation">Documentation</a> page.
                  </p>
                </div>
              </div>

              <div className="h3-wrapper">
                <h3 id="Deleting_Elements">Deleting Elements</h3>
                <p>
                  The CDS Authoring Tool allows authors to delete elements they no longer need or use. To delete an element,
                  click the "X" button in the top-right corner of the element's box. Currently, the CDS Authoring Tool does not
                  require author's to confirm deletion; the element is deleted immediately. This action cannot be undone.
                </p>
                {/* TODO: Screenshot of deleting an element */}
                <p>
                  In some cases, the CDS Authoring Tool will not allow you to delete an element. If the CDS Authoring Tool
                  prevents you from deleting an element, this means that it is referenced and used elsewhere. To delete the
                  element, you must first delete (or modify) all usages of that element.
                </p>
              </div>

              <div className="h3-wrapper">
                <h3 id="Deleting_Elements">Collapsing Elements</h3>
                <p>
                  Because elements can contain a lot of detail, they may take up a large amount of space on the screen. In order
                  to allow for a more streamlined view of the artifact's logic, the CDS Authoring Tool allows authors to collapse
                  elements. When an element is collapsed, only its name and expression phrase are displayed.
                </p>
                {/* TODO: Screenshot of collapsed element */}
                <p>
                  To collapse an element, click the double-down arrow <span class="fa fa-angle-double-down" aria-hidden="true">
                  </span> between the indent button and the delete button in the element's box. To re-expand an element, click
                  the double-right arrow <span class="fa fa-angle-double-right" aria-hidden="true"></span> between the indent
                  button and the delete button in the element's box.
                </p>
                {/* TODO: Screenshot of collapsed button */}
              </div>

              <div className="h3-wrapper">
                <h3 id="Combining_Elements">Combining Elements</h3>
                <p>
                  While elements can be useful on their own, usually they are combined with other elements in order to represent
                  more complex ideas or requirements. The CDS Authoring Tool supports the following ways of combining elements:
                  <ul>
                    <li><strong>And</strong>: Require every element in a set of boolean elements to be true</li>
                    <li><strong>Or</strong>: Require at least one element in a set of boolean elements to be true</li>
                    <li><strong>Indented Group</strong>: Group a set of elements together to represent a single logical unit</li>
                    <li><strong>Intersect</strong>: Find the set of items that occur in each element of a set of elements</li>
                    <li><strong>Union</strong>: Combine items from multiple elements into a single set of items</li>
                  </ul>
                </p>

                <div className="h4-wrapper">
                  <h4 id="And">And</h4>
                  <div>
                    Combining elements using "And" indicates that each of the elements should evaluate to a "true" result in order
                    for the logic to be satisfied. For example, you might combine an Age Range element and a Gender element using
                    "And" to indicate that a patient must be 40 - 75 years old AND male. Elements must have a boolean return
                    type in order to be combined using "And".
                  </div>
                  {/* TODO: Screenshot of Age 45 - 70 years and male? */}
                  <div>
                    The Inclusions, Exclusions, and Subpopulations tabs all require elements to be combined using And, Or, or
                    indented groups. In these tabs, you can combine elements using "And" by clicking the dropdown between
                    elements and selecting "And". The CDS Authoring Tool requires that all sibling elements (e.g., elements
                    indented at the same level) use the same combination logic, so when you select "And" between two elements,
                    it will also be selected for all other elements at the same indent level.
                  </div>
                  {/* TODO: Screenshot of choosing And */}
                  <div>
                    In the Base Elements tab, elements can be combined using the "List Operations" element type. Do this by
                    choosing "List Operations" in the element type dropdown and then selecting "And" in the second dropdown. This
                    will create a group that you can give a unique name and begin adding elements to.
                  </div>
                  {/* TODO: Screenshot of List Operations -> And */}
                </div>

                <div className="h4-wrapper">
                  <h4 id="Or">Or</h4>
                  <div>
                    Combining elements using "Or" indicates that at least one of the elements should evaluate to a "true" result
                    in order for the logic to be satisfied. For example, you might combine a Diabetes element and an LDL-c element
                    to indicate that a patient should have a diagnosis of diabetes or an LDL cholesterol reading above a certain
                    threshold. Elements must have a boolean return type in order to be combined using "Or".
                  </div>
                  {/* TODO: Screenshot of Diabetes and LDL-c > 130 mg/dL? */}
                  <div>
                    The Inclusions, Exclusions, and Subpopulations tabs all require elements to be combined using And, Or, or
                    indented groups. In these tabs, you can combine elements using "Or" by clicking the dropdown between
                    elements and selecting "Or". The CDS Authoring Tool requires that all sibling elements (e.g., elements
                    indented at the same level) use the same combination logic, so when you select "Or" between two elements,
                    it will also be selected for all other elements at the same indent level.
                  </div>
                  {/* TODO: Screenshot of choosing Or */}
                  <div>
                    In the Base Elements tab, elements can be combined using the "List Operations" element type. Do this by
                    choosing "List Operations" in the element type dropdown and then selecting "Or" in the second dropdown. This
                    will create a group that you can give a unique name and begin adding elements to.
                  </div>
                  {/* TODO: Screenshot of List Operations -> Or */}
                </div>

                <div className="h4-wrapper">
                  <h4 id="Indented_Group">Indented Group</h4>
                  <div>
                    Sometimes authors need to create complex logic that requires the use of "And" and "Or" at the same time.
                    This is accomplished by creating and combining sub-groups of elements. For example, you might want to
                    indicate that a patient must be 40 - 75 years old and male and have either a diagnosis of diabetes or an
                    LDL cholesterol reading above a certain threshold. To do this, you would create the first two elements as
                    described in the <a href="#And">And</a> section above, but then you would create an indented group to
                    contain the remaining two elements that should be combined using <a href="#Or">Or</a>.
                  </div>
                  {/* TODO: Screenshot of Age 45 - 70 years and male and diabetes or LDL-c > 130 mg/dL */}
                  <div>
                    To create a new indented group, create the first element that should go in the indented group as normal.
                    Then click on the "indent" button <span class="fa fa-indent" aria-hidden="true"></span> to the right of the
                    element name to automatically create a new indented group and place the element in it. This new group can
                    (and should) be given a unique name. To add more elements in the group, use the new "Add element" box that
                    is displayed at the bottom of the indent group.
                  </div>
                  {/* TODO: Screenshot of indented group */}
                  <div>
                    Groups can be indented multiple levels deep. In addition, groups can be outdented to return their elements
                    back to the outer indent level. Use the "outdent" button <span class="fa fa-outdent" aria-hidden="true">
                    </span> to outdent groups.
                  </div>
                </div>

                <div className="h4-wrapper">
                  <h4 id="Intersect">Intersect</h4>
                  <div>
                    Combining elements using "Intersect" indicates that each of the elements should be inspected and only those
                    items that match every element should be included in the intersection results. For example, if you combine
                    an element representing confirmed myocardial infarctions with an element representing myocardial infarctions
                    in the last six months, using "intersect", the result will be only myocardial infarctions that are in both
                    element sets (i.e., confirmed and within the last six months).
                  </div>
                  {/* TODO: Screenshot of confirmed MI and MI in the last 6 months? */}
                  <div>
                    The "Intersect" combination can only be applied in the Base Elements tab using the "List Operations" element
                    type. Do this by choosing "List Operations" in the element type dropdown and then selecting "Intersect" in
                    the second dropdown. This will create a group that you can give a unique name and begin adding elements to.
                    All of the elements in the group will be intersected together. Since intersection requires elements to have
                    returned items in common, the elements in an intersected group should all have the same result type,
                    otherwise it is impossible for any item to match against all of the elements.
                  </div>
                  {/* TODO: Screenshot of List Operations -> Intersect */}
                </div>

                <div className="h4-wrapper">
                  <h4 id="Union">Union</h4>
                  <div>
                    Combining elements using "Union" indicates that all of the items across all of the elements should be
                    combined together into a single set of items. For example, combining an LDL-c element with an HDL-c element
                    using "Union" will result in all of LDL-c and HDL-c observations.
                  </div>
                  {/* TODO: Screenshot of ldl-c and hdl-c combined? */}
                  <div>
                    The "Union" combination can only be applied in the Base Elements tab using the "List Operations" element
                    type. Do this by choosing "List Operations" in the element type dropdown and then selecting "Union" in
                    the second dropdown. This will create a group that you can give a unique name and begin adding elements to.
                    All of the elements in the group will be unioned together. If elements in the union have different return
                    types, the return type of the overall union will be "Any".
                  </div>
                  {/* TODO: Screenshot of List Operations -> Union */}
                </div>
              </div>

              <div className="h3-wrapper">
                <h3 id="Inclusions">Inclusions Tab</h3>
                <p>
                  Authors use the Inclusions tab to specify the criteria that patients should meet in order to receive a
                  recommendation from the artifact. If a patient meets the criteria in the Inclusions tab and does not meet any
                  criteria in the Exclusions tab, then they are considered to be part of the general population for which this
                  artifact's recommendations apply.
                </p>
                <p>
                  Authors specify the Inclusions criteria by creating and combining elements as described in the sections above.
                  Typically, Inclusions criteria will use "And" combinations so that all of the criteria must be met in order to
                  receive a recommendation.
                </p>
                {/* TODO: Screenshot of Inclusions */}
              </div>

              <div className="h3-wrapper">
                <h3 id="Exclusions">Exclusions Tab</h3>
                <p>
                  Authors use the Exclusions tab to specify criteria that should disqualify patients from receiving a
                  recommendation from the artifact. Even if a patient meets the criteria in the Inclusions tab, the criteria in
                  the Exclusions tab can prevent them from being in the general population for which this artifact's
                  recommendations apply. For example, some recommendations should not be provided when a patient is pregnant,
                  even if they are otherwise indicated.
                </p>
                <p>
                  Authors specify the Exclusions criteria by creating and combining elements as described in the sections above.
                  Typically, Exclusions criteria will use "Or" combinations so that any of the criteria can disqualify the
                  patient from the recommendation.
                </p>
                {/* TODO: Screenshot of Inclusions */}
              </div>

              <div className="h3-wrapper">
                <h3 id="Subpopulations">Subpopulations Tab</h3>
                <p>
                  Authors use the Subpopulations tab to specify criteria that groups patients into subpopulation that can be
                  associated with more specific recommendations. While subpopulations are not required, they can be useful for
                  artifacts that need to deliver more nuanced recommendations or recommendations that are population-specific.
                  For example, a statin artifact might deliver a different strength recommendation for a patient with a 10-year
                  risk score of 8% versus a patient with a 10-year risk score of 12%.
                </p>
                <p>
                  The Subpopulations tab allows authors to create as many subpopulations as needed. For each subpopulation, the
                  author must specify a unique name, then create and combine elements as described in the sections above. To
                  create a new subpopulation, click the "New subpopulation" button in the Subpopulations tab.
                </p>
                {/* TODO: Screenshot of Subpopulations */}
              </div>

              <div className="h3-wrapper">
                <h3 id="Base_Elements">Base Elements Tab</h3>
                <p>
                  Authors use Base Elements to create elements that can be re-used across several elements and contexts
                  within the artifact. This allows for common elements to be defined once and used, as well as further modified,
                  where ever they may be needed. This also allows authors to define standalone elements outside of any specific
                  context and have these elements exported as-is in the CQL.
                </p>
                <div className="h4-wrapper">
                  <h4 id="Creating_Base_Elements">Creating Base Elements</h4>
                  <p>
                    Authors specify Base Elements by creating and (optionally) combining elements as described in the sections
                    above. Since these elements are not in the context of specific logical constructs, they are not required to
                    have any specific return type.
                  </p>
                  {/* TODO: Screenshot of Base element */}
                </div>
                <div className="h4-wrapper">
                  <h4 id="Using_Base_Elements">Using Base Elements</h4>
                  <p>
                    Authors can reference and use Base Elements in the Inclusions tab, Exclusions tab, and Subpopulations tab.
                    To use a base element, it must be created in the Base Elements tab first. After that, use it in any valid
                    location by selecting the "Base Elements" type in the element type dropdown. A second dropdown will appear
                    allowing you to choose the Base Element you want.
                  </p>
                  {/* TODO: Screenshot of Choosing Base element */}
                  <p>
                    An element that is based on a base element is shaded light blue to make it more easily distinguishable.
                    In addition, it lists the original base element's name in the content of its element definition
                    using the "Base Element" label. If you click the link icon <span class="fa fa-link delete-valueset-button"
                    aria-hidden="true"></span> to the far right of the base element's name, you will go directly to the base
                    element definition.
                  </p>
                  <p>
                    If the base element does not have the return type required by its context (for example, if it is used in the
                    Inclusions tab but does not have a boolean return type), you can add expression modifiers to it in much the
                    same way as you would any element. In this case, the expression modifiers added to the use of the base
                    element will not affect the original definition of the base element in the Base Elements tab. This allows
                    base elements to used in a broad set of contexts in differing ways.
                  </p>
                  {/* TODO: Screenshot of base element use? */}
                  <p>
                    When a Base Element has been used, the definition of the element in the Base Elements tab will show where
                    it is being used. This is indicated by rows labeled "Element Use" in the content of the element definition.
                    If you click the link icon <span class="fa fa-link delete-valueset-button" aria-hidden="true"></span> to the
                    far right of the use's elementname, you will go directly to the element's definition.
                  </p>
                  {/* TODO: Screenshot of base element? */}
                  <p>
                    Note that when a base element is used, certain restrictions are put into place. One restriction is that you
                    cannot delete it. To delete a base element that is being used, you must first delete (or edit) all of its
                    uses.
                  </p>
                  <p>
                    Another restriction is that applied expressions cannot be removed if doing so would change the Base Element's
                    return type. This ensures that modifying a base element does not make its uses become invalid. In order
                    to remove the expression, first delete all uses of the Base Element in the artifact.
                  </p>
                  <p>
                    In addition, expression modifiers cannot be added to base elements that are being used, unless the expression
                    modifier does not change the overall return type of the element. If the expression modifier would change the
                    return type of the base element, then you must first remove all uses of the Base Element in the artifact
                    before you can add the expression modifier.
                  </p>
                </div>
              </div>

              <div className="h3-wrapper">
                <h3 id="Recommendations">Recommendations Tab</h3>
                <p>
                  Recommendations are the resulting notices that should be delivered to the clinician after the CDS
                  Artifact is executed. Recommendations are written as free text and can have an accompanying Rationale.
                  For the simplest cases, authors specify a single recommendation which will be delivered for any patient who
                  meets the Inclusions criteria but does not meet any Exclusions criteria. For more advanced cases, authors can
                  specify recommendations tailored to specific subpopulations.
                </p>
                {/* TODO: Screenshot of blank recommendation */}

                <div className="h4-wrapper">
                  <h4 id="Creating_Recommendations">Creating Recommendations</h4>
                  <p>
                    A blank recommendation is included in the Recommendations tab by default. To create additional
                    recommendations, click the "New recommendation" button. This will add a blank recommendation below the last
                    recommendation. Note that recommendations are processed in the order they appear, and patients will receive
                    the first recommendation for which they are eligible.
                  </p>
                  <p>
                    Sometimes authors may want to include a rationale for the recommendation as a separate data field. To do
                    this, click on the "Add rationale" button in any recommendation element. This will display another text field
                    which can be used to enter the rationale.
                  </p>
                  {/* TODO: Screenshot with recommendation and rationale */}
                </div>

                <div className="h4-wrapper">
                  <h4 id="Associating_Recommendations">Associating Recommendations with Subpopulations</h4>
                  <p>
                    For CDS artifacts that may deliver more than one recommendation, authors must associate recommendations with
                    the subpopulations to which they apply. The CDS Authoring Tool includes the following subpopulations by
                    default:
                    <ul>
                      <li>
                        <strong>Doesn't Meet Inclusion Criteria</strong>: Patients who don't meet the inclusion criteria usually
                        will not receive a recommendation, but associating a recommendation with this subpopulation allows
                        you to still deliver a notice for these patients.
                      </li>
                      <li>
                        <strong>Meets Exclusion Criteria</strong>: Patients who meet the exclusion criteria usually will not
                        receive a recommendation, but associating a recommendation with this subpopulation allows you to still
                        deliver a notice for these patients.
                      </li>
                    </ul>
                    In addition, any subpopulations that you created can also be associated with recommendations. For More
                    information on creating subpopulations, see <a href="#Subpopulations">Subpopulations</a> documentation.
                  </p>
                  <p>
                    To associate a recommendation with subpopulations, click the "Add subpopulation" button. This will display
                    a section above the recommendation text where you can select a subpopulation or you can create a new
                    subpopulation using the "New subpopulation" link. After selecting a subpopulation, you can optionally select
                    another subpopulation. The recommendation will only be delivered if the patient meets every subpopulation
                    criteria that has been associated with the recommendation.
                  </p>
                  {/* TODO: Screenshot selecting subpopulations */}
                </div>

                <div className="h4-wrapper">
                  <h4 id="Managing_Recommendations">Re-ordering and Deleting Recommendations</h4>
                  <p>
                    Since patients will receive the first recommendation that applies to them, the order that recommendations
                    are listed will affect how the CDS artifact behaves. In some cases, authors may need to re-order their
                    recommendations with this in mind. To re-order recommendations, click the up arrow <span
                    class="fa fa-caret-up fa-fw"></span> or down arrow <span aria-hidden="true" class="fa fa-caret-down fa-fw">
                    </span> on any recommendation to move it up or down.
                  </p>
                  <p>
                    Authors may also need to delete recommendations if they were entered by mistake or are no longer applicable.
                    To do this, click the "X" button in the recommendation element box. This will prompt you to confirm the
                    deletion. Once you have confirmed this, the recommendation will be permanently deleted. This action cannot be
                    undone.
                  </p>
                  {/* TODO: Screenshot of moving or deleting a recommendation */}
                </div>
              </div>

              <div className="h3-wrapper">
                <h3 id="Parameters">Parameters Tab</h3>
                <p>
                  Parameters allow authors to create named elements whose values can be supplied by the CDS execution environment
                  at run-time. Authors can specify default values for parameters, but are not required to do so. Parameters
                  provide a useful approach for allowing certain aspects of CDS behavior to be tailored for specific environments
                  without the need to modify the CDS logic itself. For example, an artifact that is capable of delivering grade B
                  and grade C recommendations might specify a parameter called "Allow Grade C" with a default value: true. At
                  sites where grade C recommendations are not allowed, the CDS can be run with the parameter value set to false
                  in order to supress grade C recommendations. The author, of course, needs to properly use the parameter in
                  their logic to implement this behavior. To support this, parameters can be referred to in elements throughout
                  the CDS logic (much like base elements).
                </p>
                {/* TODO: Screenshot of parameters view */}

                <div className="h4-wrapper">
                  <h4 id="Creating_Parameters">Creating Parameters</h4>
                  <p>
                    Authors can define as many parameters as they'd like. To create a parameter, click the "New parameter"
                    button. An empty parameter box will be displayed with fields for the parameter name, user-provided comments,
                    the parameter type, and an optional default value.
                  </p>
                  <p>
                    The parameter name should reflect the purpose of the parameter, making it easier for implementors to
                    understand what it represents and how it might affect the artifact. The comments box, however, can be used
                    to provide additional information about the parameter and its affect on the behavior of the artifact.
                  </p>
                  <p>
                    The parameter type provides a dropdown selection of available parameter types: Boolean, Code, Concept,
                    Integer, DateTime, Decimal, Quantity, String, Time, Interval&lt;Integer&gt;, Interval&lt;DateTime&gt;,
                    Interval&lt;Decimal&gt;, and Interval&lt;Quantity&gt;. Once you've selected a parameter type, the default
                    value editor will provide an appropriate interface for editing the type of value you chose. Specifying a
                    default value is optional, but if no default value is specified, then implementors must specify a value for
                    that parameter at run-time.
                  </p>
                  {/* TODO: Screenshot with parameter filled out */}
                </div>

                <div className="h4-wrapper">
                  <h4 id="Using_Parameters">Using Parameters</h4>
                  <p>
                    Authors can reference and use Parameters in the Inclusions tab, Exclusions tab, Subpopulations tab, and
                    Handle Errors tab. To use a parameter, it must be created in the Parameters tab first. After that, use it in
                    any valid location by selecting the "Parameters" type in the element type dropdown. A second dropdown will
                    appear allowing you to choose the Parameter you want.
                  </p>
                  {/* TODO: Screenshot of Choosing Parameter */}
                  <p>
                    An element using a parameter indicates the parameter in its expression phrase as well as listing the
                    parameter's name in the content of its element definition using the "Parameter" label. If you click the link
                    icon <span class="fa fa-link delete-valueset-button" aria-hidden="true"></span> to the far right of the
                    parameter's name, you will go directly to the parameter definition.
                  </p>
                  <p>
                    If the parameter does not have the return type required by its context (for example, if it is used in the
                    Inclusions tab but does not have a boolean return type), you can add expression modifiers to it in much the
                    same way as you would any element.
                  </p>
                  {/* TODO: Screenshot of parameter use? */}
                  <p>
                    Note that when a parameter is used, certain restrictions are put into place: it cannot be deleted nor can
                    its parameter type be changed. To delete a parameter or change its type, you must first delete (or edit) all
                    of its uses.
                  </p>
                </div>

                <div className="h4-wrapper">
                  <h4 id="Deleting_Parameters">Deleting Parameters</h4>
                  <p>
                    Authors may want to delete parameters if they were entered by mistake or are no longer applicable.
                    To do this, click the "X" button in the parameter element box. This will immediately delete the parameter
                    without requesting further confirmation. This action cannot be undone.  If the "X" button is disabled,
                    this means you cannot delete the parameter because it is currently being used by another element. To delete
                    it, you must first remove all uses of it from other elements.
                  </p>
                  {/* TODO: Screenshot of moving or deleting a parameter */}
                </div>
              </div>

              <div className="h3-wrapper">
                <h3 id="Handle_Errors">Handle Errors Tab</h3>
                <p>
                  Authors use the "Handle Errors" tab to define what messages should be provided to end users when certain error
                  conditions arise. For example, an author might want to return an error message if required data is missing from
                  the patient's health record. Handling errors is optional and may not be required or useful for certain use
                  cases.
                </p>
                <p>
                  NOTE: Although CQL 1.2 introduced the "Messages" function to allow authors to return error messages to the
                  operating environment at run-time, the CDS Authoring Tool does not currently use this approach. Instead, it
                  creates a CQL statement called "Errors" that will return a list of the errors that are applicable to the
                  patient in context. Each error in the list is a simple text string. Although the result is a list, the CDS
                  Authoring Tool is currently only capable of returning one error per invocation, so the list length will never
                  be more than one.
                </p>
                {/* TODO: Screenshot of handle errors view */}

                <div className="h4-wrapper">
                  <h4 id="Error_Conditions">Error Conditions</h4>
                  <p>
                    Authors specify error handling by chaining together conditional "If" statements, indicating that if a certain
                    condition (or set of conditions) is met, then a certain error message should be returned. By default, the
                    CDS Authoring Tool provides three initial conditions that can be used when specifying errors:
                    <ul>
                      <li><strong>Recommendations is null</strong>: indicates that no recommendation could be provided.</li>
                      <li>
                        <strong>Doesn't Meet Inclusion Criteria</strong>: indicates that the patient didn't meet the initial
                        criteria to receive the recommensation.
                      </li>
                      <li>
                        <strong>Meets Exclusion Criteria</strong>: indicates that the patient met the criteria that automatically
                        excludes them from receiving the recommendation regardless of whether or not they met the inclusion
                        criteria.
                      </li>
                    </ul>
                    In addition to the conditions above, authors can select subpopulations or boolean-valued parameters as
                    conditions to indicate when an error message should be returned.
                  </p>
                  {/* TODO: Screenshot showing condition list */}
                </div>

                <div className="h4-wrapper">
                  <h4 id="Handle_Errors_If">If Condition Then</h4>
                  <p>
                    To setup the simplest error handling case, choose a condition from the dropdown menu below the "If" label
                    in the "Errors" box. After you've selected the condition on which the error should be returned, enter the
                    error message into the text box below the label "Then".
                  </p>
                  {/* TODO: Screenshot of Simple Error Handling */}
                </div>

                <div className="h4-wrapper">
                  <h4 id="Handle_Errors_And_Also_If">And Also If...</h4>
                  <p>
                    To create more complex conditional logic, click on the "And Also If..." button. This allows you to specify
                    more detailed error handling for when the top-level condition is met. Clicking the "And Also If..." button
                    will display a new set of indented error handling controls. These controls work the same as the top-level set
                    of error handling controls, but will only be active when the top-level condition is met first.
                  </p>
                </div>

                <div className="h4-wrapper">
                  <h4 id="Handle_Or_Else_If">Or Else If...</h4>
                  <p>
                    To create alternate error messages for other conditions, click on the "Or Else If..." button. This allows
                    you to choose a condition that will be evaluated only if none of the other "If" or "Else if" conditions
                    above it were met. If it evaluates to true (and the previous conditions did not), then its error message
                    will be returned.
                  </p>
                </div>

                <div className="h4-wrapper">
                  <h4 id="Handle_Else">Else</h4>
                  <p>
                    The "Else" text box allows authors to specify an error if no other error messages were generated. This is
                    rarely used at the top-level, as most CDS should not return any error if everything runs smoothly. In nested
                    conditions (started by "And Also If..."), however, the "Else" box can be used to specify an error if the
                    top-level condition was met, but none of the sub-conditions were met. If the "Else" text box is left empty,
                    no error message will be returned if no other error condition has been satisfied.
                  </p>
                </div>
                {/* TODO: Screenshot of Complex Error Handling? */}
              </div>

              <div className="h3-wrapper">
                <h3 id="External_CQL">External CQL Tab</h3>
                <p>
                  Authors can use the "External CQL" tab to upload CQL files that contain logic that the author wants to use in
                  the current CDS artifact. This is useful when you want to re-use existing logic rather than re-write it or
                  when you want to use CQL logic that the CDS Authoring Tool is not capable of producing (for example, complex
                  mathematical operations or timing relationships). Currently, the CDS Authoring Tool can re-use definitions from
                  external CQL but cannot re-use functions from external CQL.
                </p>
                <p>
                  Note that uploading a CQL library does not make it editable in the CDS Authoring Tool. The external CQL library
                  is considered read-only. Authors, however, can use external CQL library elements as the basis of authored
                  elements and apply further expression modifiers to customize them for their artifacts.
                </p>
                {/* TODO: Screenshot of External CQL Tab */}

                <div className="h4-wrapper">
                  <h4 id="Uploading_External_CQL">Uploading External CQL</h4>
                  <p>
                    The CQL Authoring Tool allows CQL files to be uploaded individually or as a group of files contained in a
                    zip file. CQL files that are uploaded individually must not depend on any external libraries aside from
                    FHIRHelpers. If you want to upload a library that depends on other libraries (using CQL's "include" keyword),
                    you must upload a zip file containing the library and its dependencies.
                  </p>
                  <p>
                    There are two ways to upload external CQL files (whether .cql or .zip):
                    <ul>
                      <li>Find the file on your local disk and drag it into the drop zone (outlined by a dashed line).</li>
                      <li>Click anywhere in the drop zone to open a dialog you can use to find and select your file.</li>
                    </ul>
                    The CDS Authoring Tool will attempt to compile your CQL file when you upload it. If there are any errors,
                    it will display an error message and the file upload will be abandoned. If there are no errors, the upload
                    is successful and the file will appear in the list of external CQL libraries below the drop zone.
                  </p>
                </div>


                <div className="h4-wrapper">
                  <h4 id="Reviewing_External_CQL">Managing External CQL</h4>
                  <p>
                    The "External CQL" tab contains a list of uploaded CQL libraries, showing the following information and
                    controls for each artifact:
                    <ul>
                      <li>Library</li>
                      <li>Date Added</li>
                      <li>Version</li>
                      <li>FHIR Version</li>
                      <li>View Details button <span class="fa fa-eye" aria-hidden="true"></span></li>
                      <li>"Delete" button</li>
                    </ul>
                  </p>
                  {/* TODO: Screenshot of Library Listing */}
                  <p>
                    To view a summary of the contents of the external CQL library, click on the eye icon <span class="fa fa-eye"
                    aria-hidden="true"></span>. This will display a modal window with high-level metadata about the library
                    and a listing of the library's parameter's, functions, and definitions. For each of these, the name and
                    return type are shown.
                  </p>
                  {/* TODO: Screenshot of External CQL Details */}
                  <p>
                    To delete an external CQL library, click its "Delete" button. This will open a modal dialog asking you to
                    confirm that you would like to delete the external CQL file. After clicking the "Delete" button to confirm,
                    the external CQL library will be permanently deleted.  This cannot be undone.
                  </p>
                  <p>
                    If the "Delete" button is disabled, then this CQL library is being used within the artifact or is declared
                    as a dependency of one of the other external CQL libraries. To delete an external CQL library in this case,
                    you must first delete any uses of it in the artifact and/or the external libraries that declare it as a
                    dependency.
                  </p>
                </div>

                <div className="h4-wrapper">
                  <h4 id="Using_External_CQL_Elements">Using CQL Elements</h4>
                  <p>
                    Authors can reference and use parameters and definitions from external CQL libraries in the Inclusions tab,
                    Exclusions tab, Subpopulations tab, and Base Elements tab. Currently, the CDS Authoring Tool does not support
                    using functions from external CQL libraries. To use an external CQL element, select the "External CQL" type
                    in the element type dropdown in place an element can be created. A second dropdown will appear allowing you
                    to choose the External CQL library that contains the definition you wish to use. After selecting a library,
                    a third dropdown will appear allowing you to choose the specific parameter or definition to use.
                  </p>
                  {/* TODO: Screenshot of Choosing Base element */}
                  <p>
                    After selecting the external CQL parameter or definition, it will be reflectect in the element's expression
                    phrase and listed in the element's metadata using the label "External CQL Element". If you wish (or if
                    required), you can add expression modifiers to the element in much the same way as you would any element.
                    In this case, the expression modifiers added to the use of the external CQL element will not affect the
                    original definition of the external CQL element.
                  </p>
                  {/* TODO: Screenshot of base element use? */}
                  <p>
                    Note that when an external CQL element is used, it prevents the external CQL library from being deleted from
                    the artifact. To delete the external CQL library, you must first delete its use. In addition, the first time
                    you use external CQL in an artifact, that artifact will become locked into the same version of FHIR that the
                    external CQL uses. After this, you cannot download the artifact as other versions of FHIR nor can you test
                    the artifact against synthetic patient data using another version of FHIR.
                  </p>
                </div>
              </div>
            </div>

            <div className="h2-wrapper">
              <h2 id="Testing_Artifacts">Testing Artifacts ("Testing" View)</h2>
              <p>
                While CDS artifacts should always be tested in the environment where they are deployed, testing is an important
                part of the artifact development process as well. Testing CDS logic before it is deployed in a test environment
                allows authors to discover and fix bugs earlier in the process, saving both time and money. This also makes it
                easier to distinguish between bugs in the logic and bugs in the data or integration environment.
              </p>
              <p>
                The CDS Authoring Tool testing view allows authors to upload their own synthetic test patients as FHIR bundles of
                synthetic patient data. The author can then run their CDS logic against one or more of these patients and inspect
                the results to determine if they are as expected. The CDS Authoring Tool does not currently provide a test
                patient editor, nor does it provide a mechanism for automated verification of results (e.g., "test assertions").
                For more advanced testing capabilities, consider CDS Connect's <a target="_blank"
                rel="nofollow noopener noreferrer" onClick={onVisitExternalLink}
                href="https://github.com/AHRQ-CDS/CQL-Testing-Framework">CQL Testing Framework</a> <i
                className="fa fa-external-link"></i>.
              </p>
              {/* TODO: Screenshot of testing view */}

              <div className="h3-wrapper">
                <h3 id="Uploading_Test_Patients">Uploading Test Patients</h3>
                <p>
                  The first step in testing an artifact is to upload synthetic patient data to the CDS Authoring Tool. The CDS
                  Authoring Tool environment is not appropriate for real patient data (whether de-identified or not). Only
                  synthetic data should be used. Patient data should be uploaded as a FHIR bundle (DSTU2, STU3, or R4). Authors
                  familiar with FHIR can use their tool of choice to create patient test data. Popular options include
                  CDS Connect's <a target="_blank" rel="nofollow noopener noreferrer" onClick={onVisitExternalLink}
                  href="https://github.com/AHRQ-CDS/CQL-Testing-Framework">CQL Testing Framework</a> <i
                  className="fa fa-external-link"></i>, <a target="_blank" rel="nofollow noopener noreferrer"
                  onClick={onVisitExternalLink} href="https://github.com/synthetichealth/synthea">Synthea</a> <i
                  className="fa fa-external-link"></i>, <a target="_blank" rel="nofollow noopener noreferrer"
                  onClick={onVisitExternalLink} href="http://clinfhir.com/">ClinFHIR</a> <i className="fa fa-external-link">
                  </i>, and <a target="_blank" rel="nofollow noopener noreferrer" onClick={onVisitExternalLink}
                  href="https://build.fhir.org/ig/HL7/fhir-shorthand/">FHIR Shorthand</a> <i className="fa fa-external-link"></i>.
                </p>
                <p>
                  There are two ways to upload synthetic test patient bundles (in .json format):
                  <ul>
                    <li>Find the file on your local disk and drag it into the drop zone (outlined by a dashed line).</li>
                    <li>Click anywhere in the drop zone to open a dialog you can use to find and select your file.</li>
                  </ul>
                  When you upload a patient, the CDS Authoring Tool will display a modal dialog asking you to indicate which
                  version of FHIR the patient data conforms to. Choose DSTU2, STU3, or R4. This may affect what artifacts can
                  be tested using this patient and/or what FHIR version of the artifact will be used to do the testing on this
                  patient.
                </p>
                {/* TODO: Screenshot of FHIR version dialog */}
              </div>

              <div className="h3-wrapper">
                <h3 id="Managing_Test_Patients">Managing Test Patients</h3>
                <p>
                  The "Testing" tab contains a list of uploaded synthetic test patients, showing the following information and
                  controls for each patient:
                  <ul>
                    <li>Name</li>
                    <li>Birth Date</li>
                    <li>Gender</li>
                    <li>FHIR Version</li>
                    <li>Last Updated</li>
                    <li>View Details button <span class="fa fa-eye" aria-hidden="true"></span></li>
                    <li>"Delete" button</li>
                  </ul>
                </p>
                {/* TODO: Screenshot of Library Listing */}
                <p>
                  To view a summary of a synthetic test patient's data, click on the eye icon <span class="fa fa-eye"
                  aria-hidden="true"></span>. This will display a modal window with the patient's demographic data and
                  the individual entries within the patient's health record. The entries are grouped according to type
                  (e.g., Conditions, Medications, Encounters, etc.). Groups can be expanded and collapsed using the
                  right arrow <span class="fa fa-chevron-right" aria-hidden="true" ></span> and down arrow <span
                  class="fa fa-chevron-down" aria-hidden="true"></span>(respectively). When expanded, each group shows a
                  table with the most relevant data for that type (e.g., conditions show onset and abatement, medications
                  show date written, etc.).
                </p>
                {/* TODO: Screenshot of Patient Details */}
                <p>
                  At the bottom of the patient details view, an object browsers allows authors to see the exact FHIR
                  representation. This can be helpful for more detailed debugging or when the patient view summary data
                  does not show the relevant fields of interest.
                </p>
                {/* TODO: Screenshot of Patient Details Object Browser */}
                <p>
                  To delete a patient, click its "Delete" button. This will open a modal dialog asking you to confirm that you
                  would like to delete the patient. After clicking the "Delete" button to confirm, the patient will be
                  permanently deleted.  This cannot be undone.
                </p>
              </div>

              <div className="h3-wrapper">
                <h3 id="Testing_Artifacts">Testing Artifacts</h3>
                <p>
                  Once your test patients have been uploaded (see section above), you can run any compatible CDS artifact against
                  them. Compatible artifacts are artifacts that can be exported using the same version of FHIR as the patient data
                  is encoded in. Note that some artifacts may not be compatible with your patients because the artifact is locked
                  to a specific version of FHIR based on the external CQL it uses.
                </p>
                <p>
                  In order to run the CDS artifact's CQL, the CDS Authoring Tool must request additional value set information
                  (e.g., the set of codes) from the Value Set Authority Center. If you see an "Authenticate VSAC" button, you
                  must first click it and then enter in your UMLS Terminology Services account username and password (this is not
                  the same as your CDS Authoring Tool username and password). After you authenticate, you will see a new button
                  titled "Execute CQL on Selected Patients".
                </p>
                {/* TODO: Screenshot of Authenticating VSAC? */}
                <p>
                  To run your CDS artifact against your test patients, select the patients you want to test by checking the box
                  to the left of each patient's name. Once you've chosen the first test patient, you can only select other
                  patients that use the same version of FHIR. The CDS Authoring Tool does not support operating on multiple
                  versions of FHIR in a single test run. After selecting the patients you want to test click the "Execute CQL on
                  Selected Patients" button to open the testing details modal dialog.
                </p>
                {/* TODO: Screenshot of Selecting Patients and Clicking the Button */}
                <p>
                  The testing details dialog contains a dropdown select box allowing authors to choose a FHIR compatible artifact.
                  Choose the artifact you want to test from the list. If you do not see your artifact, it is likely locked to a
                  different version of FHIR than the patients you have selectec. If the artifact you selected has parameters
                  defined, an additional field will display for each parameter with the default value preselected. You can use
                  these fields to override the default values. After populating the parameter values (if applicable), click on
                  the "Execute CQL" button to close the dialog and execute the CQL.
                </p>
                {/* TODO: Screenshot of testing details */}
              </div>
              <div className="h3-wrapper">
                <h3 id="Review_Testing_Results">Reviewing Artifact Testing Results</h3>
                <p>
                  After executing the CQL, the results will be displayed on the main testing page under the dropzone in a box
                  labeled "CQL Execution Results". Under the label, high-level metadata will be shown, including:
                  <ul>
                    <li><strong>Artifact</strong>: the name of the artifact tested.</li>
                    <li>
                      <strong>Meets Inclusion Criteria</strong>: The number of patients that met the inclusion criteria
                      (e.g., "2 of 5 patients").
                    </li>
                    <li>
                      <strong>Meets Exclusion Criteria</strong>: The number of patients that met the exclusion criteria
                      (e.g., "1 of 5 patients").
                    </li>
                  </ul>
                  Below the execution results summary, a list of the test patients is displayed.
                </p>
                {/* TODO: Screenshot of testing results */}
                <p>
                  To see the individual results for test patients, click the right-arrow button <span class="fa fa-chevron-down"
                  aria-hidden="true"></span> to the right of the patient you want to view results for. This will list the five
                  most important CQL result elements for the patient:
                  <ul>
                    <li>
                      <strong>MeetsInclusionCriteria</strong>: A green checkmark <span class="fa fa-check boolean-check"
                      aria-hidden="true" ></span> indicates the patient met the inclusion criteria, a red "X" <span
                      class="fa fa-close boolean-x" aria-hidden="true" ></span> indicates the patient did not meet the inclusion
                      criteria, and the phrase "No Value" indicates that there was not enough data to make a determination.
                    </li>
                    <li>
                      <strong>MeetsExclusionCriteria</strong>: A green checkmark <span class="fa fa-check boolean-check"
                      aria-hidden="true" ></span> indicates the patient met the exclusion criteria, a red "X" <span
                      class="fa fa-close boolean-x" aria-hidden="true" ></span> indicates the patient did not meet the exclusion
                      criteria, and the phrase "No Value" indicates that there was not enough data to make a determination.
                    </li>
                    <li>
                      <strong>Recommendation</strong>: If the CDS indicates a recommendation for this patient, the recommendation
                      text will be displayed, otherwise the phrase "No Value" is displayed.
                    </li>
                    <li>
                      <strong>Rationale</strong>: If the CDS indicates a rationale for this patient, the rationale text will be
                      displayed, otherwise the phrase "No Value" is displayed.
                    </li>
                    <li>
                      <strong>Errors</strong>: If the CDS returns an error for this patient, the error text will be displayed,
                      otherwise the phrase "No Value" is displayed.
                    </li>
                  </ul>
                  {/* TODO: Screenshot of individual testing results */}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
