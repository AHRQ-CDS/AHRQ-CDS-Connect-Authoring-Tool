import React from 'react';
import propTypes from 'prop-types';
import { NumberEditor } from 'components/builder/editors';

const QuantityIntervalOverlapsNumericInterval = ({ operandId, rule, updateRule }) => {
  const updateRuleValue = (operandValue, operandId, rule, updateRule) => {
    let newRule = { ...rule };
    newRule[operandId] = operandValue;
    updateRule(newRule);
  };
  return (
    <div style={{ minWidth: '300px' }}>
      <NumberEditor
        fullWidth={false}
        handleUpdateEditor={value => updateRuleValue(value, operandId, rule, updateRule)}
        isDecimal={true}
        isInterval={true}
        label="Value"
        value={rule[operandId] || ''}
      />
    </div>
  );
};

QuantityIntervalOverlapsNumericInterval.propTypes = {
  operandId: propTypes.string.isRequired,
  rule: propTypes.object.isRequired,
  updateRule: propTypes.func.isRequired
};

export default QuantityIntervalOverlapsNumericInterval;
