import React, { Component, PropTypes } from 'react';
import { DropTarget } from 'react-dnd';
import _ from 'lodash';
import axios from 'axios';
import TemplateInstance from './TemplateInstance';

class BuilderTarget extends Component {
  static propTypes = {
    connectDropTarget: PropTypes.func.isRequired,
    templateInstances: PropTypes.array.isRequired,
    updateSingleElement: PropTypes.func.isRequired,
    updateTemplateInstances: PropTypes.func.isRequired
  }

  deleteInstance(uniqueId) {
    const newElements = this.props.templateInstances;
    const index = newElements.findIndex(element => element.uniqueId === uniqueId);

    if (index > -1) {
      newElements.splice(index, 1);
      this.props.updateTemplateInstances(newElements);
    }
  }

  saveInstance(uniqueId) {
    const elementList = this.props.templateInstances;
    const index = elementList.findIndex(element => element.uniqueId === uniqueId);
    if (index > -1) {
      const element = elementList[index];
      console.log(element);
      axios.post('http://localhost:3001/api/expressions', element)
        .then((result) => {
          console.log('Done');
        })
        .catch((error) => {
          console.log('Fail');
        });
    }
  }

  showPresets(mongoId) {
    return axios.get(`http://localhost:3001/api/expressions/group/${mongoId}`);
  }

  render() {
    const { connectDropTarget } = this.props;
    return connectDropTarget(
      <section className="builder__canvas">
        {
          this.props.templateInstances.length === 0
          ? 'Drop content here.'
          : this.props.templateInstances.map(
            (element, index) =>
              <TemplateInstance
                key={element.uniqueId}
                templateInstance={element}
                otherInstances={this.props.templateInstances}
                deleteInstance={this.deleteInstance.bind(this)}
                saveInstance={this.saveInstance.bind(this)}
                showPresets={this.showPresets.bind(this)}
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
      TODO: clone is required because we are setting value on the parameter.
      This may not be the best approach
    */
    const clone = JSON.parse(JSON.stringify(item));
    clone.uniqueId = _.uniqueId(clone.id);
    props.updateTemplateInstances(props.templateInstances.concat(clone));
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
