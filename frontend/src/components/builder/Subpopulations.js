import React from 'react';
import PropTypes from 'prop-types';
import { Button } from '@mui/material';
import _ from 'lodash';

import Subpopulation from './Subpopulation';
import createTemplateInstance from 'utils/templates';
import { getSubpopulationErrors, hasGroupNestedWarning, isSubpopulationUsed } from 'utils/warnings';

const TREE_NAME = 'subpopulations';

const Subpopulations = ({
  addInstance,
  artifact,
  baseElements,
  deleteInstance,
  editInstance,
  getAllInstancesInAllTrees,
  instanceNames,
  isLoadingModifiers,
  modifiersByInputType,
  parameters,
  subpopulations,
  templates,
  updateInstanceModifiers,
  updateSubpopulations,
  vsacApiKey
}) => {
  const operations = templates.find(g => g.name === 'Operations');
  const andTemplate = operations.entries.find(e => e.name === 'And');

  const numOfSpecialSubpopulations = subpopulations.filter(s => s.special).length;
  const allInstancesInAllTrees = getAllInstancesInAllTrees();

  const addSubpopulation = () => {
    const newSubpopulation = createTemplateInstance(andTemplate);
    newSubpopulation.name = '';
    newSubpopulation.path = '';
    newSubpopulation.subpopulationName = `Subpopulation ${subpopulations.length - numOfSpecialSubpopulations + 1}`;
    newSubpopulation.expanded = true;
    const newSubpopulations = subpopulations.concat([newSubpopulation]);

    updateSubpopulations(newSubpopulations, TREE_NAME);
  };

  const setSubpopulationName = (name, uniqueId) => {
    const newSubpopulations = _.cloneDeep(subpopulations);
    const subpopulationIndex = subpopulations.findIndex(sp => sp.uniqueId === uniqueId);
    newSubpopulations[subpopulationIndex].subpopulationName = name;

    updateSubpopulations(newSubpopulations, TREE_NAME);
  };

  const deleteSubpopulation = uniqueId => {
    const newSubpopulations = _.cloneDeep(subpopulations);
    const subpopulationIndex = newSubpopulations.findIndex(sp => sp.uniqueId === uniqueId);
    newSubpopulations.splice(subpopulationIndex, 1);

    // Update Subpopulations and update FHIRVersion because
    // elements that required a specific FHIR version may have been removed.
    // Because deleteInstance isn't called directly, we need to check here.
    updateSubpopulations(newSubpopulations, TREE_NAME, true);
  };

  return (
    <div className="subpopulations">
      {subpopulations
        .filter(s => !s.special)
        .map((subpopulation, i) => {
          const subpopulationAlerts = getSubpopulationErrors(subpopulation, artifact.recommendations, instanceNames);
          const hasNestedWarning = hasGroupNestedWarning(
            subpopulation.childInstances,
            instanceNames,
            baseElements,
            parameters,
            allInstancesInAllTrees,
            true // validate
          );
          const hasErrors =
            subpopulationAlerts.filter(a => a.showAlert && a.alertSeverity === 'error').length > 0 || hasNestedWarning;
          return (
            <Subpopulation
              key={subpopulation.uniqueId}
              addInstance={(name, template, path) => addInstance(name, template, path, subpopulation.uniqueId)} // Add elements inside subpopulations
              alerts={subpopulationAlerts}
              artifact={artifact}
              baseElements={baseElements}
              deleteInstance={(treeName, path, toAdd) => deleteInstance(treeName, path, toAdd, subpopulation.uniqueId)} // Delete elements inside subpopulations
              disableDeleteSubpopulationElement={isSubpopulationUsed(artifact.recommendations, subpopulation.uniqueId)}
              editInstance={(treeName, fields, path, editingConjunction) =>
                editInstance(treeName, fields, path, editingConjunction, subpopulation.uniqueId)
              } // Edit elements inside subpopulations
              getAllInstancesInAllTrees={getAllInstancesInAllTrees}
              handleDeleteSubpopulationElement={deleteSubpopulation}
              handleUpdateSubpopulationElement={setSubpopulationName}
              hasErrors={hasErrors}
              instanceNames={instanceNames}
              isLoadingModifiers={isLoadingModifiers}
              modifiersByInputType={modifiersByInputType}
              parameters={parameters}
              subpopulation={subpopulation}
              subpopulationUniqueId={subpopulation.uniqueId}
              templates={templates}
              updateInstanceModifiers={updateInstanceModifiers}
              vsacApiKey={vsacApiKey}
            />
          );
        })}

      <Button color="primary" onClick={addSubpopulation} variant="contained">
        New subpopulation
      </Button>
    </div>
  );
};

Subpopulations.propTypes = {
  addInstance: PropTypes.func.isRequired,
  artifact: PropTypes.object.isRequired,
  baseElements: PropTypes.array.isRequired,
  deleteInstance: PropTypes.func.isRequired,
  editInstance: PropTypes.func.isRequired,
  getAllInstancesInAllTrees: PropTypes.func.isRequired,
  instanceNames: PropTypes.array.isRequired,
  isLoadingModifiers: PropTypes.bool,
  modifiersByInputType: PropTypes.object.isRequired,
  parameters: PropTypes.array.isRequired,
  subpopulations: PropTypes.array.isRequired,
  templates: PropTypes.array.isRequired,
  updateInstanceModifiers: PropTypes.func.isRequired,
  updateSubpopulations: PropTypes.func.isRequired,
  vsacApiKey: PropTypes.string
};

export default Subpopulations;
