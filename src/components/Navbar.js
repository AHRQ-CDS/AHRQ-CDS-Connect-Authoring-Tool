import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { NavLink } from 'react-router-dom';

export default class Navbar extends Component {
  renderedNavbar = () => {
    const { isAuthenticated } = this.props;

    if (isAuthenticated) {
      return (
          <ul>
            <li><NavLink exact to="/">Home</NavLink></li>
            <li><NavLink to="/artifacts">Artifacts</NavLink></li>
            <li><NavLink to="/build">Workspace</NavLink></li>
            {/* TODO: Add link. */}
            <li><a href="">Documentation</a></li>
            <li><a href="mailto:cds-authoring-list@lists.mitre.org">Feedback</a></li>
          </ul>
      );
    }

    return (
        <ul>
          <li><NavLink exact to="/">Home</NavLink></li>
          {/* TODO: Add link. */}
          <li><a href="">Request an Account</a></li>
          {/* TODO: Add link. */}
          <li><a href="">Documentation</a></li>
          <li><a href="mailto:cds-authoring-list@lists.mitre.org">Feedback</a></li>
        </ul>
    );
  }

  render() {
    return (
      <div className="navbar">
        <nav className="navbar__wrapper" aria-labelledby="cds-main-navigation">
          <div className="sr-only" id="cds-main-navigation">Main navigation</div>
          {this.renderedNavbar()}
        </nav>
      </div>
    );
  }
}

Navbar.propTypes = {
  isAuthenticated: PropTypes.bool.isRequired
};
