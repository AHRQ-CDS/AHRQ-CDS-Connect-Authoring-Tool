import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { Alert } from '@material-ui/lab';
import { ArrowForward as ArrowForwardIcon } from '@material-ui/icons';
import { IconButton } from '@material-ui/core';
import { ArrowBackIos as ArrowBackIosIcon } from '@material-ui/icons';
import { v4 as uuidv4 } from 'uuid';
import clsx from 'clsx';
import _ from 'lodash';

import ModifierSelectorRow from './ModifierSelectorRow';
import ModifierDropdownItem from './ModifierDropdownItem';
import ModifierDropdownFooter from './ModifierDropdownFooter';
import { Dropdown } from 'components/elements';
import { sortAlphabeticallyByKey } from 'utils/sort';
import { allModifiersValid } from 'utils/instances';
import { useFieldStyles, useSpacingStyles } from 'styles/hooks';
import useStyles from '../styles';

const ModifierSelector = ({
  elementInstance,
  handleGoBack,
  hasLimitedModifiers,
  modifiersToAdd,
  setModifiersToAdd
}) => {
  const modifiersByInputType = useSelector(state => state.modifiers.modifiersByInputType);
  const fieldStyles = useFieldStyles();
  const spacingStyles = useSpacingStyles();
  const modifierModalStyles = useStyles();

  const newModifiers = elementInstance.modifiers.concat(modifiersToAdd);
  const returnTypeWithNewModifiers =
    newModifiers.length === 0 ? elementInstance.returnType : newModifiers[newModifiers.length - 1].returnType;
  let selectableModifiers = modifiersByInputType[returnTypeWithNewModifiers];
  if (hasLimitedModifiers)
    selectableModifiers = selectableModifiers.filter(({ returnType }) => returnType === elementInstance.returnType);
  const modifierOptions = selectableModifiers.map(selectableModifier => {
    return {
      value: selectableModifier.id,
      label: selectableModifier.name,
      isExternal: selectableModifier.type && selectableModifier.type === 'ExternalModifier'
    };
  });

  const handleSelectModifier = useCallback(
    modifierId => {
      setTimeout(() => document.activeElement.blur(), 0); // removes focus from dropdown after selection
      const modifierToAdd = _.cloneDeep(selectableModifiers.find(modifier => modifier.id === modifierId));
      modifierToAdd.uniqueId = `${modifierId}-${uuidv4()}`;
      setModifiersToAdd(modifiersToAdd.concat([modifierToAdd]));
    },
    [modifiersToAdd, selectableModifiers, setModifiersToAdd]
  );

  const handleUpdateModifier = useCallback(
    (index, values) => {
      const newModifiersToAdd = _.cloneDeep(modifiersToAdd);
      newModifiersToAdd[index].values = { ...newModifiersToAdd[index].values, ...values };
      setModifiersToAdd(newModifiersToAdd);
    },
    [modifiersToAdd, setModifiersToAdd]
  );

  return (
    <>
      {hasLimitedModifiers && (
        <Alert className={modifierModalStyles.warningBanner} severity="warning">
          Limited modifiers displayed because return type cannot change while in use.
        </Alert>
      )}

      <div className={modifierModalStyles.navHeader}>
        <IconButton onClick={handleGoBack}>
          <ArrowBackIosIcon fontSize="small" />
        </IconButton>
        <div>
          <div className={modifierModalStyles.tag}>with modifiers</div>
        </div>
        {modifiersToAdd.length > 0 && (
          <div>
            {modifiersToAdd.map((modifierToAdd, index) => (
              <span key={index}>
                {modifierToAdd.name}
                {index !== modifiersToAdd.length - 1 && (
                  <ArrowForwardIcon className={spacingStyles.horizontalPadding} fontSize="small" />
                )}
              </span>
            ))}
          </div>
        )}
      </div>

      <div>
        {modifiersToAdd.map((modifierToAdd, index) => (
          <ModifierSelectorRow
            key={modifierToAdd.uniqueId}
            elementInstance={elementInstance}
            handleRemoveModifier={() =>
              setModifiersToAdd(modifiersToAdd.filter(modifier => modifier.name !== modifierToAdd.name))
            }
            handleUpdateModifier={values => handleUpdateModifier(index, values)}
            isFirst={index === 0}
            modifier={modifierToAdd}
            modifiersToAdd={modifiersToAdd}
          />
        ))}

        <div className={modifierModalStyles.modifierSelectorRow}>
          <div
            className={clsx(
              modifierModalStyles.rowCorner,
              modifiersToAdd.length > 0 && modifierModalStyles.rowCornerTop
            )}
          />
          <div className={clsx(modifiersToAdd.length > 0 && modifierModalStyles.rowLine)} />

          <Dropdown
            className={fieldStyles.fieldInputXl}
            disabled={!allModifiersValid(modifiersToAdd)}
            id="modifier-select"
            Footer={modifierOptions.some(option => option.isExternal) && <ModifierDropdownFooter />}
            label="Select modifier..."
            onChange={event => handleSelectModifier(event.target.value)}
            options={modifierOptions.sort(sortAlphabeticallyByKey('label'))}
            renderItem={option => <ModifierDropdownItem option={option} />}
          />
        </div>
      </div>
    </>
  );
};

ModifierSelector.propTypes = {
  elementInstance: PropTypes.object.isRequired,
  handleGoBack: PropTypes.func.isRequired,
  hasLimitedModifiers: PropTypes.bool.isRequired,
  modifiersToAdd: PropTypes.array.isRequired,
  setModifiersToAdd: PropTypes.func.isRequired
};

export default ModifierSelector;
