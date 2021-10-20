import React from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { Button, TextField } from '@mui/material';
import clsx from 'clsx';
import _ from 'lodash';

import ErrorStatementLabel from './ErrorStatementLabel';
import { generateIfThenClause, getStatementById } from './utils';
import useStyles from './styles';

const ElseClause = ({ handleUpdateErrorStatement, statement }) => {
  const artifact = useSelector(state => state.artifacts.artifact);
  const { errorStatement } = artifact;
  const isRoot = statement.id === 'root';
  const styles = useStyles();

  const handleAddIfThenClause = () => {
    const newErrorStatement = _.cloneDeep(errorStatement);
    const statementRef = getStatementById(newErrorStatement, statement.id);
    statementRef.ifThenClauses.push(generateIfThenClause());
    handleUpdateErrorStatement(newErrorStatement);
  };

  const handleUpdateElseClause = newValue => {
    const newErrorStatement = _.cloneDeep(errorStatement);
    const statementRef = getStatementById(newErrorStatement, statement.id);
    statementRef.elseClause = newValue;
    handleUpdateErrorStatement(newErrorStatement);
  };

  return (
    <div className={clsx(!isRoot && styles.errorStatementContent, !isRoot && styles.errorStatementContentIndent)}>
      <div className={styles.errorStatementButtonElse}>
        <Button
          color="primary"
          disabled={statement.ifThenClauses.some(ifThenClause => !ifThenClause.ifCondition.label)}
          onClick={handleAddIfThenClause}
          variant="contained"
        >
          Or else if...
        </Button>
      </div>

      <div className={styles.errorStatementHeader}>
        <ErrorStatementLabel text="Else" />
      </div>

      <div className={styles.errorStatementContent}>
        <TextField
          fullWidth
          hiddenLabel
          inputProps={{ 'data-testid': 'else-clause-textfield' }}
          multiline
          name="text"
          onChange={event => handleUpdateElseClause(event.target.value)}
          placeholder="If none of the conditions hold..."
          value={statement.elseClause}
        />
      </div>
    </div>
  );
};

ElseClause.propTypes = {
  handleUpdateErrorStatement: PropTypes.func.isRequired,
  statement: PropTypes.object.isRequired
};

export default ElseClause;
