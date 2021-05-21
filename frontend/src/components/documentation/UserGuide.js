/* eslint max-len: ["error", 130] */
import React from 'react';
import { Waypoint } from 'react-waypoint';
import {
  Delete as DeleteIcon,
  Edit as EditIcon,
  FileCopy as CopyIcon,
  MenuBook as MenuBookIcon,
  Visibility as VisibilityIcon 
} from '@material-ui/icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faEye,
  faAngleDoubleDown,
  faAngleDoubleRight,
  faIndent,
  faOutdent,
  faLink,
  faCaretUp,
  faCaretDown,
  faChevronRight,
  faChevronDown,
  faCheck,
  faTimes
} from '@fortawesome/free-solid-svg-icons';
import clsx from 'clsx';

import { Link } from 'components/elements';
import { useTocbotWithWaypoint } from './hooks';
import useStyles from './styles';

const screenshotUrl = name => `${process.env.PUBLIC_URL}/assets/images/screenshots/${name}.png`;

const UserGuide = () => {
  const { onWaypointEnter, onWaypointLeave } = useTocbotWithWaypoint();
  const styles = useStyles();

  return (
    <div className={clsx(styles.guide, 'toc-container')} id="maincontent">
      <div className={clsx(styles.toc, 'toc')} id="toc"></div>

      <div className={clsx(styles.tocWrapper, 'toc-wrapper')}>
        <h1 id="CDS_Authoring_Tool_User_Guide">CDS Authoring Tool User Guide</h1>
        <div>
          The Clinical Decision Support (CDS) Authoring Tool is a web-based application to help CDS authors develop
          production-ready{' '}
          <Link
            external
            href="https://cql.hl7.org/"
            text={
              <>
                Health Level Seven (HL7<sup>®</sup>) Clinical Quality Language (CQL)
              </>
            }
          />{' '}
          logic without the need to fully understand the CQL specification.
        </div>
        <div>
          Authoring is based on defining elements using a broad type, such as Condition, and applying one or more value
          sets and codes to specify a more specific concept, such as Diabetes. These elements can be further refined
          using expression modifiers to indicate a specific status, a most recent value, a comparison against a specific
          value, and more.
        </div>
        <div>
          For an in-depth tutorial on using the CDS Authoring Tool, watch{' '}
          <a href="https://digital.ahrq.gov/events/national-web-conference-clinical-decision-support-authoring-tool">
            "A National Web Conference on the Clinical Decision Support Authoring Tool"
          </a>
          , recorded in February 2019. While new features have been added since then, the basic approach to authoring
          remains the same. This webinar is an execellent introduction for new users of the CDS Authoring Tool.
        </div>
        <div>
          The CDS Authoring Tool is part of the <a href="https://cds.ahrq.gov/cdsconnect">CDS Connect</a> project,
          sponsored by the Agency for Healthcare Research and Quality (AHRQ), and developed under contract with AHRQ by
          MITRE's CMS Alliance to Modernize Healthcare (CAMH) FFRDC.
        </div>

        <div className={styles.h2Wrapper}>
          <h2 id="Starting">1. Starting with the CDS Authoring Tool</h2>
          <div>
            Before you can build CDS artifacts in the CDS Authoring Tool, you must have two accounts:
            <ol>
              <li>A CDS Authoring Tool account</li>
              <li>A UMLS Terminology Services account</li>
            </ol>
          </div>
          <div className={styles.h3Wrapper}>
            <h3 id="Requesting_CDS_AT_Account">1.1 Requesting a CDS Authoring Tool Account</h3>
            <div>
              You must request a CDS Authoring Tool account in order to log in to the CDS Authoring Tool. This account
              provides you with your own space within the CDS Authoring Tool to create and manage CDS artifacts.
            </div>
            <div>
              <img alt="" src={screenshotUrl('Sign_Up')} className="img-fluid img-thumbnail rounded mx-auto d-block" />
            </div>
            <div>
              To request a CDS Authoring Tool account:
              <ol>
                <li>
                  Navigate to <a href="https://cds.ahrq.gov/authoring/">https://cds.ahrq.gov/authoring/</a>.
                </li>
                <li>Click on the "SIGN UP" button in the middle of the screen.</li>
                <li>This will launch a new window with a form that must be filled out and submitted.</li>
                <li>
                  After your request is reviewed, you will receive an email with further instructions to set up your
                  account.
                </li>
              </ol>
            </div>
          </div>

          <div className={styles.h3Wrapper}>
            <h3 id="Requesting_UTS_Account">1.2 Requesting a UMLS Terminology Services Account</h3>
            <div>
              UMLS Terminology Services accounts are managed by the National Library of Medicine (NLM). This account is
              used within the CDS Authoring Tool to access services provided by the Value Set Authority Center (VSAC).
              These services enable you to search for value sets, review value set contents, and test CQL that uses
              value sets.
            </div>
            <div>
              <img
                alt=""
                src={screenshotUrl('UMLS_TS_Sign_Up')}
                className="img-fluid img-thumbnail rounded mx-auto d-block"
              />
            </div>
            <div>
              To request a UMLS Terminology Services account:
              <ol>
                <li>
                  Navigate to <Link external href="https://uts.nlm.nih.gov/uts/" text="https://uts.nlm.nih.gov/uts/" />.
                </li>
                <li>Click on the "Sign Up" link in the banner.</li>
                <li>Follow the instructions from NLM to create your account.</li>
              </ol>
            </div>
          </div>

          <div className={styles.h3Wrapper}>
            <h3 id="Accessing_UMLS_API_Key">1.3 Accessing Your UMLS API Key</h3>
            <div>
              To use your UMLS Terminology Services account in the CDS Authoring Tool, you must provide your UMLS API
              key. While previous versions of the CDS Authoring Tool used your UMLS username and password, recent
              changes to UMLS Terminology Services now require an API key instead. To find your UMLS API key, navigate
              to <Link external href="https://uts.nlm.nih.gov/uts/" text="https://uts.nlm.nih.gov/uts/" /> and click the
              "Sign In" button in the banner.
            </div>
            <div>
              <img
                alt=""
                src={screenshotUrl('UMLS_TS_Sign_In')}
                className="img-fluid img-thumbnail rounded mx-auto d-block"
              />
            </div>
            <div>Follow the directions to sign in and then click on the "My Profile" button in the banner.</div>
            <div>
              <img
                alt=""
                src={screenshotUrl('UMLS_TS_My_Profile')}
                className="img-fluid img-thumbnail rounded mx-auto d-block"
              />
            </div>
            <div>
              Your API key is listed in your profile details. If you do not yet have an API key, you will see a
              hyperlink that allows you to generate one.
            </div>
            <div>
              <img
                alt=""
                src={screenshotUrl('UMLS_TS_API_Key')}
                className="img-fluid img-thumbnail rounded mx-auto d-block"
              />
            </div>
            <div>
              Since your API key is a long sequence of random characters, you may want to store it safely in a file on
              your system that you can easily copy and paste from in the future. Otherwise you will need to do the above
              sequence each time you authenticate to VSAC in the CDS Authoring Tool. NOTE: Your API key is personal to
              you and should not be shared with others. If you are using a public or shared computer, do{' '}
              <strong>not</strong> copy your API key to a local file.
            </div>
          </div>

          <div className={styles.h3Wrapper}>
            <h3 id="Logging_In">1.4 Logging In to the CDS Authoring Tool</h3>
            <div>
              Once you have a CDS Authoring Tool account, you can log in to start creating and managing CDS artifacts.
              To log in, navigate to the CDS Authoring Tool home page and click the "Login" button in the Clinical
              Decision Support Authoring Tool banner near the top of the page.
            </div>
            <div>
              <img alt="" src={screenshotUrl('Login')} className="img-fluid img-thumbnail rounded mx-auto d-block" />
            </div>
            <div>
              When you click "Login", a new dialog will be displayed with a simple login form. Type your registered
              username and password into the form and then hit the return key or click the "Login" button.
            </div>
            <div>
              <img
                alt=""
                src={screenshotUrl('Login_Details')}
                className="img-fluid img-thumbnail rounded mx-auto d-block"
              />
            </div>
            <div>
              If you encounter any issues logging in, click the "Contact Us" link on the CDS Authoring Tool home page to
              request support.
            </div>
          </div>
        </div>

        <div className={styles.h2Wrapper}>
          <h2 id="Creating_and_Managing_Artifacts">2. Creating and Managing Artifacts</h2>
          <div>
            You can create and manage CDS Artifacts by clicking the "Artifacts" link in the Clinical Decision Support
            Authoring banner near the top of the page. This will bring you to the "Artifacts" view that contains a list
            of all your CDS artifacts.
          </div>
          <div>
            <img
              alt=""
              src={screenshotUrl('Artifacts_View')}
              className="img-fluid img-thumbnail rounded mx-auto d-block"
            />
          </div>
          <div>
            Your list of artifacts can only be seen by you. No other users have access to your artifacts or any of the
            content within them. You can only share artifacts by downloading the CQL and distributing it yourself. If
            you have an artifact that may be useful to others, we encourage you to consider posting it on the{' '}
            <a href="https://cds.ahrq.gov/cdsconnect">CDS Connect Repository</a>.
          </div>
          <div className={styles.h3Wrapper}>
            <h3 id="Creating_Artifacts">2.1 Creating New Artifacts</h3>
            <div>
              To create a new artifact, click the "Create New Artifact" button in the "Artifacts" view. This will reveal
              a form, allowing you to enter an artifact name and version. There are no specific rules about artifact
              names or versions, but{' '}
              <Link
                external
                href="http://hl7.org/fhir/uv/cpg/2019Sep/documentation-libraries.html"
                text={
                  <>
                    FHIR<sup>®</sup> Clinical Guidelines
                  </>
                }
              />{' '}
              suggests using the{' '}
              <Link external href="https://apr.apache.org/versioning.html" text="Apache APR Versioning Scheme" />.
            </div>
            <div>
              <img
                alt=""
                src={screenshotUrl('Create_Artifact')}
                className="img-fluid img-thumbnail rounded mx-auto d-block"
              />
            </div>
            <div>
              Once you've entered an artifact name and version, click the "Save" button. Your new artifact will appear
              at the top of the artifact list.
            </div>
            <h4 id="CPG_Form">2.1.1 FHIR Clinical Guidelines (a.k.a. CPG on FHIR) Metadata</h4>
            <div>
              The Authoring Tool supports metadata conforming to the{' '}
              <Link
                external
                href="http://build.fhir.org/ig/HL7/cqf-recommendations/StructureDefinition-cpg-publishablelibrary.html"
                text={'FHIR Clinical Guidelines Publishable Library'}
              />{' '}
              specification. By clicking the "Show CPG Fields" button, form data may be entered.
            </div>
            <div>
              <img
                alt=""
                src={screenshotUrl('CPG_Form_Fields')}
                className="img-fluid img-thumbnail rounded mx-auto d-block"
              />
            </div>
            <div>
              A progress bar at the top of the form shows a score relative to the completion percentage of entered CPG
              metadata.
            </div>
          </div>

          <div className={styles.h3Wrapper}>
            <h3 id="Managing_Artifacts">2.2 Managing Existing Artifacts</h3>
            <div>
              The "Artifacts" view contains a list of existing artifacts, showing the following information and controls
              for each artifact:
              <ul>
                <li>Name</li>
                <li>Version</li>
                <li>When it was last updated</li>
                <li>When it was created</li>
                <li>"Edit Info" button</li>
                <li>"Duplicate" button</li>
                <li>"Delete" button</li>
              </ul>
            </div>
            <div>
              <img
                alt=""
                src={screenshotUrl('Artifact_List')}
                className="img-fluid img-thumbnail rounded mx-auto d-block"
              />
            </div>
            <div>
              To edit an artifact's logic, click the artifact's hyperlinked name. This will bring you to the artifact's
              "Workspace" view.
            </div>
            <div>
              To edit an artifact's name or version, click its "Edit Info" button{' '}
              <EditIcon color="primary" fontSize="small" aria-hidden="true" />. This will open a modal dialog with a
              form for editing the name and version.
            </div>
            <div>
              To duplicate an artifact, click its "Duplicate" button{' '}
              <CopyIcon color="primary" fontSize="small" aria-hidden="true" />. This will create a completely new copy
              of your artifact in the artifact table.
            </div>
            <div>
              To delete an artifact, click its "Delete" button{' '}
              <DeleteIcon color="secondary" fontSize="small" aria-hidden="true" />. This will open a modal dialog asking
              you to confirm that you would like to delete the artifact. After clicking the "Delete" button to confirm,
              the artifact will be permanently deleted. This cannot be undone.
            </div>
            <div>
              To sort the table by any of the columns simply click the column name. To reverse the order of the sort,
              click the column name again and the arrow indicating ascending / descending sort will change directions.
            </div>
          </div>
        </div>

        <div className={styles.h2Wrapper}>
          <h2 id="Building_Artifacts">3. Building Artifacts</h2>
          <div>
            The first step in building an artifact is to create a blank artifact. If you have not yet done this, see the
            previous section, <a href="#Managing_Artifacts">Creating and Managing Artifacts</a>. Once you've created an
            artifact, click on its hyperlinked name to go to its "Workspace" view.
          </div>
          <div>The workspace view contains a number of components that are used when building an artifact.</div>
          <div>
            <img
              alt=""
              src={screenshotUrl('Workspace_View')}
              className="img-fluid img-thumbnail rounded mx-auto d-block"
            />
          </div>
          <div>
            <div>The following components can be found in the "Workspace" header:</div>
            <ul>
              <li>
                <strong>Artifact Name</strong>: The artifact name. Click the pencil to the left of the artifact name to
                edit it.
              </li>
              <li>
                <strong>Download CQL Button</strong>: Allows the author to download the artifact as both FHIR-based CQL
                and as a Clinical Practice Guidelines (a.k.a. CPG on FHIR) Publishable Library. When you click this
                button, you can choose which version of FHIR to use in the exported CQL (DSTU2, STU3, or R4). NOTE: FHIR
                version may be restricted depending on the FHIR version of any External CQL that has been imported.
              </li>
              <li>
                <strong>Save Button</strong>: Allows the author to explicitly save their progress. NOTE: Progress will
                also be automatically saved at certain points during the editing workflow.
              </li>
              <li>
                <strong>Workspace Tabs</strong>: A set of tabs for organizing the different aspects of the CDS Logic:
                Inclusions, Exclusions, Subpopulations, Base Elements, Recommendations, Parameters, Handle Errors, and
                External CQL.
              </li>
            </ul>
          </div>

          <div className={styles.h3Wrapper}>
            <h3 id="Element_Picker">3.1 Creating and Editing Elements</h3>
            <div>
              The CDS Authoring Tool allows authors to create CDS by building and combining "elements" in specific
              contexts. Elements describe the criteria that is used to determine if a given patient qualifies for a CDS
              recommendation ("Inclusions"), should be disqualified from a recommendation ("Exclusions"), or should
              receive a more specific recommendation ("Subpopulations").
            </div>
            <div>
              <img
                alt=""
                src={screenshotUrl('Element_Picker')}
                className="img-fluid img-thumbnail rounded mx-auto d-block"
              />
            </div>
            <div>
              The general approach for creating elements is the same across all contexts:
              <ol>
                <li>
                  <strong>Select an element type</strong>, usually corresponding to a FHIR resource type (e.g.,
                  Condition or Observation).
                </li>
                <li>
                  Depending on the type that was selected,
                  <ul>
                    <li>
                      <strong>Associate the element</strong> with at least one value set or code to give it more
                      specific meaning (e.g., "Diabetes" or "LDL Cholesterol Test"), and/or...
                    </li>
                    <li>
                      <strong>Provide additional information</strong> as prompted by specific forms.
                    </li>
                  </ul>
                </li>
                <li>
                  <strong>Modify the results</strong> using "expression modifiers" to further filter the results (e.g.,
                  "Verified"), get a specific property of the result (e.g., "Quantity Value"), or test the result (e.g.,
                  "&gt; 130 mg/dL").
                </li>
              </ol>
            </div>

            <div className={styles.h4Wrapper}>
              <h4 id="Select_Element_Type">3.1.1 Select an Element Type</h4>
              <div>
                The first step to create an element is to select the element's type. The element type will determine
                what kind of data the element retrieves from the patient record. To select an element type, click in the
                dropdown box next to the "Add element" label.
              </div>
              <div>
                <img
                  alt=""
                  src={screenshotUrl('Select_Element_Type')}
                  className="img-fluid img-thumbnail rounded mx-auto d-block"
                />
              </div>
              <div>
                Depending on your artifact you many see any or all of these choices:
                <ul>
                  <li>
                    <strong>Allergy Intolerance</strong>: Instances of the FHIR AllergyIntolerance resource type
                  </li>
                  <li>
                    <strong>Base Elements</strong>: Re-usable elements defined in the "Base Elements" tab
                  </li>
                  <li>
                    <strong>Condition</strong>: Instances of the FHIR Condition resource type
                  </li>
                  <li>
                    <strong>Demographics</strong>: Age or Gender as specified in an instance of the FHIR Patient
                    resource type
                  </li>
                  <li>
                    <strong>Device</strong>: Instances of the FHIR Device resource type
                  </li>
                  <li>
                    <strong>Encounter</strong>: Instances of the FHIR Encounter resource type
                  </li>
                  <li>
                    <strong>External CQL</strong>: Named CQL definitions, parameters, and functions from CQL files
                    uploaded in the "External CQL" tab
                  </li>
                  <li>
                    <strong>Immunization</strong>: Instances of the FHIR Immunization resource type
                  </li>
                  <li>
                    <strong>Medication Statement</strong>: Instances of the FHIR MedicationStatement resource type
                  </li>
                  <li>
                    <strong>Medication Request</strong>: Instances of the FHIR MedicationRequest(STU3/R4) or
                    MedicationOrder(DSTU2) resource type
                  </li>
                  <li>
                    <strong>Observation</strong>: Instances of the Observation resource type
                  </li>
                  <li>
                    <strong>Parameters</strong>: Parameter values for parameters defined in the "Parameters" tab
                  </li>
                  <li>
                    <strong>Procedure</strong>: Instances of the FHIR Procedure resource type
                  </li>
                </ul>
                Click on the choice corresponding to the type of data this element should be based on.
              </div>
            </div>

            <div className={styles.h4Wrapper}>
              <h4 id="Associate_Element">3.1.2 Associate the Element</h4>
              <div>
                After choosing a type, you may need to associate it with a Value Set or Code. If you see a button
                labeled "Authenticate VSAC", "Add Value Set", or "Add Code", then you have selected an element type
                which requires you to narrow it down further via terminology. These types also show a small key icon
                next to the name to indicate you will need to authenticate with the National Library of Medicine's
                Values Set Authority Center (VSAC).
              </div>
              <div>
                <img
                  alt=""
                  src={screenshotUrl('Authenticate_VSAC')}
                  className="img-fluid img-thumbnail rounded mx-auto d-block"
                />
              </div>
              <div>
                If you see an "Authenticate VSAC" button, you must click it and then enter in your UMLS Terminology
                Services API key. If you do not have a UMLS Terminology Services account, see{' '}
                <a href="#Requesting_UTS_Account">Requesting a UMLS Terminology Services Account</a>. If you do not know
                your UMLS API key, see <a href="#Accessing_UMLS_API_Key">Accessing Your UMLS API Key</a>.
              </div>
              <div>
                <img
                  alt=""
                  src={screenshotUrl('Authenticate_VSAC_Details')}
                  className="img-fluid img-thumbnail rounded mx-auto d-block"
                />
              </div>
              <div>
                After you authenticate, you will see two new buttons appear in your element box: "Add Value Set" and
                "Add Code".
              </div>
              <div>
                <img
                  alt=""
                  src={screenshotUrl('Authenticate_VSAC_Success')}
                  className="img-fluid img-thumbnail rounded mx-auto d-block"
                />
              </div>
            </div>

            <div className={styles.h4Wrapper}>
              <h4 id="Add_Value_Set">3.1.3 Add Value Set</h4>
              <div>
                In the CDS Authoring Tool, authors use value sets to indicate a grouping of codes that should be used to
                find matching items in a patient's health record. For example, a "Diabetes" value set might contain many
                different codes that all indicate some diagnosis of Diabetes. These codes may differ in specificity or
                sub-types (e.g., Type 1 Diabetes, Type 2 Diabetes) or may be from different code systems (e.g., ICD-9,
                ICD-10, SNOMED-CT). If an author associates a value set with an element, then patient data need only
                match one of the codes in the value set to be considered a match for the element.
              </div>
              <div>
                To associate a value set with an element, click on the "Add Value Set" button. If you do not see an "Add
                Value Set" button, first authenticate with the VSAC as described in the section above. After clicking
                the "Add Value Set" button, a modal dialog will appear allowing you to search for a value set by
                keyword. Enter a keyword representing the value set you want to find and click the "Search" button.
              </div>
              <div>
                <img
                  alt=""
                  src={screenshotUrl('VSAC_Search_LDL')}
                  className="img-fluid img-thumbnail rounded mx-auto d-block"
                />
              </div>
              <div>
                After clicking "Search", a set of results will be displayed. Each item in the results represents a value
                set in the VSAC, including its name, Object Identifier (OID), Steward, and the number of codes in the
                value set. Click on the value set you'd like to add, or to see the contents of a specific value set,
                click its eye icon <VisibilityIcon fontSize="small" />  under codes.
              </div>
              <div>
                <img
                  alt=""
                  src={screenshotUrl('VSAC_Search_LDL_Results')}
                  className="img-fluid img-thumbnail rounded mx-auto d-block"
                />
              </div>
              <div>
                After clicking on a specific value set's eye icon <VisibilityIcon fontSize="small" />, 
                its full set of codes will be displayed. Each item in the list shows a contained code, its name, and its system.
                This allows authors to confirm that the value set contents match their intent.
                If this value set is not a good match or you want to inspect other value sets in the results,
                click the left arrow button near the top of the dialog. Otherwise, click the specific value set or
                "Select" button while viewing the contained codes to confirm the selection of the displayed value set.
              </div>
              <div>
                <img
                  alt=""
                  src={screenshotUrl('VSAC_LDL_Codes')}
                  className="img-fluid img-thumbnail rounded mx-auto d-block"
                />
              </div>
              <div>
                NOTE: The VSAC recently introduced a new approach toward authoring value sets that allows value sets to
                be defined using code filters. These value sets are called intensional value sets, and while the VSAC
                supports authoring them, it does not yet support retrieving their contents over the FHIR interface that
                the CDS Authoring Tool uses. If you select an intensional value set, an error will be displayed
                indicating that the codes cannot be retrieved. You can, however, still select the value set if you are
                confident it is the one you need.
              </div>
              <div>
                Upon selection of the value set, the element will be updated with the value set association and a name
                (which defaults to the value set name). Feel free to modify the name to more closely match the final
                intent of the element. At this point, you can associate additional value sets or codes. These value sets
                and codes will be treated as a unioned set, meaning that an item in a patient's health record need only
                match one of any of them in order to be matched on the element as a whole.
              </div>
              <div>
                <img
                  alt=""
                  src={screenshotUrl('LDL_C_Element')}
                  className="img-fluid img-thumbnail rounded mx-auto d-block"
                />
              </div>
              <div>
                Associated value sets will be reflected in the expression phrase as well as listed in the element's
                metadata. You can review a value set's contents by clicking on the eye icon{' '}
                <FontAwesomeIcon icon={faEye} aria-hidden="true" /> to the right of the listed value set. You can delete
                the value set association by clicking the "X" icon to the far right of the listed value set.
              </div>
              <div>
                Depending on the context of the element, you may also see a warning message indicating that the element
                does not have the correct return type. For example, if this is an element in the Inclusions or
                Exclusions criteria, it must have a return type "boolean" (e.g., a true or false answer). This is
                because every element in the criteria is combined using "and" or "or" clauses to arrive at an aggregate
                answer: true (the patient meets the criteria) or false (the patient does not meet the criteria). To
                satisfy the requirement for a specific return type, you must{' '}
                <a href="#Modify_Results">modify the results</a> until the required return type is achieved.
              </div>
            </div>

            <div className={styles.h4Wrapper}>
              <h4 id="Add_Code">3.1.4 Add Code</h4>
              <div>
                In cases where only a certain code should be used to match patient data for an element, authors can
                associate a single code with an element without using a value set. This feature can also be used to
                support matching on a code that is valid but is not a part of a value set that is also associated to the
                element.
              </div>
              <div>
                To associate a specific code with an element, click on the "Add Code" button. If you do not see an "Add
                Code" button, first authenticate with the VSAC as described above. After clicking the "Add Code" button,
                a modal dialog will appear allowing you to enter a code and select the system from which it came.
                Currently, the CDS Authoring Tool supports the following systems, which are also supported by the VSAC:
                SNOMED, ICD-9, ICD-10, NCI, LOINC, and RXNORM. To choose a different code system, select "Other" in the
                code system dropdown menu and provide the FHIR-compatible identifying URL for the code system. Once
                you've entered the code and selected the appropriate system, click the "Validate" button.
              </div>
              <div>
                <img
                  alt=""
                  src={screenshotUrl('VSAC_Enter_Code')}
                  className="img-fluid img-thumbnail rounded mx-auto d-block"
                />
              </div>
              <div>
                After clicking "Validate", the CDS Authoring Tool will send the code to the VSAC for validation. If the
                code is from a supported code system and verified by VSAC, the CDS Authoring Tool will display the code,
                its system, and its display text. You can confirm the selection by clicking on the "Select" button at
                the bottom of the dialog.
              </div>
              <div>
                <img
                  alt=""
                  src={screenshotUrl('VSAC_Code_Validation_Success')}
                  className="img-fluid img-thumbnail rounded mx-auto d-block"
                />
              </div>
              <div>
                If the code fails validation, this means the code is invalid or the code system is not supported. In
                either case, an error will be shown at the bottom of the dialog. You can choose to modify the code and
                try again, cancel the code selection process, or select the code despite the validation error. To cancel
                the code selection, click the "Cancel" button at the bottom of the dialog. To select the code anyway,
                click the "Select" button at the bottom of the dialog.
              </div>
              <div>
                <img
                  alt=""
                  src={screenshotUrl('VSAC_Code_Validation_Error')}
                  className="img-fluid img-thumbnail rounded mx-auto d-block"
                />
              </div>
              <div>
                Upon selection of the code, the element will be updated with the code association and a name. Feel free
                to modify the name to more closely match the final intent of the element. At this point, you can
                associate additional codes or value sets. These codes and value sets will be treated as a unioned set,
                meaning that an item in a patient's health record need only match one of any of them in order to be
                matched on the element as a whole.
              </div>
              <div>
                <img
                  alt=""
                  src={screenshotUrl('Ten_Year_Risk_Element')}
                  className="img-fluid img-thumbnail rounded mx-auto d-block"
                />
              </div>
              <div>
                Associated codes will be reflected in the expression phrase as well as listed in the element's metadata.
                You can delete the code association by clicking the "X" icon to the far right of the listed value set.
              </div>
              <div>
                Depending on the context of the element, you may also see a warning message indicating that the element
                does not have the correct return type. For more information see the last paragraph in the section above.
              </div>
            </div>

            <div className={styles.h4Wrapper}>
              <h4 id="Name_Element">3.1.5 Name the Element</h4>
              <div>
                All elements provide a user-configurable field for the element name. In some cases, the element name may
                be pre-populated, but you may change the name if desired. It's considered a best practice to reflect the
                intent of the element in its name. For example, if an element checks for an LDL cholesterol test with a
                result over 130 mg/dL, then "LDL-c &gt; 130 mg/dL" is a better name than just "LDL-c Test".
              </div>
              <div>
                <img
                  alt=""
                  src={screenshotUrl('LDL_C_Updated_Name')}
                  className="img-fluid img-thumbnail rounded mx-auto d-block"
                />
              </div>
            </div>

            <div className={styles.h4Wrapper}>
              <h4 id="Annotate_Element">3.1.6 Annotate the Element</h4>
              <div>
                All elements support comments. The comments field allows authors to provide additional information about
                an element. By default, comments are collapsed in order to preserve space in the user interface. To
                toggle a comment field's visibility, click on the comment icon in the element header.
              </div>
              <div>
                <img
                  alt=""
                  src={screenshotUrl('Ten_Year_Risk_Open_Comments')}
                  className="img-fluid img-thumbnail rounded mx-auto d-block"
                />
              </div>
              <div>
                Comments can be used in many ways. Recommended uses of comments include:
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
              </div>
              <div>
                <img
                  alt=""
                  src={screenshotUrl('Ten_Year_Risk_Comments')}
                  className="img-fluid img-thumbnail rounded mx-auto d-block"
                />
              </div>
              <div>
                When an element's comment field contains information, the comments icon changes to a subtle blue color
                and contains three dots. This allows authors to quickly see which elements have comments, even when the
                comments are collapsed.
              </div>
              <div>
                <img
                  alt=""
                  src={screenshotUrl('Ten_Year_Risk_Closed_Comments')}
                  className="img-fluid img-thumbnail rounded mx-auto d-block"
                />
              </div>
            </div>

            <div className={styles.h4Wrapper}>
              <h4 id="Provide_Additional_Information">3.1.7 Provide Additional Information</h4>
              <div>
                Some element types reqest additional information. Currently, the following two element types require
                additional information:
                <ul>
                  <li>
                    <strong>Demographics {'->'} Age Range</strong> requires at least one of: Minimum Age, Maximum Age;
                    as well as the unit of time (e.g., years).
                  </li>
                  <li>
                    <strong>Demographics {'->'} Gender</strong> requires one of the following values to be selected:
                    Male, Female, Other, Unknown.
                  </li>
                </ul>
              </div>
              <div>
                <img
                  alt=""
                  src={screenshotUrl('Age_Range_Element')}
                  className="img-fluid img-thumbnail rounded mx-auto d-block"
                />
              </div>
            </div>

            <div className={styles.h4Wrapper}>
              <h4 id="Modify_Results">3.1.8 Modify Results</h4>
              <div>
                Once you have the core element defined, including associated value sets and codes (if applicable), its
                return type will be displayed near the bottom of the element. For elements with FHIR-based types (e.g.,
                Condition, Observation, etc.), the return-type will be a list of items matching that type (e.g., List of
                Conditions). In some cases, the default return type is incompatible with the context in which it is used
                and should be modified to meet the requirements of the context. In other cases, the return type may be
                compatible, but the author may want to further filter the results.
              </div>
              <div>
                CDS Authors can use "modifier expressions" to further define or narrow an element's intent. For example,
                if you have a "Condition" element associated with a "Diabetes" value set, its initial return type will
                be: "List of Diabetes". You can then apply the "Confirmed" expression modifier to filter the results to
                only those with a confirmed clinical status, and finally apply the "Exists" expression modifier to check
                that at least one result for this query exists in the patient's record. Since the return type of the
                "Exists" expression modifier is "Boolean", this satisfies the requirement for boolean return types in
                the Inclusions and Exclusions tabs.
              </div>
              <div>
                To apply an expression modifier to an element, click on the "Expressions" button near the bottom of the
                element box. When you do this, a set of buttons will be displayed indicating the possible expression
                modifiers that can be applied to the current element.
              </div>
              <div>
                <img
                  alt=""
                  src={screenshotUrl('Add_Expression')}
                  className="img-fluid img-thumbnail rounded mx-auto d-block"
                />
              </div>
              <div>
                Expression modifiers can be chained onto one another in succession. The return type from the first
                expression modifier that is applied will affect the types of expression modifiers that can be applied as
                the second, and so on. The CDS Authoring Tool performs this filtering for the author automatically,
                always showing only the expression modifiers that are valid in the current context.
              </div>
              <div>
                Expression modifiers and their value (when applicable) are shown as a list in the main body of the
                element box. The element type, its associations, and its expression modifiers are also used to display a
                user-friendly phrase that summarizes the calculated intent of the element. For the example above, the
                generated phrase would be "There exists a confirmed condition with a code from Diabetes." As you modify
                the element, the CDS Authoring Tool will update its expression phrase automatically.
              </div>
              <div>
                <img
                  alt=""
                  src={screenshotUrl('Expression_Phrase')}
                  className="img-fluid img-thumbnail rounded mx-auto d-block"
                />
              </div>
              <div>
                If you need to remove expression modifiers, you must remove them one at a time, starting with the last
                one. To remove an expression modifier, click on the "X" on the far right hand side of the expression
                modifier's row in the element's content. It is currently not possible to directly remove expression
                modifiers in the middle of the expression modifier list because this might change the current return
                type at that point and render the rest of the expression modifier list invalid.
              </div>
              <div>
                <img
                  alt=""
                  src={screenshotUrl('LDL_C_Expressions')}
                  className="img-fluid img-thumbnail rounded mx-auto d-block"
                />
              </div>
              <div>
                To see the full set of expression modifiers applicable to each element and/or return type, click on the
                "Data Types" tab on the <a href="documentation">Documentation</a> page. The "External CQL Tab" section
                of this documentation details the process to add additional expression modifiers to use in an artifact
                in the CDS Authoring Tool.
              </div>
            </div>
          </div>

          <div className={styles.h3Wrapper}>
            <h3 id="Deleting_Elements">3.2 Deleting Elements</h3>
            <div>
              The CDS Authoring Tool allows authors to delete elements they no longer need or use. To delete an element,
              click the "X" button in the top-right corner of the element's box. Currently, the CDS Authoring Tool does
              not require authors to confirm deletion; the element is deleted immediately. This action cannot be undone.
            </div>
            <div>
              <img
                alt=""
                src={screenshotUrl('Delete_Element')}
                className="img-fluid img-thumbnail rounded mx-auto d-block"
              />
            </div>
            <div>
              In some cases, the CDS Authoring Tool will not allow you to delete an element. If the CDS Authoring Tool
              prevents you from deleting an element, this means that it is referenced and used elsewhere. To delete the
              element, you must first delete (or modify) all usages of that element.
            </div>
          </div>

          <div className={styles.h3Wrapper}>
            <h3 id="Collapsing_Elements">3.3 Collapsing Elements</h3>
            <div>
              Because elements can contain a lot of detail, they may take up a large amount of space on the screen. In
              order to allow for a more streamlined view of the artifact's logic, the CDS Authoring Tool allows authors
              to collapse elements. When an element is collapsed, only its name and expression phrase are displayed.
            </div>
            <div>
              <img
                alt=""
                src={screenshotUrl('Collapsed_Element')}
                className="img-fluid img-thumbnail rounded mx-auto d-block"
              />
            </div>
            <div>
              To collapse an element, click the double-down arrow{' '}
              <FontAwesomeIcon icon={faAngleDoubleDown} aria-hidden="true" /> between the indent button and the delete
              button in the element's box. To re-expand an element, click the double-right arrow{' '}
              <FontAwesomeIcon icon={faAngleDoubleRight} aria-hidden="true" /> between the indent button and the delete
              button in the element's box.
            </div>
          </div>

          <div className={styles.h3Wrapper}>
            <h3 id="Combining_Elements">3.4 Combining Elements</h3>
            <div>
              While elements can be useful on their own, usually they are combined with other elements in order to
              represent more complex ideas or requirements. The CDS Authoring Tool supports the following ways of
              combining elements:
              <ul>
                <li>
                  <strong>And</strong>: Require every element in a set of boolean elements to be true
                </li>
                <li>
                  <strong>Or</strong>: Require at least one element in a set of boolean elements to be true
                </li>
                <li>
                  <strong>Indented Group</strong>: Group a set of elements together to represent a single logical unit
                </li>
                <li>
                  <strong>Intersect</strong>: Find the set of items that occur in each element of a set of elements
                </li>
                <li>
                  <strong>Union</strong>: Combine items from multiple elements into a single set of items
                </li>
              </ul>
            </div>

            <div className={styles.h4Wrapper}>
              <h4 id="And">3.3.1 And</h4>
              <div>
                Combining elements using "And" indicates that each of the elements should evaluate to a "true" result in
                order for the logic to be satisfied. For example, you might combine an Age Range element and a Gender
                element using "And" to indicate that a patient must be 40 - 75 years old AND male. Elements must have a
                boolean return type in order to be combined using "And".
              </div>
              <div>
                <img
                  alt=""
                  src={screenshotUrl('Inclusions_And')}
                  className="img-fluid img-thumbnail rounded mx-auto d-block"
                />
              </div>
              <div>
                The Inclusions, Exclusions, and Subpopulations tabs all require elements to be combined using And, Or,
                or indented groups. In these tabs, you can combine elements using "And" by clicking the dropdown between
                elements and selecting "And". The CDS Authoring Tool requires that all sibling elements (e.g., elements
                indented at the same level) use the same combination logic, so when you select "And" between two
                elements, it will also be selected for all other elements at the same indent level.
              </div>
              <div>
                <img
                  alt=""
                  src={screenshotUrl('List_Operations_And')}
                  className="img-fluid img-thumbnail rounded mx-auto d-block"
                />
              </div>
              <div>
                In the Base Elements tab, elements can be combined using the "List Operations" element type. Do this by
                choosing "List Operations" in the element type dropdown and then selecting "And" in the second dropdown.
                This will create a group that you can give a unique name and begin adding elements to.
              </div>
            </div>

            <div className={styles.h4Wrapper}>
              <h4 id="Or">3.3.2 Or</h4>
              <div>
                Combining elements using "Or" indicates that at least one of the elements should evaluate to a "true"
                result in order for the logic to be satisfied. For example, you might combine an LDL-c element and a
                Diabetes element to indicate that a patient should have an LDL cholesterol reading above a certain
                threshold or a diagnosis of diabetes. Elements must have a boolean return type in order to be combined
                using "Or".
              </div>
              <div>
                <img
                  alt=""
                  src={screenshotUrl('Inclusions_Or')}
                  className="img-fluid img-thumbnail rounded mx-auto d-block"
                />
              </div>
              <div>
                The Inclusions, Exclusions, and Subpopulations tabs all require elements to be combined using And, Or,
                or indented groups. In these tabs, you can combine elements using "Or" by clicking the dropdown between
                elements and selecting "Or". The CDS Authoring Tool requires that all sibling elements (e.g., elements
                indented at the same level) use the same combination logic, so when you select "Or" between two
                elements, it will also be selected for all other elements at the same indent level.
              </div>
              <div>
                <img
                  alt=""
                  src={screenshotUrl('List_Operations_Or')}
                  className="img-fluid img-thumbnail rounded mx-auto d-block"
                />
              </div>
              <div>
                In the Base Elements tab, elements can be combined using the "List Operations" element type. Do this by
                choosing "List Operations" in the element type dropdown and then selecting "Or" in the second dropdown.
                This will create a group that you can give a unique name and begin adding elements to.
              </div>
            </div>

            <div className={styles.h4Wrapper}>
              <h4 id="Indented_Group">3.3.3 Indented Group</h4>
              <div>
                Sometimes authors need to create complex logic that requires the use of "And" and "Or" at the same time.
                This is accomplished by creating and combining sub-groups of elements. For example, you might want to
                indicate that a patient must be 40 - 75 years old and have either an LDL cholesterol reading above a
                certain threshold or a diagnosis of diabetes. To do this, you would create the first two elements as
                described in the <a href="#And">And</a> section above, but then you would convert the second element to
                an indented group and add the third element to that indented group, combining it using{' '}
                <a href="#Or">Or</a>.
              </div>
              <div>
                <img
                  alt=""
                  src={screenshotUrl('Indent_Element')}
                  className="img-fluid img-thumbnail rounded mx-auto d-block"
                />
              </div>
              <div>
                To create a new indented group, create the first element that should go in the indented group as normal.
                Then click on the "indent" button <FontAwesomeIcon icon={faIndent} aria-hidden="true" /> to the right of
                the element name to automatically create a new indented group and place the element in it. This new
                group can (and should) be given a unique name. To add more elements in the group, use the new "Add
                element" box that is displayed at the bottom of the indent group.
              </div>
              <div>
                <img
                  alt=""
                  src={screenshotUrl('Indented_Group')}
                  className="img-fluid img-thumbnail rounded mx-auto d-block"
                />
              </div>
              <div>
                Groups can be indented multiple levels deep. In addition, groups can be outdented to return their
                elements back to the outer indent level. Use the "outdent" button{' '}
                <FontAwesomeIcon icon={faOutdent} aria-hidden="true" /> to outdent groups.
              </div>
            </div>

            <div className={styles.h4Wrapper}>
              <h4 id="Intersect">3.3.4 Intersect</h4>
              <div>
                Combining elements using "Intersect" indicates that each of the elements should be inspected and only
                those items that match every element should be included in the intersection results. For example, if you
                combine an element representing confirmed myocardial infarctions with an element representing myocardial
                infarctions in the last six months, using "intersect", the result will be only myocardial infarctions
                that are in both element sets (i.e., confirmed and within the last six months).
              </div>
              <div>
                <img
                  alt=""
                  src={screenshotUrl('List_Operations_Intersect')}
                  className="img-fluid img-thumbnail rounded mx-auto d-block"
                />
              </div>
              <div>
                The "Intersect" combination can only be applied in the Base Elements tab using the "List Operations"
                element type. Do this by choosing "List Operations" in the element type dropdown and then selecting
                "Intersect" in the second dropdown. This will create a group that you can give a unique name and begin
                adding elements to. All of the elements in the group will be intersected together. Since intersection
                requires elements to have returned items in common, the elements in an intersected group should all have
                the same result type, otherwise it is impossible for any item to match against all of the elements.
              </div>
            </div>

            <div className={styles.h4Wrapper}>
              <h4 id="Union">3.3.5 Union</h4>
              <div>
                Combining elements using "Union" indicates that all of the items across all of the elements should be
                combined together into a single set of items. For example, combining an LDL-c element with an HDL-c
                element using "Union" will result in all of LDL-c and HDL-c observations.
              </div>
              <div>
                <img
                  alt=""
                  src={screenshotUrl('List_Operations_Union')}
                  className="img-fluid img-thumbnail rounded mx-auto d-block"
                />
              </div>
              <div>
                The "Union" combination can only be applied in the Base Elements tab using the "List Operations" element
                type. Do this by choosing "List Operations" in the element type dropdown and then selecting "Union" in
                the second dropdown. This will create a group that you can give a unique name and begin adding elements
                to. All of the elements in the group will be unioned together. If elements in the union have different
                return types, the return type of the overall union will be "Any".
              </div>
            </div>
          </div>

          <div className={styles.h3Wrapper}>
            <h3 id="Inclusions">3.5 Inclusions Tab</h3>
            <div>
              Authors use the Inclusions tab to specify the criteria that patients should meet in order to receive a
              recommendation from the artifact. If a patient meets the criteria in the Inclusions tab and does not meet
              any criteria in the Exclusions tab, then they are considered to be part of the general population for
              which this artifact's recommendations apply.
            </div>
            <div>
              <img
                alt=""
                src={screenshotUrl('Inclusions')}
                className="img-fluid img-thumbnail rounded mx-auto d-block"
              />
            </div>
            <div>
              Authors specify the Inclusions criteria by creating and combining elements as described in the sections
              above. Typically, Inclusions criteria will use "And" combinations so that all of the criteria must be met
              in order to receive a recommendation.
            </div>
          </div>

          <div className={styles.h3Wrapper}>
            <h3 id="Exclusions">3.6 Exclusions Tab</h3>
            <div>
              Authors use the Exclusions tab to specify criteria that should disqualify patients from receiving a
              recommendation from the artifact. Even if a patient meets the criteria in the Inclusions tab, the criteria
              in the Exclusions tab can prevent them from being in the general population for which this artifact's
              recommendations apply. For example, some recommendations should not be provided when a patient is
              pregnant, even if they are otherwise indicated.
            </div>
            <div>
              <img
                alt=""
                src={screenshotUrl('Exclusions')}
                className="img-fluid img-thumbnail rounded mx-auto d-block"
              />
            </div>
            <div>
              Authors specify the Exclusions criteria by creating and combining elements as described in the sections
              above. Typically, Exclusions criteria will use "Or" combinations so that any of the criteria can
              disqualify the patient from the recommendation.
            </div>
          </div>

          <div className={styles.h3Wrapper}>
            <h3 id="Subpopulations">3.7 Subpopulations Tab</h3>
            <div>
              Authors use the Subpopulations tab to specify criteria that groups patients into subpopulation that can be
              associated with more specific recommendations. While subpopulations are not required, they can be useful
              for artifacts that need to deliver more nuanced recommendations or recommendations that are
              population-specific. For example, a statin artifact might deliver a different strength recommendation for
              a patient with a 10-year risk score of 8% versus a patient with a 10-year risk score of 12%.
            </div>
            <div>
              <img
                alt=""
                src={screenshotUrl('Subpopulations')}
                className="img-fluid img-thumbnail rounded mx-auto d-block"
              />
            </div>
            <div>
              The Subpopulations tab allows authors to create as many subpopulations as needed. For each subpopulation,
              the author must specify a unique name, then create and combine elements as described in the sections
              above. To create a new subpopulation, click the "New subpopulation" button in the Subpopulations tab.
            </div>
          </div>

          <div className={styles.h3Wrapper}>
            <h3 id="Base_Elements">3.8 Base Elements Tab</h3>
            <div>
              Authors use Base Elements to create elements that can be re-used across several elements and contexts
              within the artifact. This allows for common elements to be defined once and used, as well as further
              modified, where ever they may be needed. This also allows authors to define standalone elements outside of
              any specific context and have these elements exported as-is in the CQL.
            </div>
            <div>
              <img
                alt=""
                src={screenshotUrl('Base_Elements')}
                className="img-fluid img-thumbnail rounded mx-auto d-block"
              />
            </div>
            <div className={styles.h4Wrapper}>
              <h4 id="Creating_Base_Elements">3.8.1 Creating Base Elements</h4>
              <div>
                Authors specify Base Elements by creating and (optionally) combining elements as described in the
                sections above. Since these elements are not in the context of specific logical constructs, they are not
                required to have any specific return type.
              </div>
              <div>
                <img
                  alt=""
                  src={screenshotUrl('Ten_Year_Risk_Value')}
                  className="img-fluid img-thumbnail rounded mx-auto d-block"
                />
              </div>
            </div>
            <div className={styles.h4Wrapper}>
              <h4 id="Using_Base_Elements">3.8.2 Using Base Elements</h4>
              <div>
                Authors can reference and use Base Elements in the Inclusions tab, Exclusions tab, and Subpopulations
                tab. To use a base element, it must be created in the Base Elements tab first. After that, use it in any
                valid location by selecting the "Base Elements" type in the element type dropdown. A second dropdown
                will appear allowing you to choose the Base Element you want.
              </div>
              <div>
                <img
                  alt=""
                  src={screenshotUrl('Select_Base_Element')}
                  className="img-fluid img-thumbnail rounded mx-auto d-block"
                />
              </div>
              <div>
                An element that is based on a base element is shaded light blue to make it more easily distinguishable.
                In addition, it lists the original base element's name in the content of its element definition using
                the "Base Element" label. If you click the link icon{' '}
                <FontAwesomeIcon icon={faLink} className="delete-valueset-button" aria-hidden="true" /> to the far right
                of the base element's name, you will go directly to the base element definition.
              </div>
              <div>
                <img
                  alt=""
                  src={screenshotUrl('Base_Element_Use')}
                  className="img-fluid img-thumbnail rounded mx-auto d-block"
                />
              </div>
              <div>
                If the base element does not have the return type required by its context (for example, if it is used in
                the Inclusions tab but does not have a boolean return type), you can add expression modifiers to it in
                much the same way as you would any element. In this case, the expression modifiers added to the use of
                the base element will not affect the original definition of the base element in the Base Elements tab.
                This allows base elements to used in a broad set of contexts in differing ways.
              </div>
              <div>
                When a Base Element has been used, the definition of the element in the Base Elements tab will show
                where it is being used. This is indicated by rows labeled "Element Use" in the content of the element
                definition. If you click the link icon{' '}
                <FontAwesomeIcon icon={faLink} className="delete-valueset-button" aria-hidden="true" /> to the far right
                of the use's elementname, you will go directly to the element's definition.
              </div>
              <div>
                <img
                  alt=""
                  src={screenshotUrl('Base_Element_Linkbacks')}
                  className="img-fluid img-thumbnail rounded mx-auto d-block"
                />
              </div>
              <div>
                Note that when a base element is used, certain restrictions are put into place. One restriction is that
                you cannot delete it. To delete a base element that is being used, you must first delete (or edit) all
                of its uses.
              </div>
              <div>
                Another restriction is that applied expressions cannot be removed if doing so would change the Base
                Element's return type. This ensures that modifying a base element does not make its uses become invalid.
                In order to remove the expression, first delete all uses of the Base Element in the artifact.
              </div>
              <div>
                In addition, expression modifiers cannot be added to base elements that are being used, unless the
                expression modifier does not change the overall return type of the element. If the expression modifier
                would change the return type of the base element, then you must first remove all uses of the Base
                Element in the artifact before you can add the expression modifier.
              </div>
            </div>
          </div>

          <div className={styles.h3Wrapper}>
            <h3 id="Recommendations">3.9 Recommendations Tab</h3>
            <div>
              Recommendations are the resulting notices that should be delivered to the clinician after the CDS Artifact
              is executed. Recommendations are written as free text and can have an accompanying Rationale. For the
              simplest cases, authors specify a single recommendation which will be delivered for any patient who meets
              the Inclusions criteria but does not meet any Exclusions criteria. For more advanced cases, authors can
              specify recommendations tailored to specific subpopulations.
            </div>
            <div>
              <img
                alt=""
                src={screenshotUrl('Recommendations')}
                className="img-fluid img-thumbnail rounded mx-auto d-block"
              />
            </div>

            <div className={styles.h4Wrapper}>
              <h4 id="Creating_Recommendations">3.9.1 Creating Recommendations</h4>
              <div>
                A blank recommendation is included in the Recommendations tab by default. To create additional
                recommendations, click the "New recommendation" button. This will add a blank recommendation below the
                last recommendation. Note that recommendations are processed in the order they appear, and patients will
                receive the first recommendation for which they are eligible.
              </div>
              <div>
                <img
                  alt=""
                  src={screenshotUrl('Create_Recommendation')}
                  className="img-fluid img-thumbnail rounded mx-auto d-block"
                />
              </div>
              <div>
                Sometimes authors may want to include a rationale for the recommendation as a separate data field. To do
                this, click on the "Add rationale" button in any recommendation element. This will display another text
                field which can be used to enter the rationale.
              </div>
            </div>

            <div className={styles.h4Wrapper}>
              <h4 id="Associating_Recommendations">3.9.2 Associating Recommendations with Subpopulations</h4>
              <div>
                For CDS artifacts that may deliver more than one recommendation, authors must associate recommendations
                with the subpopulations to which they apply. The CDS Authoring Tool includes the following
                subpopulations by default:
                <ul>
                  <li>
                    <strong>Doesn't Meet Inclusion Criteria</strong>: Patients who don't meet the inclusion criteria
                    usually will not receive a recommendation, but associating a recommendation with this subpopulation
                    allows you to still deliver a notice for these patients.
                  </li>
                  <li>
                    <strong>Meets Exclusion Criteria</strong>: Patients who meet the exclusion criteria usually will not
                    receive a recommendation, but associating a recommendation with this subpopulation allows you to
                    still deliver a notice for these patients.
                  </li>
                </ul>
                In addition, any subpopulations that you created can also be associated with recommendations. For More
                information on creating subpopulations, see <a href="#Subpopulations">Subpopulations</a> documentation.
              </div>
              <div>
                <img
                  alt=""
                  src={screenshotUrl('Associate_Subpopulation')}
                  className="img-fluid img-thumbnail rounded mx-auto d-block"
                />
              </div>
              <div>
                To associate a recommendation with subpopulations, click the "Add subpopulation" button. This will
                display a section above the recommendation text where you can select a subpopulation or you can create a
                new subpopulation using the "New subpopulation" link. After selecting a subpopulation, you can
                optionally select another subpopulation. The recommendation will only be delivered if the patient meets
                every subpopulation criteria that has been associated with the recommendation.
              </div>
            </div>

            <div className={styles.h4Wrapper}>
              <h4 id="Managing_Recommendations">3.9.3 Re-ordering and Deleting Recommendations</h4>
              <div>
                Since patients will receive the first recommendation that applies to them, the order that
                recommendations are listed will affect how the CDS artifact behaves. In some cases, authors may need to
                re-order their recommendations with this in mind. To re-order recommendations, click the up arrow{' '}
                <FontAwesomeIcon icon={faCaretUp} aria-hidden="true" /> or down arrow{' '}
                <FontAwesomeIcon icon={faCaretDown} aria-hidden="true" /> on any recommendation to move it up or down.
              </div>
              <div>
                <img
                  alt=""
                  src={screenshotUrl('Reorder_Recommendation')}
                  className="img-fluid img-thumbnail rounded mx-auto d-block"
                />
              </div>
              <div>
                Authors may also need to delete recommendations if they were entered by mistake or are no longer
                applicable. To do this, click the "X" button in the recommendation element box. This will prompt you to
                confirm the deletion. Once you have confirmed this, the recommendation will be permanently deleted. This
                action cannot be undone.
              </div>
            </div>
          </div>

          <div className={styles.h3Wrapper}>
            <h3 id="Parameters">3.10 Parameters Tab</h3>
            <div>
              Parameters allow authors to create named elements whose values can be supplied by the CDS execution
              environment at run-time. Authors can specify default values for parameters, but are not required to do so.
              Parameters provide a useful approach for allowing certain aspects of CDS behavior to be tailored for
              specific environments without the need to modify the CDS logic itself. For example, an artifact that is
              capable of delivering grade B and grade C recommendations might specify a parameter called "Allow Grade C"
              with a default value: true. At sites where grade C recommendations are not allowed, the CDS can be run
              with the parameter value set to false in order to supress grade C recommendations. The author, of course,
              needs to properly use the parameter in their logic to implement this behavior. To support this, parameters
              can be referred to in elements throughout the CDS logic (much like base elements).
            </div>
            <div>
              <img
                alt=""
                src={screenshotUrl('Parameters')}
                className="img-fluid img-thumbnail rounded mx-auto d-block"
              />
            </div>

            <div className={styles.h4Wrapper}>
              <h4 id="Creating_Parameters">3.10.1 Creating Parameters</h4>
              <div>
                Authors can define as many parameters as they'd like. To create a parameter, click the "New parameter"
                button. An empty parameter box will be displayed with fields for the parameter name, user-provided
                comments, the parameter type, and an optional default value.
              </div>
              <div>
                <img
                  alt=""
                  src={screenshotUrl('Empty_Parameter')}
                  className="img-fluid img-thumbnail rounded mx-auto d-block"
                />
              </div>
              <div>
                The parameter name should reflect the purpose of the parameter, making it easier for implementers to
                understand what it represents and how it might affect the artifact. The comments box, however, can be
                used to provide additional information about the parameter and its affect on the behavior of the
                artifact.
              </div>
              <div>
                The parameter type provides a dropdown selection of available parameter types: Boolean, Code, Concept,
                Integer, DateTime, Decimal, Quantity, String, Time, Interval&lt;Integer&gt;, Interval&lt;DateTime&gt;,
                Interval&lt;Decimal&gt;, and Interval&lt;Quantity&gt;. Once you've selected a parameter type, the
                default value editor will provide an appropriate interface for editing the type of value you chose.
                Specifying a default value is optional, but if no default value is specified, then implementers must
                specify a value for that parameter at run-time.
              </div>
              <div>
                <img
                  alt=""
                  src={screenshotUrl('Allow_Grade_C_Parameter')}
                  className="img-fluid img-thumbnail rounded mx-auto d-block"
                />
              </div>
            </div>

            <div className={styles.h4Wrapper}>
              <h4 id="Using_Parameters">3.10.2 Using Parameters</h4>
              <div>
                Authors can reference and use Parameters in the Inclusions tab, Exclusions tab, Subpopulations tab, and
                Handle Errors tab. To use a parameter, it must be created in the Parameters tab first. After that, use
                it in any valid location by selecting the "Parameters" type in the element type dropdown. A second
                dropdown will appear allowing you to choose the Parameter you want.
              </div>
              <div>
                <img
                  alt=""
                  src={screenshotUrl('Select_Allow_Grade_C')}
                  className="img-fluid img-thumbnail rounded mx-auto d-block"
                />
              </div>
              <div>
                An element using a parameter indicates the parameter in its expression phrase as well as listing the
                parameter's name in the content of its element definition using the "Parameter" label. If you click the
                link icon <FontAwesomeIcon icon={faLink} className="delete-valueset-button" aria-hidden="true" /> to the
                far right of the parameter's name, you will go directly to the parameter definition.
              </div>
              <div>
                If the parameter does not have the return type required by its context (for example, if it is used in
                the Inclusions tab but does not have a boolean return type), you can add expression modifiers to it in
                much the same way as you would any element.
              </div>
              <div>
                <img
                  alt=""
                  src={screenshotUrl('Allow_Grade_C_Element')}
                  className="img-fluid img-thumbnail rounded mx-auto d-block"
                />
              </div>
              <div>
                Note that when a parameter is used, certain restrictions are put into place: it cannot be deleted nor
                can its parameter type be changed. To delete a parameter or change its type, you must first delete (or
                edit) all of its uses.
              </div>
            </div>

            <div className={styles.h4Wrapper}>
              <h4 id="Deleting_Parameters">3.10.3 Deleting Parameters</h4>
              <div>
                Authors may want to delete parameters if they were entered by mistake or are no longer applicable. To do
                this, click the "X" button in the parameter element box. This will immediately delete the parameter
                without requesting further confirmation. This action cannot be undone. If the "X" button is disabled,
                this means you cannot delete the parameter because it is currently being used by another element. To
                delete it, you must first remove all uses of it from other elements.
              </div>
              <div>
                <img
                  alt=""
                  src={screenshotUrl('Delete_Parameter')}
                  className="img-fluid img-thumbnail rounded mx-auto d-block"
                />
              </div>
            </div>
          </div>

          <div className={styles.h3Wrapper}>
            <h3 id="Handle_Errors">3.11 Handle Errors Tab</h3>
            <div>
              Authors use the "Handle Errors" tab to define what messages should be provided to end users when certain
              error conditions arise. For example, an author might want to return an error message if required data is
              missing from the patient's health record. Handling errors is optional and may not be required or useful
              for certain use cases.
            </div>
            <div>
              <img alt="" src={screenshotUrl('Errors')} className="img-fluid img-thumbnail rounded mx-auto d-block" />
            </div>
            <div>
              NOTE: Although CQL 1.2 introduced the "Messages" function to allow authors to return error messages to the
              operating environment at run-time, the CDS Authoring Tool does not currently use this approach. Instead,
              it creates a CQL statement called "Errors" that will return a list of the errors that are applicable to
              the patient in context. Each error in the list is a simple text string. Although the result is a list, the
              CDS Authoring Tool is currently only capable of returning one error per invocation, so the list length
              will never be more than one.
            </div>

            <div className={styles.h4Wrapper}>
              <h4 id="Error_Conditions">3.11.1 Error Conditions</h4>
              <div>
                Authors specify error handling by chaining together conditional "If" statements, indicating that if a
                certain condition (or set of conditions) is met, then a certain error message should be returned. By
                default, the CDS Authoring Tool provides three initial conditions that can be used when specifying
                errors:
                <ul>
                  <li>
                    <strong>Recommendations is null</strong>: indicates that no recommendation was provided.
                  </li>
                  <li>
                    <strong>Doesn't Meet Inclusion Criteria</strong>: indicates that the patient didn't meet the initial
                    criteria to receive the recommensation.
                  </li>
                  <li>
                    <strong>Meets Exclusion Criteria</strong>: indicates that the patient met the criteria that
                    automatically excludes them from receiving the recommendation regardless of whether or not they met
                    the inclusion criteria.
                  </li>
                </ul>
                In addition to the conditions above, authors can select subpopulations or boolean-valued parameters as
                conditions to indicate when an error message should be returned.
              </div>
              <div>
                <img
                  alt=""
                  src={screenshotUrl('Select_Error_If_Condition')}
                  className="img-fluid img-thumbnail rounded mx-auto d-block"
                />
              </div>
            </div>

            <div className={styles.h4Wrapper}>
              <h4 id="Handle_Errors_If">3.11.2 If Condition Then</h4>
              <div>
                To setup the simplest error handling case, choose a condition from the dropdown menu to the right of the
                "If" label in the "Errors" box. After you've selected the condition on which the error should be
                returned, enter the error message into the text box below the label "Then".
              </div>
              <div>
                <img
                  alt=""
                  src={screenshotUrl('Patient_Excluded_Error')}
                  className="img-fluid img-thumbnail rounded mx-auto d-block"
                />
              </div>
            </div>

            <div className={styles.h4Wrapper}>
              <h4 id="Handle_Errors_And_Also_If">3.11.3 And Also If...</h4>
              <div>
                To create more complex conditional logic, click on the "And Also If..." button. This allows you to
                specify more detailed error handling for when the top-level condition is met. Clicking the "And Also
                If..." button will display a new set of indented error handling controls. These controls work the same
                as the top-level set of error handling controls, but will only be active when the top-level condition is
                met first.
              </div>
            </div>

            <div className={styles.h4Wrapper}>
              <h4 id="Handle_Or_Else_If">3.11.4 Or Else If...</h4>
              <div>
                To create alternate error messages for other conditions, click on the "Or Else If..." button. This
                allows you to choose a condition that will be evaluated only if none of the other "If" or "Else if"
                conditions above it were met. If it evaluates to true (and the previous conditions did not), then its
                error message will be returned.
              </div>
            </div>

            <div className={styles.h4Wrapper}>
              <h4 id="Handle_Else">3.11.5 Else</h4>
              <div>
                The "Else" text box allows authors to specify an error if no other error messages were generated. This
                is rarely used at the top-level, as most CDS should not return any error if everything runs smoothly. In
                nested conditions (started by "And Also If..."), however, the "Else" box can be used to specify an error
                if the top-level condition was met, but none of the sub-conditions were met. If the "Else" text box is
                left empty, no error message will be returned if no other error condition has been satisfied.
              </div>
            </div>
          </div>

          <div className={styles.h3Wrapper}>
            <h3 id="External_CQL">3.12 External CQL Tab</h3>
            <div>
              Authors can use the "External CQL" tab to upload CQL files that contain logic that the author wants to use
              in the current CDS artifact. This is useful when you want to re-use existing logic rather than re-write it
              or when you want to use CQL logic that the CDS Authoring Tool is not capable of producing (for example,
              complex mathematical operations or timing relationships).
            </div>
            <div>
              <img
                alt=""
                src={screenshotUrl('External_CQL')}
                className="img-fluid img-thumbnail rounded mx-auto d-block"
              />
            </div>
            <div>
              Note that uploading a CQL library does not make it editable in the CDS Authoring Tool. The External CQL
              library is considered read-only. Authors, however, can use External CQL library elements as the basis of
              authored elements and apply further expression modifiers to customize them for their artifacts.
            </div>

            <div className={styles.h4Wrapper}>
              <h4 id="Uploading_External_CQL">3.12.1 Uploading External CQL</h4>
              <div>
                The CQL Authoring Tool allows CQL files to be uploaded individually or as a group of files contained in
                a zip file. CQL files that are uploaded individually must not depend on any external libraries aside
                from FHIRHelpers. If you want to upload a library that depends on other libraries (using CQL's "include"
                keyword), you must upload a zip file containing the library and its dependencies.
              </div>
              <div>
                There are two ways to upload External CQL files (whether .cql or .zip):
                <ul>
                  <li>Find the file on your local disk and drag it into the drop zone (outlined by a dashed line).</li>
                  <li>Click anywhere in the drop zone to open a dialog you can use to find and select your file.</li>
                </ul>
                <div>
                  <img
                    alt=""
                    src={screenshotUrl('Upload_External_CQL')}
                    className="img-fluid img-thumbnail rounded mx-auto d-block"
                  />
                </div>
                The CDS Authoring Tool will attempt to compile your CQL file when you upload it. If there are any
                errors, it will display an error message and the file upload will be abandoned. If there are no errors,
                the upload is successful and the file will appear in the list of External CQL libraries below the drop
                zone.
              </div>
            </div>

            <div className={styles.h4Wrapper}>
              <h4 id="Reviewing_External_CQL">3.12.2 Managing External CQL</h4>
              <div>
                The "External CQL" tab contains a list of uploaded CQL libraries, showing the following information and
                controls for each artifact:
                <ul>
                  <li>Library</li>
                  <li>Last Updated</li>
                  <li>Version</li>
                  <li>
                    FHIR<sup>®</sup> Version
                  </li>
                  <li>
                    View Details button <FontAwesomeIcon icon={faEye} aria-hidden="true" />
                  </li>
                  <li>"Delete" button</li>
                </ul>
              </div>
              <div>
                <img
                  alt=""
                  src={screenshotUrl('External_CQL_List')}
                  className="img-fluid img-thumbnail rounded mx-auto d-block"
                />
              </div>
              <div>
                To view a summary of the contents of the External CQL library, click on the eye icon{' '}
                <FontAwesomeIcon icon={faEye} aria-hidden="true" />. This will display a modal window with high-level
                metadata about the library and a listing of the library's definitions, parameters, and functions. For
                each of these, the name and return type are shown. For functions, the list of arguments is also shown.
              </div>
              <div>
                <img
                  alt=""
                  src={screenshotUrl('External_CQL_Details')}
                  className="img-fluid img-thumbnail rounded mx-auto d-block"
                />
              </div>
              <div>
                To delete an External CQL library, click its "Delete" button. This will open a modal dialog asking you
                to confirm that you would like to delete the External CQL file. After clicking the "Delete" button to
                confirm, the External CQL library will be permanently deleted. This cannot be undone.
              </div>
              <div>
                <img
                  alt=""
                  src={screenshotUrl('Delete_External_CQL')}
                  className="img-fluid img-thumbnail rounded mx-auto d-block"
                />
              </div>
              <div>
                If the "Delete" button is disabled, then this CQL library is being used within the artifact or is
                declared as a dependency of one of the other External CQL libraries. To delete an External CQL library
                in this case, you must first delete any uses of it in the artifact and/or the external libraries that
                declare it as a dependency.
              </div>
            </div>

            <div className={styles.h4Wrapper}>
              <h4 id="Using_External_CQL_Elements">3.12.3 Using External CQL Elements</h4>
              <div>
                Authors can reference and use definitions, parameters, and functions from External CQL libraries in the
                Inclusions tab, Exclusions tab, Subpopulations tab, and Base Elements tab. To use an External CQL
                element, select the "External CQL" type in the element type dropdown in a place an element can be
                created. A second dropdown will appear allowing you to choose the External CQL library that contains the
                definition, parameter, or function you wish to use. After selecting a library, a third dropdown will
                appear allowing you to choose the specific definition, parameter, or function to use.
              </div>
              <div>
                <img
                  alt=""
                  src={screenshotUrl('Using_External_CQL')}
                  className="img-fluid img-thumbnail rounded mx-auto d-block"
                />
              </div>
              <div>
                After selecting the External CQL definition, parameter, or function, its name and return type will
                be reflected in the element's expression phrase and listed in the element's metadata using the label
                "External CQL Element". If you wish (or if required), you can add expression modifiers to the element 
                in much the same way as you would any element. In this case, the expression modifiers added to the 
                use of the External CQL element will not affect the original definition of the External CQL element.
              </div>
              <div>
                <img
                  alt=""
                  src={screenshotUrl('External_CQL_Use')}
                  className="img-fluid img-thumbnail rounded mx-auto d-block"
                />
              </div>
              <div>
                If the External CQL element you select is a function that has required arguments, the appropriate editors
                will be supplied for you to populate with values.  These editors consist of two dropdowns: one which
                allows you to select the source of the argument and the other that is used to select a value according to
                your chosen source.  The available sources for arguments are Base Elements, Editors, External CQL, and 
                Parameters. Note that Base Elements, External CQL, and Parameters are only available for selection when an 
                appropriate element exists that matches the type of the argument you are attempting to populate.  If a
                particular argument source is greyed out within the first dropdown, this is an indication that there are
                no elements from that source that match the type of your particular function argument.
              </div>
              <div>
                <img
                  alt=""
                  src={screenshotUrl('External_CQL_Arg_Select')}
                  className="img-fluid img-thumbnail rounded mx-auto d-block"
                />
              </div>
              <div>
                Once an argument source is selected, you may populate the second field to complete that particular function
                argument.  If "Editor" is selected as the argument source, an appropriate editor will be displayed for completion.
                If one of Base Elements, External CQL, or Parameters is selected, you will be prompted with a second
                dropdown listing the matching elements of that type.  Note that when using External CQL Elements as arguments
                you will be restricted to External CQL Functions with zero arguments, External CQL Parameters, and external
                CQL definitions. You may, however, use elements from a different External CQL library as an argument to an
                external function of another.
              </div>
              <div>
                Note that when an External CQL element is used, it prevents the External CQL library from being deleted
                from the artifact. To delete the External CQL library, you must first delete its use. In addition, when
                an External CQL library is uploaded in an artifact, that artifact will become locked into the same
                version of FHIR that the External CQL uses. After this, you cannot download the artifact as other
                versions of FHIR, you cannot test the artifact against synthetic patient data using another version of
                FHIR, and you cannot upload additional External CQL using a different version of FHIR.
              </div>
            </div>

            <div className={styles.h4Wrapper}>
              <h4 id="Using_External_CQL_Expression_Modifiers">3.12.4 Using External CQL Expression Modifiers</h4>
              <div>
                In certain situations, authors can use functions from External CQL libraries as expression modifiers on
                elements in an artifact. An external function can be used to modify an element in this way if all of the
                following conditions are met:
                <ul>
                  <li>The function has at least one argument.</li>
                  <li>The first argument of the function matches the return type of the element.</li>
                  <li>
                    One of the following is true for each argument:
                    <ul>
                      <li>There exists a Base Element whose return type matches the argument's type.</li>
                      <li>There exists a Parameter whose return type matches the argument's type.</li>
                      <li>There exists an External CQL Element whose return type matches the argument's type.</li>
                        <ul>
                          <li>Note: Only External CQL definitions, parameters, and functions with zero arguments
                             are valid as arguments to external modifiers.</li>
                        </ul>
                          <li>The argument's type is one of the following:</li>
                      <ul>
                        <li>Boolean, Code, Concept, Integer, DateTime, Decimal, Quantity, String, Time, Interval&lt;Integer&gt;,
                            Interval&lt;DateTime&gt;, Interval&lt;Decimal&gt;, and Interval&lt;Quantity&gt;.</li>
                      </ul>
                    </ul>
                  </li>
                </ul>
                If these conditions are met, the expression modifier will appear just like any other after selecting the
                "Add Expression" button. The expression will be labeled with the function's name and the library's name,
                as well as a book icon <MenuBookIcon fontSize="small" aria-hidden="true" /> to indicate that it is from
                an External CQL library.
              </div>
              <div>
                <img
                  alt=""
                  src={screenshotUrl('External_CQL_Modifier')}
                  className="img-fluid img-thumbnail rounded mx-auto d-block"
                />
              </div>
              <div>
                Once an External CQL expression modifier is selected, it is displayed on the element just like any other
                expression modifier. The return type of the element will now be the return type of the External CQL
                function. If the External CQL function only has one argument, then the expression modifier is complete
                and no further action is required because this argument will be populated by the existing element. If
                the function has additional arguments, then the expression modifier will populate with editors that will
                allow you to select an argument source and an appropriate value for that source.
              </div>
              <div>
                <img
                  alt=""
                  src={screenshotUrl('External_CQL_Modifier_Use')}
                  className="img-fluid img-thumbnail rounded mx-auto d-block"
                />
              </div>
              <div>
                Like above with External CQL functions with arguments, the available sources for arguments are 
                Base Elements, Editors, External CQL, and Parameters. Note that Base Elements,
                External CQL, and Parameters are only available for selection when an appropriate element
                exists that matches the type of the argument you are attempting to populate.
                If a particular argument source is greyed out within the first dropdown,
                this is an indication that there are no elements from that source that match the type of your particular
                function argument.
              </div>
              <div>
                <img
                  alt=""
                  src={screenshotUrl('External_CQL_Modifier_Editor')}
                  className="img-fluid img-thumbnail rounded mx-auto d-block"
                />
              </div>
              <div>
                Once an argument source is selected, you may populate the second field to complete that particular function
                argument.  If "Editor" is selected as the argument source, an appropriate editor will be displayed for completion.
                If one of Base Elements, External CQL, or Parameters is selected, you will be prompted with a second
                dropdown listing the matching elements of that type.  Note that when using External CQL Elements as arguments
                you will be restricted to External CQL Functions with zero arguments, External CQL Parameters, and external
                CQL definitions. You may, however, use elements from a different External CQL library as an argument to an
                external function of another.
              </div>
              <div>
                Similarly to when an External CQL element is used, when an External CQL expression modifier is used, its
                corresponding External CQL library cannot be deleted until the modifier is removed.
              </div>
            </div>
          </div>
        </div>

        <div className={styles.h2Wrapper}>
          <h2 id="Testing_Artifacts">4. Testing Artifacts</h2>
          <div>
            While CDS artifacts should always be tested in the environment where they are deployed, testing is an
            important part of the artifact development process as well. Testing CDS logic before it is deployed in a
            test environment allows authors to discover and fix bugs earlier in the process, saving both time and money.
            This also makes it easier to distinguish between bugs in the logic and bugs in the data or integration
            environment. To test your artifacts, click on the "Testing" link in the Clinical Decision Support Authoring
            banner near the top of the page.
          </div>
          <div>
            <img
              alt=""
              src={screenshotUrl('Testing_View')}
              className="img-fluid img-thumbnail rounded mx-auto d-block"
            />
          </div>
          <div>
            The CDS Authoring Tool testing view allows authors to upload their own synthetic test patients as FHIR
            bundles of synthetic patient data. The author can then run their CDS logic against one or more of these
            patients and inspect the results to determine if they are as expected. The CDS Authoring Tool does not
            currently provide a test patient editor, nor does it provide a mechanism for automated verification of
            results (e.g., "test assertions"). For more advanced testing capabilities, consider CDS Connect's{' '}
            <Link external href="https://github.com/AHRQ-CDS/CQL-Testing-Framework" text="CQL Testing Framework" />.
          </div>

          <div className={styles.h3Wrapper}>
            <h3 id="Uploading_Test_Patients">4.1 Uploading Test Patients</h3>
            <div>
              The first step in testing an artifact is to upload synthetic patient data to the CDS Authoring Tool. The
              CDS Authoring Tool environment is not appropriate for real patient data (whether de-identified or not).
              Only synthetic data should be used. Patient data should be uploaded as a FHIR bundle (DSTU2, STU3, or R4).
              Authors familiar with FHIR can use their tool of choice to create patient test data. Popular options
              include CDS Connect's{' '}
              <Link external href="https://github.com/AHRQ-CDS/CQL-Testing-Framework" text="CQL Testing Framework" />,{' '}
              <Link external href="https://github.com/synthetichealth/synthea" text="Synthea" />,{' '}
              <Link external href="http://clinfhir.com/" text="ClinFHIR" />, and{' '}
              <Link external href="https://build.fhir.org/ig/HL7/fhir-shorthand/" text="FHIR® Shorthand" />.
            </div>
            <div>
              There are two ways to upload synthetic test patient bundles (in .json format):
              <ul>
                <li>Find the file on your local disk and drag it into the drop zone (outlined by a dashed line).</li>
                <li>Click anywhere in the drop zone to open a dialog you can use to find and select your file.</li>
              </ul>
            </div>
            <div>
              <img
                alt=""
                src={screenshotUrl('Upload_Patient')}
                className="img-fluid img-thumbnail rounded mx-auto d-block"
              />
            </div>
            <div>
              When you upload a patient, the CDS Authoring Tool will display a modal dialog asking you to indicate which
              version of FHIR the patient data conforms to. Choose DSTU2, STU3, or R4. This may affect what artifacts
              can be tested using this patient and/or what FHIR version of the artifact will be used to do the testing
              on this patient.
            </div>
            <div>
              <img
                alt=""
                src={screenshotUrl('Patient_FHIR_Version')}
                className="img-fluid img-thumbnail rounded mx-auto d-block"
              />
            </div>
          </div>

          <div className={styles.h3Wrapper}>
            <h3 id="Managing_Test_Patients">4.2 Managing Test Patients</h3>
            <div>
              The "Testing" tab contains a list of uploaded synthetic test patients, showing the following information
              and controls for each patient:
              <ul>
                <li>Name</li>
                <li>Birth Date</li>
                <li>Gender</li>
                <li>
                  FHIR<sup>®</sup> Version
                </li>
                <li>Last Updated</li>
                <li>"View" button</li>
                <li>"Delete" button</li>
              </ul>
            </div>
            <div>
              <img
                alt=""
                src={screenshotUrl('Patient_List')}
                className="img-fluid img-thumbnail rounded mx-auto d-block"
              />
            </div>
            <div>
              To view a summary of a synthetic test patient's data, click on the "View" button. This will display a
              modal window with the patient's demographic data and the individual entries within the patient's health
              record. The entries are grouped according to type (e.g., Conditions, Medications, Encounters, etc.).
              Groups can be expanded and collapsed using the right arrow{' '}
              <FontAwesomeIcon icon={faChevronRight} aria-hidden="true" /> and down arrow{' '}
              <FontAwesomeIcon icon={faChevronDown} aria-hidden="true" /> (respectively). When expanded, each group
              shows a table with the most relevant data for that type (e.g., conditions show onset and abatement,
              medications show date written, etc.).
            </div>
            <div>
              <img
                alt=""
                src={screenshotUrl('Patient_Details')}
                className="img-fluid img-thumbnail rounded mx-auto d-block"
              />
            </div>
            <div>
              At the bottom of the patient details view, an object browsers allows authors to see the exact FHIR
              representation. This can be helpful for more detailed debugging or when the patient view summary data does
              not show the relevant fields of interest.
            </div>
            <div>
              <img
                alt=""
                src={screenshotUrl('Patient_Details_Object_Browser')}
                className="img-fluid img-thumbnail rounded mx-auto d-block"
              />
            </div>
            <div>
              To delete a patient, click its "Delete" button. This will open a modal dialog asking you to confirm that
              you would like to delete the patient. After clicking the "Delete" button to confirm, the patient will be
              permanently deleted. This cannot be undone.
            </div>
            <div>
              <img
                alt=""
                src={screenshotUrl('Delete_Patient')}
                className="img-fluid img-thumbnail rounded mx-auto d-block"
              />
            </div>
          </div>

          <div className={styles.h3Wrapper}>
            <h3 id="Test_Execution">4.3 Test Execution</h3>
            <div>
              Once your test patients have been uploaded (see section above), you can run any compatible CDS artifact
              against them. Compatible artifacts are artifacts that can be exported using the same version of FHIR as
              the patient data is encoded in. Note that some artifacts may not be compatible with your patients because
              the artifact is locked to a specific version of FHIR based on the External CQL it uses.
            </div>
            <div>
              In order to run the CDS artifact's CQL, the CDS Authoring Tool must request additional value set
              information (e.g., the set of codes) from the Value Set Authority Center. If you see an "Authenticate
              VSAC" button, you must first click it and then enter in your UMLS Terminology Services account username
              and password (this is not the same as your CDS Authoring Tool username and password). After you
              authenticate, you will see a new button titled "Execute CQL on Selected Patients".
            </div>
            <div>
              <img
                alt=""
                src={screenshotUrl('Select_Test_Patients')}
                className="img-fluid img-thumbnail rounded mx-auto d-block"
              />
            </div>
            <div>
              To run your CDS artifact against your test patients, select the patients you want to test by checking the
              box to the left of each patient's name. Once you've chosen the first test patient, you can only select
              other patients that use the same version of FHIR. The CDS Authoring Tool does not support operating on
              multiple versions of FHIR in a single test run. After selecting the patients you want to test click the
              "Execute CQL on Selected Patients" button to open the testing details modal dialog.
            </div>
            <div>
              <img
                alt=""
                src={screenshotUrl('Test_Execution_Details')}
                className="img-fluid img-thumbnail rounded mx-auto d-block"
              />
            </div>
            <div>
              The testing details dialog contains a dropdown select box allowing authors to choose a FHIR compatible
              artifact. Choose the artifact you want to test from the list. If you do not see your artifact, it is
              likely locked to a different version of FHIR than the patients you have selectec. If the artifact you
              selected has parameters defined, an additional field will display for each parameter with the default
              value preselected. You can use these fields to override the default values. After populating the parameter
              values (if applicable), click on the "Execute CQL" button to close the dialog and execute the CQL.
            </div>
          </div>
          <div className={styles.h3Wrapper}>
            <h3 id="Test_Execution_Results">4.4 Test Execution Results</h3>
            <div>
              After executing the CQL, the results will be displayed on the main testing page under the dropzone in a
              box labeled "CQL Execution Results". Under the label, high-level metadata will be shown, including:
              <ul>
                <li>
                  <strong>Artifact</strong>: the name of the artifact tested.
                </li>
                <li>
                  <strong>Meets Inclusion Criteria</strong>: The number of patients that met the inclusion criteria
                  (e.g., "2 of 3 patients").
                </li>
                <li>
                  <strong>Meets Exclusion Criteria</strong>: The number of patients that met the exclusion criteria
                  (e.g., "1 of 3 patients").
                </li>
              </ul>
              Below the execution results summary, a list of the test patients is displayed.
            </div>
            <div>
              <img
                alt=""
                src={screenshotUrl('Test_Results')}
                className="img-fluid img-thumbnail rounded mx-auto d-block"
              />
            </div>
            <div>
              To see the individual results for test patients, click the right-arrow button{' '}
              <FontAwesomeIcon icon={faChevronDown} aria-hidden="true" /> to the right of the patient you want to view
              results for.
            </div>
            <div>
              <img
                alt=""
                src={screenshotUrl('Test_Results_Details')}
                className="img-fluid img-thumbnail rounded mx-auto d-block"
              />
            </div>
            <div>
              This lists the five most important CQL result elements for the patient:
              <ul>
                <li>
                  <strong>MeetsInclusionCriteria</strong>: A green checkmark{' '}
                  <FontAwesomeIcon icon={faCheck} className="boolean-check" aria-hidden="true" /> indicates the patient
                  met the inclusion criteria, a red "X"{' '}
                  <FontAwesomeIcon icon={faTimes} className="boolean-x" aria-hidden="true" /> indicates the patient did
                  not meet the inclusion criteria, and the phrase "No Value" indicates that there was not enough data to
                  make a determination.
                </li>
                <li>
                  <strong>MeetsExclusionCriteria</strong>: A green checkmark{' '}
                  <FontAwesomeIcon icon={faCheck} aria-hidden="true" /> indicates the patient met the exclusion
                  criteria, a red "X" <FontAwesomeIcon icon={faTimes} className="boolean-x" aria-hidden="true" />{' '}
                  indicates the patient did not meet the exclusion criteria, and the phrase "No Value" indicates that
                  there was not enough data to make a determination.
                </li>
                <li>
                  <strong>Recommendation</strong>: If the CDS indicates a recommendation for this patient, the
                  recommendation text will be displayed, otherwise the phrase "No Value" is displayed.
                </li>
                <li>
                  <strong>Rationale</strong>: If the CDS indicates a rationale for this patient, the rationale text will
                  be displayed, otherwise the phrase "No Value" is displayed.
                </li>
                <li>
                  <strong>Errors</strong>: If the CDS returns an error for this patient, the error text will be
                  displayed, otherwise the phrase "No Value" is displayed.
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <Waypoint onEnter={onWaypointEnter} onLeave={onWaypointLeave} />
    </div>
  );
};

export default UserGuide;
