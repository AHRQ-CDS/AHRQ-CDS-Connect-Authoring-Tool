import React, { Component } from 'react';
import Element from './Element';

class BuilderSubPalette extends Component {
  render() {
    return (
      <div className="builder__subpalette">
        {this.props.group.entries.map((element, index) => {
          return <Element key={index + element} name={element} />;
        })}
      </div>
    );
  }
}

export default BuilderSubPalette;
