import React, { Component } from 'react';
import PropTypes from 'prop-types';
import pluralize from 'pluralize';
import classnames from 'classnames';
import { IconButton } from '@material-ui/core';
import {
  ChatBubble as ChatBubbleIcon,
  Close as CloseIcon,
  ExpandLess as ExpandLessIcon,
  ExpandMore as ExpandMoreIcon,
  Sms as SmsIcon
} from '@material-ui/icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faExclamationCircle } from '@fortawesome/free-solid-svg-icons';
import { UncontrolledTooltip } from 'reactstrap';
import clsx from 'clsx';
import _ from 'lodash';

import { findValueAtPath } from '../../utils/find';
import { doesBaseElementInstanceNeedWarning, hasDuplicateName, hasGroupNestedWarning, hasInvalidListWarning }
  from '../../utils/warnings';
import { getReturnType, getFieldWithId } from '../../utils/instances';

import { Modal } from 'components/elements';
import ConjunctionGroup from './ConjunctionGroup';
import ExpressionPhrase from './modifiers/ExpressionPhrase';
import StringField from './fields/StringField';
import TextAreaField from "./fields/TextAreaField";

const listTypes = [
  'list_of_observations',
  'list_of_conditions',
  'list_of_medication_statements',
  'list_of_medication_requests',
  'list_of_procedures',
  'list_of_allergy_intolerances',
  'list_of_encounters',
  'list_of_immunizations',
  'devices',
  'list_of_booleans',
  'list_of_system_quantities',
  'list_of_system_concepts',
  'list_of_any'
];

const singularTypes = [
  'observation',
  'condition',
  'medication_statement',
  'medication_request',
  'procedure',
  'allergy_intolerance',
  'encounter',
  'immunization',
  'device',
  'boolean',
  'system_quantity',
  'system_concept'
];

