import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { NavLink } from 'react-router-dom';
import Login from './auth/Login';
import Logout from './auth/Logout';

export default class Navbar extends Component {
  renderedNavbar = () => {
    const {
      isAuthenticated,
      authUser,
      authStatus,
      authStatusText,
      loginUser,
      logoutUser,
      setAuthStatus
    } = this.props;

    if (isAuthenticated) {
      return (
        <nav className="navbar__nav" aria-labelledby="cds-main-navigation">
          <div className="sr-only" id="cds-main-navigation">Main navigation</div>

          <ul>
            <li><NavLink exact to="/">Home</NavLink></li>
            <li><NavLink to="/artifacts">Artifacts</NavLink></li>
            <li><NavLink to="/build">Workspace</NavLink></li>
          </ul>

          <Logout
            onLogoutClick={logoutUser}
            authUser={authUser}
            authStatus={authStatus}
            authStatusText={authStatusText} />
        </nav>
      );
    }

    return (
      <Login
        onLoginClick={loginUser}
        authStatus={authStatus}
        authStatusText={authStatusText}
        setAuthStatus={setAuthStatus} />
    );
  }

  render() {
    return (
      <div className="navbar">
        {this.renderedNavbar()}
      </div>
    );
  }
}

Navbar.propTypes = {
  isAuthenticated: PropTypes.bool.isRequired,
  authUser: PropTypes.string,
  authStatus: PropTypes.string,
  authStatusText: PropTypes.string,
  loginUser: PropTypes.func.isRequired,
  logoutUser: PropTypes.func.isRequired,
  setAuthStatus: PropTypes.func.isRequired
};
