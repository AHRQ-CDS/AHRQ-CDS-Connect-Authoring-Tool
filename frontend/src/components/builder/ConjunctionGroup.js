import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Select from 'react-select';
import FontAwesome from 'react-fontawesome';
import { UncontrolledTooltip } from 'reactstrap';

import TemplateInstance from './TemplateInstance';
import ElementSelect from './ElementSelect';
import StringParameter from './parameters/types/StringParameter';
import ExpressionPhrase from './modifiers/ExpressionPhrase';

import createTemplateInstance from '../../utils/templates';
import { hasGroupNestedWarning } from '../../utils/warnings';
import requiredIf from '../../utils/prop_types';

export default class ConjunctionGroup extends Component {
  constructor(props) {
    super(props);

    const operationTemplates = this.props.templates.find(cat => cat.name === 'Operations').entries;
    this.types = operationTemplates.filter(template => template.conjunction);
    const listOperationTemplates = this.props.templates.find(cat => cat.name === 'List Operations') || [];
    this.listOperations = listOperationTemplates.entries;
    this.allTypes = this.props.templates.reduce((prev, curr) => [...prev, ...curr.entries], []);

    this.state = {
      showGroup: true
    };
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
    const { treeName, artifact, templates, disableElement } = this.props;
    if (disableElement) {
      return;
    }
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
    const { disableElement } = this.props;
    if (disableElement) {
      return;
    }
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

  deleteInstance = () => {
    if (!this.props.disableElement) {
      this.props.deleteInstance(this.props.treeName, this.getPath());
    }
  }

  conjunctionHasDuplicateName = (child) => {
    const elementNameParam = child.parameters.find(param => param.id === 'element_name');
    const nameValue = elementNameParam.value === undefined ? '' : elementNameParam.value;
    const duplicateNameIndex = this.props.instanceNames.findIndex(name =>
      name.id !== child.uniqueId && name.name === nameValue);
    return duplicateNameIndex !== -1;
  }

  hasNestedWarnings = (childInstances) => {
    const { instanceNames, baseElements, getAllInstancesInAllTrees, validateReturnType } = this.props;
    const allInstancesInAllTrees = getAllInstancesInAllTrees();
    const hasNestedWarning =
      hasGroupNestedWarning(childInstances, instanceNames, baseElements, allInstancesInAllTrees, validateReturnType);
    return hasNestedWarning;
  }

  showHideGroupBody = () => {
    this.setState({ showGroup: !this.state.showGroup });
  }

  // ----------------------- RENDERS --------------------------------------- //

  renderDisabledTooltip = id => (
    <UncontrolledTooltip
      target={id} placement="left">
      To edit or delete this element, remove all references to the Base Element List.
    </UncontrolledTooltip>
  );

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
      options={ this.props.options === 'listOperations' ? this.listOperations : this.types }
      onChange={ this.handleTypeChange }
      inputProps={{ 'aria-label': 'Select conjunction type', title: 'Select conjunction type' }}
    />
  )

  renderIndentButtons = instance => (
    // Indenting is always possible, outdent only possible when not at root already
    <span className="indent-outdent-container">
      {this.getPath() !== '' &&
        <span>
          <button
            aria-label="outdent"
            className={`element__hidebutton transparent-button ${this.props.disableElement ? 'disabled' : ''}`}
            id={`outdentbutton-${instance.uniqueId}`}
            onClick={() => this.outdentClickHandler(instance)}>
            <FontAwesome name="dedent" />
          </button>
          {this.props.disableElement && this.renderDisabledTooltip(`outdentbutton-${instance.uniqueId}`) }
        </span>
      }

      <button
        aria-label="indent"
        className={`element__hidebutton transparent-button ${this.props.disableElement ? 'disabled' : ''}`}
        id={`indentbutton-${instance.uniqueId}`}
        onClick={() => this.indentClickHandler(instance)}>
        <FontAwesome name="indent" />
      </button>
      { this.props.disableElement && this.renderDisabledTooltip(`indentbutton-${instance.uniqueId}`) }
    </span>
  )

