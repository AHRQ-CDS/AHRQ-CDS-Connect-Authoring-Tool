import React, { Component } from 'react';
import BuilderSubPalette from './BuilderSubPalette';
import BuilderPalette from './BuilderPalette';

class BuilderPage extends Component {
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
      <div className="builder">
        <BuilderPalette />
        <BuilderSubPalette />

        <section className="main"
          onDragOver={this.allowDrop}
          onDrop={this.onDrop}>
          Drop content here.
        </section>
      </div>
    );
  }
}

export default BuilderPage;
