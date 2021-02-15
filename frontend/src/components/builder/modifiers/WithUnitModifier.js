import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';

import UcumField from 'components/builder/fields/UcumField';
import { useFieldStyles } from 'styles/hooks';
import useStyles from './styles';

const WithUnitModifier = ({ handleUpdateModifier, unit }) => {
  const fieldStyles = useFieldStyles();
  const styles = useStyles();

  return (
    <div className={styles.modifier}>
      <div className={styles.modifierText}>With unit...</div>

      <div className={clsx(fieldStyles.fieldInput, fieldStyles.fieldInputMd)}>
        <UcumField
          handleChangeUnit={(event, option) => handleUpdateModifier({ unit: option?.value || '' })}
          unit={unit}
        />
      </div>
    </div>
  );
};

WithUnitModifier.propTypes = {
  handleUpdateModifier: PropTypes.func.isRequired,
  unit: PropTypes.string
};

export default WithUnitModifier;
