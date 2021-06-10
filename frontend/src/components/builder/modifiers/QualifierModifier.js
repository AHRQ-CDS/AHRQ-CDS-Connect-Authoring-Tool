import React, { useCallback, useState } from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { Button, IconButton, Tooltip } from '@material-ui/core';
import {
  List as ListIcon,
  LocalHospital as LocalHospitalIcon,
  Lock as LockIcon,
  Visibility as VisibilityIcon
} from '@material-ui/icons';
import clsx from 'clsx';

import { Dropdown } from 'components/elements';
import { CodeSelectModal, ValueSetSelectModal, VSACAuthenticationModal } from 'components/modals';
import { useFieldStyles } from 'styles/hooks';
import useStyles from './styles';

const options = [
  { value: 'value is a code from', label: 'value is a code from' },
  { value: 'value is the code', label: 'value is the code' }
];

const QualifierModifier = ({ code, handleSelectValueSet, handleUpdateModifier, qualifier, valueSet }) => {
  const [showCodeSelectModal, setShowCodeSelectModal] = useState(false);
  const [showValueSetSelectModal, setShowValueSetSelectModal] = useState(false);
  const [showValueSetViewModal, setShowValueSetViewModal] = useState(false);
  const [showVSACAuthenticationModal, setShowVSACAuthenticationModal] = useState(false);
  const vsacApiKey = useSelector(state => state.vsac.apiKey);
  const fieldStyles = useFieldStyles();
  const styles = useStyles();

  const qualifierIsCode = qualifier === 'value is the code';

  let selection = '';
  if (valueSet) selection = `${valueSet.name} (${valueSet.oid})`;
  if (code) selection = `${code.codeSystem.name} (${code.code}) ${code.display === '' ? '' : ` - ${code.display}`}`;

  const handleChange = useCallback(
    event => {
      const selectedOption = options.find(option => option.value === event.target.value);
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
          onChange={handleChange}
          options={options}
          value={qualifier}
        />

        {valueSet && !Boolean(vsacApiKey) && (
          <Tooltip arrow title="Authenticate VSAC to view details" placement="left">
            <span className={styles.modifierButton}>
              <IconButton aria-label="View Value Set" disabled color="primary">
                <VisibilityIcon fontSize="small" />
              </IconButton>
            </span>
          </Tooltip>
        )}

        {valueSet && Boolean(vsacApiKey) && (
          <span className={styles.modifierButton}>
            <IconButton aria-label="View Value Set" color="primary" onClick={() => setShowValueSetSelectModal(true)}>
              <VisibilityIcon fontSize="small" />
            </IconButton>
          </span>
        )}
      </div>

      {qualifier && (
        <div className={fieldStyles.fieldInputGroup}>
          {Boolean(vsacApiKey) && !valueSet && !code && (
            <Button
              className={styles.modifierMargin}
              color="primary"
              onClick={qualifierIsCode ? () => setShowCodeSelectModal(true) : () => setShowValueSetViewModal(true)}
              startIcon={qualifierIsCode ? <LocalHospitalIcon /> : <ListIcon />}
              variant="contained"
            >
              {qualifierIsCode ? 'Add Code' : 'Select Value Set'}
            </Button>
          )}

          {selection !== '' && <div className={styles.modifierMargin}>{selection}</div>}
        </div>
      )}

      {qualifier && !Boolean(vsacApiKey) && !code && (
        <Button
          className={styles.modifierMargin}
          color="primary"
          onClick={() => setShowVSACAuthenticationModal(true)}
          variant="contained"
          startIcon={<LockIcon />}
        >
          Authenticate VSAC
        </Button>
      )}

      {showCodeSelectModal && (
        <CodeSelectModal
          handleCloseModal={() => setShowCodeSelectModal(false)}
          handleSelectCode={code => handleUpdateModifier({ code })}
        />
      )}

      {showValueSetSelectModal && (
        <ValueSetSelectModal
          handleCloseModal={() => setShowValueSetSelectModal(false)}
          handleSelectValueSet={selectedValueSet => handleSelectValueSet(selectedValueSet)}
          readOnly
          savedValueSet={valueSet}
        />
      )}

      {showValueSetViewModal && (
        <ValueSetSelectModal
          handleCloseModal={() => setShowValueSetViewModal(false)}
          handleSelectValueSet={valueSet => handleUpdateModifier({ valueSet })}
        />
      )}

      {showVSACAuthenticationModal && (
        <VSACAuthenticationModal handleCloseModal={() => setShowVSACAuthenticationModal(false)} />
      )}
    </div>
  );
};

QualifierModifier.propTypes = {
  code: PropTypes.object,
  handleSelectValueSet: PropTypes.func.isRequired,
  handleUpdateModifier: PropTypes.func.isRequired,
  qualifier: PropTypes.string,
  valueSet: PropTypes.object
};

export default QualifierModifier;
