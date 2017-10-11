import React, { Component } from 'react';
import PropTypes from 'prop-types';
import FontAwesome from 'react-fontawesome';

export default class Login extends Component {
  constructor(props) {
    super(props);

    this.state = { showLogin: false };
  }

  login = (event) => {
    event.preventDefault();

    if (this.state.showLogin === false) { // slide out login
      this.toggleShowLogin();
    } else { // submit login
      const username = this.refs.username;
      const password = this.refs.password;
      this.props.onLoginClick(username.value.trim(), password.value.trim());
    }
  }

  toggleShowLogin = () => {
    this.setState({ showLogin: !this.state.showLogin });
    this.props.setAuthStatus(null);
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

  renderedLoginInputs() {
    if (!this.state.showLogin) {
      return null;
    }

    return (
      <div className="login__inputs">
        <input type='text' ref='username' className="form-control col" placeholder='username'/>
        <input type='password' ref='password' className="form-control col" placeholder='password'/>

        <button type="button" className="login__inputs-reset" onClick={this.toggleShowLogin}>
          <FontAwesome name="angle-double-right" />
        </button>

        {this.renderedAuthStatusText()}
      </div>
    );
  }

  render() {
    return (
      <form className="login row" onSubmit={this.login}>
        {this.renderedLoginInputs()}

        <button type="submit" className="btn btn-primary login__button col">
          Login
        </button>
      </form>
    );
  }
}

Login.propTypes = {
  authStatus: PropTypes.string,
  authStatusText: PropTypes.string,
  onLoginClick: PropTypes.func.isRequired,
  setAuthStatus: PropTypes.func.isRequired
};
