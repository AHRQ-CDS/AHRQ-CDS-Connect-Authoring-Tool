import React, { Component, PropTypes } from 'react';
import Select from 'react-select';
import FontAwesome from 'react-fontawesome';

import TemplateInstance, { createTemplateInstance } from './TemplateInstance';
import ElementSelect from './ElementSelect';
import StringParameter from './parameters/StringParameter';

const requiredIf = (type, condition) => function (props) {
  const test = condition(props) ? type.isRequired : type;
  return test.apply(this, arguments);
};

class ConjunctionGroup extends Component {
  static propTypes = {
    root: PropTypes.bool,
    getPath: requiredIf(PropTypes.func, props => !props.root),
    name: PropTypes.string.isRequired,
    instance: PropTypes.object.isRequired,
    addInstance: PropTypes.func.isRequired,
    editInstance: PropTypes.func.isRequired,
    updateInstanceModifiers: PropTypes.func.isRequired,
    deleteInstance: PropTypes.func.isRequired,
    saveInstance: PropTypes.func.isRequired,
    getAllInstances: PropTypes.func.isRequired,
    showPresets: PropTypes.func.isRequired,
    categories: PropTypes.array.isRequired,
  }

  constructor(props) {
    super(props);

    const operationTemplates = this.props.categories.find(cat => cat.name === 'Operations').entries;
    this.types = operationTemplates.filter(template => template.conjunction);
  }

  handleTypeChange = (type) => {
    this.props.editInstance(this.props.name, type, this.getPath(), true);
  }

  handleNameChange = (state) => {
    this.props.editInstance(this.props.name, state, this.getPath());
  }

  addChild = (template) => {
    const instance = createTemplateInstance(template);
    this.props.addInstance(this.props.name, instance, this.getPath());
  }

  getPath = () => {
    if (this.props.root) {
      return this.props.instance.path;
    }
    return this.props.getPath(this.props.instance.uniqueId);
  }

  getChildsPath = (id) => {
    const childIndex = this.props.instance.childInstances.findIndex(instance => instance.uniqueId === id);
    return `${this.getPath()}.childInstances.${childIndex}`;
  }

  getNestingClassName = () => {
    const level = this.getPath().split('.').filter(pathSection => pathSection === 'childInstances').length;
    return level % 2 === 0 ? '' : 'conjunction-group--odd';
  }

  renderConjunctionSelect = i => (
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
        inputProps={{ 'aria-label': 'Select conjunction type' }}
      />
    )

  render() {
    const elementNameParam = this.props.instance.parameters.find(param => param.id === 'element_name');
    return (
      <div className={`conjunction-group ${this.getNestingClassName()}`}>
        <div className="conjunction-group__header">
          <div className="conjunction-group__header-title">
            {
              this.props.root ?
                null
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
              <div
                key={ instance.uniqueId }
                className="conjunction-group__conjunction-child">
                <ConjunctionGroup
                  getPath={ this.getChildsPath }
                  name={ this.props.name }
                  instance={ instance }
                  addInstance={ this.props.addInstance }
                  editInstance={ this.props.editInstance }
                  updateInstanceModifiers={ this.props.updateInstanceModifiers }
                  deleteInstance={ this.props.deleteInstance }
                  saveInstance={ this.props.saveInstance }
                  getAllInstances={ this.props.getAllInstances }
                  showPresets={ this.props.showPresets }
                  categories={ this.props.categories }
                />
                { this.renderConjunctionSelect(i) }
              </div>
            );
          }
          return (
              <div
                key={ instance.uniqueId }
                className="conjunction-group__conjunction-child">
                <TemplateInstance
                  getPath={ this.getChildsPath }
                  treeName={ this.props.name }
                  templateInstance={ instance }
                  otherInstances={ this.props.getAllInstances(this.props.name) }
                  editInstance={ this.props.editInstance }
                  updateInstanceModifiers={ this.props.updateInstanceModifiers }
                  deleteInstance={ this.props.deleteInstance }
                  saveInstance={ this.props.saveInstance }
                  showPresets={ this.props.showPresets }
                />
                { this.renderConjunctionSelect(i) }
              </div>
          );
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
