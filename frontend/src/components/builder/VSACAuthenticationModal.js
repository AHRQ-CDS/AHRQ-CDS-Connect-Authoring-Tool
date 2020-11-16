/* eslint-disable jsx-a11y/no-autofocus */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExclamationCircle, faSpinner, faKey } from '@fortawesome/free-solid-svg-icons';

import { Modal }  from 'components/elements';

class VSACAuthenticationModal extends Component {
  constructor(props) {
    super(props);

    this.state = { showVSACAuthModal: false };
  }

  openVSACLoginModal = () => {
    this.setState({ showVSACAuthModal: true });
  }

  closeVSACLoginModal = () => {
    this.setState({ showVSACAuthModal: false });
    this.props.setVSACAuthStatus(null);
  }

  loginToVSAC = (event) => {
    event.preventDefault();

    this.props.loginVSACUser(this.refs.apiKey.value.trim());
  }

  renderedAuthStatusText() {
    const { vsacStatus, vsacStatusText } = this.props;

    if (vsacStatus !== 'loginFailure') { return null; }

    return (
      <div className="login__auth-status">
        <FontAwesomeIcon icon={faExclamationCircle} /> {vsacStatusText}
      </div>
    );
  }

  renderButton = () => {
    if (this.props.vsacIsAuthenticating) {
      return (
        <button className="disabled-button" disabled={true} aria-label="Authenticating">
          <FontAwesomeIcon icon={faSpinner} size="2x" spin />
        </button>
      );
    }

    return (
      <button className="primary-button" onClick={this.openVSACLoginModal} aria-label="Authenticate VSAC">
        <FontAwesomeIcon icon={faKey} />{' '}Authenticate VSAC
      </button>
    );
  }

  render() {
    return (
      <div className="vsac-authentication-modal">
        {this.renderButton()}

        <Modal
          title="Login to your VSAC account"
          theme="dark"
          maxWidth="md"
          submitButtonText="Login"
          hasCancelButton
          handleShowModal={this.state.showVSACAuthModal}
          handleCloseModal={this.closeVSACLoginModal}
          handleSaveModal={this.loginToVSAC}
        >
          <div className="login-modal modal__content">
            <div className="login-modal__disclaimer">
              Use your UMLS Terminology Services API key to log in to VSAC to access value sets and codes within the CDS
              Authoring Tool.
              <p/>
              <ul className="modal__helptext">
                <li>
                  Need an account? {' '}
                  <a href={`${process.env.PUBLIC_URL}/documentation#Requesting_UTS_Account`} target="_blank"
                     rel="noopener noreferrer">Request a UMLS Terminology Services account.</a>
                </li>
                <li>
                  Don't know your UMLS API key? {' '}
                  <a href={`${process.env.PUBLIC_URL}/documentation#Accessing_UMLS_API_Key`} target="_blank"
                     rel="noopener noreferrer">Find your UMLS Terminology Services API key.</a>
                </li>
              </ul>
            </div>

             <form id="modal-form" onSubmit={this.loginToVSAC} className="login-modal__form">
              <label htmlFor="apiKey">API Key</label>
              <input
                type='password'
                ref='apiKey'
                id='apiKey'
                className="form-control col"
                placeholder='API Key'
                aria-labelledby="vsacApiKeyLabel"
              />

              {this.renderedAuthStatusText()}
            </form>
          </div>
        </Modal>
      </div>
    );
  }
}

VSACAuthenticationModal.propTypes = {
  loginVSACUser: PropTypes.func.isRequired,
  setVSACAuthStatus: PropTypes.func.isRequired,
  vsacStatus: PropTypes.string,
  vsacStatusText: PropTypes.string,
  vsacIsAuthenticating: PropTypes.bool
};

export default VSACAuthenticationModal;
