import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Box, Button } from '@mui/material';
import { Build as WrenchIcon } from '@mui/icons-material';

import { ModifierModal } from 'components/modals';
import { allModifiersValid, filterRelevantModifiers, getReturnType } from 'utils/instances';

const SelectModifierAction = ({
  elementInstance,
  hasLimitedModifiers,
  isLoadingModifiers,
  modifiersByInputType,
  updateModifiers
}) => {
  const [showModifierModal, setShowModifierModal] = useState(false);
  const [returnType, setReturnType] = useState(elementInstance.returnType);
  const [relevantModifiers, setRelevantModifiers] = useState(modifiersByInputType[elementInstance.returnType] || []);
  const baseElementIsUsed = elementInstance.usedBy ? elementInstance.usedBy.length !== 0 : false;

  useEffect(() => {
    if (elementInstance.modifiers == null) elementInstance.modifiers = [];
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const relevantModifiers = filterRelevantModifiers(modifiersByInputType[returnType], elementInstance);
    setRelevantModifiers(relevantModifiers);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [returnType, modifiersByInputType]);

  if (isLoadingModifiers) return <Box>Loading modifiers...</Box>;
  if (elementInstance.cannotHaveModifiers || relevantModifiers.length === 0) return null;
  return (
    <>
      {!elementInstance.cannotHaveModifiers && relevantModifiers.length > 0 && (
        <Box margin={'0 10px 10px 0'}>
          <Button
            color="primary"
            disabled={!allModifiersValid(elementInstance.modifiers)}
            onClick={() => setShowModifierModal(true)}
            variant="contained"
            startIcon={<WrenchIcon />}
          >
            Add Modifiers
          </Button>
        </Box>
      )}
      {showModifierModal && (
        <ModifierModal
          elementInstance={elementInstance}
          handleUpdateModifiers={modifiers => {
            setReturnType(getReturnType(elementInstance.returnType, modifiers));
            updateModifiers(modifiers);
          }}
          handleCloseModal={() => setShowModifierModal(false)}
          hasLimitedModifiers={Boolean(baseElementIsUsed || hasLimitedModifiers)}
        />
      )}
    </>
  );
};

SelectModifierAction.propTypes = {
  elementInstance: PropTypes.object.isRequired,
  hasLimitedModifiers: PropTypes.bool,
  isLoadingModifiers: PropTypes.bool,
  modifiersByInputType: PropTypes.object.isRequired,
  updateModifiers: PropTypes.func.isRequired
};

export default SelectModifierAction;
