import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';

import { Dropdown } from 'components/elements';
import { useFieldStyles } from 'styles/hooks';
import useStyles from './styles';

const options = [
  { value: 'is null', label: 'is null' },
  { value: 'is not null', label: 'is not null' }
];

const CheckExistenceModifier = ({ handleUpdateModifier, value }) => {
  const fieldStyles = useFieldStyles();
  const styles = useStyles();

  return (
    <div className={styles.modifier}>
      <Dropdown
        className={clsx(fieldStyles.fieldInput, fieldStyles.fieldInputMd)}
        id="check-existence"
        label="Check existence"
        onChange={event => handleUpdateModifier({ value: event.target.value })}
        options={options}
        value={value}
      />
    </div>
  );
};

CheckExistenceModifier.propTypes = {
  handleUpdateModifier: PropTypes.func.isRequired,
  value: PropTypes.string
};

export default CheckExistenceModifier;
