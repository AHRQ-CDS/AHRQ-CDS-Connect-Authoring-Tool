import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Select from 'react-select';
import FontAwesome from 'react-fontawesome';

import TemplateInstance from './TemplateInstance';
import ElementSelect from './ElementSelect';
import StringParameter from './parameters/types/StringParameter';

import createTemplateInstance from '../../utils/templates';
import requiredIf from '../../utils/prop_types';

export default class ConjunctionGroup extends Component {
  constructor(props) {
    super(props);

    const operationTemplates = this.props.templates.find(cat => cat.name === 'Operations').entries;
    this.types = operationTemplates.filter(template => template.conjunction);
    this.allTypes = this.props.templates.reduce((prev, curr) => [...prev, ...curr.entries], []);
  }

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

    if (level === 0) {
      return 'card-group__top';
    } else if (level % 2 === 0) {
      return 'card-group__even';
    }

    return 'card-group__odd';
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
      className="card-group__conjunction-select"
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

  renderIndentButtons = instance => (
    // Indenting is always possible, outdent only possible when not at root already
    <span className="indent-outdent-container">
      {this.getPath() !== '' &&
        <button
          aria-label="outdent"
          className="element__hidebutton transparent-button"
          onClick={() => this.outdentClickHandler(instance)}>
          <FontAwesome name="dedent" />
        </button>
      }

      <button
        aria-label="indent"
        className="element__hidebutton transparent-button"
        onClick={() => this.indentClickHandler(instance)}>
        <FontAwesome name="indent" />
      </button>
    </span>
  )

  renderRoot() {
    const elementNameParam = this.props.instance.parameters.find(param => param.id === 'element_name');
    const duplicateNameIndex = this.props.instanceNames.findIndex(name =>
      name.id !== this.props.instance.uniqueId && name.name === elementNameParam.value);

    if (!this.props.root) {
      return (
        <div className="card-group__header">
          <div className="card-group__header-title">
            <StringParameter
              id={elementNameParam.id}
              name={elementNameParam.name}
              value={elementNameParam.value}
              updateInstance={this.handleNameChange}
            />
            {duplicateNameIndex !== -1
              && <div className="warning">Warning: Name already in use. Choose another name.</div>}
          </div>

          <div className="card-group__buttons">
            {this.renderIndentButtons(this.props.instance)}

            <button
              className="element__deletebutton transparent-button"
              onClick={() => this.props.deleteInstance(this.props.treeName, this.getPath())}
              aria-label={`remove ${this.props.instance.name}`}>
              <FontAwesome name='close'/>
            </button>
          </div>
        </div>
      );
    }

    return null;
  }

  renderChildren() {
    const {
      artifact, treeName, templates, valueSets, addInstance, editInstance, deleteInstance
    } = this.props;

    return this.props.instance.childInstances.map((instance, i) => {
      // return null if child instance conjunction is false
      if (instance.conjunction) {
        return (
          <div key={instance.uniqueId} className="card-group">
            <ConjunctionGroup
              root={false}
              treeName={treeName}
              artifact={artifact}
              templates={templates}
              valueSets={valueSets}
              loadValueSets={this.props.loadValueSets}
              instance={instance}
              addInstance={addInstance}
              editInstance={editInstance}
              deleteInstance={deleteInstance}
              getAllInstances={this.props.getAllInstances}
              updateInstanceModifiers={this.props.updateInstanceModifiers}
              parameters={this.props.parameters}
              subelements={this.props.subelements}
              getPath={this.getChildsPath}
              conversionFunctions={this.props.conversionFunctions}
              instanceNames={this.props.instanceNames}
              subPopulationIndex={this.props.subPopulationIndex}
              loginVSACUser={this.props.loginVSACUser}
              setVSACAuthStatus={this.props.setVSACAuthStatus}
              vsacStatus={this.props.vsacStatus}
              vsacStatusText={this.props.vsacStatusText}
              timeLastAuthenticated={this.props.timeLastAuthenticated}
              searchVSACByKeyword={this.props.searchVSACByKeyword}
              isSearchingVSAC={this.props.isSearchingVSAC}
              vsacSearchResults={this.props.vsacSearchResults}
              vsacSearchCount={this.props.vsacSearchCount}
              getVSDetails={this.props.getVSDetails}
              isRetrievingDetails={this.props.isRetrievingDetails}
              vsacDetailsCodes={this.props.vsacDetailsCodes}
              vsacFHIRCredentials={this.props.vsacFHIRCredentials}
              validateReturnType={this.props.validateReturnType}
              isValidatingCode={this.props.isValidatingCode}
              isValidCode={this.props.isValidCode}
              codeData={this.props.codeData}
              validateCode={this.props.validateCode}
              resetCodeValidation={this.props.resetCodeValidation} />

            {this.renderConjunctionSelect(i)}
          </div>
        );
      }

      return this.renderTemplate(instance);
    });
  }