  renderRoot() {
    const { showGroup } = this.state;
    const collapsedClass = showGroup ? '' : 'expression-collapsed';
    const elementNameParam = this.props.instance.parameters.find(param => param.id === 'element_name');
    const conjunctionHasDuplicateName = this.conjunctionHasDuplicateName(this.props.instance);

    if (!this.props.root) {
      const { disableElement } = this.props;
      return (
        <div className="card-group__top">
          <div className="card-group__header">
            <div className="card-group__header-title">
              {showGroup ?
                <div>
                  <StringParameter
                    id={elementNameParam.id}
                    name={elementNameParam.name}
                    value={elementNameParam.value}
                    updateInstance={this.handleNameChange}
                  />
                  {conjunctionHasDuplicateName
                    && <div className="warning">Warning: Name already in use. Choose another name.</div>}
                </div>
              :
                <div className="group-heading-name">
                  {elementNameParam.value}:
                  {(conjunctionHasDuplicateName || this.hasNestedWarnings(this.props.instance.childInstances))
                    && <div className="warning"><FontAwesome name="exclamation-circle" /> Has warnings</div>}
                </div>
              }
            </div>

            <div className="card-group__buttons">
              {showGroup && this.renderIndentButtons(this.props.instance)}

              <button
                onClick={this.showHideGroupBody}
                className="element__hidebutton transparent-button"
                aria-label={`hide ${elementNameParam.name}`}>
                <FontAwesome name={showGroup ? 'angle-double-down' : 'angle-double-right'} />
              </button>

              <button
                className={`element__deletebutton transparent-button ${disableElement ? 'disabled' : ''}`}
                id={`deletebutton-${this.props.instance.uniqueId}`}
                onClick={this.deleteInstance}
                aria-label={`remove ${this.props.instance.name}`}>
                <FontAwesome name='close'/>
              </button>
              { disableElement && this.renderDisabledTooltip(`deletebutton-${this.props.instance.uniqueId}`) }
            </div>
          </div>
          <ExpressionPhrase
            class={`expression expression__group ${collapsedClass}`}
            instance={this.props.instance}
            baseElements={this.props.baseElements}
          />
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
              getAllInstancesInAllTrees={this.props.getAllInstancesInAllTrees}
              updateInstanceModifiers={this.props.updateInstanceModifiers}
              parameters={this.props.parameters}
              baseElements={this.props.baseElements}
              getPath={this.getChildsPath}
              conversionFunctions={this.props.conversionFunctions}
              instanceNames={this.props.instanceNames}
              subPopulationIndex={this.props.subPopulationIndex}
              scrollToElement={this.props.scrollToElement}
              loginVSACUser={this.props.loginVSACUser}
              setVSACAuthStatus={this.props.setVSACAuthStatus}
              vsacStatus={this.props.vsacStatus}
              vsacStatusText={this.props.vsacStatusText}
              searchVSACByKeyword={this.props.searchVSACByKeyword}
              isSearchingVSAC={this.props.isSearchingVSAC}
              vsacSearchResults={this.props.vsacSearchResults}
              vsacSearchCount={this.props.vsacSearchCount}
              getVSDetails={this.props.getVSDetails}
              isRetrievingDetails={this.props.isRetrievingDetails}
              vsacDetailsCodes={this.props.vsacDetailsCodes}
              vsacDetailsCodesError={this.props.vsacDetailsCodesError}
              vsacFHIRCredentials={this.props.vsacFHIRCredentials}
              validateReturnType={this.props.validateReturnType}
              isValidatingCode={this.props.isValidatingCode}
              isValidCode={this.props.isValidCode}
              codeData={this.props.codeData}
              validateCode={this.props.validateCode}
              resetCodeValidation={this.props.resetCodeValidation}
              disableElement={this.props.disableElement}
              elementUniqueId={this.props.elementUniqueId}
            />

            {this.renderConjunctionSelect(i)}
          </div>
        );
      }

      return this.renderTemplate(instance);
    });
  }

  renderTemplate(instance) {
    const allInstancesInAllTrees = this.props.getAllInstancesInAllTrees();
    return (
      <div key={instance.uniqueId} className="card-group-section">
        <TemplateInstance
          valueSets={this.props.valueSets}
          loadValueSets={this.props.loadValueSets}
          getPath={this.getChildsPath}
          treeName={this.props.treeName}
          templateInstance={instance}
          otherInstances={this.props.getAllInstances(this.props.treeName)}
          allInstancesInAllTrees={allInstancesInAllTrees}
          editInstance={this.props.editInstance}
          updateInstanceModifiers={this.props.updateInstanceModifiers}
          deleteInstance={this.props.deleteInstance}
          subpopulationIndex={this.props.subPopulationIndex}
          renderIndentButtons={this.renderIndentButtons}
          conversionFunctions={this.props.conversionFunctions}
          instanceNames={this.props.instanceNames}
          baseElements={this.props.baseElements}
          scrollToElement={this.props.scrollToElement}
          loginVSACUser={this.props.loginVSACUser}
          setVSACAuthStatus={this.props.setVSACAuthStatus}
          vsacStatus={this.props.vsacStatus}
          vsacStatusText={this.props.vsacStatusText}
          searchVSACByKeyword={this.props.searchVSACByKeyword}
          isSearchingVSAC={this.props.isSearchingVSAC}
          vsacSearchResults={this.props.vsacSearchResults}
          vsacSearchCount={this.props.vsacSearchCount}
          getVSDetails={this.props.getVSDetails}
          isRetrievingDetails={this.props.isRetrievingDetails}
          vsacDetailsCodes={this.props.vsacDetailsCodes}
          vsacDetailsCodesError={this.props.vsacDetailsCodesError}
          vsacFHIRCredentials={this.props.vsacFHIRCredentials}
          validateReturnType={this.props.validateReturnType}
          isValidatingCode={this.props.isValidatingCode}
          isValidCode={this.props.isValidCode}
          codeData={this.props.codeData}
          validateCode={this.props.validateCode}
          resetCodeValidation={this.props.resetCodeValidation}
          disableElement={this.props.disableElement}
          disableIndent={this.props.disableIndent} />

        {this.renderConjunctionSelect(instance)}
      </div>
    );
  }

  render() {
    const { showGroup } = this.state;
    const classname = `card-group ${this.getNestingClassName()}`;

    return (
      <div className={classname}>
        {this.renderRoot()}
        {showGroup && this.renderChildren()}

        {showGroup &&
          <div className="card-element">
            <ElementSelect
              categories={this.props.templates}
              onSuggestionSelected={this.addChild}
              parameters={this.props.parameters}
              baseElements={this.props.baseElements}
              loginVSACUser={this.props.loginVSACUser}
              setVSACAuthStatus={this.props.setVSACAuthStatus}
              vsacStatus={this.props.vsacStatus}
              vsacStatusText={this.props.vsacStatusText}
              searchVSACByKeyword={this.props.searchVSACByKeyword}
              isSearchingVSAC={this.props.isSearchingVSAC}
              vsacSearchResults={this.props.vsacSearchResults}
              vsacSearchCount={this.props.vsacSearchCount}
              getVSDetails={this.props.getVSDetails}
              isRetrievingDetails={this.props.isRetrievingDetails}
              vsacDetailsCodes={this.props.vsacDetailsCodes}
              vsacDetailsCodesError={this.props.vsacDetailsCodesError}
              vsacFHIRCredentials={this.props.vsacFHIRCredentials}
              isValidatingCode={this.props.isValidatingCode}
              isValidCode={this.props.isValidCode}
              codeData={this.props.codeData}
              validateCode={this.props.validateCode}
              resetCodeValidation={this.props.resetCodeValidation}
              inBaseElements={false}
              disableElement={this.props.disableElement}
              elementUniqueId={this.props.elementUniqueId}
            />
          </div>
        }
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
  getAllInstancesInAllTrees: PropTypes.func.isRequired,
  deleteInstance: PropTypes.func.isRequired,
  instanceNames: PropTypes.array.isRequired,
  conversionFunctions: PropTypes.array,
  scrollToElement: PropTypes.func.isRequired,
  loginVSACUser: PropTypes.func.isRequired,
  setVSACAuthStatus: PropTypes.func.isRequired,
  vsacStatus: PropTypes.string,
  vsacStatusText: PropTypes.string,
  searchVSACByKeyword: PropTypes.func.isRequired,
  isSearchingVSAC: PropTypes.bool.isRequired,
  vsacSearchResults: PropTypes.array.isRequired,
  vsacSearchCount: PropTypes.number.isRequired,
  getVSDetails: PropTypes.func.isRequired,
  isRetrievingDetails: PropTypes.bool.isRequired,
  vsacDetailsCodes: PropTypes.array.isRequired,
  vsacDetailsCodesError: PropTypes.string.isRequired,
  vsacFHIRCredentials: PropTypes.object,
  validateReturnType: PropTypes.bool,
  isValidatingCode: PropTypes.bool.isRequired,
  isValidCode: PropTypes.bool,
  resetCodeValidation: PropTypes.func.isRequired,
  codeData: PropTypes.object,
  validateCode: PropTypes.func.isRequired,
  options: PropTypes.string,
  disableIndent: PropTypes.bool,
  disableElement: PropTypes.bool,
  elementUniqueId: PropTypes.string
};
