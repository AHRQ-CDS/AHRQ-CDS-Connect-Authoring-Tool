import React, { Component } from 'react';
import FontAwesome from 'react-fontawesome';

class Element extends Component {
	dragStarted(event) {
    event.dataTransfer.setData('elementId', event.target.id);
  }

  render() {
    return (
      <div className="element"
        id="ageRange"
      	draggable="true"
      	onDragStart={this.dragStarted}>
        <FontAwesome className='fa-fw' name='clock-o' /> Age Range
        <br/> <em>(40 - 79 yo)</em>
      </div>
    );
  }
}

export default Element;
