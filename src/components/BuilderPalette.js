import React, { Component } from 'react';
import FontAwesome from 'react-fontawesome';
import { NavLink } from 'react-router-dom';
import groups from '../data/groupings';

class BuilderPalette extends Component {


  render() {
    return (
      <nav className="builder__palette">
        <ul>
          {groups.map((g) => {
            const location = `/build/${g.id}`;
            return (
              <li key={g.name}>
                <NavLink to={location}>
                  <FontAwesome className='fa-fw' name={g.icon} />
                  {g.name}
                </NavLink>
              </li>
            );
          })}
        </ul>
      </nav>
    );
  }
}

export default BuilderPalette;
