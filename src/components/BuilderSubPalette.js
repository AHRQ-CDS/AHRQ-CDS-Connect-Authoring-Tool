import React, { Component } from 'react';
import BuilderElement from './BuilderElement';

class BuilderSubPalette extends Component {
  render() {
    return (
      <div className="builder-subpalette">
        {this.props.group.entries.map((element, index) => {
          return <BuilderElement key={index + element} name={element} />;
        })}
      </div>
    );
  }
}

export default BuilderSubPalette;
