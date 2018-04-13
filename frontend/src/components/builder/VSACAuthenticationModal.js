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

  render() {
    return (
      <div>
        <button className="primary-button" onClick={this.openVSACLoginModal}>
          <FontAwesome name="key" />{' '}Authenticate VSAC
        </button>

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
              <input
                type='text'
                autoFocus
                autoComplete="username"
                ref='username'
                className="form-control col"
                placeholder='username'/>
              <input
                type='password'
                autoComplete="current-password"
                ref='password'
                className="form-control col"
                placeholder='password'/>
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
  vsacStatusText: PropTypes.string
};

export default VSACAuthenticationModal;
