import React, { Component, PropTypes } from 'react';
import FontAwesome from 'react-fontawesome';
import { createTemplateInstance } from './TemplateInstance';

class BuilderElement extends Component {
  static propTypes = {
    name: PropTypes.string.isRequired,
    template: PropTypes.object.isRequired,
    templateInstances: PropTypes.array.isRequired,
    updateTemplateInstances: PropTypes.func.isRequired
  }

  addElement() {
    const instance = createTemplateInstance(this.props.template);

    this.props.updateTemplateInstances(this.props.templateInstances.concat(instance));
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
