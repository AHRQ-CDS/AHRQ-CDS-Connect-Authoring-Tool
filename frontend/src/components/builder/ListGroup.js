import React from 'react';
import PropTypes from 'prop-types';
import { GroupElement } from './group-element';
import ConjunctionGroup from './ConjunctionGroup';
import { getFieldWithId } from 'utils/instances';
import {
  isElementAndOr,
  isBaseElementListUsed,
  calculateNewReturnType,
  calculateReturnTypeAfterElementRemoved,
  calculateReturnTypeWithNewModifiers
} from 'utils/lists';
import { getListGroupErrors, hasGroupNestedWarning } from 'utils/warnings';
import { getAllElements, getElementNames } from 'components/builder/utils';
import { useSelector } from 'react-redux';

const ListGroup = ({
  addInstance,
  deleteInstance,
  deleteLists,
  editInstance,
  listInstance,
  updateInstanceModifiers,
  updateLists
}) => {
  const artifact = useSelector(state => state.artifacts.artifact);
  const allElements = getAllElements(artifact) ?? [];
  const instanceNames = getElementNames(allElements);
  const baseElements = artifact.baseElements;
  const parameters = artifact.parameters.filter(({ name }) => name?.length);
  const isListInstanceUsed = isBaseElementListUsed(listInstance);
  const isAndOrElement = isElementAndOr(listInstance.id);
  const alerts = getListGroupErrors(listInstance, instanceNames, baseElements, parameters, allElements);
  const hasNestedWarning = hasGroupNestedWarning(
    listInstance.childInstances,
    instanceNames,
    baseElements,
    parameters,
    allElements,
    isAndOrElement
  );
  const hasErrors = alerts.filter(a => a.showAlert && a.alertSeverity === 'error').length > 0 || hasNestedWarning;

  const updateElement = field => {
    const fieldId = Object.keys(field)[0];
    const value = field[fieldId];
    const fieldToUpdate = getFieldWithId(listInstance.fields, fieldId);
    fieldToUpdate.value = value;
    updateLists(listInstance);
  };

  const addInstanceInGroup = (name, template, path) => {
    const newReturnType = calculateNewReturnType(listInstance, template, path);
    return addInstance(name, template, path, listInstance.uniqueId, undefined, null, newReturnType);
  };

  const deleteInstanceInGroup = (treeName, path, toAdd) => {
    const newReturnType = calculateReturnTypeAfterElementRemoved(listInstance, path, toAdd);
    return deleteInstance(treeName, path, toAdd, listInstance.uniqueId, newReturnType);
  };

  const editInstanceInGroup = (treeName, fields, path, editingConjunction) => {
    return editInstance(treeName, fields, path, editingConjunction, listInstance.uniqueId);
  };

  const updateInstanceModifiersInGroup = (treeName, modifiers, path) => {
    const newReturnType = calculateReturnTypeWithNewModifiers(listInstance, modifiers, path);
    return updateInstanceModifiers(treeName, modifiers, path, listInstance.uniqueId, newReturnType);
  };

  return (
    <GroupElement
      alerts={alerts}
      disable={isListInstanceUsed}
      disableTitleField={false}
      groupInstance={listInstance}
      handleAddElement={() => {}} // Adding elements isn't handled by this wrapper GroupElement
      handleDeleteElement={deleteLists}
      handleUpdateElement={field => updateElement(field)}
      hasErrors={hasErrors}
      indentParity={'odd'}
      isWrapper
      label={'List Group'}
      showReturnType
      root={false}
    >
      <ConjunctionGroup
        addInstance={addInstanceInGroup}
        baseIndentLevel={1}
        deleteInstance={deleteInstanceInGroup}
        disableAddElement={isListInstanceUsed}
        disableIndent={!isAndOrElement}
        editInstance={editInstanceInGroup}
        elementUniqueId={listInstance.uniqueId} // Ensures the current Base Element list isn't added to itself from ElementSelect
        instance={listInstance}
        options={isAndOrElement ? '' : 'listOperations'}
        root={true}
        treeName={'baseElements'}
        updateInstanceModifiers={updateInstanceModifiersInGroup}
        validateReturnType={isAndOrElement}
      />
    </GroupElement>
  );
};

ListGroup.propTypes = {
  addInstance: PropTypes.func.isRequired,
  deleteInstance: PropTypes.func.isRequired,
  deleteLists: PropTypes.func.isRequired,
  editInstance: PropTypes.func.isRequired,
  listInstance: PropTypes.object.isRequired,
  updateInstanceModifiers: PropTypes.func.isRequired,
  updateLists: PropTypes.func.isRequired
};

export default ListGroup;
