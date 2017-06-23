import React, { Component, PropTypes } from 'react';
import _ from 'lodash';
import Select from 'react-select';
import FontAwesome from 'react-fontawesome';

import TemplateInstance, { createTemplateInstance } from './TemplateInstance';
import ElementSelect from './ElementSelect';
import StringParameter from './parameters/StringParameter';

class ConjunctionGroup extends Component {
  static propTypes = {
    instance: PropTypes.object.isRequired,
    saveInstance: PropTypes.func.isRequired,
    deleteInstance: PropTypes.func.isRequired,
    templateInstances: PropTypes.array.isRequired,
    updateSingleInstance: PropTypes.func.isRequired,
    updateTemplateInstances: PropTypes.func.isRequired,
    showPresets: PropTypes.func.isRequired,
    categories: PropTypes.array.isRequired
  }

  constructor(props) {
    super(props);

    const operationTemplates = this.props.categories.find(cat => cat.name === 'Operations').entries;
    this.types = operationTemplates.filter(template => template.conjunction);
  }

  handleTypeChange = (type) => {
    this.props.updateSingleInstance(type, this.getPath(), true);
  }

  handleNameChange = (state) => {
    this.props.updateSingleInstance(state, this.getPath());
  }

  addChild = (template) => {
    let instance = createTemplateInstance(template);
    this.props.addInstance(instance, this.getPath());
  }

  getPath = () => {
    if (this.props.root) {
      return this.props.instance.path;
    } else {
      return this.props.getPath(this.props.instance.uniqueId);
    }
  }

  getChildsPath = (id) => {
    const childIndex = this.props.instance.childInstances.findIndex(instance => instance.uniqueId === id);
    return this.getPath() + '.childInstances.' + childIndex;
  }

  render() {
    const elementNameParam = this.props.instance.parameters.find(param => param.id === 'element_name');
    return (
      <div className="conjunction-group">
        <div className="conjunction-group__header">
          <span>
            {this.props.instance.name}
          </span>
          <div className="conjunction-group__button-bar">
            {
              !this.props.root &&
                <button
                  onClick={ () => this.props.deleteInstance(this.getPath()) }
                  aria-label={ `remove ${this.props.instance.name}` }>
                  <FontAwesome fixedWidth name='close'/>
                </button>
            }
          </div>
        </div>
        <StringParameter
          id={ elementNameParam.id }
          name={ elementNameParam.name }
          value={ elementNameParam.value }
          updateInstance={ this.handleNameChange }
        />
        { this.props.instance.childInstances.map((instance, i) => {
          if (!instance) {
            return null;
          }
          if (instance.conjunction) {
            return (
              <ConjunctionGroup
                getPath={ this.getChildsPath }
                key={ instance.uniqueId }
                instance={ instance }
                addInstance={ this.props.addInstance }
                saveInstance={ this.props.saveInstance }
                deleteInstance={ this.props.deleteInstance }
                getChildrenOfInstance={ this.props.getChildrenOfInstance }
                templateInstances={ this.props.templateInstances }
                updateSingleInstance={ this.props.updateSingleInstance }
                updateTemplateInstances={ this.props.updateTemplateInstances }
                showPresets={ this.props.showPresets }
                categories={ this.props.categories }
              />
            );
          } else {
            return (
              <div
                key={ instance.uniqueId }
                className="conjunction-group__conjunction">
                <TemplateInstance
                  getPath={ this.getChildsPath }
                  templateInstance={ instance }
                  otherInstances={ this.props.instance.childInstances }
                  saveInstance={ this.props.saveInstance }
                  deleteInstance={ this.props.deleteInstance }
                  updateSingleInstance={ this.props.updateSingleInstance }
                  showPresets={ this.props.showPresets }
                />
                <Select
                  className="conjunction-group__conjunction-select"
                  name={ `conjunction-select-${i}` }
                  value={ this.props.instance.name }
                  valueKey="name"
                  labelKey="name"
                  searchable={ false }
                  clearable={ false }
                  options={ this.types }
                  onChange={ this.handleTypeChange }
                  inputProps={{ 'aria-label': "Select conjunction type" }}
                />
              </div>
            );
          }
        }) }
        <ElementSelect
          parentId={ this.props.instance.uniqueId }
          categories={ this.props.categories }
          templateInstances={ this.props.templateInstances }
          onSuggestionSelected={ this.addChild }
        />
      </div>
    );
  }
}

export default ConjunctionGroup;
