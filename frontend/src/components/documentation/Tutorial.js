import React from 'react';
import clsx from 'clsx';
import { Waypoint } from 'react-waypoint';
import { Link } from 'components/elements';
import { useTocbotWithWaypoint } from './hooks';
import useStyles from './styles';

const screenshotUrl = name => `${process.env.PUBLIC_URL}/assets/images/tutorial/${name}.png`;
const patientFileName = name => `${process.env.PUBLIC_URL}/assets/images/tutorial/patients/${name}.json`;

const Tutorial = () => {
  const { onWaypointEnter, onWaypointLeave } = useTocbotWithWaypoint();
  const styles = useStyles();

  return (
    <div className={clsx(styles.guide, 'toc-container')} id="maincontent">
      <div className={clsx(styles.toc, 'toc')} id="toc"></div>

      <div className={clsx(styles.tocWrapper, 'toc-wrapper')}>
        <h1 id="CDS_Authoring_Tool_Tutorial">CDS Authoring Tool Tutorial</h1>
        <div>
          This tutorial is a step-by-step guide to creating a CDS Artifact in the CDS Authoring Tool. It serves as an
          introduction to the CDS Authoring Tool.
        </div>
        <div>
          This tutorial is based on a previous version of the{' '}
          <Link
            text="Healthy Diet and Physical Activity"
            href="https://cds.ahrq.gov/cdsconnect/artifact/healthy-diet-and-physical-activity-cvd-prevention-adults-cardiovascular-risk"
          />{' '}
          guideline. While the most current version of the guideline was considered, the earlier version contains
          constructs that more easily demonstrate the aspects of the Authoring Tool that most users need to know.{' '}
        </div>
        <div className={styles.italic}>
          Please note: This tutorial is provided for educational purposes only. The resulting clinical logic is neither
          complete nor current and should NOT be used in a clinical setting.
        </div>

        <div className={styles.h2Wrapper}>
          <h2 id="Before_Starting">Before Starting</h2>
          <div>
            Before creating an artifact, you must have a CDS Authoring Tool account, a UMLS Terminology Services
            account, and be logged into the CDS Authoring Tool. Follow the instructions in the User Guide under{' '}
            <Link
              text="Starting with the CDS Authoring Tool"
              href={`${process.env.PUBLIC_URL}/documentation/userguide#Starting`}
            />{' '}
            for help with any of these steps.
          </div>
        </div>

        <div className={styles.h2Wrapper}>
          <h2 id="Overview">Overview</h2>
          <div>
            In this tutorial, we will use the CDS Authoring Tool to create a "Healthy Diet Tutorial" artifact that
            represents the following simplified CDS rule:
          </div>
          <div className={styles.h3Wrapper}>
            If the patient meets all the the following inclusion criteria:
            <ul>
              <li>is age 18 or older,</li>
              <li>
                has a BMI of 25 kg/m<sup>2</sup> or higher,
              </li>
              <li>and has hypertension;</li>
            </ul>
            And the patient does not meet any of the following exclusion criteria:
            <ul>
              <li>has had a myocardial infarction;</li>
            </ul>
            Then provide the following recommendation:
            <ul>
              <li>Talk to your physician about diet and exercise.</li>
            </ul>
          </div>
          <div>Now, lets start the artifact.</div>
        </div>

        <div className={styles.h2Wrapper}>
          <h2 id="Create_New_Artifact">Create a New Artifact</h2>
          <div>
            Once you are logged in to the CDS Authoring Tool, navigate to the{' '}
            <Link text="Artifacts tab" href={`${process.env.PUBLIC_URL}/artifacts`} /> and create a new artifact. In
            order to follow along more easily, you may want to open the Artifacts tab in a separate browser window or
            tab.
          </div>
          <div>
            Add a name and version for the artifact. Let's name this artifact "Healthy Diet Tutorial" and give it a very
            early version number of 0.0.1.
          </div>
          <div>
            <img
              alt="Create healthy diet tutorial artifact"
              src={screenshotUrl('Create_Artifact')}
              className="img-fluid img-thumbnail rounded mx-auto d-block"
            />
          </div>
          <div>
            Once your artifact is created, it will appear in your list of artifacts. Click on the name of the artifact
            to open it in the Workspace.
          </div>
          <div>
            <img
              alt="Open artifact"
              src={screenshotUrl('Open_Artifact')}
              className="img-fluid img-thumbnail rounded mx-auto d-block"
            />
          </div>
        </div>

        <div className={styles.h2Wrapper}>
          <h2 id="Inclusions">Inclusion Criteria</h2>
          <div>
            Now let's build the inclusion criteria for the artifact. With the artifact open in the Workspace, click on
            the "Inclusions" tab.
          </div>
          <div>
            Inclusion criteria is used to identify a target population that should receive the recommendation from this
            artifact. In the case of this simplified tutorial, we want the recommendation to be provided to patients who
            meet the following inclusion criteria:
            <ul>
              <li>the patient's age is 18 years or older,</li>
              <li>
                the patient has a BMI of 25 kg/m<sup>2</sup> or higher,
              </li>
              <li>and the patient has hypertension.</li>
            </ul>
          </div>

          <div className={styles.h3Wrapper}>
            <h3 id="Age_Range">Age Range</h3>
            <div>
              The first inclusion criteria is that the patient's age must be 18 years or older. Add the Age Range
              element, which can be found within the Demographics elements.
            </div>
            <div>
              <img
                alt="Add age range into inclusions"
                src={screenshotUrl('Inclusions_Age')}
                className="img-fluid img-thumbnail rounded mx-auto d-block"
              />
            </div>
            <div>
              CQL element names should describe what they represent, so let's name this element "Is 18+ Years Old", then
              set the minimum age to 18 and the unit of time to "years".
            </div>
            <div>
              <img
                alt="Finished age range element"
                src={screenshotUrl('Age_Range')}
                className="img-fluid img-thumbnail rounded mx-auto d-block"
              />
            </div>
          </div>

          <div className={styles.h3Wrapper}>
            <h3 id="BMI_Observation">BMI Observation</h3>
            <div>
              The next inclusion criteria is checking if the patient has a BMI of 25 kg/m<sup>2</sup> or higher. To
              capture this concept in FHIR, you should use an Observation element. Add the Observation element and
              authenticate to VSAC.
            </div>
            <div>
              Next, add a specific code for BMI to the Observation element. The{' '}
              <Link external text="FHIR BMI Observation profile" href="https://hl7.org/fhir/R4/bmi.html" /> indicates
              that LOINC 39156-5 should be used for BMI observations, so let's use that here. Click the "Add code"
              button to add code 39156-5 from the LOINC code system. Click "Validate" to check that the code is correct.
              You should see the validated code with display text "Body mass index (BMI) [Ratio]". Select the code to
              add it to your Observation element.
            </div>
            <div>
              <img
                alt="Validated code"
                src={screenshotUrl('Validate_Code')}
                className="img-fluid img-thumbnail rounded mx-auto d-block"
              />
            </div>
            <div>
              Now the Observation with the BMI code is in the Inclusions. However, as it currently is, this element
              represents a list of all Observations from a patient's record that have that BMI code. In order to
              transform this element to check if a patient's BMI is 25 kg/m<sup>2</sup> or greater, you need to add
              modifiers to the element.
            </div>
            <div>
              First, update the name of the element to better represent the concept it will eventually capture. Rename
              the element to "BMI {'>'}= 25 kg/m2"
            </div>
            <div>
              Click the "Add modifiers" button and click "Select modifiers" to choose from the built-in modifiers
              available in the CDS Authoring Tool. For this observation, we want to check that any Observations on the
              patient's record that are considered are verified, so add the "Verified" modifier. We also only want to
              consider the most recent Observation, so add the "Most Recent" modifier. Note that the return type field
              indicates that the element's return type changed from "List of Observations" to "Observation".
            </div>
            <div>
              Now that we have the BMI Observation we need, we can check if its value meets our criteria of {'>'}= 25
              mg/k<sup>2</sup>. To do this, add the "Quantity Value" and the "Value Comparison" modifiers. In the value
              comparison modifier, add the "{'>'}=" minimum operator, the "25" minimum value, and "kg/m2" in the units.
              Note that, at this point, the return type field indicates that the element's return type is "Boolean".
              Finally, click the "Add" button at the bottom of the dialog to save your modifiers.
            </div>
            <div>
              With these modifiers, you have transformed this Observation element to represent the criteria to check if
              the patient's BMI is 25 kg/m<sup>2</sup> or higher.
            </div>
            <div>
              <img
                alt="Finished BMI observation element"
                src={screenshotUrl('BMI_Observation')}
                className="img-fluid img-thumbnail rounded mx-auto d-block"
              />
            </div>
          </div>

          <div className={styles.h3Wrapper}>
            <h3 id="Hypertension_Condition">Hypertension Condition</h3>
            <div>
              The final piece of the inclusion criteria for this artifact is checking if the patient has hypertension.
              To capture this concept in FHIR, you should use a Condition element. Add the Condition element (and
              authenticate to VSAC, if necessary).
            </div>
            <div>
              Since there are many different codes that can be used to represent hypertension, we will specify this
              element using a value set containing all of the codes we want to allow as a match. Click the "Add Value
              Set" button to add a value set for hypertension. Use the search bar to search for value sets from NLM's
              VSAC. For our artifact, we'll search for "hypertension". You can click the "eye" icon to view the codes in
              each value set. Scroll down and select the Hypertension value set from the AHRQ CDS Connect Steward (OID
              2.16.840.1.113762.1.4.1032.9).
            </div>
            <div>
              This element now represents all of the Conditions in the patient's record that match a code in the
              hypertension value set, regardless of their clinical status. This list may be empty or it may contain
              conditions that have resolved. We need to use modifiers to be more specific about what we are looking for.
            </div>
            <div>
              First, rename the element to "Has Hypertension" to more closely reflect the concept that this element will
              capture.
            </div>
            <div>
              For this element, in order to check if the patient has hypertension, we want want to ensure that there is
              at least one Condition that is active or recurring and has been confirmed. If such a Condition exists on
              the patient's record, then they have hypertension. While we can use built-in modifiers to specify this
              additional criteria, it is also possible to specify this by building our own custom modifier. For the
              purposes of this tutorial, we'll build a custom modifier to demonstrate how that can be done.
            </div>
            <div>
              Click "Add modifiers" and then click "Build new modifier" to start building a custom modifier. First you
              need to choose the version of FHIR this artifact will be used with to ensure the correct options are
              available to your modifier. We'll choose R4.
            </div>
            <div>
              The first portion of the custom modifier will check if the clinical status of the Condition is active or
              recurring. Add a rule, choose the "Clinical Status" property, and choose "Matches Standard Code In" as the
              operator. For this element, we want to check if the condition is active or recurring, so choose those
              codes from the dropdown.
            </div>
            <div>
              The second portion of the custom modifier will check that the verification status of the Condition is
              confirmed. Add another rule for this concept, choose the "Verification Status" property, and choose
              "Matches Standard Code In" as the operator. Add the "confirmed" code from the dropdown.
            </div>
            <div>
              <img
                alt="Finished custom modifier"
                src={screenshotUrl('Custom_Modifier')}
                className="img-fluid img-thumbnail rounded mx-auto d-block"
              />
            </div>
            <div>
              That will complete your custom modifier, so click "Add" to add this modifier to the Condition element.
            </div>
            <div>
              This element still returns a list of Conditions. If the patient has a hypertension Condition that meets
              our criteria, the list will contain at least one item; otherwise it will be empty. Since we want to check
              if the patient has hypertension, we need one more modifier to check if the list is empty or not. To do
              that, add the built-in modifier "Exists", which will check whether there are any Conditions left that meet
              the criteria from the custom modifier.
            </div>
            <div>
              <img
                alt="Finished hypertension condition"
                src={screenshotUrl('Hypertension_Condition')}
                className="img-fluid img-thumbnail rounded mx-auto d-block"
              />
            </div>
          </div>

          <div className={styles.h3Wrapper}>
            <h3 id="Inclusions_Summary">Summary</h3>
            <div>
              Your Age Range, Observation, and Condition elements are now all added to the Inclusions tab. Because
              patients should be included in the artifact if they meet all three of these elements, there should be an
              "And" between each element in the Inclusions workspace.
            </div>
            <div>This finishes out the inclusion criteria that we want to capture for this simplified artifact. </div>
          </div>
        </div>

        <div className={styles.h2Wrapper}>
          <h2 id="Exclusion">Exclusion Criteria</h2>
          <div>
            The next step is to build the exclusion criteria for your artifact. Exclusion criteria is used to identify
            patients who should not receive the recommendation, even if they meet the inclusion criteria. For this
            simple artifact, patients are excluded if they have had a myocardial infarction, as a general recommendation
            for exercise may not be safe for them. Click on the "Exclusions" tab to switch over to creating the
            exclusion criteria.
          </div>

          <div className={styles.h3Wrapper}>
            <h3 id="Condition_Myocardial_Infarction">Myocardial Infarction Condition</h3>
            <div>
              For this artifact, we do not want the recommendation to apply to patients who have had a myocardial
              infarction. In the Exclusions tab, add a Condition element and add a Value Set. Search for "myocardial"
              and select the "Initial Myocardial Infarction" value set from the AHA Steward (oid
              2.16.840.1.113883.3.526.3.403).
            </div>
            <div>
              Now we want to check if the patient has had a myocardial infarction. To do that, we want to check that the
              patient has a confirmed Condition on their record that matches a code in the value set we just chose.
            </div>
            <div>First, rename the element to "Had Myocardial Infarction" to reflect this concept more closely.</div>
            <div>
              Next, add modifiers to update the element to reflect the criteria we need for the exclusions. Click "Add
              modifiers", then "Select Modifiers", and add the built-in "Confirmed" and "Exists" modifiers.
            </div>
            <div>
              <img
                alt="Finished myocardial infarction condition"
                src={screenshotUrl('Myocardial_Infarction_Condition')}
                className="img-fluid img-thumbnail rounded mx-auto d-block"
              />
            </div>
          </div>

          <div className={styles.h3Wrapper}>
            <h3 id="Exclusions_Summary">Summary</h3>
            <div>
              You now have all the exclusion criteria for this simplified artifact. More realistic artifacts often have
              additional exclusion criteria. Typically, the exclusion will apply if any one of those conditions is met;
              in that case, there should be an "Or" between each element in the Exclusion workspace.
            </div>
            <div>This finishes out the exclusion criteria that we want to capture for this simplified artifact. </div>
          </div>
        </div>

        <div className={styles.h2Wrapper}>
          <h2 id="Recommendations">Recommendations</h2>
          <div>
            Now that we have the Inclusion and Exclusion criteria set, we can provide a recommendation for the artifact.
            This recommendation will be given if the patient meets all the inclusion criteria and does not meet any of
            the exclusion criteria.
          </div>
          <div>
            Switch to the "Recommendations" tab in the Workspace and click the "New recommendation" button to add the
            recommendation. For this artifact, add a very simple recommendation saying "Talk to your physician about
            diet and exercise."
          </div>
          <div>
            <img
              alt="Finished recommendation"
              src={screenshotUrl('Recommendation')}
              className="img-fluid img-thumbnail rounded mx-auto d-block"
            />
          </div>
        </div>

        <div className={styles.h2Wrapper}>
          <h2 id="Review">Review</h2>
          <div>
            Now that the entire artifact has been built, we can review finished artifact. Switch to the Summary tab in
            the workspace. This provides a quick summary of the logic in the artifact.
          </div>
          <div>
            <img
              alt="Review summary"
              src={screenshotUrl('Summary')}
              className="img-fluid img-thumbnail rounded mx-auto d-block"
            />
          </div>
          <div>
            We can also view the CQL for the artifact. Click the "View CQL" button and choose FHIR R4 (4.0.1). This will
            open a dialog with the CQL for the artifact that can be reviewed.
          </div>
          <div>
            <img
              alt="Review CQL"
              src={screenshotUrl('View_CQL')}
              className="img-fluid img-thumbnail rounded mx-auto d-block"
            />
          </div>
        </div>

        <div className={styles.h2Wrapper}>
          <h2 id="Download">Download</h2>
          <div>
            Now that you've reviewed the artifact, you can download it. Click on the "Download CQL" button and choose
            FHIR R4 (4.0.1). Because we chose R4 as the FHIR version of this artifact when creating the custom modifier,
            only the R4 FHIR versions are available to be used when downloading this artifact. Even though both are
            available, FHIR version 4.0.1 is the current R4 version and has replaced FHIR version 4.0.0. FHIR version
            4.0.0 is mainly used by legacy systems; whenever possible, FHIR version 4.0.1 is preferred.
          </div>
          <div>
            Once you click FHIR R4 (4.0.1), your artifact is downloaded as both both FHIR-based CQL and as a Clinical
            Practice Guidelines (a.k.a. CPG on FHIR) Publishable Library. Once you download the artifact, you can
            distribute it yourself or include the logic files in an artifact on the{' '}
            <Link text="CDS Connect repository" href="https://cds.ahrq.gov/cdsconnect" />.
          </div>
        </div>

        <div className={styles.h2Wrapper}>
          <h2 id="Testing">Testing</h2>
          <div>
            It is useful to check your artifacts to make sure they capture the logic you intended. Besides just
            reviewing the artifact within the CDS Authoring Tool and reviewing the generated CQL, you can test the logic
            directly in the Authoring Tool using synthetic patient data.
          </div>
          <div>
            Navigate to the Testing tab of the Authoring Tool. Details about testing features are available in the{' '}
            <Link
              text="User Guide Testing Artifacts section"
              href={`${process.env.PUBLIC_URL}/documentation/userguide#Testing_Artifacts`}
            />
            .
          </div>
          <div>
            The first step to test your artifact is to upload test patients. These files must contain synthetic patient
            data only. Never upload any data that contains Personally Identifiable Information (PII) or Protected Health
            Information (PHI). For this simplified artifact, you can use synthetic patients{' '}
            <Link href={patientFileName('IsabelIncluded')} download text="Isabel Included" /> and{' '}
            <Link href={patientFileName('EliExcluded')} download text="Eli Excluded" />. Download the files and upload
            them to the Testing tab by dragging them into the drop zone or clicking the upload icon. If you are prompted
            to choose a FHIR version, choose R4.
          </div>
          <div>
            <img
              alt="Uploaded patients"
              src={screenshotUrl('Patient_List')}
              className="img-fluid img-thumbnail rounded mx-auto d-block"
            />
          </div>
          <div>
            With the patients uploaded, you may view their data by clicking on the "eye" icon next to their name.
          </div>
          <div>
            To test the artifact, start by selecting the patients you wish to test it against. If you are using Isabel
            Included and Eli Excluded, select both patients. Then click the "Execute CQL on Selected Patients" button,
            select the "Healthy Diet Tutorial" artifact, and click "Execute CQL". This will execute the artifact you
            just created against each of the synthetic patients.
          </div>
          <div>
            Once the artifact is executed, a summary of the results will be displayed. The summary shows whether each
            patient met the inclusion criteria, met the exclusion criteria, and if they received a recommendation. You
            can also view the detailed results for each patient to see the results of each element in your artifact for
            that patient. This is a great way to ensure the pieces of the artifact logic are working how you had
            intended.
          </div>
          <div>
            <img
              alt="Execution results"
              src={screenshotUrl('Execution_Results')}
              className="img-fluid img-thumbnail rounded mx-auto d-block"
            />
          </div>
          <div>
            Looking at the details of Isabel Included, we can see that she is over 18 years old, has a BMI of 25 kg/mg
            <sup>2</sup>, has hypertension, and has not had a myocardial infarction. Therefore, we expect that Isabel
            meets our inclusion criteria and does not meet our exclusion criteria, and therefore she should receive our
            recommendation. We can see these expectations match up with the execution results.
          </div>
          <div>
            Looking at the details of Eli Excluded, we can see he is over 18 years old, has a BMI of 25 kg/mg
            <sup>2</sup>, has hypertension, and has had a myocardial infarction. Therefore, we expect that Eli meets our
            inclusion criteria, but also meets our exclusion criteria, and therefore he should not receive our
            recommendation. We can see these expectations match up with the execution results as well.
          </div>
          <div>
            Additional test patients can be created with data tailored to the logic you want to test in your artifact.
            Executing your artifact against test patients to ensure you receive the expected results helps to increase
            your confidence in your artifact's accuracy.
          </div>

          <div className={styles.h2Wrapper}>
            <h2 id="Next_Steps">Next Steps</h2>
            <div>
              This completes the "Healthy Diet Tutorial" artifact. This should give you a foundation for how to author
              artifact logic with the CDS Authoring Tool. From here, you could go back and add additional details to
              your artifact to match the current guidance, or you can create your own brand new artifact.
            </div>
            <div>
              For further information about the Authoring Tool, the{' '}
              <Link text="User Guide" href={`${process.env.PUBLIC_URL}/documentation/userguide`} /> goes into detail on
              all the features available in the tool and provides links to previously recorded webinars that demonstrate
              the Authoring Tool.
            </div>
          </div>
        </div>
      </div>

      <Waypoint onEnter={onWaypointEnter} onLeave={onWaypointLeave} />
    </div>
  );
};

export default Tutorial;
