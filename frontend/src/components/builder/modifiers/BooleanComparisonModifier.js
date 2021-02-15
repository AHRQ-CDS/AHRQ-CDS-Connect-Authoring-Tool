import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';

import { Dropdown } from 'components/elements';
import { useFieldStyles } from 'styles/hooks';
import useStyles from './styles';

const options = [
  { value: 'is true', label: 'is true' },
  { value: 'is not true', label: 'is not true' },
  { value: 'is false', label: 'is false' },
  { value: 'is not false', label: 'is not false' }
];

const BooleanComparisonModifier = ({ handleUpdateModifier, value }) => {
  const fieldStyles = useFieldStyles();
  const styles = useStyles();

  return (
    <div className={styles.modifier}>
      <Dropdown
        className={clsx(fieldStyles.fieldInput, fieldStyles.fieldInputMd)}
        id="boolean-comparison"
        label="Boolean"
        onChange={event => handleUpdateModifier({ value: event.target.value })}
        options={options}
        value={value}
      />
    </div>
  );
};

BooleanComparisonModifier.propTypes = {
  handleUpdateModifier: PropTypes.func.isRequired,
  value: PropTypes.string
};

export default BooleanComparisonModifier;
