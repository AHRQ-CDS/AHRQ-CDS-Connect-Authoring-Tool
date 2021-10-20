import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { useQuery } from 'react-query';
import { Alert, Divider, IconButton, Stack } from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';

import ElementCardLabel from 'components/elements/ElementCard/ElementCardLabel';
import { ModifierForm } from 'components/builder/modifiers';
import { Tooltip } from 'components/elements';
import { DeleteConfirmationModal } from 'components/modals';
import { fetchModifiers } from 'queries/modifiers';
import { validateModifier } from 'utils/instances';
import { changeToCase } from 'utils/strings';
import { modifierCanBeRemoved } from 'components/builder/modifiers/utils';

const ModifierTemplate = ({
  baseElementIsUsed,
  elementInstance,
  handleRemoveModifier,
  handleUpdateModifier,
  index,
  modifier
}) => {
  const [showDeleteConfirmationModal, setShowDeleteConfirmationModal] = useState(false);
  const artifact = useSelector(state => state.artifacts.artifact);
  const query = { artifactId: artifact?._id };
  const modifiersQuery = useQuery(['modifiers', query], () => fetchModifiers(query), {
    enabled: query.artifactId != null
  });
  const modifierMap = modifiersQuery.data?.modifierMap ?? {};

  // Reset values on modifiers that were not previously set or saved in the database
  if (!modifier.values && modifierMap[modifier.id] && modifierMap[modifier.id].values) {
    modifier.values = modifierMap[modifier.id].values;
  }

  const { modifiers, returnType } = elementInstance;
  const { canBeRemoved, tooltipText } = modifierCanBeRemoved(Boolean(baseElementIsUsed), index, returnType, modifiers);
  const validationWarning = validateModifier(modifier);

  const handleDeleteModifier = () => {
    handleRemoveModifier(index);
    setShowDeleteConfirmationModal(false);
  };

  return (
    <Stack id="modifiers-template" width="100%">
      <Stack direction="row" justifyContent="space-between">
        <ModifierForm
          elementInstance={elementInstance}
          handleUpdateModifier={modifier => handleUpdateModifier(index, modifier)}
          index={index}
          modifier={modifier}
        />

        <Tooltip enabled={!canBeRemoved} placement="left" title={tooltipText}>
          <IconButton
            aria-label="remove expression"
            disabled={!canBeRemoved}
            color="primary"
            onClick={() => setShowDeleteConfirmationModal(true)}
            sx={{ marginTop: '5px' }}
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      </Stack>

      {validationWarning && (
        <Alert severity="error" sx={{ marginBottom: '10px' }}>
          {validationWarning}
        </Alert>
      )}

      <Divider />

      {showDeleteConfirmationModal && (
        <DeleteConfirmationModal
          deleteType="Modifier"
          handleCloseModal={() => setShowDeleteConfirmationModal(false)}
          handleDelete={handleDeleteModifier}
        >
          <>
            <div>Modifier Name: {modifier.name || 'Custom Modifier'}</div>
            <div>Return Type: {changeToCase(modifier.returnType, 'capitalCase')}</div>
          </>
        </DeleteConfirmationModal>
      )}
    </Stack>
  );
};

const ModifiersTemplate = ({ baseElementIsUsed, elementInstance, handleRemoveModifier, handleUpdateModifier }) => {
  const { modifiers } = elementInstance;

  return (
    <Stack direction="row">
      <ElementCardLabel label="Modifiers" mt="10px" />

      <Stack width="100%">
        {modifiers.map((modifier, index) => (
          <ModifierTemplate
            key={index}
            baseElementIsUsed={baseElementIsUsed}
            elementInstance={elementInstance}
            handleRemoveModifier={handleRemoveModifier}
            handleUpdateModifier={handleUpdateModifier}
            index={index}
            isLastModifier={index + 1 === modifiers.length}
            modifier={modifier}
          />
        ))}
      </Stack>
    </Stack>
  );
};

ModifiersTemplate.propTypes = {
  baseElementIsUsed: PropTypes.bool,
  elementInstance: PropTypes.object.isRequired,
  handleRemoveModifier: PropTypes.func.isRequired,
  handleUpdateModifier: PropTypes.func.isRequired
};

export default ModifiersTemplate;
