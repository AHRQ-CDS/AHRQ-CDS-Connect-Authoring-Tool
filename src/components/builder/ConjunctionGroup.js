import React, { Component, PropTypes } from 'react';
import _ from 'lodash';
import Select from 'react-select';
import FontAwesome from 'react-fontawesome';

import TemplateInstance, { createTemplateInstance } from './TemplateInstance';
import ElementSelect from './ElementSelect';
import StringParameter from './parameters/StringParameter';

const requiredIf = (type, condition) => {
  return function(props) {
    var test = condition(props) ? type.isRequired : type;
    return test.apply(this, arguments);
  };
};

class ConjunctionGroup extends Component {
  static propTypes = {
    root: PropTypes.bool,
    getPath: requiredIf(PropTypes.func, props => !props.root),
    instance: PropTypes.object.isRequired,
    addInstance: PropTypes.func.isRequired,
    editInstance: PropTypes.func.isRequired,
    deleteInstance: PropTypes.func.isRequired,
    saveInstance: PropTypes.func.isRequired,
    getAllInstances: PropTypes.func.isRequired,
    showPresets: PropTypes.func.isRequired,
    categories: PropTypes.array.isRequired
  }

  constructor(props) {
    super(props);

    const operationTemplates = this.props.categories.find(cat => cat.name === 'Operations').entries;
    this.types = operationTemplates.filter(template => template.conjunction);
  }

  handleTypeChange = (type) => {
    this.props.editInstance(type, this.getPath(), true);
  }

  handleNameChange = (state) => {
    this.props.editInstance(state, this.getPath());
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
      <div className={this.props.root ? "conjunction-group conjunction-group--root" : "conjunction-group"}>
        <div className="conjunction-group__header">
          <div className="conjunction-group__header-title">
            {
              this.props.root ?
                <h2 className="conjunction-group__root-title">{ elementNameParam.value }</h2>
              :
                <StringParameter
                  id={ elementNameParam.id }
                  name={ elementNameParam.name }
                  value={ elementNameParam.value }
                  updateInstance={ this.handleNameChange }
                />
            }
          </div>
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
        { this.props.instance.childInstances.map((instance, i) => {
          if (instance.conjunction) {
            return (
              <ConjunctionGroup
                key={ instance.uniqueId }
                getPath={ this.getChildsPath }
                instance={ instance }
                addInstance={ this.props.addInstance }
                editInstance={ this.props.editInstance }
                deleteInstance={ this.props.deleteInstance }
                saveInstance={ this.props.saveInstance }
                getAllInstances={ this.props.getAllInstances }
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
                  otherInstances={ this.props.getAllInstances() }
                  editInstance={ this.props.editInstance }
                  deleteInstance={ this.props.deleteInstance }
                  saveInstance={ this.props.saveInstance }
                  showPresets={ this.props.showPresets }
                />
                <Select
                  className="conjunction-group__conjunction-select"
                  name={ `conjunction-select-${i}` }
                  value={ this.props.instance.name }
                  valueKey="name"
                  labelKey="name"
                  placeholder="Select one"
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
          categories={ this.props.categories }
          onSuggestionSelected={ this.addChild }
        />
      </div>
    );
  }
}

export default ConjunctionGroup;
