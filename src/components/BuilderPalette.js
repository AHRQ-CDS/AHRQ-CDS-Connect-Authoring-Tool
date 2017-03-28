import React, { Component } from 'react';
import FontAwesome from 'react-fontawesome';

class BuilderPalette extends Component {
  render() {
    return (
      <nav className="builder-palette inline-nav">
        <ul>
          <li className="active"><FontAwesome className='fa-fw' name='users' /> Demographics</li>
          <li><FontAwesome className='fa-fw' name='stethoscope' /> Conditions</li>
          <li><FontAwesome className='fa-fw' name='bug' /> Symptoms</li>
          <li><FontAwesome className='fa-fw' name='medkit' /> Medications</li>
        </ul>
      </nav>
    );
  }
}

export default BuilderPalette;
