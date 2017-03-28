import React, { Component } from 'react';
import BuilderElement from './BuilderElement';

class BuilderSubPalette extends Component {
  allowDrop(event) {
    event.preventDefault();
  }

  onDrop(event) {
    event.preventDefault();
    let id = event.dataTransfer.getData('elementId');
    event.target.appendChild(document.getElementById(id));
  }

  render() {
    return (
      <div className="builder-subpalette"
      	onDragOver={this.allowDrop}
        onDrop={this.onDrop}>
        <BuilderElement />
      </div>
    );
  }
}

export default BuilderSubPalette;
