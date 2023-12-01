import React from 'react';
import PropTypes from 'prop-types';
import { GroupElement } from './group-element';
import ConjunctionGroup from './ConjunctionGroup';

const Subpopulation = ({
  addInstance,
  alerts,
  deleteInstance,
  disableDeleteSubpopulationElement,
  editInstance,
  handleDeleteSubpopulationElement,
  handleUpdateSubpopulationElement,
  hasErrors,
  subpopulation,
  subpopulationUniqueId,
  updateInstanceModifiers
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
        baseIndentLevel={1}
        deleteInstance={deleteInstance}
        editInstance={editInstance}
        instance={subpopulation}
        root={true}
        subpopulationUniqueId={subpopulationUniqueId}
        treeName={'subpopulations'}
        updateInstanceModifiers={updateInstanceModifiers}
      />
    </GroupElement>
  );
};

Subpopulation.propTypes = {
  addInstance: PropTypes.func.isRequired,
  alerts: PropTypes.array,
  deleteInstance: PropTypes.func.isRequired,
  disableDeleteSubpopulationElement: PropTypes.bool.isRequired,
  editInstance: PropTypes.func.isRequired,
  handleDeleteSubpopulationElement: PropTypes.func.isRequired,
  handleUpdateSubpopulationElement: PropTypes.func.isRequired,
  hasErrors: PropTypes.bool.isRequired,
  subpopulation: PropTypes.object.isRequired,
  subpopulationUniqueId: PropTypes.string.isRequired,
  updateInstanceModifiers: PropTypes.func.isRequired
};

export default Subpopulation;
