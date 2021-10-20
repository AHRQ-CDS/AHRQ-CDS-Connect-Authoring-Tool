/* eslint max-len: ["error", 130] */
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link as RouterLink } from 'react-router-dom';
import { Button } from '@mui/material';
import clsx from 'clsx';

import WhatsNew from './WhatsNew';
import { Link } from 'components/elements';
import { onVisitExternalForm } from 'utils/handlers';
import { useSpacingStyles } from 'styles/hooks';
import useStyles from './styles';

const LandingButton = ({ isAuthenticated }) => {
  const styles = useStyles();

  if (isAuthenticated) {
    return (
      <Button component={RouterLink} to="/artifacts" className={styles.primaryButtonLink}>
        GET STARTED
      </Button>
    );
  }

  return (
    <Button
      className={styles.primaryButtonLink}
      onClick={onVisitExternalForm}
      href="https://cds.ahrq.gov/form/cds-authoring-tool-sign-up"
    >
      SIGN UP
    </Button>
  );
};

const Landing = ({ isAuthenticated }) => {
  const styles = useStyles();
  const spacingStyles = useSpacingStyles();

  return (
    <div className={styles.root} id="maincontent">
      <div className={spacingStyles.globalPadding}>
        <div className={clsx(styles.homeBanner, spacingStyles.fullBleed)}>
          <div className={styles.homeBannerContent}>
            <div className={styles.homeBannerTitle}>Create shareable standards-based CDS artifacts</div>

            <div className={styles.homeBannerSubtitle}>
              The <strong>Clinical Decision Support (CDS) Authoring Tool</strong> is a component of the{' '}
              <strong>CDS Connect</strong> project.
            </div>

            <LandingButton isAuthenticated={isAuthenticated} />
          </div>
        </div>

        <WhatsNew />

        <div className={clsx(styles.header, styles.landingHeader, spacingStyles.fullBleed)}>
          About the CDS Authoring Tool
        </div>

        <div className={styles.homeContent}>
          <div className={styles.homeCard}>
            <img
              className={styles.homeCardImage}
              src={`${process.env.PUBLIC_URL}/assets/images/home-transform.png`}
              alt=""
            />

            <div className={styles.homeCardTitle}>Transform</div>

            <div>
              CDS Connect, sponsored by the{' '}
              <Link external href="https://www.ahrq.gov/" text="Agency for Healthcare Research and Quality" />, aims to
              offer a systematic and replicable process for transforming patient-centered outcomes research (PCOR)
              findings into shareable standards-based CDS artifacts.
            </div>
          </div>

          <div className={styles.homeCard}>
            <img
              className={styles.homeCardImage}
              src={`${process.env.PUBLIC_URL}/assets/images/home-interface.png`}
              alt=""
            />

            <div className={styles.homeCardTitle}>Create</div>

            <div>
              The CDS Authoring Tool provides an interface for creating CDS logic using simple forms and exporting it as{' '}
              <Link
                external
                href="https://cql.hl7.org/"
                text="Health Level Seven (HL7®) Clinical Quality Language (CQL) 1.3"
              />{' '}
              artifacts using the HL7® Fast Healthcare Interoperability Resources (FHIR®){' '}
              <Link external href="http://hl7.org/fhir/DSTU2/index.html" text="DSTU2" /> ,{' '}
              <Link external href="http://hl7.org/fhir/STU3/index.html" text="STU3" /> , or{' '}
              <Link external href="http://hl7.org/fhir/R4/index.html" text="R4" /> data model.
            </div>
          </div>

          <div className={styles.homeCard}>
            <img
              className={styles.homeCardImage}
              src={`${process.env.PUBLIC_URL}/assets/images/home-repository.png`}
              alt=""
            />

            <div className={styles.homeCardTitle}>Share</div>
            <div>
              CDS Connect provides a repository of CDS artifacts and a prototype infrastructure for sharing CDS across
              different health care settings and technologies. The CDS Authoring Tool, along with the{' '}
              <Link href="https://cds.ahrq.gov/cdsconnect" text="CDS Connect Repository" />, is designed to promote the
              creation and use of CDS in everyday clinical settings, connecting high-quality CDS to the U.S. healthcare
              community.
            </div>
          </div>

          <div className={styles.homeCard}>
            <img
              className={styles.homeCardImage}
              src={`${process.env.PUBLIC_URL}/assets/images/home-contribute.png`}
              alt=""
            />
            <div className={styles.homeCardTitle}>Contribute</div>
            <div>
              The CDS Authoring Tool is released under an open source Apache 2.0 license and is available on{' '}
              <Link external href="https://github.com/ahrq-cds/ahrq-cds-connect-authoring-tool" text="GitHub" />.
            </div>
          </div>
        </div>

        <div className={clsx(styles.homeFooter, spacingStyles.fullBleed)}>
          <p>
            The CDS Authoring Tool is currently under development. Users should be aware of the following known
            limitations in current releases of the authoring tool:
          </p>

          <ul>
            <li>a limited set of logical capabilities, primarily focused on inclusion/exclusion logic</li>
            <li>support for only rule-based CDS, providing string-based recommendation statements</li>
          </ul>

          <p>
            The CDS Connect team appreciates your{' '}
            <a href="https://cds.ahrq.gov/contact-us" onClick={onVisitExternalForm}>
              feedback
            </a>{' '}
            and participation to help shape the CDS Authoring Tool as it moves forward.
          </p>
        </div>
      </div>
    </div>
  );
};

Landing.propTypes = {
  isAuthenticated: PropTypes.bool.isRequired
};

function mapStateToProps(state) {
  return {
    isAuthenticated: state.auth.isAuthenticated
  };
}

export default connect(mapStateToProps)(Landing);
