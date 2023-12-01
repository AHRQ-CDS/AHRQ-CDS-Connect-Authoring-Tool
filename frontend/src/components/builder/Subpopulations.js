import React from 'react';
import PropTypes from 'prop-types';
import { Button, CircularProgress } from '@mui/material';
import _ from 'lodash';
import { useQuery } from 'react-query';
import { useSelector } from 'react-redux';

import fetchTemplates from 'queries/fetchTemplates';
import Subpopulation from './Subpopulation';
import createTemplateInstance from 'utils/templates';
import { getSubpopulationErrors, hasGroupNestedWarning, isSubpopulationUsed } from 'utils/warnings';
import { getAllElements, getElementNames } from 'components/builder/utils';

const TREE_NAME = 'subpopulations';

const Subpopulations = ({
  addInstance,
  deleteInstance,
  editInstance,
  updateInstanceModifiers,
  updateSubpopulations
}) => {
  const artifact = useSelector(state => state.artifacts.artifact);
  const { data: templates, isLoading: isTemplatesLoading } = useQuery('templates', () => fetchTemplates(), {
    staleTime: Infinity
  });

  if (isTemplatesLoading) {
    return <CircularProgress />;
  }

  const operations = templates.find(g => g.name === 'Operations');
  const andTemplate = operations.entries.find(e => e.name === 'And');

  const { baseElements, recommendations, subpopulations } = artifact;
  const parameters = artifact.parameters.filter(({ name }) => name?.length);
  const numOfSpecialSubpopulations = subpopulations.filter(s => s.special).length;
  const allElements = getAllElements(artifact) ?? [];
  const instanceNames = getElementNames(allElements);

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
          const subpopulationAlerts = getSubpopulationErrors(subpopulation, recommendations, instanceNames);
          const hasNestedWarning = hasGroupNestedWarning(
            subpopulation.childInstances,
            instanceNames,
            baseElements,
            parameters,
            allElements,
            true // validate
          );
          const hasErrors =
            subpopulationAlerts.filter(a => a.showAlert && a.alertSeverity === 'error').length > 0 || hasNestedWarning;
          return (
            <Subpopulation
              key={subpopulation.uniqueId}
              addInstance={(name, template, path) => addInstance(name, template, path, subpopulation.uniqueId)} // Add elements inside subpopulations
              alerts={subpopulationAlerts}
              deleteInstance={(treeName, path, toAdd) => deleteInstance(treeName, path, toAdd, subpopulation.uniqueId)} // Delete elements inside subpopulations
              disableDeleteSubpopulationElement={isSubpopulationUsed(recommendations, subpopulation.uniqueId)}
              editInstance={(treeName, fields, path, editingConjunction) =>
                editInstance(treeName, fields, path, editingConjunction, subpopulation.uniqueId)
              } // Edit elements inside subpopulations
              handleDeleteSubpopulationElement={deleteSubpopulation}
              handleUpdateSubpopulationElement={setSubpopulationName}
              hasErrors={hasErrors}
              subpopulation={subpopulation}
              subpopulationUniqueId={subpopulation.uniqueId}
              updateInstanceModifiers={updateInstanceModifiers}
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
  deleteInstance: PropTypes.func.isRequired,
  editInstance: PropTypes.func.isRequired,
  updateInstanceModifiers: PropTypes.func.isRequired,
  updateSubpopulations: PropTypes.func.isRequired
};

export default Subpopulations;
