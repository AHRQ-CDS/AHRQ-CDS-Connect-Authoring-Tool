import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

import { onVisitExternalLink, onVisitExternalForm } from '../utils/handlers';

class Landing extends Component {
  renderedButton = () => {
    if (this.props.isAuthenticated) {
      return <Link to="/artifacts" className="primary-button-link">GET STARTED</Link>;
    }

    return (
      <a
        className="primary-button-link"
        onClick={onVisitExternalForm}
        href="https://cds.ahrq.gov/form/cds-authoring-tool-sign-up">
        SIGN UP
      </a>
    );
  }

  render() {
    return (
      <div className="landing" id="maincontent">
        <div className="landing-wrapper">
          <div className="home-banner">
            <div className="home-banner__content">
              <div className="home-banner__content-title">Create shareable standards-based CDS artifacts</div>

              <div className="home-banner__content-subtitle">
                The <strong>Clinical Decision Support (CDS) Authoring Tool</strong> is a component of the <strong>CDS
                Connect</strong> project.
              </div>

              {this.renderedButton()}
            </div>
          </div>

          <div className="home-content">
            <div className="home-content__transform home-card">
              <img
                className="home-card__image"
                src={`${process.env.PUBLIC_URL}/assets/images/home-transform.png`}
                alt="transform" />

              <div className="home-card__title">Transform</div>

              <div className="home-card__text">
                CDS Connect, sponsored by the <a href="https://www.ahrq.gov/">Agency for Healthcare Research and
                Quality</a>, aims to offer a systematic and replicable process for transforming patient-centered
                outcomes research (PCOR) findings into shareable standards-based CDS artifacts.
              </div>
            </div>

            <div className="home-content__interface home-card">
              <img
                className="home-card__image"
                src={`${process.env.PUBLIC_URL}/assets/images/home-interface.png`}
                alt="interface" />

              <div className="home-card__title">Create</div>

              <div className="home-card__text">
                The CDS Authoring Tool provides an interface for creating CDS logic using simple forms and exporting
                it as
                <a
                  target="_blank"
                  rel="nofollow noopener noreferrer"
                  onClick={onVisitExternalLink}
                  href="https://cql.hl7.org/">
                  {' '}Health Level Seven (HL7) Clinical Quality Language (CQL) 1.2{' '}
                </a>
                <i className="fa fa-external-link"></i> artifacts using the
                <a
                  target="_blank"
                  rel="nofollow noopener noreferrer"
                  onClick={onVisitExternalLink}
                  href="http://hl7.org/fhir/DSTU2/index.html">
                  {' '}HL7 Fast Healthcare Interoperability Resources (FHIR) DSTU 2{' '}
                </a>
                <i className="fa fa-external-link"></i> data model.
              </div>
            </div>

            <div className="home-content__repository home-card">
              <img
                className="home-card__image"
                src={`${process.env.PUBLIC_URL}/assets/images/home-repository.png`}
                alt="repository" />

              <div className="home-card__title">Share</div>

              <div className="home-card__text">
                CDS Connect provides a repository of CDS artifacts and a prototype infrastructure for sharing
                CDS across different health care settings and technologies. The CDS Authoring Tool, along with the
                <a href="https://cds.ahrq.gov/cdsconnect"> CDS Connect Repository</a>, is designed to promote the creation and
                use of CDS in everyday clinical settings, connecting high-quality CDS to the U.S. healthcare community.
              </div>
            </div>

            <div className="home-content__contribute home-card">
              <img
                className="home-card__image"
                src={`${process.env.PUBLIC_URL}/assets/images/home-contribute.png`}
                alt="contribute" />

              <div className="home-card__title">Contribute</div>

              <div className="home-card__text">
                The CDS Authoring Tool is released under an open source Apache 2.0 license and is available on GitHub
                at:{' '}

                <a
                  target="_blank"
                  rel="nofollow noopener noreferrer"
                  onClick={onVisitExternalLink}
                  href="https://github.com/ahrq-cds/ahrq-cds-connect-authoring-tool">
                  {' '}https://github.com/ahrq-cds/ahrq-cds-connect-authoring-tool{' '}
                </a>

                <i className="fa fa-external-link"></i>.
              </div>
            </div>
          </div>

          <div className="home-screenshot">
            <img
              className="img-fluid img-thumbnail rounded mx-auto d-block"
              alt="screenshot of authoring a CDS artifact about statin use"
              src={`${process.env.PUBLIC_URL}/assets/images/statin-use-screenshot.png`} />
          </div>

          <div className="home-footer">
            <p>
              The CDS Authoring Tool is currently under development. Users should be aware of the following known
              limitations in current releases of the authoring tool:
            </p>

            <ul>
              <li>a limited set of logical capabilities, primarily focused on inclusion/exclusion logic</li>
              <li>support for only rule-based CDS, providing string-based recommendation statements</li>
            </ul>

            <p>
              The CDS Connect team appreciates your <a href="https://cds.ahrq.gov/contact-us"
              onClick={onVisitExternalForm}>feedback</a> and participation to help shape the CDS Authoring Tool as it
              moves forward.
            </p>
          </div>
        </div>
      </div>
    );
  }
}

Landing.propTypes = {
  isAuthenticated: PropTypes.bool.isRequired
};

function mapStateToProps(state) {
  return {
    isAuthenticated: state.auth.isAuthenticated
  };
}

export default connect(mapStateToProps)(Landing);
