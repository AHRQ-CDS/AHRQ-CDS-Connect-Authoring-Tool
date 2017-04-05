import React, { Component, PropTypes } from 'react';
import { DropTarget } from 'react-dnd';
import Element from './Element';

class BuilderTarget extends Component {
  static propTypes = {
    connectDropTarget: PropTypes.func.isRequired,
  }

  constructor(props) {
    super(props);
    this.addItem = (item) => {
      const oldData = this.state.droppedElements;
      const newData = oldData.concat([item.elementId]);

      /* this.state.droppedElements is set up to mimic the information that is received when
      rendering the SubPalette */
      /* TODO: If more information is added to identify and render those elements,
      state.droppedElements may need this information, so it may be needed on the drag item */
      this.setState({ droppedElements: newData });
    };

    this.state = {
      droppedElements: []
    };
  }

  render() {
    const { connectDropTarget } = this.props;
    return connectDropTarget(
      <section className="builder__canvas">
        {this.state.droppedElements.length === 0 ? 'Drop content here.' : null}
        {this.state.droppedElements.map(
          (element, index) => <Element key={index + element} name={element} />
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
