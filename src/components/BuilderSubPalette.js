import React, { Component } from 'react';
import { DropTarget } from 'react-dnd';
import axios from 'axios';
import Element from './Element';

class BuilderSubPalette extends Component {
  removeItem(item) {
    const url = 'http://localhost:3001/api';

    axios.delete(`${url}/ageRange/${item.dbId}`)
      .then((result) => {
        const data = this.props.droppedElements;
        let indexToRemove = -1;
        for (let i = 0; i < data.length; i++) {
          const id = data[i].dbId;
          if (id === item.dbId) {
            indexToRemove = i;
          }
        }
        data.splice(indexToRemove, 1);
        this.props.updateDroppedElements(data);
      });
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
  // Called when compatible item is dropped on the target
  drop(props, monitor, component) {
    const item = monitor.getItem();
    component.removeItem(item);
  },
};

function collect(connect, monitor) {
  return {
    connectDropTarget: connect.dropTarget(),
  };
}

export default DropTarget('element', dropSpec, collect)(BuilderSubPalette);
