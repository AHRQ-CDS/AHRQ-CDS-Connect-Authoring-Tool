import React, { Component } from 'react';
import Element from './Element';

class BuilderSubPalette extends Component {
  render() {
    return (
      <div aria-labelledby="palette-active-group" className="builder__subpalette">
        {this.props.selectedGroup.entries.filter(e => !e.suppress).map((element, index) =>
          <Element
            key={index + element}
            name={element.name}
            template={element}
            templateInstances={this.props.templateInstances}
            updateTemplateInstances={this.props.updateTemplateInstances}/>
        )}
      </div>
    );
  }
}

export default BuilderSubPalette;
