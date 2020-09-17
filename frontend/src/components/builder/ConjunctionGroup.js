import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faOutdent,
  faIndent,
  faExclamationCircle,
  faCommentDots,
  faComment,
  faAngleDoubleDown,
  faAngleDoubleRight,
  faTimes
} from '@fortawesome/free-solid-svg-icons';
import { UncontrolledTooltip } from 'reactstrap';
import classnames from 'classnames';

import TemplateInstance from './TemplateInstance';
import ElementSelect from './ElementSelect';
import StringField from './fields/StringField';
import TextAreaField from './fields/TextAreaField';
import StyledSelect from '../elements/StyledSelect';
import ExpressionPhrase from './modifiers/ExpressionPhrase';

import createTemplateInstance from '../../utils/templates';
import { hasGroupNestedWarning } from '../../utils/warnings';
import requiredIf from '../../utils/prop_types';
import { getFieldWithId } from '../../utils/instances';

export default class ConjunctionGroup extends Component {
  constructor(props) {
    super(props);

    const operationTemplates = this.props.templates.find(cat => cat.name === 'Operations').entries;
    this.types = operationTemplates.filter(template => template.conjunction);
    const listOperationTemplates = this.props.templates.find(cat => cat.name === 'List Operations') || [];
    this.listOperations = listOperationTemplates.entries;
    this.allTypes = this.props.templates.reduce((prev, curr) => [...prev, ...curr.entries], []);

    this.state = {
      showGroup: true,
      showComment: false
    };
  }

  handleTypeChange = (type) => {
    this.props.editInstance(this.props.treeName, type, this.getPath(), true);
  }

  handleNameChange = (state) => {
    this.props.editInstance(this.props.treeName, state, this.getPath(), false);
  }

