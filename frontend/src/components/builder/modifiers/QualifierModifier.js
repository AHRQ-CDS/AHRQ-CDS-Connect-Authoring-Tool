import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';

import { Dropdown } from 'components/elements';
import { EditorsTemplate } from 'components/builder/templates';
import { useFieldStyles } from 'styles/hooks';
import useStyles from './styles';

const options = [
  { value: 'value is a code from', label: 'value is a code from' },
  { value: 'value is the code', label: 'value is the code' }
];

const QualifierModifier = ({ code, handleUpdateModifier, qualifier, valueSet }) => {
  const fieldStyles = useFieldStyles();
  const styles = useStyles();
  const qualifierIsCode = qualifier === 'value is the code';

  const handleSelectQualifier = useCallback(
    newQualifier => {
      const selectedOption = options.find(option => option.value === newQualifier);
      handleUpdateModifier({ qualifier: selectedOption?.value, valueSet: null, code: null });
    },
    [handleUpdateModifier]
  );

  return (
    <div className={styles.modifier}>
      <div className={fieldStyles.fieldInputGroup}>
        <Dropdown
          className={clsx(fieldStyles.fieldInput, fieldStyles.fieldInputLg)}
          id="qualifier"
          label="Qualifier"
          onChange={event => handleSelectQualifier(event.target.value)}
          options={options}
          value={qualifier}
        />
      </div>

      {qualifier && (
        <EditorsTemplate
          handleUpdateEditor={
            qualifierIsCode
              ? code => handleUpdateModifier({ qualifier, code })
              : valueSet => handleUpdateModifier({ qualifier, valueSet })
          }
          type={qualifierIsCode ? 'system_code' : 'valueset'}
          value={qualifierIsCode ? code : valueSet}
        />
      )}
    </div>
  );
};

QualifierModifier.propTypes = {
  code: PropTypes.object,
  handleUpdateModifier: PropTypes.func.isRequired,
  qualifier: PropTypes.string,
  valueSet: PropTypes.object
};

export default QualifierModifier;
