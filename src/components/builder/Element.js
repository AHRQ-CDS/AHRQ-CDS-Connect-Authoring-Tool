import React, { Component, PropTypes } from 'react';
import _ from 'lodash';
import FontAwesome from 'react-fontawesome';

class BuilderElement extends Component {
  static propTypes = {
    name: PropTypes.string.isRequired,
    template: PropTypes.object.isRequired,
    templateInstances: PropTypes.array.isRequired,
    updateTemplateInstances: PropTypes.func.isRequired
  }

  addElement() {
    /*
      TODO: clone is required because we are setting value on the parameter.
      This may not be the best approach
    */
    const clone = JSON.parse(JSON.stringify(this.props.template));
    clone.uniqueId = _.uniqueId(clone.id);

    this.props.updateTemplateInstances(this.props.templateInstances.concat(clone));
  }

  render() {
    return (
      <button className='element element--button' onClick={ () => this.addElement() }>
        {this.props.name} <FontAwesome className='fa-fw fa-plus' name='plus' />
      </button>
    );
  }
}

export default BuilderElement;
