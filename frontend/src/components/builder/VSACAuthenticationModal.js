/* eslint-disable jsx-a11y/no-autofocus */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import FontAwesome from 'react-fontawesome';

import Modal from '../elements/Modal';

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

    const { username, password } = this.refs;
    this.props.loginVSACUser(username.value.trim(), password.value.trim());
  }

  renderedAuthStatusText() {
    const { vsacStatus, vsacStatusText } = this.props;

    if (vsacStatus !== 'loginFailure') { return null; }

    return (
      <div className="login__auth-status">
        <FontAwesome name="exclamation-circle" /> {vsacStatusText}
      </div>
    );
  }

  renderButton = () => {
    if (this.props.vsacIsAuthenticating) {
      return (
        <button className="disabled-button" disabled={true} aria-label="Authenticating">
          <FontAwesome name="spinner" size="2x" spin />
        </button>
      );
    }

    return (
      <button className="primary-button" onClick={this.openVSACLoginModal} aria-label="Authenticate VSAC">
        <FontAwesome name="key" />{' '}Authenticate VSAC
      </button>
    );
  }

  render() {
    return (
      <div className="vsac-authentication-modal">
        {this.renderButton()}

        <Modal
          modalTitle="Login to VSAC your account"
          modalId="vsac-login"
          modalTheme="dark"
          modalSubmitButtonText="Login"
          handleShowModal={this.state.showVSACAuthModal}
          handleCloseModal={this.closeVSACLoginModal}
          handleSaveModal={this.loginToVSAC}>
          <div className="login-modal modal__content">
            <div className="login-modal__disclaimer">
              Use your UMLS account to log in to VSAC to access value sets and codes within the CDS Authoring Tool.
            </div>

            <div className="login-modal__form">
              <label htmlFor="username">Username</label>
              <input
                type='text'
                autoFocus
                autoComplete="username"
                ref='username'
                id='username'
                className="form-control col"
                placeholder='username'
                aria-labelledby="vsacUsernameLabel"/>
              <label htmlFor="password">Password</label>
              <input
                type='password'
                autoComplete="current-password"
                ref='password'
                id='password'
                className="form-control col"
                placeholder='password'
                aria-labelledby="vsacPasswordLabel"/>
              {this.renderedAuthStatusText()}
            </div>
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
