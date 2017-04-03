import React, { Component } from 'react';
import Element from './Element';

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
      <div className="builder__subpalette"
      	onDragOver={this.allowDrop}
        onDrop={this.onDrop}>
        <Element />
      </div>
    );
  }
}

export default BuilderSubPalette;
