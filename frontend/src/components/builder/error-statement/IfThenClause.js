import React from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { Button } from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import clsx from 'clsx';
import _ from 'lodash';

import ErrorStatementLabel from './ErrorStatementLabel';
import IfConditionSelect from './IfConditionSelect';
import NestedErrorStatement from './NestedErrorStatement';
import ThenClause from './ThenClause';
import {
  generateErrorStatement,
  getStatementById,
  ifThenClauseMissingStatementWarning,
  ifThenClauseDisabledIfConditionWarning
} from './utils';
import useStyles from './styles';

const IfThenClause = ({ handleDeleteIfThenClause, handleUpdateErrorStatement, ifThenClause, index, statement }) => {
  const artifact = useSelector(state => state.artifacts.artifact);
  const { errorStatement, expTreeExclude, expTreeInclude } = artifact;
  const styles = useStyles();

  const hasNestedStatement = ifThenClause.statements.length > 0;
  const ifThenClauseIndex = statement?.ifThenClauses.indexOf(ifThenClause) || 0;
  const isRoot = statement.id === 'root';
  const label = ifThenClauseIndex === 0 ? (isRoot ? 'If' : 'And if') : 'Else if';

  const missingStatementWarning = ifThenClauseMissingStatementWarning(ifThenClause, statement);
  const disabledIfConditionWarning = ifThenClauseDisabledIfConditionWarning(
    ifThenClause,
    expTreeInclude,
    expTreeExclude
  );

  const handleToggleNestedStatements = () => {
    const newErrorStatement = _.cloneDeep(errorStatement);
    const statementRef = getStatementById(newErrorStatement, statement.id);
    statementRef.ifThenClauses[index].thenClause = '';
    if (hasNestedStatement) statementRef.ifThenClauses[index].statements = [];
    else statementRef.ifThenClauses[index].statements.push(generateErrorStatement());
    handleUpdateErrorStatement(newErrorStatement);
  };

  return (
    <div className={clsx(!isRoot && styles.errorStatementContent, !isRoot && styles.errorStatementContentIndent)}>
      {missingStatementWarning && (
        <div className={styles.warningBanner}>
          <Alert severity="error">
            You need {missingStatementWarning === 'Then' ? 'a' : 'an'}{' '}
            <span className={styles.warningTag}>{missingStatementWarning}</span> statement
          </Alert>
        </div>
      )}

      {disabledIfConditionWarning && (
        <div className={styles.warningBanner}>
          <Alert severity="error">
            You have selected the disabled option "{disabledIfConditionWarning}". Please selected a different option.
          </Alert>
        </div>
      )}

      <div className={styles.errorStatementHeader}>
        <ErrorStatementLabel text={label} />

        <IfConditionSelect
          handleDeleteIfThenClause={handleDeleteIfThenClause}
          handleUpdateErrorStatement={handleUpdateErrorStatement}
          ifThenClauseIndex={index}
          ifCondition={ifThenClause.ifCondition}
          statement={statement}
        />
      </div>

      <div className={clsx(styles.errorStatementContent, styles.errorStatementContentIndent)}>
        <Button
          className={styles.errorStatementButton}
          color="primary"
          disabled={!ifThenClause.ifCondition.value}
          onClick={handleToggleNestedStatements}
          variant="contained"
        >
          {hasNestedStatement ? 'Remove nested statements' : 'And also if...'}
        </Button>
      </div>

      {hasNestedStatement &&
        ifThenClause.statements.map(childStatement => (
          <NestedErrorStatement
            key={childStatement.id}
            handleUpdateErrorStatement={handleUpdateErrorStatement}
            parentStatement={statement}
            statement={childStatement}
          />
        ))}

      {!hasNestedStatement && (
        <ThenClause
          handleUpdateErrorStatement={handleUpdateErrorStatement}
          ifThenClauseIndex={index}
          statementId={statement.id}
          thenClause={ifThenClause.thenClause}
        />
      )}
    </div>
  );
};

IfThenClause.propTypes = {
  handleDeleteIfThenClause: PropTypes.func.isRequired,
  handleUpdateErrorStatement: PropTypes.func.isRequired,
  ifThenClause: PropTypes.object.isRequired,
  index: PropTypes.number.isRequired,
  statement: PropTypes.object.isRequired
};

export default IfThenClause;