  handleCommentChange = (state) => {
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
    const { treeName, artifact, templates, disableAddElement } = this.props;
    if (disableAddElement) {
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
    const { disableAddElement } = this.props;
    if (disableAddElement) {
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
    if (!this.props.disableAddElement) {
      this.props.deleteInstance(this.props.treeName, this.getPath());
    }
  }

  conjunctionHasDuplicateName = (child) => {
    const elementNameField = getFieldWithId(child.fields, 'element_name');
    const nameValue = elementNameField.value === undefined ? '' : elementNameField.value;
    const duplicateNameIndex = this.props.instanceNames.findIndex(name =>
      name.id !== child.uniqueId && name.name === nameValue);
    return duplicateNameIndex !== -1;
  }

  hasNestedWarnings = (childInstances) => {
    const { instanceNames, baseElements, parameters, getAllInstancesInAllTrees, validateReturnType } = this.props;
    const allInstancesInAllTrees = getAllInstancesInAllTrees();
    const hasNestedWarning = hasGroupNestedWarning(
      childInstances,
      instanceNames,
      baseElements,
      parameters,
      allInstancesInAllTrees,
      validateReturnType
    );
    return hasNestedWarning;
  }

  showHideGroupBody = () => {
    this.setState({ showGroup: !this.state.showGroup });
  }

  toggleComment = () => {
    this.setState({ showComment: !this.state.showComment });
  }

  // ----------------------- RENDERS --------------------------------------- //

  renderDisabledTooltip = id => (
    <UncontrolledTooltip
      target={id} placement="left">
      To edit or delete this element, remove all references to the Base Element List.
    </UncontrolledTooltip>
  );

  renderConjunctionSelect = i => (
    <StyledSelect
      className="card-group__conjunction-select"
      name={`conjunction-select-${i}`}
      value={this.props.instance}
      getOptionValue={({ name }) => name}
      getOptionLabel={({ name }) => name}
      placeholder="Select one"
      isSearchable={false}
      isClearable={false}
      options={this.props.options === 'listOperations' ? this.listOperations : this.types}
      onChange={this.handleTypeChange}
      inputProps={{ 'aria-label': 'Select conjunction type', title: 'Select conjunction type' }}
      classNamePrefix="conjunction-select"
    />
  )

  renderIndentButtons = instance => (
    // Indenting is always possible, outdent only possible when not at root already
    <span className="indent-outdent-container">
      {this.getPath() !== '' &&
        <span>
          <button
            aria-label="outdent"
            className={`element__hidebutton transparent-button ${this.props.disableAddElement ? 'disabled' : ''}`}
            id={`outdentbutton-${instance.uniqueId}`}
            onClick={() => this.outdentClickHandler(instance)}>
            <FontAwesomeIcon icon={faOutdent} />
          </button>
          {this.props.disableAddElement && this.renderDisabledTooltip(`outdentbutton-${instance.uniqueId}`) }
        </span>
      }

      <button
        aria-label="indent"
        className={`element__hidebutton transparent-button ${this.props.disableAddElement ? 'disabled' : ''}`}
        id={`indentbutton-${instance.uniqueId}`}
        onClick={() => this.indentClickHandler(instance)}>
        <FontAwesomeIcon icon={faIndent} />
      </button>
      { this.props.disableAddElement && this.renderDisabledTooltip(`indentbutton-${instance.uniqueId}`) }
    </span>
  )

  renderRoot() {
    const { showGroup, showComment } = this.state;
    const collapsedClass = showGroup ? '' : 'expression-collapsed';
    const elementNameField = getFieldWithId(this.props.instance.fields, 'element_name');
    const elementCommentField = getFieldWithId(this.props.instance.fields,'comment');
    const conjunctionHasDuplicateName = this.conjunctionHasDuplicateName(this.props.instance);
    const showHasWarnings = conjunctionHasDuplicateName || this.hasNestedWarnings(this.props.instance.childInstances);
    const hasComment = elementCommentField && elementCommentField.value && elementCommentField.value !== '';

    if (!this.props.root) {
      const { disableAddElement } = this.props;

      return (
        <div className="card-group__top">
          <div className="card-group__header">
            <div className="card-group__header-title">
              {showGroup ?
                <>
                  <StringField
                    id={elementNameField.id}
                    name={elementNameField.name}
                    value={elementNameField.value}
                    updateInstance={this.handleNameChange}
                  />

                  {showComment &&
                    <TextAreaField
                      id={elementCommentField.id}
                      name={elementCommentField.name}
                      value={elementCommentField.value}
                      updateInstance={this.handleCommentChange}
                    />
                  }

                  {conjunctionHasDuplicateName &&
                    <div className="warning">Warning: Name already in use. Choose another name.</div>
                  }
                </>
              :
                <div className="group-heading-name">
                  {elementNameField.value}:
                  {showHasWarnings &&
                    <div className="warning"><FontAwesomeIcon icon={faExclamationCircle} /> Has warnings</div>
                  }
                </div>
              }
            </div>

            <div className="card-group__buttons">
              {showGroup && this.renderIndentButtons(this.props.instance)}

              {showGroup &&
                <button
                  onClick={this.toggleComment}
                  className={classnames('element_hidebutton', 'transparent-button', hasComment && 'has-comment')}
                  aria-label="show comment"
                >
                  <FontAwesomeIcon icon={hasComment ? faCommentDots : faComment} />
                </button>
              }

              <button
                onClick={this.showHideGroupBody}
                className="element__hidebutton transparent-button"
                aria-label={`hide ${elementNameField.name}`}
              >
                <FontAwesomeIcon icon={showGroup ? faAngleDoubleDown : faAngleDoubleRight} />
              </button>

              <button
                className={`element__deletebutton transparent-button ${disableAddElement ? 'disabled' : ''}`}
                id={`deletebutton-${this.props.instance.uniqueId}`}
                onClick={this.deleteInstance}
                aria-label={`remove ${this.props.instance.name}`}
              >
                <FontAwesomeIcon icon={faTimes} />
              </button>

              {disableAddElement && this.renderDisabledTooltip(`deletebutton-${this.props.instance.uniqueId}`)}
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
              externalCqlList={this.props.externalCqlList}
              loadExternalCqlList={this.props.loadExternalCqlList}
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
              disableAddElement={this.props.disableAddElement}
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
      <div key={instance.uniqueId} className="card-group-section" id={instance.uniqueId}>
        <TemplateInstance
          artifactId={this.props.artifact._id}
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
          parameters={this.props.parameters}
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
          disableAddElement={this.props.disableAddElement}
          disableIndent={this.props.disableIndent}
          externalCqlList={this.props.externalCqlList}
          loadExternalCqlList={this.props.loadExternalCqlList} />

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
              artifactId={this.props.artifact._id}
              categories={this.props.templates}
              onSuggestionSelected={this.addChild}
              parameters={this.props.parameters}
              baseElements={this.props.baseElements}
              externalCqlList={this.props.externalCqlList}
              loadExternalCqlList={this.props.loadExternalCqlList}
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
              disableAddElement={this.props.disableAddElement}
              elementUniqueId={this.props.elementUniqueId}
            />
          </div>
        }
      </div>
    );
  }
}

ConjunctionGroup.propTypes = {
  artifact: PropTypes.object,
  codeData: PropTypes.object,
  conversionFunctions: PropTypes.array,
  deleteInstance: PropTypes.func.isRequired,
  disableAddElement: PropTypes.bool,
  disableIndent: PropTypes.bool,
  elementUniqueId: PropTypes.string,
  externalCqlList: PropTypes.array.isRequired,
  getAllInstances: PropTypes.func.isRequired,
  getAllInstancesInAllTrees: PropTypes.func.isRequired,
  getPath: requiredIf(PropTypes.func, props => !props.root), // path needed for children
  getVSDetails: PropTypes.func.isRequired,
  instanceNames: PropTypes.array.isRequired,
  isRetrievingDetails: PropTypes.bool.isRequired,
  isSearchingVSAC: PropTypes.bool.isRequired,
  isValidatingCode: PropTypes.bool.isRequired,
  isValidCode: PropTypes.bool,
  loadExternalCqlList: PropTypes.func.isRequired,
  loadValueSets: PropTypes.func.isRequired,
  loginVSACUser: PropTypes.func.isRequired,
  options: PropTypes.string,
  resetCodeValidation: PropTypes.func.isRequired,
  root: PropTypes.bool.isRequired,
  scrollToElement: PropTypes.func.isRequired,
  searchVSACByKeyword: PropTypes.func.isRequired,
  setVSACAuthStatus: PropTypes.func.isRequired,
  templates: PropTypes.array,
  treeName: PropTypes.string.isRequired,
  validateCode: PropTypes.func.isRequired,
  validateReturnType: PropTypes.bool,
  valueSets: PropTypes.array,
  vsacDetailsCodes: PropTypes.array.isRequired,
  vsacDetailsCodesError: PropTypes.string.isRequired,
  vsacFHIRCredentials: PropTypes.object,
  vsacSearchCount: PropTypes.number.isRequired,
  vsacSearchResults: PropTypes.array.isRequired,
  vsacStatus: PropTypes.string,
  vsacStatusText: PropTypes.string
};
