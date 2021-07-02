import React from 'react';
import propTypes from 'prop-types';
import clsx from 'clsx';
import { Dropdown } from 'components/elements';
import { useFieldStyles } from 'styles/hooks';
import useStyles from './styles';

const options = [
  { label: 'True', value: 'true' },
  { label: 'False', value: 'false' }
];

// Operators work by storing their operands within the rules.
// The stateful variables we write to come directly from the userSpecifiedOperands
// section of each operator definition in 'operators.json'
// In this case, rule.booleanValue is the state variable in question.
const IsTrueFalse = ({ rule, updateRule }) => {
  const fieldStyles = useFieldStyles();
  const operatorStyles = useStyles();

  return (
    <Dropdown
      className={clsx(operatorStyles.container, fieldStyles.fieldInputSm)}
      label="Value"
      onChange={event => {
        const booleanValue = event.target.value === 'true' ? true : false;
        updateRule({ ...rule, booleanValue: booleanValue });
      }}
      options={options}
      value={rule.booleanValue != null ? (rule.booleanValue ? 'true' : 'false') : ''}
    />
  );
};

IsTrueFalse.propTypes = {
  rule: propTypes.object.isRequired,
  updateRule: propTypes.func.isRequired
};
export default IsTrueFalse;
