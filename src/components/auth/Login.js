import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ReactModal from 'react-modal';
import FontAwesome from 'react-fontawesome';

// For screen readers to not see the background text
ReactModal.setAppElement('#root');

export default class Login extends Component {
  constructor(props) {
    super(props);

    this.state = { showLoginModal: false };
  }

  componentWillUnmount() { // eslint-disable-line class-methods-use-this
    document.getElementById('root').classList.remove('blur-10');
  }

  openLoginModal = () => {
    this.setState({ showLoginModal: true });
    document.getElementById('root').classList.add('blur-10');
  }

  closeLoginModal = () => {
    this.setState({ showLoginModal: false });
    this.props.setAuthStatus(null);
    document.getElementById('root').classList.remove('blur-10');
  }

  login = (event) => {
    event.preventDefault();

    const username = this.refs.username;
    const password = this.refs.password;
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
        <button onClick={this.openLoginModal} className="btn btn-primary login__button col">Login</button>

        <ReactModal
          contentLabel="Login"
          id='login'
          isOpen={this.state.showLoginModal}
          onRequestClose={this.closeLoginModal}
          className="login-modal modal-style"
          shouldCloseOnOverlayClick={false}
          overlayClassName='modal-overlay'>

          <div className="modal__header">
            <div className="modal__heading">Login to your account</div>

            <div className="modal__buttonbar">
              <button onClick={this.closeLoginModal}
                className="modal__deletebutton"
                aria-label="Close login disclaimer">
                <FontAwesome fixedWidth name='close'/>
              </button>
            </div>
          </div>

          <div className="modal__body">
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

            <form onSubmit={this.login}>
              <input type='text' ref='username' className="form-control col" placeholder='username' />
              <input type='password' ref='password' className="form-control col" placeholder='password' />
              {this.renderedAuthStatusText()}

              <div className="modal__buttons">
                <button type="button" onClick={this.closeLoginModal}>Cancel</button>

                <button type="submit" className="primary-button">
                  Login
                </button>
              </div>
            </form>
          </div>
        </ReactModal>
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
