import React from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { TextField } from '@mui/material';
import clsx from 'clsx';
import _ from 'lodash';

import ErrorStatementLabel from './ErrorStatementLabel';
import { getStatementById } from './utils';
import useStyles from './styles';

const ThenClause = ({ handleUpdateErrorStatement, ifThenClauseIndex, statementId, thenClause }) => {
  const artifact = useSelector(state => state.artifacts.artifact);
  const { errorStatement } = artifact;
  const styles = useStyles();

  const handleUpdateThenClause = newValue => {
    const newErrorStatement = _.cloneDeep(errorStatement);
    const statementRef = getStatementById(newErrorStatement, statementId);
    statementRef.ifThenClauses[ifThenClauseIndex].thenClause = newValue;
    handleUpdateErrorStatement(newErrorStatement);
  };

  return (
    <div className={clsx(styles.errorStatementContent, styles.errorStatementContentIndent)}>
      <div className={styles.errorStatementHeader}>
        <ErrorStatementLabel text="Then" />
      </div>

      <div className={styles.errorStatementContent}>
        <TextField
          fullWidth
          hiddenLabel
          inputProps={{ 'data-testid': 'then-clause-textfield' }}
          multiline
          name="text"
          onChange={event => handleUpdateThenClause(event.target.value)}
          placeholder="Describe your error..."
          value={thenClause}
        />
      </div>
    </div>
  );
};

ThenClause.propTypes = {
  handleUpdateErrorStatement: PropTypes.func.isRequired,
  ifThenClauseIndex: PropTypes.number.isRequired,
  statementId: PropTypes.string.isRequired,
  thenClause: PropTypes.string.isRequired
};

export default ThenClause;
