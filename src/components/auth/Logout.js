import React, { Component } from 'react';
import PropTypes from 'prop-types';

export default class Logout extends Component {
  render() {
    const { authUser, onLogoutClick } = this.props;

    return (
      <div className="logout">
        <span>Logged in as {authUser.uid}</span>
        <button onClick={onLogoutClick} className='btn btn-primary'>Logout</button>
      </div>
    );
  }
}

Logout.propTypes = {
  authUser: PropTypes.shape({ uid: PropTypes.string }),
  onLogoutClick: PropTypes.func.isRequired
};
