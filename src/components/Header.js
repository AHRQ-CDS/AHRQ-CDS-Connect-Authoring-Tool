import React from 'react';
import FontAwesome from 'react-fontawesome';
import { Link, NavLink } from 'react-router-dom';

export default () => (
  <header className="cds-header">
    <Link to="/" className="cds-logo">CDS Authoring Tool</Link>
    <nav className="cds-nav inline-nav">
      <ul>
        <li><NavLink to="/author"><FontAwesome className='fa-fw' name='user' /> Author Info</NavLink></li>
        <li><NavLink to="/build"><FontAwesome className='fa-fw' name='wrench' /> Go To Builder</NavLink></li>
      </ul>
    </nav>
  </header>
)
