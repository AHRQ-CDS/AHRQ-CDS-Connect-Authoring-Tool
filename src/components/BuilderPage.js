import React, { Component } from 'react';
import BuilderSubPalette from './BuilderSubPalette';
import BuilderPalette from './BuilderPalette';

class BuilderPage extends Component {
  render() {
    return (
      <div className="builder">
        <BuilderPalette />
        <BuilderSubPalette />

        <section className="main">
          Drop content here.
        </section>
      </div>
    );
  }
}

export default BuilderPage;
