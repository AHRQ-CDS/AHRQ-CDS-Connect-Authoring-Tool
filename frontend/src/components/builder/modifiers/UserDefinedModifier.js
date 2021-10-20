import React, { useState } from 'react';
import propTypes from 'prop-types';
import { IconButton } from '@mui/material';
import { Edit as EditIcon } from '@mui/icons-material';

import { ModifierModal } from 'components/modals';
import makeStyles from './styles';

const UserDefinedModifier = ({ elementInstance, handleUpdateModifier, label, modifier }) => {
  const [showModifierModal, setShowModifierModal] = useState(false);
  const modifierStyles = makeStyles();

  return (
    <div className={modifierStyles.customModifier}>
      <div className={modifierStyles.modifierMargin}>{label}</div>

      <IconButton aria-label="edit" onClick={() => setShowModifierModal(true)} size="large">
        <EditIcon color="primary" fontSize="small" />
      </IconButton>

      {showModifierModal && (
        <ModifierModal
          elementInstance={elementInstance}
          handleCloseModal={() => setShowModifierModal(false)}
          handleUpdateModifiers={handleUpdateModifier}
          modifierToEdit={modifier}
        />
      )}
    </div>
  );
};

UserDefinedModifier.propTypes = {
  elementInstance: propTypes.object.isRequired,
  handleUpdateModifier: propTypes.func.isRequired,
  label: propTypes.string.isRequired,
  modifier: propTypes.object.isRequired
};

export default UserDefinedModifier;