export default class ListGroup extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isExpanded: true,
      showComment: false,
      showConfirmDeleteModal: false
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

  toggleComment = () => {
    this.setState({ showComment: !this.state.showComment });
  }

  updateBaseElementList = (data, type, uniqueId) => {
    const newBaseElementLists = _.cloneDeep(this.props.artifact.baseElements);
    const baseElementIndex = this.props.artifact.baseElements.findIndex(baseElement =>
      baseElement.uniqueId === uniqueId);
    const field = getFieldWithId(newBaseElementLists[baseElementIndex].fields, type);
    field.value = data;

    this.props.updateBaseElementLists(newBaseElementLists, 'baseElements');
  }

  deleteBaseElementList = (uniqueId) => {
    const newBaseElementLists = _.cloneDeep(this.props.artifact.baseElements);
    const baseElementIndex = this.props.artifact.baseElements.findIndex(baseElement =>
      baseElement.uniqueId === uniqueId);
    newBaseElementLists.splice(baseElementIndex, 1);
    this.props.updateBaseElementLists(newBaseElementLists, 'baseElements');
  }

  openConfirmDeleteModal = (uniqueId) => {
    const newBaseElementLists = _.cloneDeep(this.props.artifact.baseElements);
    const baseElementIndex = this.props.artifact.baseElements.findIndex(baseElement =>
      baseElement.uniqueId === uniqueId);
    const baseElementListIsInUse = this.isBaseElementListUsed(newBaseElementLists[baseElementIndex]);
    if (!baseElementListIsInUse) {
      this.setState({ showConfirmDeleteModal: true });
    }
  }

  closeConfirmDeleteModal = () => {
    this.setState({ showConfirmDeleteModal: false });
  }

  handleDeleteBaseElementList = () => {
    this.deleteBaseElementList(this.props.instance.uniqueId);
    this.closeConfirmDeleteModal();
  }

  renderConfirmDeleteModal() {
    const elementName = getFieldWithId(this.props.instance.fields, 'element_name').value;

    return (
      <Modal
        title="Delete List Group Confirmation"
        submitButtonText="Delete"
        handleShowModal={this.state.showConfirmDeleteModal}
        handleCloseModal={this.closeConfirmDeleteModal}
        handleSaveModal={this.handleDeleteBaseElementList}
      >
        <div className="delete-list-group-confirmation-modal modal__content">
          <h5>
            {`Are you sure you want to permanently delete
              ${elementName ? 'the following' : 'this unnamed'} list group?`}
          </h5>

          {elementName && <div className="list-group-info">
            <span>List Group: </span>
            <span>{elementName}</span>
          </div>}
        </div>
      </Modal>
    );
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

  editInstance = (treeName, fields, path, editingConjunction, baseElement) => {
    this.props.editInstance(treeName, fields, path, editingConjunction, baseElement.uniqueId);
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
    const { instanceNames, baseElements, parameters, getAllInstancesInAllTrees, instance } = this.props;
    const isAndOrElement = instance.id === 'And' || instance.id === 'Or';
    const allInstancesInAllTrees = getAllInstancesInAllTrees();
    const hasNestedWarning = hasGroupNestedWarning(
      childInstances,
      instanceNames,
      baseElements,
      parameters,
      allInstancesInAllTrees,
      isAndOrElement
    );
    return hasNestedWarning;
  }

  renderListGroup = () => {
    const { instance, index, baseElements } = this.props;
    const baseElementListUsed = this.isBaseElementListUsed(instance);
    const isAndOrElement = instance.id === 'And' || instance.id === 'Or';
    return (
      <div className="card-element__body">
        <div>
          {isAndOrElement && hasInvalidListWarning(instance.returnType) &&
            <div className="warning">
              Warning: Elements in groups combined with and/or must all have return type 'boolean'.
            </div>
          }

          <ExpressionPhrase
            class="expression expression__group"
            instance={instance}
            baseElements={baseElements}
          />

          <div className="return-type">
            <div className="label">Return Type:</div>

            <div className="return-type__value">
              {
                isAndOrElement &&
                (_.startCase(instance.returnType) === 'Boolean' || instance.childInstances.length === 1) &&
                <FontAwesomeIcon icon={faCheck} className="check" />
              }

              {!isAndOrElement && <FontAwesomeIcon icon={faCheck} className="check" />}
              {_.startCase(instance.returnType)}
            </div>
          </div>
        </div>

        <ConjunctionGroup
          root={true}
          treeName={this.props.treeName}
          artifact={this.props.artifact}
          templates={this.props.templates}
          instance={this.props.instance}
          addInstance={(name, template, path) => this.addInstance(name, template, path, instance, isAndOrElement)}
          editInstance={(treeName, fields, path, editingConjunction) =>
            this.editInstance(treeName, fields, path, editingConjunction, instance)}
          deleteInstance={(treeName, path, toAdd) =>
            this.deleteInstance(treeName, path, toAdd, instance, isAndOrElement)}
          getAllInstances={this.getAllInstances}
          getAllInstancesInAllTrees={this.props.getAllInstancesInAllTrees}
          updateInstanceModifiers={(t, modifiers, path) =>
            this.updateInstanceModifiers(t, modifiers, path, index, isAndOrElement)}
          parameters={this.props.parameters}
          baseElements={this.props.baseElements}
          externalCqlList={this.props.externalCqlList}
          loadExternalCqlList={this.props.loadExternalCqlList}
          modifierMap={this.props.modifierMap}
          modifiersByInputType={this.props.modifiersByInputType}
          isLoadingModifiers={this.props.isLoadingModifiers}
          conversionFunctions={this.props.conversionFunctions}
          instanceNames={this.props.instanceNames}
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
          vsacApiKey={this.props.vsacApiKey}
          vsacIsAuthenticating={this.props.vsacIsAuthenticating}
          isValidatingCode={this.props.isValidatingCode}
          isValidCode={this.props.isValidCode}
          codeData={this.props.codeData}
          validateCode={this.props.validateCode}
          resetCodeValidation={this.props.resetCodeValidation}
          validateReturnType={isAndOrElement}
          options={isAndOrElement ? '' : 'listOperations'}
          disableIndent={!isAndOrElement}
          disableAddElement={baseElementListUsed}
          elementUniqueId={instance.uniqueId}
        />
      </div>
    );
  }

  renderList = () => {
    const { instance, instanceNames, baseElements, parameters } = this.props;
    const { isExpanded, showComment } = this.state;
    const name = getFieldWithId(instance.fields, 'element_name').value;
    const comment = getFieldWithId(instance.fields,'comment').value;
    const allInstancesInAllTrees = this.props.getAllInstancesInAllTrees();

    const needsDuplicateNameWarning
      = hasDuplicateName(instance, instanceNames, baseElements, parameters, allInstancesInAllTrees);
    const needsBaseElementWarning = doesBaseElementInstanceNeedWarning(instance, allInstancesInAllTrees);
    const needsIntersectionWarning =
      instance.returnType === 'list_of_any' && instance.name === 'Intersect' && instance.childInstances.length > 0;
    const needsHasWarningsWarning =
      needsDuplicateNameWarning || needsBaseElementWarning || this.hasNestedWarnings(instance.childInstances);

    const baseElementListUsed = this.isBaseElementListUsed(instance);
    const headerClass = classnames('card-element__header', { collapsed: !isExpanded });
    const headerTopClass = classnames('card-element__header-top', { collapsed: !isExpanded });
    const hasComment = comment && comment !== '';

    return (
      <div className="card-element">
        <div className={headerClass}>
          <div className={headerTopClass}>
            {isExpanded ?
              <div className="card-element__heading">
                <StringField
                  id="base_element_name"
                  name="Group"
                  uniqueId={instance.uniqueId}
                  updateInstance={value => {
                    this.updateBaseElementList(value.base_element_name, "element_name", instance.uniqueId);
                  }}
                  value={name}
                />

                {showComment &&
                  <TextAreaField
                    id="base_comment"
                    name="Comment"
                    value={comment}
                    updateInstance={value => {
                      this.updateBaseElementList(value.base_comment, "comment", instance.uniqueId);
                    }}
                  />
                }

                {needsDuplicateNameWarning && !needsBaseElementWarning &&
                  <div className="warning">Warning: Name already in use. Choose another name.</div>
                }

                {needsBaseElementWarning &&
                  <div className="warning">
                    Warning: One or more uses of this Base Element have changed. Choose another name.
                  </div>
                }

                {needsIntersectionWarning &&
                  <div className="warning">
                    Warning: Intersecting different types will always result in an empty list
                  </div>
                }
              </div>
              :
              <div className="card-element__heading">
                <div className="heading-name">
                  {name}:
                  {needsHasWarningsWarning &&
                    <div className="warning"><FontAwesomeIcon icon={faExclamationCircle} /> Has warnings</div>
                  }
                </div>
              </div>
            }

            <div className="card-element__buttons">
              {isExpanded &&
                <IconButton
                  aria-label="show comment"
                  className={clsx(hasComment && 'has-comment')}
                  color="primary"
                  onClick={this.toggleComment}
                >
                  {hasComment ? <SmsIcon fontSize="small" /> : <ChatBubbleIcon fontSize="small" />}
                </IconButton>
              }

              <IconButton
                aria-label={`hide ${name}`}
                color="primary"
                onClick={isExpanded ? this.collapse : this.expand}
              >
                {isExpanded ? <ExpandLessIcon fontSize="small" /> : <ExpandMoreIcon fontSize="small" />}
              </IconButton>

              <span id={`deletebutton-${instance.uniqueId}`}>
                <IconButton
                  aria-label="remove base element list"
                  color="primary"
                  disabled={baseElementListUsed}
                  onClick={() => this.openConfirmDeleteModal(instance.uniqueId)}
                >
                  <CloseIcon fontSize="small" />
                </IconButton>
              </span>

              {baseElementListUsed &&
                <UncontrolledTooltip target={`deletebutton-${instance.uniqueId}`} placement="left">
                  To delete this Base Element List, remove all references to it.
                </UncontrolledTooltip>
              }
            </div>
          </div>

          {!isExpanded &&
            <ExpressionPhrase
              class="expression expression__group expression-collapsed"
              instance={instance}
              baseElements={baseElements}
            />
          }
        </div>

        {isExpanded && this.renderListGroup()}
        {this.renderConfirmDeleteModal()}
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
  externalCqlList: PropTypes.array.isRequired,
  loadExternalCqlList: PropTypes.func.isRequired,
  modifierMap: PropTypes.object.isRequired,
  modifiersByInputType: PropTypes.object.isRequired,
  isLoadingModifiers: PropTypes.bool,
  conversionFunctions: PropTypes.array,
  instanceNames: PropTypes.array.isRequired,
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
  vsacApiKey: PropTypes.string,
  vsacIsAuthenticating: PropTypes.bool.isRequired,
  isValidatingCode: PropTypes.bool.isRequired,
  isValidCode: PropTypes.bool,
  codeData: PropTypes.object,
  validateCode: PropTypes.func.isRequired,
  resetCodeValidation: PropTypes.func.isRequired,
  scrollToElement: PropTypes.func.isRequired,
};
