import React, { Component } from 'react';
import PropTypes from 'prop-types';
import FontAwesome from 'react-fontawesome';

import Modal from '../elements/Modal';
import { onVisitExternalForm } from '../../utils/handlers';

export default class Login extends Component {
  constructor(props) {
    super(props);

    this.state = { showLoginModal: false };
  }

  openLoginModal = () => {
    this.setState({ showLoginModal: true });
  }

  closeLoginModal = () => {
    this.setState({ showLoginModal: false });
    this.props.setAuthStatus(null);
  }

  login = (event) => {
    event.preventDefault();

    const { username, password } = this.refs;
    this.props.onLoginClick(username.value.trim(), password.value.trim());
  }

  renderedAuthStatusText() {
    const { authStatus, authStatusText } = this.props;

    if (authStatus !== 'loginFailure') { return null; }

    return (
      <div className="login__auth-status">
        <FontAwesome name="exclamation-circle" /> {authStatusText}
      </div>
    );
  }

  render() {
    return (
      <div className="login">
        <button onClick={this.openLoginModal} className="btn btn-primary login__button col" aria-label="Login">
          Login
        </button>

        <Modal
          modalTitle="Login to your account"
          modalId="login"
          modalTheme="dark"
          modalSubmitButtonText="Login"
          handleShowModal={this.state.showLoginModal}
          handleCloseModal={this.closeLoginModal}
          handleSaveModal={this.login}>

          <div className="login-modal modal__content">
            <div className="login-modal__disclaimer">
              This warning banner provides privacy and security notices consistent with applicable federal laws,
              directives, and other federal guidance for accessing this Government system, which includes all
              devices/storage media attached to this system. This system is provided for Government-authorized use
              only. Unauthorized or improper use of this system is prohibited and may result in disciplinary action
              and/or civil and criminal penalties. At any time, and for any lawful Government purpose, the government
              may monitor, record, and audit your system usage and/or intercept, search and seize any communication
              or data transiting or stored on this system. Therefore, you have no reasonable expectation of privacy.
              Any communication or data transiting or stored on this system may be disclosed or used for any lawful
              Government purpose.
            </div>
            <div className="login-modal__form">
              <label htmlFor='username'>Username</label>
              <input type='text' id='username' ref='username'
                className="form-control col" placeholder='username' />
              <label htmlFor='password'>Password</label>
              <input type='password' id='password' ref='password'
                className="form-control col" placeholder='password' />
              {this.renderedAuthStatusText()}
            </div>

            <div className="login-modal__forgot-password">
              <a href="https://ahrqadmin.org/UMA/password" className="light-link hover-link-to-button" onClick={onVisitExternalForm}>
                <span className="text">Forgot password?</span>
                <span className="line -right"></span>
                <span className="line -top"></span>
                <span className="line -left"></span>
                <span className="line -bottom"></span>
              </a>
            </div>
          </div>
        </Modal>
      </div>
    );
  }
}

Login.propTypes = {
  authStatus: PropTypes.string,
  authStatusText: PropTypes.string,
  onLoginClick: PropTypes.func.isRequired,
  setAuthStatus: PropTypes.func.isRequired
};
