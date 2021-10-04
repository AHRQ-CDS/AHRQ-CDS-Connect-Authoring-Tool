import React from 'react';
import PropTypes from 'prop-types';
import { Button, Card, IconButton } from '@material-ui/core';
import { Clear as ClearIcon } from '@material-ui/icons';
import produce from 'immer';
import clsx from 'clsx';
import _ from 'lodash';

import { Dropdown } from 'components/elements';
import { useFieldStyles } from 'styles/hooks';
import useStyles from './styles';

const deleteSubpopulation = produce((subpopulations, index) => {
  subpopulations.splice(index, 1);
});

const RecommendationSubpopulations = ({
  artifactSubpopulations,
  handleUpdateSubpopulations,
  recommendationSubpopulations,
  setShowAddSubpopulation,
  showAddSubpopulation,
  subpopulationOptions
}) => {
  const fieldStyles = useFieldStyles();
  const styles = useStyles();

  const selectRecommendationSubpopulation = subpopulationId => {
    const subpopulation = artifactSubpopulations.find(({ uniqueId }) => uniqueId === subpopulationId);
    handleUpdateSubpopulations(recommendationSubpopulations.concat([_.cloneDeep(subpopulation)]));
    setShowAddSubpopulation(false);
  };

  return (
    <div className={styles.recommendationSubpopulations}>
      If all of the following apply...
      {recommendationSubpopulations.map((subpopulation, index) => (
        <Card
          key={subpopulation.uniqueId || index}
          className={clsx(styles.recommendationSubpopulation, styles.recommendationInputHeader)}
        >
          {subpopulation.subpopulationName}

          <IconButton
            aria-label="remove subpopulation"
            color="primary"
            onClick={() => handleUpdateSubpopulations(deleteSubpopulation(recommendationSubpopulations, index))}
          >
            <ClearIcon fontSize="small" />
          </IconButton>
        </Card>
      ))}
      {subpopulationOptions.length > 0 && !showAddSubpopulation && (
        <Button color="primary" onClick={() => setShowAddSubpopulation(true)} variant="contained">
          Add subpopulation
        </Button>
      )}
      {showAddSubpopulation && (
        <div className={clsx(styles.addSubpopulation, styles.recommendationInputHeader)}>
          <Dropdown
            className={clsx(fieldStyles.fieldInput, fieldStyles.fieldInputFullWidth)}
            SelectProps={{ SelectDisplayProps: { 'data-testid': 'add-subpopulation' } }}
            label="Add a subpopulation"
            labelKey="subpopulationName"
            onChange={event => selectRecommendationSubpopulation(event.target.value)}
            options={subpopulationOptions}
            value=""
            valueKey="uniqueId"
          />

          <IconButton
            aria-label="clear add subpopulation"
            className={styles.addSubpopulationClear}
            onClick={() => setShowAddSubpopulation(false)}
          >
            <ClearIcon fontSize="small" />
          </IconButton>
        </div>
      )}
    </div>
  );
};

RecommendationSubpopulations.propTypes = {
  artifactSubpopulations: PropTypes.array.isRequired,
  handleUpdateSubpopulations: PropTypes.func.isRequired,
  recommendationSubpopulations: PropTypes.array.isRequired,
  setShowAddSubpopulation: PropTypes.func.isRequired,
  showAddSubpopulation: PropTypes.bool.isRequired,
  subpopulationOptions: PropTypes.array.isRequired
};

export default RecommendationSubpopulations;