  renderTemplate(instance) {
    return (
      <div key={instance.uniqueId} className="card-group-section">
        <TemplateInstance
          valueSets={this.props.valueSets}
          loadValueSets={this.props.loadValueSets}
          getPath={this.getChildsPath}
          treeName={this.props.treeName}
          templateInstance={instance}
          otherInstances={this.props.getAllInstances(this.props.treeName)}
          editInstance={this.props.editInstance}
          updateInstanceModifiers={this.props.updateInstanceModifiers}
          deleteInstance={this.props.deleteInstance}
          subpopulationIndex={this.props.subPopulationIndex}
          renderIndentButtons={this.renderIndentButtons}
          conversionFunctions={this.props.conversionFunctions}
          instanceNames={this.props.instanceNames}
          loginVSACUser={this.props.loginVSACUser}
          setVSACAuthStatus={this.props.setVSACAuthStatus}
          vsacStatus={this.props.vsacStatus}
          vsacStatusText={this.props.vsacStatusText}
          timeLastAuthenticated={this.props.timeLastAuthenticated}
          searchVSACByKeyword={this.props.searchVSACByKeyword}
          isSearchingVSAC={this.props.isSearchingVSAC}
          vsacSearchResults={this.props.vsacSearchResults}
          vsacSearchCount={this.props.vsacSearchCount}
          getVSDetails={this.props.getVSDetails}
          isRetrievingDetails={this.props.isRetrievingDetails}
          vsacDetailsCodes={this.props.vsacDetailsCodes}
          vsacFHIRCredentials={this.props.vsacFHIRCredentials}
          validateReturnType={this.props.validateReturnType}
          isValidatingCode={this.props.isValidatingCode}
          isValidCode={this.props.isValidCode}
          codeData={this.props.codeData}
          validateCode={this.props.validateCode}
          resetCodeValidation={this.props.resetCodeValidation} />

        {this.renderConjunctionSelect(instance)}
      </div>
    );
  }

  render() {
    const classname = `card-group ${this.getNestingClassName()}`;

    return (
      <div className={classname}>
        {this.renderRoot()}
        {this.renderChildren()}

        <div className="card-element">
          <ElementSelect
            categories={this.props.templates}
            onSuggestionSelected={this.addChild}
            parameters={this.props.parameters}
            subelements={this.props.subelements}
            loginVSACUser={this.props.loginVSACUser}
            setVSACAuthStatus={this.props.setVSACAuthStatus}
            vsacStatus={this.props.vsacStatus}
            vsacStatusText={this.props.vsacStatusText}
            timeLastAuthenticated={this.props.timeLastAuthenticated}
            searchVSACByKeyword={this.props.searchVSACByKeyword}
            isSearchingVSAC={this.props.isSearchingVSAC}
            vsacSearchResults={this.props.vsacSearchResults}
            vsacSearchCount={this.props.vsacSearchCount}
            getVSDetails={this.props.getVSDetails}
            isRetrievingDetails={this.props.isRetrievingDetails}
            vsacDetailsCodes={this.props.vsacDetailsCodes}
            vsacFHIRCredentials={this.props.vsacFHIRCredentials}
            isValidatingCode={this.props.isValidatingCode}
            isValidCode={this.props.isValidCode}
            codeData={this.props.codeData}
            validateCode={this.props.validateCode}
            resetCodeValidation={this.props.resetCodeValidation}
          />
        </div>
      </div>
    );
  }
}

ConjunctionGroup.propTypes = {
  root: PropTypes.bool.isRequired,
  treeName: PropTypes.string.isRequired,
  artifact: PropTypes.object,
  templates: PropTypes.array,
  valueSets: PropTypes.array,
  loadValueSets: PropTypes.func.isRequired,
  getPath: requiredIf(PropTypes.func, props => !props.root), // path needed for children
  getAllInstances: PropTypes.func.isRequired,
  deleteInstance: PropTypes.func.isRequired,
  conversionFunctions: PropTypes.array,
  loginVSACUser: PropTypes.func.isRequired,
  setVSACAuthStatus: PropTypes.func.isRequired,
  vsacStatus: PropTypes.string,
  vsacStatusText: PropTypes.string,
  timeLastAuthenticated: PropTypes.instanceOf(Date),
  searchVSACByKeyword: PropTypes.func.isRequired,
  isSearchingVSAC: PropTypes.bool.isRequired,
  vsacSearchResults: PropTypes.array.isRequired,
  vsacSearchCount: PropTypes.number.isRequired,
  getVSDetails: PropTypes.func.isRequired,
  isRetrievingDetails: PropTypes.bool.isRequired,
  vsacDetailsCodes: PropTypes.array.isRequired,
  vsacFHIRCredentials: PropTypes.object,
  validateReturnType: PropTypes.bool,
  isValidatingCode: PropTypes.bool.isRequired,
  isValidCode: PropTypes.bool,
  resetCodeValidation: PropTypes.func.isRequired,
  codeData: PropTypes.object,
  validateCode: PropTypes.func.isRequired
};
