import React from 'react';
import propTypes from 'prop-types';
import IsTrueFalse from './operators/IsTrueFalse';

const OperatorInstance = ({ rule, updateRule }) => {
  return <>{rule.ruleType === 'isTrueFalse' && <IsTrueFalse rule={rule} updateRule={updateRule} />}</>;
};

OperatorInstance.propTypes = {
  rule: propTypes.object.isRequired,
  updateRule: propTypes.func.isRequired
};

export default OperatorInstance;
