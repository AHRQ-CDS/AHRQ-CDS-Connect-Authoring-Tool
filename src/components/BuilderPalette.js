import React, { Component } from 'react';
import FontAwesome from 'react-fontawesome';
import { NavLink } from 'react-router-dom';
import groups from '../data/groupings';

class BuilderPalette extends Component {
  exportFile() {
    let finalText = 'String to save!';

    let saveElement = document.createElement('a');
    saveElement.href = 'data:text/plain,' + encodeURIComponent(finalText);
    saveElement.download = 'SaveMe.txt';
    saveElement.click();
  }

  render() {
    return (
      <nav className="builder-palette inline-nav">
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
          <li onClick={this.exportFile}><FontAwesome className='fa-fw' name='floppy-o' /> Save </li>
        </ul>
      </nav>
    );
  }
}

export default BuilderPalette;
