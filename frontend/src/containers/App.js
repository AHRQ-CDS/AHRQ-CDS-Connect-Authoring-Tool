import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Alert } from '@material-ui/lab';

import { loginUser, logoutUser, setAuthStatus, getCurrentUser } from 'actions/auth';
import setErrorMessage from 'actions/errors';

import { Analytics, Navbar } from 'components/base';
import CdsHeader from 'components/header/CdsHeader';
import AhrqHeader from 'components/header/AhrqHeader';
import CdsFooter from 'components/footer/CdsFooter';
import AhrqFooter from 'components/footer/AhrqFooter';

class App extends Component {
  UNSAFE_componentWillMount() { // eslint-disable-line camelcase
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
      <Alert severity="error" onClose={this.handleDismissClick}>
        {errorMessage}
      </Alert>
    );
  }

  render() {
    const {
      artifactSaved, authStatus, authStatusText, authUser, children, isAuthenticated, isAuthenticating
    } = this.props;

    return (
      <div className="app">
        <a className="skiplink" href="#maincontent">Skip to main content</a>
        <Analytics gtmKey={process.env.REACT_APP_GTM_KEY} dapURL={process.env.REACT_APP_DAP_URL} />
        <AhrqHeader />

        <CdsHeader
          isAuthenticated={isAuthenticated}
          isAuthenticating={isAuthenticating}
          authUser={authUser}
          authStatus={authStatus}
          authStatusText={authStatusText}
          artifactSaved={artifactSaved}
          loginUser={this.props.loginUser}
          logoutUser={this.props.logoutUser}
          setAuthStatus={this.props.setAuthStatus}
        />

        <Navbar isAuthenticated={isAuthenticated} />

        {this.renderedErrorMessage()}
        {children}

        <CdsFooter />
        <AhrqFooter />
      </div>
    );
  }
}

App.propTypes = {
  artifactSaved: PropTypes.bool.isRequired,
  authStatus: PropTypes.string,
  authStatusText: PropTypes.string,
  authUser: PropTypes.string,
  getCurrentUser: PropTypes.func.isRequired,
  isAuthenticated: PropTypes.bool.isRequired,
  isAuthenticating: PropTypes.bool.isRequired,
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
    artifactSaved: state.artifacts.artifactSaved,
    authStatus: state.auth.authStatus,
    authStatusText: state.auth.authStatusText,
    authUser: state.auth.username,
    errorMessage: state.errors.errorMessage,
    isAuthenticated: state.auth.isAuthenticated,
    isAuthenticating: state.auth.isAuthenticating
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(App);
