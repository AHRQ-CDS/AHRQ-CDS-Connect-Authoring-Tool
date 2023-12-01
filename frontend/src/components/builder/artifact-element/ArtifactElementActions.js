import React from 'react';
import PropTypes from 'prop-types';
import { Stack } from '@mui/material';

import SelectModifierAction from './SelectModifierAction';
import VSACOptionsAction from './VSACOptionsAction';

const ArtifactElementActions = ({
  allowsVSAC,
  hasLimitedModifiers,
  elementInstance,
  handleUpdateElement,
  isLoadingModifiers,
  modifiersByInputType,
  updateModifiers
}) => {
  return (
    <Stack>
      <SelectModifierAction
        elementInstance={elementInstance}
        hasLimitedModifiers={hasLimitedModifiers}
        isLoadingModifiers={isLoadingModifiers}
        modifiersByInputType={modifiersByInputType}
        updateModifiers={updateModifiers}
      />
      <VSACOptionsAction
        allowsVSAC={allowsVSAC}
        elementInstance={elementInstance}
        handleUpdateElement={handleUpdateElement}
      />
    </Stack>
  );
};

ArtifactElementActions.propTypes = {
  allowsVSAC: PropTypes.bool.isRequired,
  hasLimitedModifiers: PropTypes.bool,
  elementInstance: PropTypes.object.isRequired,
  handleUpdateElement: PropTypes.func.isRequired,
  isLoadingModifiers: PropTypes.bool,
  modifiersByInputType: PropTypes.object.isRequired,
  updateModifiers: PropTypes.func.isRequired
};

export default ArtifactElementActions;
