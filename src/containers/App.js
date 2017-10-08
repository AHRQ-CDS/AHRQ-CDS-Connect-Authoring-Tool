import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { loginUser, logoutUser, setAuthStatus } from '../actions/auth';
import { setErrorMessage } from '../actions/errors';

import Header from '../components/Header';
import Navbar from '../components/Navbar';

class App extends Component {
  handleDismissClick = (e) => {
    this.props.setErrorMessage('');
    e.preventDefault();
  }

  renderedErrorMessage() {
    const { errorMessage } = this.props;
    if (errorMessage === '') { return null; }

    return (
      <div className="error-message">
        <span>{errorMessage}</span>
        <button onClick={this.handleDismissClick}>Dismiss</button>
      </div>
    );
  }

  render() {
    const { children, isAuthenticated, authUser, authStatus, authStatusText } = this.props;

    return (
      <div className="app">
        <a className="skiplink" href="#maincontent">Skip to main content</a>
        <Header />
        <Navbar
          isAuthenticated={isAuthenticated}
          authUser={authUser}
          authStatus={authStatus}
          authStatusText={authStatusText}
          loginUser={this.props.loginUser}
          logoutUser={this.props.logoutUser}
          setAuthStatus={this.props.setAuthStatus} />
        {this.renderedErrorMessage()}
        {children}
      </div>
    );
  }
}

App.propTypes = {
  isAuthenticated: PropTypes.bool.isRequired,
  authUser: PropTypes.string,
  authStatus: PropTypes.string,
  authStatusText: PropTypes.string,
  loginUser: PropTypes.func.isRequired,
  logoutUser: PropTypes.func.isRequired,
  setAuthStatus: PropTypes.func.isRequired
};

// these props are used for dispatching actions
function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    loginUser,
    logoutUser,
    setAuthStatus,
    setErrorMessage
  }, dispatch);
}

// these props come from the application's state when it is started
function mapStateToProps(state) {
  return {
    isAuthenticated: state.auth.isAuthenticated,
    authUser: state.auth.username,
    authStatus: state.auth.authStatus,
    authStatusText: state.auth.authStatusText,
    errorMessage: state.errors.errorMessage
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(App);
