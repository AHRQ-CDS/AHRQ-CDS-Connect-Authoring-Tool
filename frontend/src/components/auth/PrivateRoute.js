import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Route } from 'react-router-dom';
import { CircularProgress } from '@material-ui/core';

import { ErrorPage } from 'components/base';

const PrivateRoute = ({ component, isAuthenticated, isAuthenticating, path }) => {
  if (isAuthenticated) return <Route path={path} component={component} />;

  return <Route path={path}>{isAuthenticating ? <CircularProgress /> : <ErrorPage errorType="notLoggedIn" />}</Route>;
};

PrivateRoute.propTypes = {
  component: PropTypes.elementType,
  isAuthenticated: PropTypes.bool.isRequired,
  isAuthenticating: PropTypes.bool.isRequired,
  path: PropTypes.string.isRequired
};

function mapStateToProps(state) {
  return {
    isAuthenticated: state.auth.isAuthenticated,
    isAuthenticating: state.auth.isAuthenticating
  };
}

export default connect(mapStateToProps)(PrivateRoute);
