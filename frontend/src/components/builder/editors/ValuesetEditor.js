import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { Button, IconButton } from '@material-ui/core';
import { TextField } from '@material-ui/core';
import { Edit as EditIcon, LocalHospital as LocalHospitalIcon } from '@material-ui/icons';
import { ValueSetSelectModal } from 'components/modals';
import { VSACAuthenticationModal } from 'components/modals';
import { useSpacingStyles } from 'styles/hooks';

const ValuesetEditor = ({ nameValue, oidValue, onChange, label }) => {
  const [showValueSetSelectModal, setShowValueSetSelectModal] = useState(false);
  const [showVSACAuthModal, setShowVSACAuthModal] = useState(false);
  const vsacApiKey = useSelector(state => state.vsac.apiKey);
  const spacingStyles = useSpacingStyles();

  return (
    <div className={spacingStyles.marginTopHalf}>
      {showVSACAuthModal && <VSACAuthenticationModal handleCloseModal={() => setShowVSACAuthModal(false)} />}
      {showValueSetSelectModal && (
        <ValueSetSelectModal
          handleCloseModal={() => setShowValueSetSelectModal(false)}
          handleSelectValueSet={value => onChange(value)}
          readOnly={false}
          savedValueSet={undefined}
        />
      )}
      {nameValue === '' && oidValue === '' && !Boolean(vsacApiKey) && (
        <Button color="primary" onClick={() => setShowVSACAuthModal(true)} variant="contained">
          Authenticate VSAC
        </Button>
      )}
      {nameValue === '' && oidValue === '' && Boolean(vsacApiKey) && (
        <Button
          color="primary"
          onClick={() => setShowValueSetSelectModal(true)}
          startIcon={<LocalHospitalIcon />}
          variant="contained"
        >
          Add Valueset
        </Button>
      )}

      {nameValue !== '' && oidValue !== '' && (
        <div>
          <TextField value={nameValue} helperText={`OID: ${oidValue}`} variant="outlined" />
          <IconButton color="primary" onClick={() => setShowValueSetSelectModal(true)} variant="contained">
            <EditIcon />
          </IconButton>
        </div>
      )}
    </div>
  );
};

ValuesetEditor.propTypes = {
  nameValue: PropTypes.string.isRequired,
  oidValue: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  label: PropTypes.string.isRequired
};

export default ValuesetEditor;
