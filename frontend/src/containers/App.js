import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Alert } from '@material-ui/lab';

import { getCurrentUser } from 'actions/auth';
import setErrorMessage from 'actions/errors';
import loadTemplates from 'actions/templates';

import { Analytics, Navbar } from 'components/base';
import CdsHeader from 'components/header/CdsHeader';
import AhrqHeader from 'components/header/AhrqHeader';
import CdsFooter from 'components/footer/CdsFooter';
import AhrqFooter from 'components/footer/AhrqFooter';

class App extends Component {
  UNSAFE_componentWillMount() { // eslint-disable-line camelcase
    this.props.getCurrentUser();
    this.props.loadTemplates();
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
    const { children, isAuthenticated } = this.props;

    return (
      <div className="app">
        <a className="skiplink" href="#maincontent">Skip to main content</a>
        <Analytics gtmKey={process.env.REACT_APP_GTM_KEY} dapURL={process.env.REACT_APP_DAP_URL} />
        <AhrqHeader />
        <CdsHeader />
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
  getCurrentUser: PropTypes.func.isRequired,
  isAuthenticated: PropTypes.bool.isRequired
};

// these props are used for dispatching actions
function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    getCurrentUser,
    loadTemplates,
    setErrorMessage
  }, dispatch);
}

// these props come from the application's state when it is started
function mapStateToProps(state) {
  return {
    errorMessage: state.errors.errorMessage,
    isAuthenticated: state.auth.isAuthenticated
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(App);
