import React, { Component } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { AUTHENTICATED, UNAUTHENTICATED, CHECKING_AUTHENTICATION, getCurrentUser } from '../lib/auth';
import Authentication from './auth/Authentication';

class Navbar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      status: CHECKING_AUTHENTICATION
    };

    this.updateAuth();
  }

  updateAuth = () => {
    getCurrentUser()
      .then(user => this.setState({ user, status: AUTHENTICATED }))
      .catch(() => this.setState({ user: null, status: UNAUTHENTICATED }));
  }

  render() {
    const { user, status } = this.state;
    return (
      <header className="navbar">
        <a className="skiplink" href="#maincontent">Skip to main content</a>
        <h1 className="navbar__logo"><Link to="/">CDS Authoring Tool</Link></h1>
        { status === AUTHENTICATED ?
          <nav className="navbar__nav">
            <ul>
              <li><NavLink to="/artifacts">Artifacts</NavLink></li>
              <li><NavLink to="/build">Workspace</NavLink></li>
            </ul>
          </nav>
        : '' }
        <nav className="navbar__nav-secondary">
          <ul>
            <li><Authentication authStatus={status} authUser={user} onAuthChange={this.updateAuth}/></li>
            <li><a href="mailto:cds-authoring-list@lists.mitre.org">Feedback</a></li>
          </ul>
        </nav>
      </header>
    );
  }
}

export default Navbar;
