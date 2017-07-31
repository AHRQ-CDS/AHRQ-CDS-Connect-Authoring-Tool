import React from 'react';
import { Link, NavLink } from 'react-router-dom';

export default () => (
  <header className="navbar">
    <a className="skiplink" href="#maincontent">Skip to main content</a>
    <h1 className="navbar__logo"><Link to="/">CDS Authoring Tool</Link></h1>
    <nav className="navbar__nav">
      <ul>
        <li><NavLink to="/artifacts">Artifacts</NavLink></li>
        <li><NavLink to="/build">New Artifact</NavLink></li>
      </ul>
    </nav>
    <nav className="navbar__nav-secondary">
      <ul>
        <li><a href="mailto:cds-authoring-list@lists.mitre.org">Feedback</a></li>
      </ul>
    </nav>
  </header>
);
