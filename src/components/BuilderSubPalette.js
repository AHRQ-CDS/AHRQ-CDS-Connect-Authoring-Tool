import React, { Component } from 'react';
import { DropTarget } from 'react-dnd';
import Element from './Element';

class BuilderSubPalette extends Component {
  removeItem(item) {
    const data = this.props.droppedElements;
    const indexToRemove = data.indexOf(item.elementId)
    data.splice(indexToRemove, 1);
    this.props.updateDroppedElements(data);
  }

  render() {
    const { connectDropTarget } = this.props;
    return connectDropTarget(
      <div aria-labelledby="palette-active-group" className="builder__subpalette">
        {this.props.selectedGroup.entries.map((element, index) =>
          <Element key={index + element} name={element} />
        )}
      </div>
    );
  }
}

const dropSpec = {
  // Called when compatible itme is dropped on the target
  drop(props, monitor, component) {
    const item = monitor.getItem();
    component.removeItem(item);
  },
}

function collect(connect, monitor) {
  return {
    connectDropTarget: connect.dropTarget(),
  };
}

export default DropTarget('element', dropSpec, collect)(BuilderSubPalette);