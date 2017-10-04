import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { AUTHENTICATED, UNAUTHENTICATED, CHECKING_AUTHENTICATION } from '../../lib/auth';
import Login from './Login';
import Logout from './Logout';

class Authentication extends Component {

  render() {
    const { authUser, authStatus, onAuthChange } = this.props;
    switch (authStatus) {
      case UNAUTHENTICATED:
        return <Login onAuthChange={onAuthChange} />;
      case AUTHENTICATED:
        return <Logout authUser={authUser} onAuthChange={onAuthChange} />;
      default:
        return <div>Checking authentication status</div>;
    }
  }
}

Authentication.propTypes = {
  authUser: PropTypes.shape({ uid: PropTypes.string }),
  authStatus: PropTypes.oneOf([AUTHENTICATED, UNAUTHENTICATED, CHECKING_AUTHENTICATION]).isRequired,
  onAuthChange: PropTypes.func.isRequired
};

export default Authentication;
