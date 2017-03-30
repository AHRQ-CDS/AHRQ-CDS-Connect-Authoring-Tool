import React, { Component } from 'react';
import FontAwesome from 'react-fontawesome';

class BuilderElement extends Component {
	dragStarted(event) {
    event.dataTransfer.setData('elementId', event.target.id);
  }

  render() {
    return (
      <div className="builder-element"
        id={this.props.name}
      	draggable="true"
      	onDragStart={this.dragStarted}>
        {this.props.name}
      </div>
    );
  }
}

export default BuilderElement;
