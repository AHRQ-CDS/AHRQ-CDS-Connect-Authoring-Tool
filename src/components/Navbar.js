import React from 'react';
import FontAwesome from 'react-fontawesome';
import { Link, NavLink } from 'react-router-dom';

export default () => (
  <header className="navbar">
    <Link to="/" className="navbar__logo">CDS Authoring Tool</Link>
    <nav className="navbar__nav">
      <ul>
        <li><NavLink to="/artifacts"><FontAwesome fixedWidth name='eye' /> View Artifacts</NavLink></li>
        <li><NavLink to="/build"><FontAwesome fixedWidth name='wrench' /> New Artifact</NavLink></li>
      </ul>
    </nav>
    <nav className="navbar__nav-secondary">
      <ul>
        <li><Link to="mailto:cds-authoring-list@lists.mitre.org">Feedback</Link></li>
      </ul>
    </nav>
  </header>
);
