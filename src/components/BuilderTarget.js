import React, { Component, PropTypes } from 'react';
import { DropTarget } from 'react-dnd';
import axios from 'axios';
import Element from './Element';

class BuilderTarget extends Component {
  static propTypes = {
    connectDropTarget: PropTypes.func.isRequired,
  }

  constructor(props) {
    super(props);
    this.addItem = (item) => {
      const url = 'http://localhost:3001/api';

      // TODO: If item reflects what the schema expects, this isn't needed
      const postItem = {
        type: item.elementId,
        low: item.low,
        high: item.high
      };

      axios.post(`${url}/ageRange`, postItem)
        .then((result) => {
          const oldData = this.props.droppedElements;

          // Save the database id on dropped elements so they can be deleted later
          const newData = oldData.concat([{ name: item.elementId, dbId: result.data.item._id }]);
          this.props.updateDroppedElements(newData);
        });
    };
  }

  render() {
    const { connectDropTarget } = this.props;
    return connectDropTarget(
      <section className="builder__canvas">
        {this.props.droppedElements.length === 0 ? 'Drop content here.' : null}
        {this.props.droppedElements.map(
          (element, index) => <Element key={index + element.name}
                    name={element.name}
                    dbId={element.dbId}/>
        )}
      </section>,
    );
  }
}

const spec = {
  // describes how the drop target reacts to the drag and drop events
  drop(props, monitor, component) {
    /* Called when a compatible item is dropped on the target. You may either return
    undefined, or a plain object. If you return an object, it is going to become
    the drop result and will be available to the drag source in its endDrag method
    as monitor.getDropResult() */
    const item = monitor.getItem();
    component.addItem(item);
  },

  hover(props, monitor, component) {
    // Called when an item is hovered over the component

  },

  canDrop(props, monitor) {
    /* Specifying it is handy if you'd like to disable dropping based on some
    predicate over props or monitor.getItem() */
    return true;
  },
};

function collect(connect, monitor) {
  // inject these properties into the component
  return {
    connectDropTarget: connect.dropTarget(),
  };
}

export default DropTarget('element', spec, collect)(BuilderTarget);
