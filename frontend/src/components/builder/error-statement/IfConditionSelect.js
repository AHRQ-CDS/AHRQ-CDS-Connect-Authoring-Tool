import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { IconButton } from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';
import clsx from 'clsx';
import _ from 'lodash';

import { Dropdown } from 'components/elements';
import { getStatementById } from './utils';
import { useFieldStyles } from 'styles/hooks';

const IfConditionSelect = ({
  handleDeleteIfThenClause,
  handleUpdateErrorStatement,
  ifCondition,
  ifThenClauseIndex,
  statement
}) => {
  const artifact = useSelector(state => state.artifacts.artifact);
  const { errorStatement, expTreeExclude, expTreeInclude, parameters, subpopulations } = artifact;
  const fieldStyles = useFieldStyles();

  const options = useMemo(() => {
    const subpopulationIsDisabled = subpopulationId => {
      switch (subpopulationId) {
        case 'default-subpopulation-1':
          if (expTreeInclude.childInstances.length === 0) return true;
          break;
        case 'default-subpopulation-2':
          if (expTreeExclude.childInstances.length === 0) return true;
          break;
        default:
          return false;
      }
    };

    const booleanParameterOptions = parameters
      .filter(parameter => parameter.name !== '' && parameter.type === 'boolean')
      .map(parameter => ({
        label: parameter.name,
        value: parameter.name,
        uniqueId: parameter.uniqueId
      }));

    const subpopulationOptions = subpopulations.map(subpopulation => ({
      label: subpopulation.subpopulationName,
      value: subpopulation.special
        ? subpopulation.special_subpopulationName
        : subpopulation.subpopulationName
          ? `"${subpopulation.subpopulationName}"`
          : `"${subpopulation.uniqueId}"`,
      uniqueId: subpopulation.uniqueId,
      isDisabled: subpopulationIsDisabled(subpopulation.uniqueId)
    }));

    return [{ label: 'Recommendations is null', value: '"Recommendation" is null' }]
      .concat(_.sortBy(booleanParameterOptions, ['label']))
      .concat(_.sortBy(subpopulationOptions, ['label']));
  }, [expTreeExclude.childInstances.length, expTreeInclude.childInstances.length, parameters, subpopulations]);

  const selectedOption = options.find(({ value }) => value === ifCondition.value);

  const handleUpdateIfCondition = newValue => {
    const newErrorStatement = _.cloneDeep(errorStatement);
    const statementRef = getStatementById(newErrorStatement, statement.id);
    const condition = options.find(({ value }) => value === newValue);
    statementRef.ifThenClauses[ifThenClauseIndex].ifCondition = condition;
    handleUpdateErrorStatement(newErrorStatement);
  };

  return (
    <>
      <Dropdown
        className={clsx(fieldStyles.fieldInput, fieldStyles.fieldInputXl)}
        hiddenLabel={Boolean(selectedOption?.value)}
        id={`condition-${statement.id}`}
        label={selectedOption?.value ? null : 'Choose if condition'}
        onChange={event => handleUpdateIfCondition(event.target.value)}
        options={options || []}
        value={selectedOption?.value || ''}
      />

      {statement.ifThenClauses.length > 1 && (
        <IconButton
          aria-label="delete-if-then-clause"
          color="primary"
          onClick={() => handleDeleteIfThenClause()}
          variant="contained"
          size="large"
        >
          <CloseIcon />
        </IconButton>
      )}
    </>
  );
};

IfConditionSelect.propTypes = {
  handleDeleteIfThenClause: PropTypes.func.isRequired,
  handleUpdateErrorStatement: PropTypes.func.isRequired,
  ifCondition: PropTypes.object.isRequired,
  ifThenClauseIndex: PropTypes.number.isRequired,
  statement: PropTypes.object.isRequired
};

export default IfConditionSelect;
