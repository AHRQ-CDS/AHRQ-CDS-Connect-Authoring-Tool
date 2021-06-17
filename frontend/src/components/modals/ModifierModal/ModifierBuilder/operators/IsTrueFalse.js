import React from 'react';
import propTypes from 'prop-types';
import clsx from 'clsx';
import { Dropdown } from 'components/elements';
import { useFieldStyles } from 'styles/hooks';
import useStyles from './styles';

// Operators work by storing their operands within the rules.
// The stateful variables we write to come directly from the userSpecifiedOperands
// section of each operator definition in 'operators.json'
// In this case, rule.booleanValue is the state variable in question.
const IsTrueFalse = ({ rule, updateRule }) => {
  const fieldStyles = useFieldStyles();
  const operatorStyles = useStyles();

  return (
    <div className={clsx(operatorStyles.container, fieldStyles.fieldInputLg)}>
      <div className={operatorStyles.text}>Value must be: </div>
      <Dropdown
        label="True/False"
        onChange={event => {
          const booleanValue = event.target.value === 'true' ? true : false;
          const updatedRule = { ...rule, booleanValue: booleanValue };
          updateRule(updatedRule);
        }}
        options={[
          { label: 'True', value: 'true' },
          { label: 'False', value: 'false' }
        ]}
        value={rule.booleanValue !== undefined ? (rule.booleanValue ? 'true' : 'false') : ''}
      />
    </div>
  );
};

IsTrueFalse.propTypes = {
  rule: propTypes.object.isRequired,
  updateRule: propTypes.func.isRequired
};
export default IsTrueFalse;
