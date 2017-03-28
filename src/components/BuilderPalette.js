import React, { Component } from 'react';
import FontAwesome from 'react-fontawesome';

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
          <li className="active"><FontAwesome className='fa-fw' name='users' /> Demographics</li>
          <li><FontAwesome className='fa-fw' name='stethoscope' /> Conditions</li>
          <li><FontAwesome className='fa-fw' name='bug' /> Symptoms</li>
          <li><FontAwesome className='fa-fw' name='medkit' /> Medications</li>
          <li onClick={this.exportFile}><FontAwesome className='fa-fw' name='floppy-o' /> Save </li>
        </ul>
      </nav>
    );
  }
}

export default BuilderPalette;
