import React from 'react';
import { Waypoint } from 'react-waypoint';
import { useSelector } from 'react-redux';
import clsx from 'clsx';

import { Link } from 'components/elements';
import { useTocbotWithWaypoint } from './hooks';
import useStyles from './styles';

export const purpose = (
  <ol type="A">
    <li>
      <strong>Declarations</strong>: These terms & conditions govern the relationship between a Creator and the other
      parties to CDS Connect. By using the CDS Connect Authoring Tool, the Creator and any Publishing Organization agree
      to these terms & conditions.
    </li>
    <li>
      <strong>Change of Terms</strong>: These terms & conditions may change over time. The Governing Organization will
      endeavor to disseminate information about proposed changes well in advance (e.g., by Web posting). The user may
      decline the revised terms & conditions at that time by discontinuing use of the CDS Connect Authoring Tool.
    </li>
  </ol>
);

export const definitions = (
  <ol type="A">
    <li>
      <strong>AHRQ</strong>: The U.S. Agency for Healthcare Research & Quality.
    </li>
    <li>
      <strong>Author</strong>: Contributor to creation and modification of a CDS Artifact, but not necessarily the
      Publishing Organization or its Lead, who are the stewards and responsible parties for the CDS Artifact.
    </li>
    <li>
      <strong>Clinical Decision Support (CDS)</strong>: CDS provides timely information, usually at the point of care,
      to help inform decisions about a patient's care so as to enable higher-quality health outcomes. CDS tools are
      order sets created for particular conditions or types of patients, recommendations, and databases that can provide
      information relevant to particular patients, reminders for preventive care, and alerts about potentially dangerous
      situations. See:{' '}
      <Link
        external
        href="https://www.healthit.gov/topic/safety/clinical-decision-support"
        text="https://www.healthit.gov/topic/safety/clinical-decision-support"
      />
      .
    </li>
    <li>
      <strong>CDS Artifact</strong>: A healthcare decision support software application that translates medical
      knowledge (e.g., clinical practice guidelines, peer-reviewed articles, best practices, and clinical quality
      measures) into clinical action. The CDS Artifact can include a number of different types of CDS (e.g., clinician
      or patient-facing), which may incur additional federal regulation depending on their classification as device or
      non-device CDS. See:{' '}
      <Link
        external
        href="https://www.fda.gov/regulatory-information/search-fda-guidance-documents/clinical-decision-support-software"
        text="https://www.fda.gov/regulatory-information/search-fda-guidance-documents/clinical-decision-support-software"
      />
      .
    </li>
    <li>
      <strong>CDS Connect Artifact (CDSC Artifact)</strong>: A CDS Artifact that is accepted for inclusion in the CDS
      Connect Repository pursuant to the process set out in REQUIREMENTS FOR ARTIFACT CONTRIBUTORS TO CDS CONNECT
      REPOSITORY at paragraph B. DEVELOPMENT, SUBMISSION, INCLUSION AND MAINTENANCE OF CDS (CDSC) ARTIFACTS.
    </li>
    <li>
      <strong>CDS Connect Authoring Tool (Authoring Tool)</strong>: An interface for creating clinical decision support
      logic using simple forms and exporting it as Health Level Seven (HL7) Clinical Quality Language (CQL) artifacts
      using the HL7 Fast Healthcare Interoperability Resources (FHIR) data model for integration with electronic health
      records (EHRs).
    </li>
    <li>
      <strong>Creator</strong>: A user of the Authoring Tool. A Creator may or may not use the Authoring Tool with the
      intention of publishing the CDS Artifact authored using the Authoring Tool. A Creator may also use the Authoring
      Tool solely for educational purposes, e.g., learning about CQL. A Creator typically functions as part of a
      Publishing Organization's team but could be independent.
    </li>
    <li>
      <strong>Governing Organization (GO)</strong>: Organization that owns and oversees CDS Connect (currently AHRQ).
    </li>
    <li>
      <strong>Governing Organization Lead (GO Lead)</strong>:Represents the GO on all matters related to the CDS Connect
      resource.
    </li>
    <li>
      <strong>Governor</strong>: Oversees and administers all activity within CDS Connect from a technical, process, and
      systems perspective (currently The MITRE Corporation).
    </li>
    <li>
      <strong>Patient Centered Outcomes Research (PCOR)</strong>: Research that compares the impact of two or more
      preventive, diagnostic, treatment, or healthcare delivery approaches on health outcomes, including those that are
      meaningful to patients. See:{' '}
      <Link
        external
        href="https://www.ahrq.gov/pcor/potential-of-the-pcortf/index.html"
        text="Potential of the Patient-Centered Outcomes Research Trust Fund | Agency for Healthcare Research and Quality (ahrq.gov)"
      />
      .
    </li>
    <li>
      <strong>Publishing Organization</strong>: Legally owns and is responsible for a CDS Artifact from the clinical
      content perspective, including best efforts to review and maintain CDS Artifacts that are no longer Experimental
      and are now Active for clinical use. In some instances, an individual could be the Author, Publishing Organization
      Lead, and Publishing Organization.
    </li>
    <li>
      <strong>Publishing Organization Lead</strong>: Represents the Publishing Organization as the decision maker for
      all the organization's activities within CDS Connect.
    </li>
    <li>
      <strong>Repository</strong>: GO-operated site for storage and dissemination of Artifacts.
    </li>
  </ol>
);

