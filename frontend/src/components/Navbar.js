import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { NavLink } from 'react-router-dom';
import { onVisitExternalForm } from '../utils/handlers';

export default class Navbar extends Component {
  renderedNavbar = () => {
    const { isAuthenticated } = this.props;

    if (isAuthenticated) {
      return (
          <ul>
            <li><NavLink exact to="/">Home</NavLink></li>
            <li><NavLink to="/artifacts">Artifacts</NavLink></li>
            <li><NavLink to="/patients">Patients</NavLink></li>
            <li><NavLink to="/build">Workspace</NavLink></li>
            <li><NavLink to="/userguide">Documentation</NavLink></li>
            <li><a href="https://cds.ahrq.gov/contact-us" onClick={onVisitExternalForm}>Feedback</a></li>
          </ul>
      );
    }

    return (
        <ul>
          <li><NavLink exact to="/">Home</NavLink></li>
          <li><NavLink to="/userguide">Documentation</NavLink></li>
          <li><a href="https://cds.ahrq.gov/form/cds-authoring-tool-sign-up" onClick={onVisitExternalForm}>Sign Up</a></li>
          <li><a href="https://cds.ahrq.gov/contact-us" onClick={onVisitExternalForm}>Feedback</a></li>
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
