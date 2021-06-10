import React from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { useQuery } from 'react-query';
import { IconButton, Tooltip } from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import { Close as CloseIcon } from '@material-ui/icons';
import clsx from 'clsx';

import { ModifierForm } from 'components/builder/modifiers';
import { fetchModifiers } from 'queries/modifiers';
import { validateModifier } from 'utils/instances';
import { modifierCanBeRemoved } from 'components/builder/modifiers/utils';
import { useFieldStyles } from 'styles/hooks';

const ModifierTemplate = ({
  baseElementIsUsed,
  elementInstance,
  handleRemoveModifier,
  handleSelectValueSet,
  handleUpdateModifier,
  index,
  modifier
}) => {
  const artifact = useSelector(state => state.artifacts.artifact);
  const query = { artifactId: artifact?._id };
  const modifiersQuery = useQuery(['modifiers', query], () => fetchModifiers(query), {
    enabled: query.artifactId != null
  });
  const modifierMap = modifiersQuery.data?.modifierMap ?? {};
  const fieldStyles = useFieldStyles();

  // Reset values on modifiers that were not previously set or saved in the database
  if (!modifier.values && modifierMap[modifier.id] && modifierMap[modifier.id].values) {
    modifier.values = modifierMap[modifier.id].values;
  }

  const { modifiers, returnType } = elementInstance;
  const { canBeRemoved, tooltipText } = modifierCanBeRemoved(Boolean(baseElementIsUsed), index, returnType, modifiers);
  const validationWarning = validateModifier(modifier);

  return (
    <div className={fieldStyles.fieldDetails}>
      <div className={fieldStyles.fieldGroup}>
        <ModifierForm
          elementInstance={elementInstance}
          handleSelectValueSet={handleSelectValueSet}
          handleUpdateModifier={modifier => handleUpdateModifier(index, modifier)}
          index={index}
          modifier={modifier}
        />

        {validationWarning && <Alert severity="error">{validationWarning}</Alert>}
      </div>

      <div className={fieldStyles.fieldButtons}>
        {tooltipText && (
          <Tooltip arrow title={tooltipText} placement="left">
            <span>
              <IconButton aria-label="remove expression" disabled color="primary">
                <CloseIcon fontSize="small" />
              </IconButton>
            </span>
          </Tooltip>
        )}

        {canBeRemoved && (
          <IconButton aria-label="remove expression" color="primary" onClick={() => handleRemoveModifier(index)}>
            <CloseIcon fontSize="small" />
          </IconButton>
        )}
      </div>
    </div>
  );
};

const ModifiersTemplate = ({
  baseElementIsUsed,
  elementInstance,
  handleRemoveModifier,
  handleSelectValueSet,
  handleUpdateModifier
}) => {
  const { modifiers } = elementInstance;
  const fieldStyles = useFieldStyles();

  return (
    <div className={fieldStyles.field} id="modifiers-template">
      <div className={clsx(fieldStyles.fieldLabel, fieldStyles.fieldLabelTall)}>Modifiers:</div>

      <div className={fieldStyles.fieldGroup}>
        {modifiers.map((modifier, index) => (
          <ModifierTemplate
            key={index}
            baseElementIsUsed={baseElementIsUsed}
            elementInstance={elementInstance}
            handleRemoveModifier={handleRemoveModifier}
            handleSelectValueSet={handleSelectValueSet}
            handleUpdateModifier={value => handleUpdateModifier(index, value)}
            index={index}
            isLastModifier={index + 1 === modifiers.length}
            modifier={modifier}
          />
        ))}
      </div>
    </div>
  );
};

ModifiersTemplate.propTypes = {
  baseElementIsUsed: PropTypes.bool,
  elementInstance: PropTypes.object.isRequired,
  handleRemoveModifier: PropTypes.func.isRequired,
  handleSelectValueSet: PropTypes.func.isRequired,
  handleUpdateModifier: PropTypes.func.isRequired
};

export default ModifiersTemplate;
