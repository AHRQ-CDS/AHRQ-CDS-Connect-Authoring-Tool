import React, { Component, PropTypes } from 'react';
import { DropTarget } from 'react-dnd';
import _ from 'lodash';
import TemplateInstance from './TemplateInstance';

class BuilderTarget extends Component {
  static propTypes = {
    connectDropTarget: PropTypes.func.isRequired,
    droppedElements: PropTypes.array.isRequired,
    updateSingleElement: PropTypes.func.isRequired,
    updateDroppedElements: PropTypes.func.isRequired
  }

  render() {
    const { connectDropTarget } = this.props;
    return connectDropTarget(
      <section className="builder__canvas">
        {
          this.props.droppedElements.length === 0
          ? 'Drop content here.'
          : this.props.droppedElements.map(
            (element, index) =>
              <TemplateInstance
                key={element.id + index}
                templateInstance={element}
                updateSingleElement={this.props.updateSingleElement} />
            )
        }
      </section>
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

    /*
      On drop, copy the element to create a new TemplateInstance.
      TODO: clone is required because we are setting value on the parameter. this may not be the best approach
    */
    const clone = JSON.parse(JSON.stringify(item));
    clone.uniqueId = _.uniqueId(clone.id);
    clone.parameters.forEach(param => {
      param.value = '';
    });
    props.updateDroppedElements(props.droppedElements.concat(clone));
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
