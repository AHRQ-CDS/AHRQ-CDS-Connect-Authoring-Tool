import React, { Component } from 'react';
import FontAwesome from 'react-fontawesome';

class BuilderElement extends Component {
  render() {
    return (
      <div className="builder-element">
        <FontAwesome className='fa-fw' name='clock-o' /> Age Range
      </div>
    );
  }
}

export default BuilderElement;
