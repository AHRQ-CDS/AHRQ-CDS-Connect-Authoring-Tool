import React, { Component } from 'react';
import PropTypes from 'prop-types';
import pluralize from 'pluralize';
import classnames from 'classnames';
import { IconButton } from '@mui/material';
import {
  ChatBubble as ChatBubbleIcon,
  Close as CloseIcon,
  ExpandLess as ExpandLessIcon,
  ExpandMore as ExpandMoreIcon,
  Sms as SmsIcon
} from '@mui/icons-material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExclamationCircle } from '@fortawesome/free-solid-svg-icons';
import { UncontrolledTooltip } from 'reactstrap';
import clsx from 'clsx';
import _ from 'lodash';

import { findValueAtPath } from 'utils/find';
import {
  doesBaseElementInstanceNeedWarning,
  hasDuplicateName,
  hasGroupNestedWarning,
  hasInvalidListWarning
} from 'utils/warnings';
import { getReturnType, getFieldWithId } from 'utils/instances';

import { DeleteConfirmationModal } from 'components/modals';
import { ReturnTypeTemplate } from 'components/builder/templates';
import ConjunctionGroup from './ConjunctionGroup';
import ExpressionPhrase from './ExpressionPhrase';
import StringField from './fields/StringField';
import TextAreaField from './fields/TextAreaField';

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
  'list_of_service_requests',
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
  'service_request',
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
  };

  expand = () => {
    this.setState({ isExpanded: true });
  };

  onEnterKey = e => {
    e.which = e.which || e.keyCode;
    if (e.which === 13) {
      if (this.state.isExpanded) this.collapse();
      else this.expand();
    }
  };

  toggleComment = () => {
    this.setState({ showComment: !this.state.showComment });
  };

  updateBaseElementList = (data, type, uniqueId) => {
    const newBaseElementLists = _.cloneDeep(this.props.artifact.baseElements);
    const baseElementIndex = this.props.artifact.baseElements.findIndex(
      baseElement => baseElement.uniqueId === uniqueId
    );
    const field = getFieldWithId(newBaseElementLists[baseElementIndex].fields, type);
    field.value = data;

    this.props.updateBaseElementLists(newBaseElementLists, 'baseElements');
  };

  deleteBaseElementList = uniqueId => {
    const newBaseElementLists = _.cloneDeep(this.props.artifact.baseElements);
    const baseElementIndex = this.props.artifact.baseElements.findIndex(
      baseElement => baseElement.uniqueId === uniqueId
    );
    newBaseElementLists.splice(baseElementIndex, 1);
    this.props.updateBaseElementLists(newBaseElementLists, 'baseElements');
  };

  openConfirmDeleteModal = uniqueId => {
    const newBaseElementLists = _.cloneDeep(this.props.artifact.baseElements);
    const baseElementIndex = this.props.artifact.baseElements.findIndex(
      baseElement => baseElement.uniqueId === uniqueId
    );
    const baseElementListIsInUse = this.isBaseElementListUsed(newBaseElementLists[baseElementIndex]);
    if (!baseElementListIsInUse) {
      this.setState({ showConfirmDeleteModal: true });
    }
  };

  closeConfirmDeleteModal = () => {
    this.setState({ showConfirmDeleteModal: false });
  };

  handleDeleteBaseElementList = () => {
    this.deleteBaseElementList(this.props.instance.uniqueId);
    this.closeConfirmDeleteModal();
  };

  promoteReturnTypeToList = returnType => {
    const isSingularElement = singularTypes.find(type => type === returnType);
    if (isSingularElement) {
      return `list_of_${pluralize.plural(returnType)}`;
    }
    return returnType;
  };

  checkReturnTypeCompatibility = (currentReturnType, incomingReturnType) => {
    const incomingReturnTypeOrPromoted = this.promoteReturnTypeToList(incomingReturnType);
    const isListElement = listTypes.find(type => type === incomingReturnTypeOrPromoted);
    if (currentReturnType === incomingReturnTypeOrPromoted && isListElement) {
      return incomingReturnTypeOrPromoted;
    }
    return 'list_of_any';
  };

  checkAndOrReturnTypeCompatibility = (currentReturnType, incomingReturnType, isOnlyElement) => {
    const booleanAndNull =
      (_.lowerCase(incomingReturnType) === 'none' && _.lowerCase(currentReturnType) === 'boolean') ||
      (_.lowerCase(incomingReturnType) === 'boolean' && _.lowerCase(currentReturnType) === 'none');

    if ((currentReturnType === incomingReturnType && _.lowerCase(currentReturnType) === 'boolean') || isOnlyElement) {
      return incomingReturnType;
    } else if (booleanAndNull) {
      return 'boolean';
    }
    return 'invalid';
  };

  getReturnTypeOfFullList = baseElementList => {
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
    baseElementList.childInstances.forEach(child => {
      // Base Element Lists can only go one child deep
      const incomingReturnType = getReturnType(child.returnType, child.modifiers);
      newReturnType = this.checkReturnTypeCompatibility(currentReturnType, incomingReturnType);
      currentReturnType = newReturnType;
    });

    return currentReturnType;
  };

  getAndOrReturnTypeOfFullList = baseElementList => {
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
    baseElementList.childInstances.forEach(child => {
      let incomingReturnType = getReturnType(child.returnType, child.modifiers);
      if (child.childInstances) {
        incomingReturnType = this.getAndOrReturnTypeOfFullList(child);
      }
      const isOnlyElement = baseElementList.childInstances.length === 1;
      newReturnType = this.checkAndOrReturnTypeCompatibility(currentReturnType, incomingReturnType, isOnlyElement);
      currentReturnType = newReturnType;
    });

    return currentReturnType;
  };

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
  };

  editInstance = (treeName, fields, path, editingConjunction, baseElement) => {
    this.props.editInstance(treeName, fields, path, editingConjunction, baseElement.uniqueId);
  };

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
  };

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
  };

  isBaseElementListUsed = element => (element.usedBy ? element.usedBy.length !== 0 : false);

  hasNestedWarnings = childInstances => {
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
  };

  renderListGroup = () => {
    const { instance, index, baseElements } = this.props;
    const baseElementListUsed = this.isBaseElementListUsed(instance);
    const isAndOrElement = instance.id === 'And' || instance.id === 'Or';
    let showCheck = true;
    if (isAndOrElement)
      showCheck = _.startCase(instance.returnType) === 'Boolean' || instance.childInstances.length === 1;

    return (
      <div className="card-element__body">
        <div>
          {isAndOrElement && hasInvalidListWarning(instance.returnType) && (
            <div className="warning">
              Warning: Elements in groups combined with and/or must all have return type 'boolean'.
            </div>
          )}

          <ExpressionPhrase class="expression expression__group" instance={instance} baseElements={baseElements} />

          <ReturnTypeTemplate returnType={_.startCase(instance.returnType)} returnTypeIsValid={showCheck} />
        </div>

        <ConjunctionGroup
          addInstance={(name, template, path) => this.addInstance(name, template, path, instance, isAndOrElement)}
          artifact={this.props.artifact}
          baseElements={this.props.baseElements}
          conversionFunctions={this.props.conversionFunctions}
          deleteInstance={(treeName, path, toAdd) =>
            this.deleteInstance(treeName, path, toAdd, instance, isAndOrElement)
          }
          disableAddElement={baseElementListUsed}
          disableIndent={!isAndOrElement}
          editInstance={(treeName, fields, path, editingConjunction) =>
            this.editInstance(treeName, fields, path, editingConjunction, instance)
          }
          elementUniqueId={instance.uniqueId}
          getAllInstances={this.getAllInstances}
          getAllInstancesInAllTrees={this.props.getAllInstancesInAllTrees}
          instance={this.props.instance}
          instanceNames={this.props.instanceNames}
          isLoadingModifiers={this.props.isLoadingModifiers}
          modifierMap={this.props.modifierMap}
          modifiersByInputType={this.props.modifiersByInputType}
          options={isAndOrElement ? '' : 'listOperations'}
          parameters={this.props.parameters}
          root={true}
          templates={this.props.templates}
          treeName={this.props.treeName}
          updateInstanceModifiers={(t, modifiers, path) =>
            this.updateInstanceModifiers(t, modifiers, path, index, isAndOrElement)
          }
          validateReturnType={isAndOrElement}
          vsacApiKey={this.props.vsacApiKey}
        />
      </div>
    );
  };

  renderList = () => {
    const { baseElements, getAllInstancesInAllTrees, instance, instanceNames, parameters } = this.props;
    const { isExpanded, showComment, showConfirmDeleteModal } = this.state;
    const name = getFieldWithId(instance.fields, 'element_name').value;
    const comment = getFieldWithId(instance.fields, 'comment').value;
    const allInstancesInAllTrees = getAllInstancesInAllTrees();
    const elementName = getFieldWithId(instance.fields, 'element_name').value;

    const needsDuplicateNameWarning = hasDuplicateName(
      instance,
      instanceNames,
      baseElements,
      parameters,
      allInstancesInAllTrees
    );
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
            {isExpanded ? (
              <div className="card-element__heading">
                <div className="card-field">
                  <div className="card-label">List Group:</div>

                  <div className="card-input">
                    <StringField
                      field={{ id: 'base_element_name', value: name }}
                      handleUpdateField={value => {
                        this.updateBaseElementList(value.base_element_name, 'element_name', instance.uniqueId);
                      }}
                    />
                  </div>
                </div>

                {showComment && (
                  <div className="card-field">
                    <div className="card-label">Comment:</div>

                    <div className="card-input">
                      <TextAreaField
                        field={{ id: 'base_comment', value: comment }}
                        handleUpdateField={value => {
                          this.updateBaseElementList(value.base_comment, 'comment', instance.uniqueId);
                        }}
                      />
                    </div>
                  </div>
                )}

                {needsDuplicateNameWarning && !needsBaseElementWarning && (
                  <div className="warning">Warning: Name already in use. Choose another name.</div>
                )}

                {needsBaseElementWarning && (
                  <div className="warning">
                    Warning: One or more uses of this Base Element have changed. Choose another name.
                  </div>
                )}

                {needsIntersectionWarning && (
                  <div className="warning">
                    Warning: Intersecting different types will always result in an empty list.
                  </div>
                )}
              </div>
            ) : (
              <div className="card-element__heading">
                <div className="heading-name">
                  {name}:
                  {needsHasWarningsWarning && (
                    <div className="warning">
                      <FontAwesomeIcon icon={faExclamationCircle} /> Has warnings
                    </div>
                  )}
                </div>
              </div>
            )}

            <div className="card-element__buttons">
              {isExpanded && (
                <IconButton
                  aria-label="show comment"
                  className={clsx(hasComment && 'has-comment')}
                  color="primary"
                  onClick={this.toggleComment}
                  size="large"
                >
                  {hasComment ? <SmsIcon fontSize="small" /> : <ChatBubbleIcon fontSize="small" />}
                </IconButton>
              )}

              <IconButton
                aria-label={`hide ${name}`}
                color="primary"
                onClick={isExpanded ? this.collapse : this.expand}
                size="large"
              >
                {isExpanded ? <ExpandLessIcon fontSize="small" /> : <ExpandMoreIcon fontSize="small" />}
              </IconButton>

              <span id={`deletebutton-${instance.uniqueId}`}>
                <IconButton
                  aria-label="remove base element list"
                  color="primary"
                  disabled={baseElementListUsed}
                  onClick={() => this.openConfirmDeleteModal(instance.uniqueId)}
                  size="large"
                >
                  <CloseIcon fontSize="small" />
                </IconButton>
              </span>

              {baseElementListUsed && (
                <UncontrolledTooltip target={`deletebutton-${instance.uniqueId}`} placement="left">
                  To delete this Base Element List, remove all references to it.
                </UncontrolledTooltip>
              )}
            </div>
          </div>

          {!isExpanded && (
            <ExpressionPhrase
              class="expression expression__group expression-collapsed"
              instance={instance}
              baseElements={baseElements}
            />
          )}
        </div>

        {isExpanded && this.renderListGroup()}

        {showConfirmDeleteModal && (
          <DeleteConfirmationModal
            deleteType="List Group"
            handleCloseModal={this.closeConfirmDeleteModal}
            handleDelete={this.handleDeleteBaseElementList}
          >
            <div>List Group: {elementName ? elementName : 'unnamed'}</div>
          </DeleteConfirmationModal>
        )}
      </div>
    );
  };

  render() {
    return (
      <div className="subpopulation card-group card-group__top">
        {this.renderList(this.props.instance, this.props.index)}
      </div>
    );
  }
}

ListGroup.propTypes = {
  addInstance: PropTypes.func.isRequired,
  artifact: PropTypes.object,
  baseElements: PropTypes.array.isRequired,
  conversionFunctions: PropTypes.array,
  deleteInstance: PropTypes.func.isRequired,
  editInstance: PropTypes.func.isRequired,
  getAllInstances: PropTypes.func.isRequired,
  getAllInstancesInAllTrees: PropTypes.func.isRequired,
  index: PropTypes.number.isRequired,
  instance: PropTypes.object.isRequired,
  instanceNames: PropTypes.array.isRequired,
  isLoadingModifiers: PropTypes.bool,
  modifierMap: PropTypes.object.isRequired,
  modifiersByInputType: PropTypes.object.isRequired,
  parameters: PropTypes.array.isRequired,
  templates: PropTypes.array,
  treeName: PropTypes.string.isRequired,
  updateBaseElementLists: PropTypes.func.isRequired,
  updateInstanceModifiers: PropTypes.func.isRequired,
  vsacApiKey: PropTypes.string
};
