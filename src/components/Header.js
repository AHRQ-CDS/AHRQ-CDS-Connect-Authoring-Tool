import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Login from './auth/Login';
import Logout from './auth/Logout';

export default class Header extends Component {
  renderedAuth() {
    const { isAuthenticated, authUser, authStatus, authStatusText, loginUser, logoutUser,
      setAuthStatus } = this.props;

    if (isAuthenticated) {
      return (
        <Logout
          onLogoutClick={logoutUser}
          authUser={authUser}
          authStatus={authStatus}
          authStatusText={authStatusText} />
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
      <header className="header">
        <div className="header__hhsbanner">
          <div className="header__hhsbanner-wrapper row">
            <a href="https://www.hhs.gov/" className="header__hhsbannerlink col-sm">
              <img src={`${process.env.PUBLIC_URL}/assets/images/hhs-logo.png`}
                   title="HHS--US Department of Health and Human Services"
                   alt="HHS--US Department of Health and Human Services" />
              <span className="header__hhstext">U.S. Department of Health &amp; Human Services</span>
            </a>

            <div className="header__links col-sm">
              <span><a href="https://www.ahrq.gov/">AHRQ Home</a></span>
              <span><a href="https://www.ahrq.gov/cpi/about/index.html">About AHRQ</a></span>
              <span><a href="https://www.ahrq.gov/contact/index.html">Contact AHRQ</a></span>
              <span><a href="https://info.ahrq.gov/">FAQ</a></span>
              <span>
                <a href="http://subscriptions.ahrq.gov/service/multi_subscribe.html?code=USAHRQ">
                  <img src={`${process.env.PUBLIC_URL}/assets/images/primary-mail-list-icon.png`} alt="mail icon" /> Email Updates
                </a>
              </span>
            </div>
          </div>
        </div>

        <div className="header__ahrqbanner">
          <div className="header__ahrqbanner-wrapper">
            <a href="http://www.ahrq.gov/index.html" title="AHRQ Home" rel="home" id="logo">
              <img src={`${process.env.PUBLIC_URL}/assets/images/ahrq-logo.png`}
                   title="AHRQ--Agency for Healthcare Research and Quality: Advancing Excellence in Health Care"
                   alt="AHRQ--Agency for Healthcare Research and Quality: Advancing Excellence in Health Care" />
            </a>
          </div>
        </div>

        <div className="header__stripe-container">
          <div className="header__stripe header__stripe--purple"></div>
          <div className="header__stripe header__stripe--light-blue"></div>
          <div className="header__stripe header__stripe--orange"></div>
          <div className="header__stripe header__stripe--green"></div>
          <div className="header__stripe header__stripe--dark-blue"></div>
        </div>

        <div className="header__cdsbanner">
          <div className="header__cdsbanner-wrapper row">
            <div className="header__cdsbanner-text col-xs-12 col-lg-5">
              <a href="/" alt="home">
                <div className="text-top">Patient-centered Outcomes Research</div>
                <div className="text-bottom">Clinical Decision Support Authoring</div>
              </a>
            </div>

            <div className="header__cdsbanner-auth col-xs-12 col-lg-7">
              {this.renderedAuth()}
            </div>
          </div>
        </div>
      </header>
    );
  }
}

Header.propTypes = {
  isAuthenticated: PropTypes.bool.isRequired,
  authUser: PropTypes.string,
  authStatus: PropTypes.string,
  authStatusText: PropTypes.string,
  loginUser: PropTypes.func.isRequired,
  logoutUser: PropTypes.func.isRequired,
  setAuthStatus: PropTypes.func.isRequired
};
