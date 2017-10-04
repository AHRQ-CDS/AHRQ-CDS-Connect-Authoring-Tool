import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { AUTHENTICATED, UNAUTHENTICATED, CHECKING_AUTHENTICATION, login, logout } from '../../lib/auth';

class LoginForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: '',
      failed: false
    };

    this.login = this.login.bind(this);
    this.logout = this.logout.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
  }

  login(e) {
    e.preventDefault();
    login(this.state.username, this.state.password)
      .then((result) => {
        this.setState({ username: result.uid, password: '', failed: false });
        this.props.onAuthChange();
      })
      .catch(() => {
        this.setState({ username: this.state.username, password: this.state.password, failed: true });
      });
  }

  logout(e) {
    logout()
      .then(result => this.props.onAuthChange())
      .catch(() => this.props.onAuthChange());
  }

  handleInputChange(e) {
    this.setState({ [e.target.name]: e.target.value });
  }

  render() {
    switch (this.props.authStatus) {
      case UNAUTHENTICATED:
        return this.renderLogin();
      case AUTHENTICATED:
        return this.renderLogout();
      default:
        return <div>Checking authentication status</div>;
    }
  }

  renderLogin() {
    const { username, password, failed } = this.state;
    return (
      <form action="/" className="form__inline" onSubmit={this.login}>
        { failed ? <div className="form__group">Login Failed</div> : ''}
        <div className="form__group" style={{ margin: '0px', marginLeft: '10px', marginRight: '10px' }}>
          <input
            id="username"
            name="username"
            type="text"
            placeholder="username"
            onChange={this.handleInputChange}
            value={username}
          />
        </div>
        <div className="form__group" style={{ margin: '0px', marginRight: '10px' }}>
          <input
            id="password"
            name="password"
            type="password"
            placeholder="password"
            onChange={this.handleInputChange}
            value={password}
          />
        </div>
        <button type="submit" className='primary-button'>Login</button>
      </form>
    );
  }

  renderLogout() {
    const { authUser } = this.props;
    return (
    <div>
      Logged in as {authUser.uid}
      <button onClick={this.logout} className='primary-button' style={{ marginLeft: '10px' }}>Logout</button>
    </div>
    );
  }
}

LoginForm.propTypes = {
  authUser: PropTypes.shape({ uid: PropTypes.string }),
  authStatus: PropTypes.oneOf([AUTHENTICATED, UNAUTHENTICATED, CHECKING_AUTHENTICATION]).isRequired,
  onAuthChange: PropTypes.func.isRequired
};

export default LoginForm;
