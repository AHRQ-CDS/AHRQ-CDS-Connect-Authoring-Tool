import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Select from 'react-select';
import FontAwesome from 'react-fontawesome';

import TemplateInstance from './TemplateInstance';
import ElementSelect from './ElementSelect';
import StringParameter from './parameters/StringParameter';

import createTemplateInstance from '../../utils/templates';
import requiredIf from '../../utils/prop_types';

export default class ConjunctionGroupNew extends Component {
  handleTypeChange = (type) => {
    this.props.editInstance(this.props.treeName, type, this.getPath(), true);
  }

  handleNameChange = (state) => {
    this.props.editInstance(this.props.treeName, state, this.getPath(), false);
  }

  addChild = (template) => {
    const instance = createTemplateInstance(template);
    this.props.addInstance(this.props.treeName, instance, this.getPath());
  }

  // if root component, returns root artifact path, otherwise calls child's getPath function with artifact id
  getPath() {
    if (this.props.root) {
      return this.props.instance.path;
    }
    return this.props.getPath(this.props.instance.uniqueId);
  }

  getChildsPath = (id) => {
    const artifactTree = this.props.instance;
    const childIndex = artifactTree.childInstances.findIndex(instance => instance.uniqueId === id);
    return `${this.getPath()}.childInstances.${childIndex}`;
  }

  // returns class name for odd conjunction groups determined from length of child instances
  getNestingClassName = () => {
    const level = this.getPath().split('.').filter(pathSection => pathSection === 'childInstances').length;
    return level % 2 === 0 ? '' : 'conjunction-group--odd';
  }

  // ----------------------- CLICK HANDLERS -------------------------------- //

  indentClickHandler = (instance) => {
    const { treeName, artifact, templates } = this.props;
    const operationTemplates = templates.find(template => template.name === 'Operations').entries;
    const conjunctionTemplates = operationTemplates.filter(template => template.conjunction);

    // Decide what type of conjunction group to create when indenting
    let conjunctionType;
    if (artifact[treeName].id === 'Or') {
      conjunctionType = conjunctionTemplates.find(template => template.id === 'And');
    } else { // Default is adding an OR
      conjunctionType = conjunctionTemplates.find(template => template.id === 'Or');
    }

    if (instance.conjunction) {
      // Indenting a conjunction group (and it's children)
      const newInstance = createTemplateInstance(conjunctionType, [instance]);
      const parentPath = this.getPath().split('.').slice(0, -2).join('.'); // Path of parent of conjunction group
      const index = Number(this.getPath().split('.').pop()); // Index of to indent group at
      const toAdd = [{ instance: newInstance, path: parentPath, index }];

      this.props.deleteInstance(treeName, this.getPath(), toAdd);
    } else {
      // Indent a single templateInstance
      const newInstance = createTemplateInstance(conjunctionType, [instance]);
      const index = Number(this.getChildsPath(instance.uniqueId).split('.').pop()); // Index to add new conjunction at
      const toAdd = [{ instance: newInstance, path: this.getPath(), index }];

      this.props.deleteInstance(treeName, this.getChildsPath(instance.uniqueId), toAdd);
    }
  }

  outdentClickHandler = (instance) => {
    if (instance.conjunction) {
      // Outdenting a conjunction group. Removes the conjunction, readds each child to the conjunction's parent
      const toAdd = [];
      instance.childInstances.forEach((child, i) => {
        // Path of the parent where items get added
        const parentPath = this.getPath().split('.').slice(0, -2).join('.');
        let index = this.getPath().split('.').pop(); // Index of the conjunction group
        index = Number(index) + i; // Index to add the conjunction's children at
        return toAdd.push({ instance: child, path: parentPath, index });
      });

      this.props.deleteInstance(this.props.treeName, this.getPath(), toAdd);
    } else {
      // Outdenting a single templateInstance
      // Path of the parent of the group instance is coming from. This is where it will be readded
      const parentPath = this.getPath().split('.').slice(0, -2).join('.');
      let index = this.getPath().split('.').pop(); // Index of the parent
      index = Number(index) + 1; // Readd the child that is being outdented right below the parent it came from
      const toAdd = [{ instance, path: parentPath, index }];
      this.props.deleteInstance(this.props.treeName, this.getChildsPath(instance.uniqueId), toAdd);
    }
  }

