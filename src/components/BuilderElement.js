import React, { Component } from 'react';
import FontAwesome from 'react-fontawesome';

class BuilderElement extends Component {
	dragStarted(event) {
    event.dataTransfer.setData('elementId', event.target.id);
  }
  
  render() {
    return (
      <div className="builder-element"
        id="ageRange"
      	draggable="true"
      	onDragStart={this.dragStarted}>
        <FontAwesome className='fa-fw' name='clock-o' /> Age Range
      </div>
    );
  }
}

export default BuilderElement;
