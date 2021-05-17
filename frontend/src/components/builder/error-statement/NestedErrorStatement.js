import React from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import _ from 'lodash';

import ElseClause from './ElseClause';
import IfThenClause from './IfThenClause';
import { getStatementById } from './utils';

const NestedErrorStatement = ({ handleUpdateErrorStatement, parentStatement, statement }) => {
  const artifact = useSelector(state => state.artifacts.artifact);
  const { errorStatement } = artifact;
  const hasIfThenClauses = statement.ifThenClauses.length > 0;

  const handleDeleteIfThenClause = index => {
    const newErrorStatement = _.cloneDeep(errorStatement);
    const statementRef = getStatementById(newErrorStatement, statement.id);
    statementRef.ifThenClauses.splice(index, 1);
    handleUpdateErrorStatement(newErrorStatement);
  };

  return (
    <>
      {hasIfThenClauses &&
        statement.ifThenClauses.map((ifThenClause, index) => (
          <IfThenClause
            key={index}
            handleDeleteIfThenClause={() => handleDeleteIfThenClause(index)}
            handleUpdateErrorStatement={handleUpdateErrorStatement}
            ifThenClause={ifThenClause}
            index={index}
            statement={statement}
          />
        ))}

      <ElseClause handleUpdateErrorStatement={handleUpdateErrorStatement} statement={statement} />
    </>
  );
};

NestedErrorStatement.propTypes = {
  handleUpdateErrorStatement: PropTypes.func.isRequired,
  parentStatement: PropTypes.object,
  statement: PropTypes.object.isRequired
};

export default NestedErrorStatement;
