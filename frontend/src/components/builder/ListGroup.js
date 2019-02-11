import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import FontAwesome from 'react-fontawesome';
import pluralize from 'pluralize';
import { UncontrolledTooltip } from 'reactstrap';
import { findValueAtPath } from '../../utils/find';
import { doesBaseElementInstanceNeedWarning, hasDuplicateName, hasGroupNestedWarning } from '../../utils/warnings';
import { getReturnType } from '../../utils/instances';

import ConjunctionGroup from './ConjunctionGroup';
import ExpressionPhrase from './modifiers/ExpressionPhrase';

const listTypes = [
  'list_of_observations',
  'list_of_conditions',
  'list_of_medication_statements',
  'list_of_medication_orders',
  'list_of_procedures',
  'list_of_allergy_intolerances',
  'list_of_encounters',
  'list_of_booleans',
  'list_of_system_quantities',
  'list_of_system_concepts',
  'list_of_any'
];

const singularTypes = [
  'observation',
  'condition',
  'medication_statement',
  'medication_order',
  'procedure',
  'allergy_intolerance',
  'encounter',
  'boolean',
  'system_quantity',
  'system_concept'
];

export default class ListGroup extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isExpanded: true
    };
  }

  getAllInstances = treeName => this.props.getAllInstances(treeName, null, this.props.instance.uniqueId);

  collapse = () => {
    this.setState({ isExpanded: false });
  }

  expand = () => {
    this.setState({ isExpanded: true });
  }

  onEnterKey = (e) => {
    e.which = e.which || e.keyCode;
    if (e.which === 13) {
      if (this.state.isExpanded) this.collapse();
      else this.expand();
    }
  }

  updateBaseElementList = (name, uniqueId) => {
    const newBaseElementLists = _.cloneDeep(this.props.artifact.baseElements);
    const baseElementIndex = this.props.artifact.baseElements.findIndex(baseElement =>
      baseElement.uniqueId === uniqueId);
    newBaseElementLists[baseElementIndex].parameters[0].value = name;

    this.props.updateBaseElementLists(newBaseElementLists, 'baseElements');
  }

  deleteBaseElementList = (uniqueId) => {
    const newBaseElementLists = _.cloneDeep(this.props.artifact.baseElements);
    const baseElementIndex = this.props.artifact.baseElements.findIndex(baseElement =>
      baseElement.uniqueId === uniqueId);
    const baseElementListIsInUse = this.isBaseElementListUsed(newBaseElementLists[baseElementIndex]);
    if (!baseElementListIsInUse) {
      newBaseElementLists.splice(baseElementIndex, 1);
      this.props.updateBaseElementLists(newBaseElementLists, 'baseElements');
    }
  }

  promoteReturnTypeToList = (returnType) => {
    const isSingularElement = singularTypes.find(type => type === returnType);
    if (isSingularElement) {
      return `list_of_${pluralize.plural(returnType)}`;
    }
    return returnType;
  }

  checkReturnTypeCompatibility = (currentReturnType, incomingReturnType) => {
    const incomingReturnTypeOrPromoted = this.promoteReturnTypeToList(incomingReturnType);
    const isListElement = listTypes.find(type => type === incomingReturnTypeOrPromoted);
    if (currentReturnType === incomingReturnTypeOrPromoted && (isListElement)) {
      return incomingReturnTypeOrPromoted;
    }
    return 'list_of_any';
  }

  checkAndOrReturnTypeCompatibility = (currentReturnType, incomingReturnType, isOnlyElement) => {
    const booleanAndNull = (_.lowerCase(incomingReturnType) === 'none' && _.lowerCase(currentReturnType) === 'boolean')
      || (_.lowerCase(incomingReturnType) === 'boolean' && _.lowerCase(currentReturnType) === 'none');

    if ((currentReturnType === incomingReturnType && _.lowerCase(currentReturnType) === 'boolean') || isOnlyElement) {
      return incomingReturnType;
    } else if (booleanAndNull) {
      return 'boolean';
    }
    return 'invalid';
  }

  getReturnTypeOfFullList = (baseElementList) => {
    let currentReturnType;
    // Set the initial type to the first child's type to start. If no children, default is 'list_of_any'.
    if (baseElementList.childInstances.length > 0) {
      const firstChild = baseElementList.childInstances[0];
      currentReturnType = getReturnType(firstChild.returnType, firstChild.modifiers);
      currentReturnType = this.promoteReturnTypeToList(currentReturnType);
    } else {
      currentReturnType = 'list_of_any';
    }

    let newReturnType;
    baseElementList.childInstances.forEach((child) => { // Base Element Lists can only go one child deep
      const incomingReturnType = getReturnType(child.returnType, child.modifiers);
      newReturnType = this.checkReturnTypeCompatibility(currentReturnType, incomingReturnType);
      currentReturnType = newReturnType;
    });

    return currentReturnType;
  }

  getAndOrReturnTypeOfFullList = (baseElementList) => {
    let currentReturnType;
    // Set the initial type to the first child's type to start. If no children, default is 'list_of_any'.
    if (baseElementList.childInstances.length > 0) {
      const firstChild = baseElementList.childInstances[0];
      currentReturnType = getReturnType(firstChild.returnType, firstChild.modifiers);
    } else {
      currentReturnType = 'none';
    }

    let newReturnType;
    // Base Element And/Or Conjunctions can go multiple children deep so need recursion to check the type
    baseElementList.childInstances.forEach((child) => {
      let incomingReturnType = getReturnType(child.returnType, child.modifiers);
      if (child.childInstances) {
        incomingReturnType = this.getAndOrReturnTypeOfFullList(child);
      }
      const isOnlyElement = baseElementList.childInstances.length === 1;
      newReturnType = this.checkAndOrReturnTypeCompatibility(currentReturnType, incomingReturnType, isOnlyElement);
      currentReturnType = newReturnType;
    });

    return currentReturnType;
  }

  addInstance = (name, template, path, baseElement, isAndOrElement) => {
    const baseElementList = _.cloneDeep(baseElement);
    const currentReturnType = baseElementList.returnType;
    let newReturnType;
    if (baseElement.childInstances.length === 0) {
      // New return type will just be whatever the new element's type is.
      if (isAndOrElement) {
        newReturnType = template.returnType;
      } else {
        newReturnType = this.promoteReturnTypeToList(template.returnType);
      }
    } else {
      // Need to check if incoming type will change the current return type.
      let incomingReturnType = getReturnType(template.returnType, template.modifiers);
      if (isAndOrElement) {
        const isOnlyElement = baseElementList.childInstances.length === 1;
        newReturnType = this.checkAndOrReturnTypeCompatibility(currentReturnType, incomingReturnType, isOnlyElement);
      } else {
        incomingReturnType = this.promoteReturnTypeToList(incomingReturnType);
        newReturnType = this.checkReturnTypeCompatibility(currentReturnType, incomingReturnType);
      }
    }
    this.props.addInstance(name, template, path, baseElement.uniqueId, undefined, null, newReturnType);
  }

  editInstance = (treeName, params, path, editingConjunction, baseElement) => {
    this.props.editInstance(treeName, params, path, editingConjunction, baseElement.uniqueId);
  }

  deleteInstance = (treeName, path, toAdd, baseElement, isAndOrElement) => {
    // Temporarily remove the element that will be deleted to correctly calculate return type.
    const indexToRemove = path.slice(-1);
    const baseElementList = _.cloneDeep(baseElement);
    const target = findValueAtPath(baseElementList, path.slice(0, path.length - 2));
    target.splice(indexToRemove, 1);

    let currentReturnType;
    if (isAndOrElement) {
      currentReturnType = this.getAndOrReturnTypeOfFullList(baseElementList);
    } else {
      currentReturnType = this.getReturnTypeOfFullList(baseElementList);
    }
    this.props.deleteInstance(treeName, path, toAdd, baseElement.uniqueId, currentReturnType);
  }

  updateInstanceModifiers = (t, modifiers, path, index, isAndOrElement) => {
    const baseElementList = _.cloneDeep(this.props.baseElements[index]);
    if (!baseElementList) return;

    // Temporarily apply the modifiers that will be updated. Base Element Lists can only be one child deep.
    const target = findValueAtPath(baseElementList, path);
    target.modifiers = modifiers;

    let currentReturnType;
    if (isAndOrElement) {
      currentReturnType = this.getAndOrReturnTypeOfFullList(baseElementList);
    } else {
      currentReturnType = this.getReturnTypeOfFullList(baseElementList);
    }
    this.props.updateInstanceModifiers(t, modifiers, path, index, currentReturnType);
  }

  isBaseElementListUsed = element => (element.usedBy ? element.usedBy.length !== 0 : false);

  hasNestedWarnings = (childInstances) => {
    const { instanceNames, baseElements, getAllInstancesInAllTrees, instance } = this.props;
    const isAndOrElement = instance.id === 'And' || instance.id === 'Or';
    const allInstancesInAllTrees = getAllInstancesInAllTrees();
    const hasNestedWarning =
      hasGroupNestedWarning(childInstances, instanceNames, baseElements, allInstancesInAllTrees, isAndOrElement);
    return hasNestedWarning;
  }

  renderListGroup = () => {
    const { instance, index, baseElements } = this.props;
    const baseElementListUsed = this.isBaseElementListUsed(instance);
    const isAndOrElement = instance.id === 'And' || instance.id === 'Or';
    return (
      <div className="card-element__body">
        <div>
          <ExpressionPhrase
            class="expression expression__group"
            instance={instance}
            baseElements={baseElements}
          />
          <div className="return-type row">
            <div className="col-3 bold align-right return-type__label">Return Type:</div>
            <div className="col-7 return-type__value">
              {isAndOrElement
                && (_.startCase(instance.returnType) === 'Boolean' || instance.childInstances.length === 1)
                && <FontAwesome name="check" className="check" />}
              {!isAndOrElement && <FontAwesome name="check" className="check" />}
              {_.startCase(instance.returnType)}
            </div>
          </div>
        </div>
        <ConjunctionGroup
          root={true}
          treeName={this.props.treeName}
          artifact={this.props.artifact}
          templates={this.props.templates}
          valueSets={this.props.valueSets}
          loadValueSets={this.props.loadValueSets}
          instance={this.props.instance}
          addInstance={(name, template, path) => this.addInstance(name, template, path, instance, isAndOrElement)}
          editInstance={(treeName, params, path, editingConjunction) =>
            this.editInstance(treeName, params, path, editingConjunction, instance)}
          deleteInstance={(treeName, path, toAdd) =>
            this.deleteInstance(treeName, path, toAdd, instance, isAndOrElement)}
          getAllInstances={this.getAllInstances}
          getAllInstancesInAllTrees={this.props.getAllInstancesInAllTrees}
          updateInstanceModifiers={(t, modifiers, path) =>
            this.updateInstanceModifiers(t, modifiers, path, index, isAndOrElement)}
          parameters={this.props.parameters}
          baseElements={this.props.baseElements}
          conversionFunctions={this.props.conversionFunctions}
          instanceNames={this.props.instanceNames}
          scrollToBaseElement={this.props.scrollToBaseElement}
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
          validateReturnType={isAndOrElement}
          options={isAndOrElement ? '' : 'listOperations'}
          disableIndent={!isAndOrElement}
          disableElement={baseElementListUsed}
          elementUniqueId={instance.uniqueId}
        />
      </div>
    );
  }

  renderList = () => {
    const { instance } = this.props;
    const name = instance.parameters[0].value;
    const allInstancesInAllTrees = this.props.getAllInstancesInAllTrees();
    const { instanceNames, baseElements } = this.props;
    const needsDuplicateNameWarning = hasDuplicateName(instance, instanceNames, baseElements, allInstancesInAllTrees);
    const needsBaseElementWarning = doesBaseElementInstanceNeedWarning(instance, allInstancesInAllTrees);
    const baseElementListUsed = this.isBaseElementListUsed(instance);
    const disabledClass = baseElementListUsed ? 'disabled' : '';
    return (
      <div className="card-element">
        <div className="card-element__header">
          {this.state.isExpanded ?
            <div className="subpopulation__title">
              <FontAwesome fixedWidth name='angle-double-down'
                id="collapse-icon"
                tabIndex="0"
                onClick={this.state.isExpanded ? this.collapse : this.expand}
                onKeyPress={this.onEnterKey}
              />

              <input
                type="text"
                className="subpopulation__name-input"
                title="Base Element List Title"
                aria-label="Base Element List Title"
                value={name}
                onClick={event => event.stopPropagation()}
                onChange={(event) => {
                  this.updateBaseElementList(event.target.value, instance.uniqueId);
                }}
              />
              {needsDuplicateNameWarning && !needsBaseElementWarning
                && <div className='warning'>Warning: Name already in use. Choose another name.</div>}
              {needsBaseElementWarning &&
                <div className="warning">
                  Warning: One or more uses of this Base Element have changed. Choose another name.
                </div>}
              {instance.returnType === 'list_of_any'
                && instance.name === 'Intersect'
                && instance.childInstances.length > 0
                && <div className='warning'>
                  Warning: Intersecting different types will always result in an empty list
                </div>}
            </div>
            :
            <div className="subpopulation-title">
              <FontAwesome fixedWidth name='angle-double-right'
                id="collapse-icon"
                tabIndex="0"
                onClick={this.state.isExpanded ? this.collapse : this.expand}
                onKeyPress={this.onEnterKey}
              />
              <h4>{instance.parameters[0].value}</h4>
              {(needsDuplicateNameWarning || needsBaseElementWarning || this.hasNestedWarnings(instance.childInstances))
                && <div className="warning"><FontAwesome name="exclamation-circle" /> Has warnings</div>}
            </div>
          }

          <div className="card-element__buttons">
            <button className="secondary-button" onClick={this.state.isExpanded ? this.collapse : this.expand}>
              {this.state.isExpanded ? 'Done' : 'Edit'}
            </button>

            <button
              aria-label="Remove base element list"
              className={`secondary-button ${disabledClass}`}
              id={`deletebutton-${instance.uniqueId}`}
              onClick={() => this.deleteBaseElementList(instance.uniqueId)}>
              <FontAwesome fixedWidth name='times' />
            </button>
            {baseElementListUsed &&
              <UncontrolledTooltip
                target={`deletebutton-${instance.uniqueId}`} placement="left">
                To delete this Base Element List, remove all references to it.
            </UncontrolledTooltip>}
          </div>
        </div>

        {this.state.isExpanded && this.renderListGroup()}
      </div>
    );
  }

  render() {
    return (
      <div className="subpopulation card-group card-group__top">
        {this.renderList(this.props.instance, this.props.index)}
      </div>
    );
  }
}

ListGroup.propTypes = {
  treeName: PropTypes.string.isRequired,
  artifact: PropTypes.object,
  templates: PropTypes.array,
  valueSets: PropTypes.array,
  loadValueSets: PropTypes.func.isRequired,
  instance: PropTypes.object.isRequired,
  index: PropTypes.number.isRequired,
  addInstance: PropTypes.func.isRequired,
  editInstance: PropTypes.func.isRequired,
  deleteInstance: PropTypes.func.isRequired,
  getAllInstances: PropTypes.func.isRequired,
  getAllInstancesInAllTrees: PropTypes.func.isRequired,
  updateInstanceModifiers: PropTypes.func.isRequired,
  updateBaseElementLists: PropTypes.func.isRequired,
  parameters: PropTypes.array.isRequired,
  baseElements: PropTypes.array.isRequired,
  conversionFunctions: PropTypes.array,
  instanceNames: PropTypes.array.isRequired,
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
  isValidatingCode: PropTypes.bool.isRequired,
  isValidCode: PropTypes.bool,
  codeData: PropTypes.object,
  validateCode: PropTypes.func.isRequired,
  resetCodeValidation: PropTypes.func.isRequired,
  scrollToBaseElement: PropTypes.func.isRequired,
};
