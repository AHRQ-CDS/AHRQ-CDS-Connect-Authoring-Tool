import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import { logout } from '../../lib/auth';

class Logout extends Component {
  logout = (e) => {
    logout()
      .then(() => {
        this.props.onAuthChange();
        this.props.history.push('/');
      })
      .catch(() => {
        this.props.onAuthChange();
        this.props.history.push('/');
      });
  }

  render() {
    const { authUser } = this.props;
    return (
      <div>
        Logged in as {authUser.uid}
        <button onClick={this.logout} className='primary-button' style={{ marginLeft: '10px' }}>Logout</button>
      </div>
    );
  }
}

Logout.propTypes = {
  authUser: PropTypes.shape({ uid: PropTypes.string }),
  onAuthChange: PropTypes.func.isRequired
};

// This allows us to access the router history to redirect when necessary.
// See: https://github.com/ReactTraining/react-router/blob/master/packages/react-router/docs/api/withRouter.md
const LogoutWithRouter = withRouter(Logout);

export default LogoutWithRouter;
