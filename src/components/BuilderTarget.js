import React, { Component, PropTypes } from 'react';
import { DropTarget } from 'react-dnd';

class BuilderTarget extends Component {
  static propTypes = {
    connectDropTarget: PropTypes.func.isRequired
  }

  addBox(item) {
    console.log("Do something with this item");
  }

  render() {
    const { connectDropTarget } = this.props;
    return connectDropTarget(
      <section className="builder__canvas">
        Drop content here.
      </section>
    );
  }
}

const spec = {
  // describes how the drop target reacts to the drag and drop events
  drop(props, monitor, component) {
    // Called when a compatible item is dropped on the target. You may either return undefined, or a plain object. If you return an object, it is going to become the drop result and will be available to the drag source in its endDrag method as monitor.getDropResult()
    const item = monitor.getItem();
    component.addBox(item);
  },

  hover(props, monitor, component) {
    // Called when an item is hovered over the component
    return;
  },

  canDrop(props, monitor) {
    // Specifying it is handy if you'd like to disable dropping based on some predicate over props or monitor.getItem()
    return true;
  }
}

function collect(connect, monitor) {
  // inject these properties into the component
  return {
    connectDropTarget: connect.dropTarget()
  };
}

export default DropTarget('element', spec, collect)(BuilderTarget);
