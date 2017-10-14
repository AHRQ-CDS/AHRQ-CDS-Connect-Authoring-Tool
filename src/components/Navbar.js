import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { NavLink } from 'react-router-dom';

export default class Navbar extends Component {
  renderedNavbar = () => {
    // const { isAuthenticated } = this.props; // TODO: add
    const isAuthenticated = true; // TODO: remove

    if (isAuthenticated) {
      return (
        <nav className="navbar__wrapper" aria-labelledby="cds-main-navigation">
          <div className="sr-only" id="cds-main-navigation">Main navigation</div>

          <ul>
            <li><NavLink exact to="/">Home</NavLink></li>
            <li><NavLink to="/artifacts">Artifacts</NavLink></li>
            <li><NavLink to="/build">Workspace</NavLink></li>
          </ul>
        </nav>
      );
    }

    return null;
  }

  render() {
    return (
      <div className="navbar">
        {this.renderedNavbar()}
      </div>
    );
  }
}

Navbar.propTypes = {
  isAuthenticated: PropTypes.bool.isRequired
};
