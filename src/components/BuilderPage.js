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
        <header className="builder__header">
          <h2 className="builder__heading">Model title that's kind of long</h2>

          <div className="builder__buttonbar">
            <button className="builder__savebutton is-unsaved">Save</button>
            <button className="builder__deletebutton">Delete</button>
          </div>   
        </header>
        <div className="builder__sidebar">
          <BuilderPalette />
          <BuilderSubPalette />
        </div>
        <section className="builder__canvas"
          onDragOver={this.allowDrop}
          onDrop={this.onDrop}>
          Drop content here.
        </section>
      </div>
    );
  }
}

export default BuilderPage;
