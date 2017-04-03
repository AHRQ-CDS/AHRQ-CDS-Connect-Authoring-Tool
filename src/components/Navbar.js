import React from 'react';
import FontAwesome from 'react-fontawesome';
import { NavLink } from 'react-router-dom';

export default () => (
  <header className="navbar">
    <span className="navbar__logo">CDS Authoring Tool</span>
    <nav className="navbar__nav">
      <ul>
        <li><NavLink to="/"><FontAwesome className='fa-fw' name='home' /> Home</NavLink></li>
        <li><NavLink to="/author"><FontAwesome className='fa-fw' name='user' /> Author Info</NavLink></li>
        <li><NavLink to="/build"><FontAwesome className='fa-fw' name='wrench' /> Go To Builder</NavLink></li>
      </ul>
    </nav>
  </header>
)
