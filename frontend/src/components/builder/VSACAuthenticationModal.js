/* eslint-disable jsx-a11y/no-autofocus */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button, CircularProgress, TextField } from '@material-ui/core';
import { Lock as LockIcon } from '@material-ui/icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExclamationCircle } from '@fortawesome/free-solid-svg-icons';

import { Link, Modal }  from 'components/elements';

class VSACAuthenticationModal extends Component {
  constructor(props) {
    super(props);

    this.state = {
      apiKey: '',
      showVSACAuthModal: false
    };
  }

  openVSACLoginModal = () => {
    this.setState({ showVSACAuthModal: true });
  }

  closeVSACLoginModal = () => {
    this.setState({ showVSACAuthModal: false });
    this.props.setVSACAuthStatus(null);
  }

  loginToVSAC = event => {
    event.preventDefault();
    this.props.loginVSACUser(this.state.apiKey);
  }

  handleApiKeyChange = event => {
    this.setState({ apiKey: event.target.value });
  };

  renderedAuthStatusText() {
    const { vsacStatus, vsacStatusText } = this.props;

    if (vsacStatus !== 'loginFailure') { return null; }

    return (
      <div className="login__auth-status">
        <FontAwesomeIcon icon={faExclamationCircle} /> {vsacStatusText}
      </div>
    );
  }

  renderButton = () => (
    <Button
      color="primary"
      onClick={this.openVSACLoginModal}
      variant="contained"
      startIcon={this.props.vsacIsAuthenticating ? <CircularProgress size={20} /> : <LockIcon />}
    >
      Authenticate VSAC
    </Button>
  );

  render() {
    const { vsacIsAuthenticating } = this.props;
    const { apiKey, showVSACAuthModal } = this.state;

    return (
      <div className="vsac-authentication-modal">
        {this.renderButton()}

        <Modal
          title="Login to your VSAC account"
          theme="dark"
          maxWidth="md"
          submitButtonText="Login"
          hasCancelButton
          hasEnterKeySubmit={false}
          handleShowModal={showVSACAuthModal}
          handleCloseModal={this.closeVSACLoginModal}
          handleSaveModal={this.loginToVSAC}
          isLoading={vsacIsAuthenticating}
        >
          <div className="login-modal modal__content">
            <div className="login-modal__disclaimer">
              Use your UMLS Terminology Services API key to log in to VSAC to access value sets and codes within the CDS
              Authoring Tool.
              <p/>
              <ul className="modal__helptext">
                <li>
                  Need an account?{' '}
                  <Link
                    href={`${process.env.PUBLIC_URL}/documentation#Requesting_UTS_Account`}
                    text="Request a UMLS Terminology Services account."
                  />
                </li>
                <li>
                  Don't know your UMLS API key?{' '}
                  <Link
                    href={`${process.env.PUBLIC_URL}/documentation#Accessing_UMLS_API_Key`}
                    text="Find your UMLS Terminology Services API key."
                  />
                </li>
              </ul>
            </div>

             <form id="modal-form" onSubmit={this.loginToVSAC} className="login-modal__form">
              <TextField
                autoComplete="new-password"
                autoFocus
                fullWidth
                label="API Key"
                onChange={this.handleApiKeyChange}
                type="password"
                value={apiKey}
                variant="outlined"
              />

              {vsacIsAuthenticating && <CircularProgress />}
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
