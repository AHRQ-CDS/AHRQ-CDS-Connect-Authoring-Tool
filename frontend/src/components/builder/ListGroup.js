import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import FontAwesome from 'react-fontawesome';
import pluralize from 'pluralize';
import { UncontrolledTooltip } from 'reactstrap';
import { findValueAtPath } from '../../utils/find';

import Validators from '../../utils/validators';
import ConjunctionGroup from './ConjunctionGroup';

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

  validateModifier = (modifier) => {
    let validationWarning = null;

    if (modifier.validator) {
      const validator = Validators[modifier.validator.type];
      const values = modifier.validator.fields.map(v => modifier.values[v]);
      const args = modifier.validator.args ? modifier.validator.args.map(v => modifier.values[v]) : [];
      if (!validator.check(values, args)) {
        validationWarning = validator.warning(modifier.validator.fields, modifier.validator.args);
      }
    }
    return validationWarning;
  }

  // Gets the returnType of the last valid modifier
  getReturnType = (elementReturnType, modifiers = []) => {
    let returnType = elementReturnType;
    if (modifiers.length === 0) return returnType;

    for (let index = modifiers.length - 1; index >= 0; index--) {
      const modifier = modifiers[index];
      if (this.validateModifier(modifier) === null) {
        returnType = modifier.returnType;
        break;
      }
    }

    return returnType;
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
      return currentReturnType;
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
      currentReturnType = this.getReturnType(firstChild.returnType, firstChild.modifiers);
      currentReturnType = this.promoteReturnTypeToList(currentReturnType);
    } else {
      currentReturnType = 'list_of_any';
    }

    let newReturnType;
    baseElementList.childInstances.forEach((child) => { // Base Element Lists can only go one child deep
      const incomingReturnType = this.getReturnType(child.returnType, child.modifiers);
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
      currentReturnType = this.getReturnType(firstChild.returnType, firstChild.modifiers);
    } else {
      currentReturnType = 'none';
    }

    let newReturnType;
    // Base Element And/Or Conjunctions can go multiple children deep so need recursion to check the type
    baseElementList.childInstances.forEach((child) => {
      let incomingReturnType = this.getReturnType(child.returnType, child.modifiers);
      if (child.childInstances) {
        incomingReturnType = this.getAndOrReturnTypeOfFullList(child);
      }
      const isOnlyElement = baseElementList.childInstances.length === 1;
      newReturnType = this.checkAndOrReturnTypeCompatibility(currentReturnType, incomingReturnType, isOnlyElement);
      currentReturnType = newReturnType;
    });

    return currentReturnType;
  }

  addInstance = (name, template, path, baseElement) => {
    const baseElementList = _.cloneDeep(baseElement);
    const currentReturnType = baseElementList.returnType;
    let newReturnType;
    if (baseElement.childInstances.length === 0) {
      // New return type will just be whatever the new element's type is.
      newReturnType = this.promoteReturnTypeToList(template.returnType);
    } else {
      // Need to check if incoming type will change the current return type.
      let incomingReturnType = this.getReturnType(template.returnType, template.modifiers);
      incomingReturnType = this.promoteReturnTypeToList(incomingReturnType);
      newReturnType = this.checkReturnTypeCompatibility(currentReturnType, incomingReturnType);
    }
    this.props.addInstance(name, template, path, baseElement.uniqueId, undefined, null, newReturnType);
  }

  // TODO can you condense these functions into the one? Or are there too many differences?
  addAndOrInstance = (name, template, path, baseElement) => {
    const baseElementList = _.cloneDeep(baseElement);
    const currentReturnType = baseElementList.returnType;
    let newReturnType;
    if (baseElement.childInstances.length === 0) {
      // New return type will just be whatever the new element's type is.
      newReturnType = template.returnType;
    } else {
      // Need to check if incoming type will change the current return type.
      const incomingReturnType = this.getReturnType(template.returnType, template.modifiers);
      const isOnlyElement = baseElementList.childInstances.length === 1;
      newReturnType = this.checkAndOrReturnTypeCompatibility(currentReturnType, incomingReturnType, isOnlyElement);
    }
    this.props.addInstance(name, template, path, baseElement.uniqueId, undefined, null, newReturnType);
  }

  editInstance = (treeName, params, path, editingConjunction, baseElement) => {
    this.props.editInstance(treeName, params, path, editingConjunction, baseElement.uniqueId);
  }

  deleteInstance = (treeName, path, toAdd, baseElement) => {
    // Temporarily remove the element that will be deleted to correctly calculate return type.
    const indexToRemove = path.slice(-1);
    const baseElementList = _.cloneDeep(baseElement);
    baseElementList.childInstances.splice(indexToRemove, 1);

    const currentReturnType = this.getReturnTypeOfFullList(baseElementList);
    this.props.deleteInstance(treeName, path, toAdd, baseElement.uniqueId, currentReturnType);
  }

  deleteAndOrInstance = (treeName, path, toAdd, baseElement) => {
    // Temporarily remove the element that will be deleted to correctly calculate return type.
    const indexToRemove = path.slice(-1);
    const baseElementList = _.cloneDeep(baseElement);
    const target = findValueAtPath(baseElementList, path.slice(0, path.length - 2));
    target.splice(indexToRemove, 1);
    // TODO what should Boolean AND None be?

    const currentReturnType = this.getAndOrReturnTypeOfFullList(baseElementList);
    this.props.deleteInstance(treeName, path, toAdd, baseElement.uniqueId, currentReturnType);
  }

  updateInstanceModifiers = (t, modifiers, path, index) => {
    const baseElementList = _.cloneDeep(this.props.baseElements[index]);
    if (!baseElementList) return;

    // Temporarily apply the modifiers that will be updated. Base Element Lists can only be one child deep.
    baseElementList.childInstances[path.slice(-1)].modifiers = modifiers;
    const currentReturnType = this.getReturnTypeOfFullList(baseElementList);
    this.props.updateInstanceModifiers(t, modifiers, path, index, currentReturnType);
  }

  updateAndOrInstanceModifiers = (t, modifiers, path, index) => {
    const baseElementList = _.cloneDeep(this.props.baseElements[index]);
    if (!baseElementList) return;

    // Temporarily apply the modifiers that will be updated. Base Element Lists can only be one child deep.
    const target = findValueAtPath(baseElementList, path);
    target.modifiers = modifiers;
    const currentReturnType = this.getAndOrReturnTypeOfFullList(baseElementList);
    this.props.updateInstanceModifiers(t, modifiers, path, index, currentReturnType);
  }

  isBaseElementListUsed = element => (element.usedBy ? element.usedBy.length !== 0 : false);

  renderAndOrConjunction = (s, baseElementListUsed) => {
    const { instance, index } = this.props;
    return (
      <div className="card-element__body">
        <div>
          <div className="return-type row">
            <div className="col-3 bold align-right return-type__label">Return Type:</div>
            <div className="col-7 return-type__value">
              {(_.startCase(s.returnType) === 'Boolean' || s.childInstances.length === 1)
                && <FontAwesome name="check" className="check" />}
              {_.startCase(s.returnType)}
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
          addInstance={(name, template, path) => this.addAndOrInstance(name, template, path, instance)}
          editInstance={(treeName, params, path, editingConjunction) =>
            this.editInstance(treeName, params, path, editingConjunction, instance)}
          deleteInstance={(treeName, path, toAdd) => this.deleteAndOrInstance(treeName, path, toAdd, instance)}
          getAllInstances={this.props.getAllInstances}
          updateInstanceModifiers={(t, modifiers, path) => this.updateAndOrInstanceModifiers(t, modifiers, path, index)}
          parameters={this.props.parameters}
          baseElements={this.props.baseElements}
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
          isValidatingCode={this.props.isValidatingCode}
          isValidCode={this.props.isValidCode}
          codeData={this.props.codeData}
          validateCode={this.props.validateCode}
          resetCodeValidation={this.props.resetCodeValidation}
          validateReturnType={true}
          inBaseElements={false}
          disableElement={baseElementListUsed}
        />
      </div>
    );
  }

  renderListGroup = (s) => {
    const { instance, index } = this.props;
    const baseElementListUsed = this.isBaseElementListUsed(s);
    const intersectAndUnion = s.id === 'Union' || s.id === 'Intersect';
    if (!intersectAndUnion) {
      return this.renderAndOrConjunction(s, baseElementListUsed);
    }
    return (
      <div className="card-element__body">
        <div>
          <div className="return-type row">
            <div className="col-3 bold align-right return-type__label">Return Type:</div>
            <div className="col-7 return-type__value">
              <FontAwesome name="check" className="check" />
              {_.startCase(s.returnType)}
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
          addInstance={(name, template, path) => this.addInstance(name, template, path, instance)}
          editInstance={(treeName, params, path, editingConjunction) =>
            this.editInstance(treeName, params, path, editingConjunction, instance)}
          deleteInstance={(treeName, path, toAdd) => this.deleteInstance(treeName, path, toAdd, instance)}
          getAllInstances={this.props.getAllInstances}
          updateInstanceModifiers={(t, modifiers, path) => this.updateInstanceModifiers(t, modifiers, path, index)}
          parameters={this.props.parameters}
          baseElements={this.props.baseElements}
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
          isValidatingCode={this.props.isValidatingCode}
          isValidCode={this.props.isValidCode}
          codeData={this.props.codeData}
          validateCode={this.props.validateCode}
          resetCodeValidation={this.props.resetCodeValidation}
          validateReturnType={false}
          options={'listOperations'}
          inBaseElements={true}
          disableElement={baseElementListUsed}
        />
      </div>
    );
  }

  renderList = (s, i) => {
    const name = s.parameters[0].value;
    const duplicateNameIndex = this.props.instanceNames.findIndex(n =>
      n.id !== s.uniqueId && n.name === s.parameters[0].value);
    const baseElementListUsed = this.isBaseElementListUsed(s);
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
                  this.updateBaseElementList(event.target.value, s.uniqueId);
                }}
              />
              {duplicateNameIndex !== -1
                && <div className='warning'>Warning: Name already in use. Choose another name.</div>}
                {s.returnType === 'list_of_any' && s.name === 'Intersect' && s.childInstances.length > 0
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
              <h4>{s.parameters[0].value}</h4>
            </div>
          }

          <div className="card-element__buttons">
            <button className="secondary-button" onClick={this.state.isExpanded ? this.collapse : this.expand}>
              {this.state.isExpanded ? 'Done' : 'Edit'}
            </button>

            <button
              aria-label="Remove base element list"
              className={`secondary-button ${disabledClass}`}
              id={`deletebutton-${s.uniqueId}`}
              onClick={() => this.deleteBaseElementList(s.uniqueId)}>
              <FontAwesome fixedWidth name='times' />
            </button>
            {baseElementListUsed &&
              <UncontrolledTooltip
                target={`deletebutton-${s.uniqueId}`} placement="left">
                To delete this Base Element List, remove all references to it.
            </UncontrolledTooltip>}
          </div>
        </div>

        {this.state.isExpanded && this.renderListGroup(s, i)}
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
  resetCodeValidation: PropTypes.func.isRequired
};
