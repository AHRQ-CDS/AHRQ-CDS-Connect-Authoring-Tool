import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { loginUser, logoutUser, setAuthStatus, getCurrentUser } from '../actions/auth';
import setErrorMessage from '../actions/errors';

import Header from '../components/Header';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

class App extends Component {
  componentWillMount() {
    this.props.getCurrentUser();
  }

  handleDismissClick = (e) => {
    this.props.setErrorMessage('');
    e.preventDefault();
  }

  renderedErrorMessage() {
    const { errorMessage } = this.props;
    if (errorMessage === '') { return null; }
    return (
      <div className="error-message">
        {errorMessage}
        <button className="close" aria-label="Close" onClick={this.handleDismissClick}>
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
    );
  }

  render() {
    const {
      children, isAuthenticated, authUser, authStatus, authStatusText
    } = this.props;

    return (
      <div className="app">
        <a className="skiplink" href="#maincontent">Skip to main content</a>

        <Header
          isAuthenticated={isAuthenticated}
          authUser={authUser}
          authStatus={authStatus}
          authStatusText={authStatusText}
          loginUser={this.props.loginUser}
          logoutUser={this.props.logoutUser}
          setAuthStatus={this.props.setAuthStatus} />

        <Navbar isAuthenticated={isAuthenticated} />

        {this.renderedErrorMessage()}
        {children}

        <Footer isAuthenticated={isAuthenticated} />
      </div>
    );
  }
}

App.propTypes = {
  isAuthenticated: PropTypes.bool.isRequired,
  authUser: PropTypes.string,
  authStatus: PropTypes.string,
  authStatusText: PropTypes.string,
  getCurrentUser: PropTypes.func.isRequired,
  loginUser: PropTypes.func.isRequired,
  logoutUser: PropTypes.func.isRequired,
  setAuthStatus: PropTypes.func.isRequired
};

// these props are used for dispatching actions
function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    getCurrentUser,
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
