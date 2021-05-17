import { v4 as uuidv4 } from 'uuid';

export const generateIfThenClause = () => ({
  ifCondition: { label: null, value: null },
  statements: [],
  thenClause: ''
});

export const generateErrorStatement = id => ({
  id: id || uuidv4(),
  ifThenClauses: [generateIfThenClause()],
  elseClause: ''
});

export const getStatementById = (errorStatement, id) => {
  if (errorStatement.id === id) return errorStatement;

  for (const ifThenClause of errorStatement.ifThenClauses) {
    for (const statement of ifThenClause.statements) {
      const foundStatement = getStatementById(statement, id);
      if (foundStatement) return foundStatement;
    }
  }

  return null;
};