  // ----------------------- RENDERS --------------------------------------- //

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
      inputProps={{ 'aria-label': 'Select conjunction type', title: 'Select conjunction type' }}
    />
  )

  renderIndentButtons(instance) {
    // Indenting is always possible, outdent only possible when not at root already
    return (
      <span className="indent-outdent-container">
        { this.getPath() !== '' ?
          <button
            aria-label="outdent"
            className='element__hidebutton secondary-button'
            onClick={() => this.outdentClickHandler(instance)}>
            <FontAwesome name="dedent" />
          </button> :
          null
        }
        <button
          aria-label="indent"
          className='element__hidebutton secondary-button'
          onClick={() => this.indentClickHandler(instance)}>
          <FontAwesome name="indent" />
        </button>
      </span>
    );
  }

  renderHeader() {
    const elementNameParam = this.props.instance.parameters.find(param => param.id === 'element_name');

    // return header only if not root component
    if (!this.props.root) {
      return (
        <div className="conjunction-group__header">
          <div className="conjunction-group__header-title">
            <StringParameter
              id={elementNameParam.id}
              name={elementNameParam.name}
              value={elementNameParam.value}
              updateInstance={this.handleNameChange}
            />
          </div>

          <div className="conjunction-group__button-bar">
            {this.renderIndentButtons(this.props.instance)}

            <button
              onClick={() => this.props.deleteInstance(this.props.treeName, this.getPath())}
              aria-label={`remove ${this.props.instance.name}`}>
              <FontAwesome fixedWidth name='close'/>
            </button>
          </div>
        </div>
      );
    }

    return null;
  }

  renderChildren() {
    const { artifact, treeName, templates, deleteInstance } = this.props;

    return this.props.instance.childInstances.map((instance, i) => {
      // return null if child instance conjunction is false
      if (instance.conjunction) {
        return (
          <div key={instance.uniqueId} className="conjunction-group__conjunction-child">
            <ConjunctionGroupNew
              root={false}
              treeName={treeName}
              artifact={artifact}
              templates={templates}
              instance={instance}
              deleteInstance={deleteInstance}
              getPath={this.getChildsPath}
              getAllInstances={this.props.getAllInstances}
              updateInstanceModifiers={this.props.updateInstanceModifiers}
              booleanParameters={this.props.booleanParameters}
              showPresets={this.props.showPresets}
              setPreset={this.props.setPreset} />

            {this.renderConjunctionSelect(i)}
          </div>
        );
      }

      return this.renderTemplate(instance);
    });
  }

  renderTemplate(instance) {
    return (
      <div key={ instance.uniqueId } className="conjunction-group__conjunction-child">
        <TemplateInstance
          getPath={this.getChildsPath}
          treeName={this.props.treeName}
          templateInstance={instance}
          otherInstances={this.props.getAllInstances(this.props.treeName)}
          editInstance={this.props.editInstance}
          updateInstanceModifiers={this.props.updateInstanceModifiers}
          deleteInstance={this.props.deleteInstance}
          saveInstance={this.props.saveInstance}
          showPresets={this.props.showPresets}
          setPreset={this.props.setPreset}
          subpopulationIndex={this.props.subPopulationIndex}
          renderIndentButtons={this.renderIndentButtons}
        />

        {this.renderConjunctionSelect(instance)}
      </div>
    );
  }

  render() {
    const conjunctionGroupClassName = `conjunction-group ${this.getNestingClassName()}`;

    return (
      <div className={conjunctionGroupClassName}>
        {this.renderHeader()}
        {this.renderChildren()}

        <ElementSelect
          categories={this.props.templates}
          onSuggestionSelected={this.addChild}
          booleanParameters={this.props.booleanParameters}
        />
      </div>
    );
  }
}

ConjunctionGroupNew.propTypes = {
  root: PropTypes.bool.isRequired,
  treeName: PropTypes.string.isRequired,
  artifact: PropTypes.object,
  templates: PropTypes.array,
  getPath: requiredIf(PropTypes.func, props => !props.root), // path needed for children
  deleteInstance: PropTypes.func.isRequired
};