export const intendedUsers = (
  <ol type="A">
    <li>
      <strong>Technical</strong>: Use of the Authoring Tool requires subject matter expertise in clinical care, CDS,
      EHRs, HL7, and FHIR. An individual Creator may not possess all the necessary skills, but the Publishing
      Organization's team should collectively have both the technical expertise and mechanisms for integrating its
      expertise into an Artifact.
    </li>
    <li>
      <strong>General Public</strong>: The Authoring Tool is not intended for use by the General Public but, rather, by
      technical teams or individuals with professional skills in clinical care, FHIR coding, and related backgrounds.
    </li>
  </ol>
);

export const noAssurance = (
  <ol type="A">
    <li>
      <strong>Non-assurance</strong>: The Creator's use of the Authoring Tool does not guarantee acceptance of any
      resultant CDS Artifact, material, or tool generated. Rather, such CDS Artifacts remain subject to the usual review
      process as described in the terms & conditions for CDS Artifacts considered for the Repository.
    </li>
  </ol>
);

export const ownership = (
  <ol type="A">
    <li>
      <strong>Copyright</strong>: AHRQ has copyrighted the Authoring Tool and licenses it under Apache 2.0.
      <sup>1</sup>
    </li>
    <li>
      <strong>Extensions of the Authoring Tool</strong>: Creator, Author, Publishing Organization, and/or other owner(s)
      may substantially extend the Authoring Tool so as to constitute a “derivative work” within the meaning of 17 USC
      101. The GO encourages all derivative works' widespread distribution, use, and experimentation. When using or
      incorporating the underlying Authoring Tool, owners of derivative work are encouraged to disseminate such work
      under an Apache license.
    </li>
  </ol>
);

export const disclaimers = (
  <ol type="A">
    <li>
      <strong>No Authoring Tool Warranty</strong>: The GO provides the Authoring Tool “as is.” It excludes all
      warranties, either express or implied.
    </li>
    <li>
      <strong>No Artifact Warranty</strong>: The GO also makes no warranties about any resulting Artifacts. Authoring
      Tool does not constitute a turnkey solution whose use ensures either successful implementation or regulatory
      compliance. Creators must use appropriate prototyping, testing, quality controls, training, updating, audit,
      techniques, etc. to verify that the resulting Artifact performs as intended. They should also consider the
      Artifact's fitness for purpose, infringement of other intellectual property rights, and other risks.
    </li>
  </ol>
);

export const footnotes = (
  <>
    <div id="footnote-1">
      <sup>1</sup>{' '}
      <Link
        external
        text="Authoring Tool README"
        href="https://github.com/AHRQ-CDS/AHRQ-CDS-Connect-Authoring-Tool#license"
      />
      ;{' '}
      <Link
        external
        text="Authoring Tool License"
        href="https://github.com/AHRQ-CDS/AHRQ-CDS-Connect-Authoring-Tool/blob/master/LICENSE"
      />
    </div>
  </>
);

const TermsAndConditions = () => {
  const { onWaypointEnter, onWaypointLeave } = useTocbotWithWaypoint();
  const termsAcceptedDate = useSelector(state =>
    state.auth.termsAcceptedDate ? new Date(state.auth.termsAcceptedDate).toLocaleDateString('en-us') : null
  );
  const styles = useStyles();

  return (
    <div className={clsx(styles.guide, 'toc-container')} id="maincontent">
      <div className={clsx(styles.toc, 'toc')} id="toc"></div>

      <div className={clsx(styles.tocWrapper, 'toc-wrapper')}>
        <h1 id="CDS_Authoring_Tool_Terms_and_Conditions">CDS Authoring Tool Terms and Conditions</h1>
        {termsAcceptedDate && <div>You agreed to the Authoring Tool Terms and Conditions on {termsAcceptedDate}.</div>}

        <div className={styles.h2Wrapper}>
          <h2 id="Purpose">I. Purpose</h2>
          {purpose}
        </div>

        <div className={styles.h2Wrapper}>
          <h2 id="Definitions">II. Definitions</h2>
          {definitions}
        </div>

        <div className={styles.h2Wrapper}>
          <h2 id="Intended_Users">III. Intended Users</h2>
          {intendedUsers}
        </div>

        <div className={styles.h2Wrapper}>
          <h2 id="No_Assurance_of_Artifact_Acceptance">IV. No Assurance of Artifact Acceptance</h2>
          {noAssurance}
        </div>

        <div className={styles.h2Wrapper}>
          <h2 id="Ownership">V. Ownership</h2>
          {ownership}
        </div>

        <div className={styles.h2Wrapper}>
          <h2 id="Disclaimers">VI. Disclaimers</h2>
          {disclaimers}
        </div>

        <div className={styles.h2Wrapper}>{footnotes}</div>
      </div>

      <Waypoint onEnter={onWaypointEnter} onLeave={onWaypointLeave} />
    </div>
  );
};

export default TermsAndConditions;
