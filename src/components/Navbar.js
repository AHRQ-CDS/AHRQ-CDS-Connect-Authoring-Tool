import React from 'react';
import FontAwesome from 'react-fontawesome';
import { Link, NavLink } from 'react-router-dom';

export default () => (
  <header className="navbar">
    <Link to="/" className="navbar__logo">CDS Authoring Tool</Link>
    <nav className="navbar__nav">
      <ul>
        <li><NavLink to="/author"><FontAwesome fixedWidth name='user' /> Author Info</NavLink></li>
        <li><NavLink to="/build"><FontAwesome fixedWidth name='wrench' /> Go To Builder</NavLink></li>
      </ul>
    </nav>
  </header>
)
