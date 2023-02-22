import React from 'react';
import PropTypes from 'prop-types';
import { GroupElement } from './group-element';
import ConjunctionGroup from './ConjunctionGroup';

const Subpopulation = ({
  addInstance,
  alerts,
  artifact,
  baseElements,
  deleteInstance,
  disableDeleteSubpopulationElement,
  editInstance,
  getAllInstancesInAllTrees,
  handleDeleteSubpopulationElement,
  handleUpdateSubpopulationElement,
  hasErrors,
  instanceNames,
  isLoadingModifiers,
  modifiersByInputType,
  parameters,
  subpopulation,
  subpopulationUniqueId,
  templates,
  updateInstanceModifiers,
  vsacApiKey
}) => {
  return (
    <GroupElement
      alerts={alerts}
      allowComment={false}
      disable={disableDeleteSubpopulationElement}
      disableTitleField={disableDeleteSubpopulationElement}
      groupInstance={subpopulation}
      groupTitleField={{ id: 'subpopulation_title', value: subpopulation.subpopulationName }}
      handleAddElement={() => {}} // Adding elements isn't handled by this wrapper GroupElement
      handleDeleteElement={() => handleDeleteSubpopulationElement(subpopulation.uniqueId)}
      handleUpdateElement={field => handleUpdateSubpopulationElement(field.subpopulation_title, subpopulation.uniqueId)}
      hasErrors={hasErrors}
      label={'Subpopulation'}
      indentParity={'odd'}
      isWrapper
      root={false}
    >
      <ConjunctionGroup
        addInstance={addInstance}
        artifact={artifact}
        baseElements={baseElements}
        baseIndentLevel={1}
        deleteInstance={deleteInstance}
        editInstance={editInstance}
        getAllInstancesInAllTrees={getAllInstancesInAllTrees}
        instance={subpopulation}
        instanceNames={instanceNames}
        isLoadingModifiers={isLoadingModifiers}
        modifiersByInputType={modifiersByInputType}
        parameters={parameters}
        root={true}
        subpopulationUniqueId={subpopulationUniqueId}
        templates={templates}
        treeName={'subpopulations'}
        updateInstanceModifiers={updateInstanceModifiers}
        vsacApiKey={vsacApiKey}
      />
    </GroupElement>
  );
};

Subpopulation.propTypes = {
  addInstance: PropTypes.func.isRequired,
  alerts: PropTypes.array,
  artifact: PropTypes.object,
  baseElements: PropTypes.array.isRequired,
  deleteInstance: PropTypes.func.isRequired,
  disableDeleteSubpopulationElement: PropTypes.bool.isRequired,
  editInstance: PropTypes.func.isRequired,
  getAllInstancesInAllTrees: PropTypes.func.isRequired,
  handleDeleteSubpopulationElement: PropTypes.func.isRequired,
  handleUpdateSubpopulationElement: PropTypes.func.isRequired,
  hasErrors: PropTypes.bool.isRequired,
  instanceNames: PropTypes.array.isRequired,
  isLoadingModifiers: PropTypes.bool,
  modifiersByInputType: PropTypes.object.isRequired,
  parameters: PropTypes.array,
  subpopulation: PropTypes.object.isRequired,
  subpopulationUniqueId: PropTypes.string.isRequired,
  templates: PropTypes.array,
  updateInstanceModifiers: PropTypes.func.isRequired,
  vsacApiKey: PropTypes.string
};

export default Subpopulation;
