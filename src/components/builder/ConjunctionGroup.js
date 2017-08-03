import React, { Component, PropTypes } from 'react';
import Select from 'react-select';
import FontAwesome from 'react-fontawesome';

import TemplateInstance from './TemplateInstance';
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
    booleanParameters: PropTypes.array.isRequired,
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
    this.props.editInstance(this.props.name, state, this.getPath(), false);
  }

  addChild = (template) => {
    const instance = this.props.createTemplateInstance(template);
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

  indentClickHandler = (instance) => {
    // Decide what type of conjunction group to create when indenting
    let type;
    if (this.props.instance.id === 'Or') {
      type = this.types.find(type => type.id === 'And');;
    } else { // Default is adding an OR
      type = this.types.find(type => type.id === 'Or');;
    }

    if(instance.conjunction) {
      // Indenting a conjunction group (and it's children)
      let newInstance = this.props.createTemplateInstance(type, [instance])
      let parentPath = this.getPath().split('.').slice(0,-2).join('.'); // Path of parent of conjunction group
      let index = Number(this.getPath().split('.').pop()) // Index of to indent group at
      let toAdd = [{instance: newInstance, path: parentPath, index: index}]
      this.props.deleteInstance(this.props.name, this.getPath(), toAdd);
    } else {
      // Indent a single templateInstance
      let newInstance = this.props.createTemplateInstance(type, [instance]);
      let index = Number(this.getChildsPath(instance.uniqueId).split('.').pop()); // Index to add new conjuction at
      let toAdd = [{instance: newInstance, path: this.getPath(), index: index}]
      this.props.deleteInstance(this.props.name, this.getChildsPath(instance.uniqueId), toAdd);
    }
  }

  outdentClickHandler = (instance) => {
    if(instance.conjunction) {
      // Outdenting a conjunction group. Removes the conjunction, readds each child to the conjunction's parent
      let toAdd = [];
      instance.childInstances.forEach( (child, i) => {
        // Path of the parent where items get added
        let parentPath = this.getPath().split('.').slice(0,-2).join('.');
        let index = this.getPath().split('.').pop(); // Index of the conjunction group
        index = Number(index) + i; // Index to add the conjunction's children at
        return toAdd.push({instance: child, path: parentPath, index: index})
      });
      this.props.deleteInstance(this.props.name, this.getPath(), toAdd);
    } else {
      // Outdenting a single templateInstance
      // Path of the parent of the group instance is coming from. This is where it will be readded
      let parentPath = this.getPath().split('.').slice(0,-2).join('.');
      let index = this.getPath().split('.').pop(); // Index of the parent
      index = Number(index) + 1; // Readd the child that is being outdented right below the parent it came from
      let toAdd = [{instance: instance, path: parentPath, index: index}]
      this.props.deleteInstance(this.props.name, this.getChildsPath(instance.uniqueId), toAdd);
    }
  }

  renderIndentButtons = (instance) => {
    // TODO: put aria attributes on the button
    // TODO: update css/placement of button to match designs

    // Indenting is always possible, outdent only possilbe when not at root already
    return (
      <span className="indent-outdent-container">
        { this.getPath() !== '' ?
          <button
            aria-label="outdent"
            className='element__hidebutton'
            onClick={()=> this.outdentClickHandler(instance)}>
            <FontAwesome name="dedent" />
          </button> :
          null
        }
        <button
          aria-label="indent"
          className='element__hidebutton'
          onClick={()=> this.indentClickHandler(instance)}>
          <FontAwesome name="indent" />
        </button>
      </span>
    )
  }

  renderConjunctionSelect = i => {
    return (
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
        inputProps={{ 'aria-label': 'Select conjunction type', 'title': 'Select conjunction type' }}
      />
    )
}

  render() {
    const elementNameParam = this.props.instance.parameters.find(param => param.id === 'element_name');
    return (
      <div className={`conjunction-group ${this.getNestingClassName()}`}>
        {
          !this.props.root &&
          <div className="conjunction-group__header">
            <div className="conjunction-group__header-title">
              <StringParameter
                id={ elementNameParam.id }
                name={ elementNameParam.name }
                value={ elementNameParam.value }
                updateInstance={ this.handleNameChange }
              />
            </div>
            <div className="conjunction-group__button-bar">
              {this.renderIndentButtons(this.props.instance)}
              <button
                onClick={ () => this.props.deleteInstance(this.props.name, this.getPath()) }
                aria-label={ `remove ${this.props.instance.name}` }>
                <FontAwesome fixedWidth name='close'/>
              </button>
            </div>
          </div>
        }
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
                  booleanParameters={ this.props.booleanParameters }
                  createTemplateInstance={ this.props.createTemplateInstance }
                  addInstance={ this.props.addInstance }
                  editInstance={ this.props.editInstance }
                  updateInstanceModifiers={ this.props.updateInstanceModifiers }
                  deleteInstance={ this.props.deleteInstance }
                  saveInstance={ this.props.saveInstance }
                  getAllInstances={ this.props.getAllInstances }
                  showPresets={ this.props.showPresets }
                  setPreset={ this.props.setPreset }
                  categories={ this.props.categories }
                  subPopulationIndex={ this.props.subPopulationIndex }
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
                  setPreset={ this.props.setPreset }
                  subpopulationIndex={ this.props.subPopulationIndex }
                  renderIndentButtons={ this.renderIndentButtons }
                />
                { this.renderConjunctionSelect(i) }
              </div>
          );
        }) }
        <ElementSelect
          categories={ this.props.categories }
          onSuggestionSelected={ this.addChild }
          booleanParameters={ this.props.booleanParameters }
        />
      </div>
    );
  }
}

export default ConjunctionGroup;
