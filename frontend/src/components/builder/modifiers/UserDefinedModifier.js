import React, { useState } from 'react';
import propTypes from 'prop-types';
import { IconButton } from '@material-ui/core';
import EditIcon from '@material-ui/icons/Edit';
import makeStyles from './styles';
import { ModifierModal } from '../../modals';

const UserDefinedModifier = ({ elementInstance, handleUpdateModifier = undefined, label, modifier }) => {
  const modifierStyles = makeStyles();
  const [showModifierModal, setShowModifierModal] = useState(false);
  return (
    <div className={modifierStyles.customModifier}>
      <div className={modifierStyles.modifierMargin}>{label}</div>
      <IconButton onClick={() => setShowModifierModal(true)}>
        <EditIcon color="primary" fontSize="small" />
      </IconButton>
      {showModifierModal && (
        <ModifierModal
          editDirect={true}
          editReturnType={elementInstance.modifiers.length === 1}
          elementInstance={elementInstance}
          elementInstanceReturnType={elementInstance.returnType}
          handleCloseModal={() => setShowModifierModal(false)}
          handleUpdateModifiers={handleUpdateModifier}
          modifier={modifier}
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
