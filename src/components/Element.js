import React, { Component, PropTypes } from 'react';
import { DragSource } from 'react-dnd';
import FontAwesome from 'react-fontawesome';

class BuilderElement extends Component {
  static propTypes = {
    name: PropTypes.string.isRequired,
    connectDragSource: PropTypes.func.isRequired,
    connectDragPreview: PropTypes.func.isRequired
  }

  constructor(props) {
    super(props);
    this.state = {
      isActive: false
    };
  }

  render() {
    const { connectDragSource, connectDragPreview } = this.props;
    return connectDragPreview(
      <div className={this.state.isActive ? 'element is-active' : 'element'}>
        {connectDragSource(
          <button
            onClick={() => this.setState({ isActive: true })}
            onFocus={() => this.setState({ isActive: true })}
            onBlur={() => this.setState({ isActive: false })}
            onMouseOver={() => this.setState({ isActive: true })}
            onMouseOut={() => this.setState({ isActive: false })}
            className="element__dragger" aria-label="move item"><FontAwesome fixedWidth name='arrows' /></button>,
          { dropEffect: 'copy' }
        )}
        {this.props.name}
      </div>
    );
  }
}

const spec = {
  // describes how the drag source reacts to the drag and drop events
  beginDrag(props, monitor, component) {
    component.setState({ isActive: true });
    // You must return a plain JavaScript object describing the data being dragged.
    return {
      elementId: props.name,
      low: 40,
      high: 79, // TODO: The appropriate info will need to be on props
      dbId: props.dbId
    };
  },

  endDrag(props, monitor, component) {
    /* If it was handled, and the drop target specified a drop result by returning a
    plain object from its drop() method, it will be available as monitor.getDropResult().
    This method is a good place to fire a Flux action. */
    // const item = monitor.getItem();
    // const dropResult = monitor.getDropResult();
    // console.log(item);
    // console.log(dropResult);
    // Componenet will be null if it is unmounted after the drag (i.e. remove from workspace)
    if (component !== null) {
      component.setState({ isActive: false });
    }
  },

  canDrag(props, monitor) {
    // Specifying it is handy if you'd like to disable dragging based on some predicate over props
    return true;
  },

  /* isDragging(props, monitor) {
    // By default, only the drag source that initiated the drag operation is considered
    to be dragging. You can override this behavior by defining a custom isDragging method.
    It might return something like props.id === monitor.getItem().id. Do this if the
    original component may be unmounted during the dragging and later "resurrected" with
    a different parent. For example, when moving a card across the lists in a Kanban board,
    you want it to retain the dragged appearance—even though technically, the component
    gets unmounted and a different one gets mounted every time you move it to another list.
    return true;
  } */
};

function collect(connect, monitor) {
  // inject these properties into the component
  return {
    connectDragSource: connect.dragSource(),
    connectDragPreview: connect.dragPreview()
  };
}

export default DragSource('element', spec, collect)(BuilderElement);
