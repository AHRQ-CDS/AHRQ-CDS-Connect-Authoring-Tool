import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown, faChevronRight } from '@fortawesome/free-solid-svg-icons';

import { onVisitExternalForm } from '../utils/handlers';
import whatsNew from '../data/whatsNew';
import ExternalLink from '../components/elements/ExternalLink';

class Landing extends Component {
  constructor(props) {
    super(props);

    this.state = {
      whatsNewOpen: false,
      whatsNewIndex: 0,
    };
  }

  toggleWhatsNew = () => {
    this.setState({ whatsNewOpen: !this.state.whatsNewOpen });
  }

  toggleWhatsNewButton = (i) => {
    this.setState({
      whatsNewOpen: true,
      whatsNewIndex: i
    });
  }

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

  renderedWhatsNew = () => {
    const { whatsNewOpen, whatsNewIndex } = this.state;

    return (
      <div className="whats-new">
        <div
          role="button"
          tabIndex="0"
          className="header"
          onClick={() => this.toggleWhatsNew()}
          onKeyDown={() => null}
        >
          What's New
          <FontAwesomeIcon icon={whatsNewOpen ? faChevronDown : faChevronRight} />
        </div>

        <div className="new-buttons">
          {whatsNew.map((feature, i) =>
            <div className={`new-button-group feature-${i}`} key={i}>
              <button
                className="new-button"
                onClick={() => this.toggleWhatsNewButton(i)} key={i}
                aria-label={feature.name}
              >
                {feature.name}
              </button>
              <div className={classnames('triangle', whatsNewIndex === i && whatsNewOpen && 'active')}></div>
            </div>
          )}
        </div>

        {whatsNewOpen &&
          <div className="new-display">
            {whatsNew[whatsNewIndex].image !== '' &&
              <div className="display-image">
                <img src={whatsNew[whatsNewIndex].image} alt="" />
              </div>
            }

            <div className="display-description">
              <div className="name">{whatsNew[whatsNewIndex].name}</div>

              <div className="description">
                {whatsNew[whatsNewIndex].description}

                {whatsNew[whatsNewIndex].link &&
                  whatsNew[whatsNewIndex].link !== '' &&
                  whatsNew[whatsNewIndex].linkExternal !== true &&
                  <a
                    className={`link feature-${whatsNewIndex}`}
                    href={whatsNew[whatsNewIndex].link}
                  >
                    {whatsNew[whatsNewIndex].linkText}
                  </a>
                }
                {whatsNew[whatsNewIndex].link &&
                  whatsNew[whatsNewIndex].link !== '' &&
                  whatsNew[whatsNewIndex].linkExternal === true &&
                  <ExternalLink href={whatsNew[whatsNewIndex].link} text={whatsNew[whatsNewIndex].linkText} />
                }
              </div>
            </div>
          </div>
        }
      </div>
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

          {this.renderedWhatsNew()}

          <div className="header">About the CDS Authoring Tool</div>

          <div className="home-content">
            <div className="home-content__transform home-card">
              <img
                className="home-card__image"
                src={`${process.env.PUBLIC_URL}/assets/images/home-transform.png`}
                alt=""
              />

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
                alt=""
              />

              <div className="home-card__title">Create</div>

              <div className="home-card__text">
                The CDS Authoring Tool provides an interface for creating CDS logic using simple forms and exporting
                it as{' '}
                <ExternalLink href="https://cql.hl7.org/" text="Health Level Seven (HL7) Clinical Quality Language (CQL) 1.3" />
                {' '}artifacts using the HL7 Fast Healthcare Interoperability Resources (FHIR){' '}
                <ExternalLink href="http://hl7.org/fhir/DSTU2/index.html" text="DSTU2" />
                {' '},{' '}
                <ExternalLink href="http://hl7.org/fhir/STU3/index.html" text="STU3" />
                {' '}, or{' '}
                <ExternalLink href="http://hl7.org/fhir/R4/index.html" text="R4" />
                {' '}data model.
              </div>
            </div>

            <div className="home-content__repository home-card">
              <img
                className="home-card__image"
                src={`${process.env.PUBLIC_URL}/assets/images/home-repository.png`}
                alt=""
              />

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
                alt=""
              />
              <div className="home-card__title">Contribute</div>
              <div className="home-card__text">
                The CDS Authoring Tool is released under an open source Apache 2.0 license and is available on{' '}
                <ExternalLink href="https://github.com/ahrq-cds/ahrq-cds-connect-authoring-tool" text="GitHub" />
                .
              </div>
            </div>
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
