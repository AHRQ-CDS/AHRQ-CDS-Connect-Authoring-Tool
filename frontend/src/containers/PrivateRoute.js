import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Route } from 'react-router-dom';

import { ErrorPage } from 'components/base';

class PrivateRoute extends Component {
  render() {
    if (this.props.isAuthenticated) {
      return <Route path={this.props.path} component={this.props.component} />;
    }
    return <Route path={this.props.path}><ErrorPage errorType='notLoggedIn' /></Route>;
  }
}

PrivateRoute.propTypes = {
  isAuthenticated: PropTypes.bool.isRequired,
  path: PropTypes.string.isRequired
};

function mapStateToProps(state) {
  return {
    isAuthenticated: state.auth.isAuthenticated
  };
}

export default connect(mapStateToProps)(PrivateRoute);
