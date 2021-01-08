import React from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { Route } from 'react-router-dom';
import { CircularProgress } from '@material-ui/core';

import { ErrorPage } from 'components/base';

const PrivateRoute = ({ component, path }) => {
  const isAuthenticated = useSelector(state => state.auth.isAuthenticated);
  const isAuthenticating = useSelector(state => state.auth.isAuthenticating);

  if (isAuthenticated) return <Route path={path} component={component} />;

  return <Route path={path}>{isAuthenticating ? <CircularProgress /> : <ErrorPage errorType="notLoggedIn" />}</Route>;
};

PrivateRoute.propTypes = {
  component: PropTypes.elementType,
  path: PropTypes.string.isRequired
};

export default PrivateRoute;
