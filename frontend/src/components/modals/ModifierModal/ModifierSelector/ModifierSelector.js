import React from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { useQuery } from 'react-query';
import { Alert, IconButton } from '@mui/material';
import { ArrowBackIos as ArrowBackIosIcon, ArrowForward as ArrowForwardIcon } from '@mui/icons-material';
import { v4 as uuidv4 } from 'uuid';
import clsx from 'clsx';
import _ from 'lodash';

import ModifierSelectorRow from './ModifierSelectorRow';
import ModifierDropdownItem from './ModifierDropdownItem';
import ModifierDropdownFooter from './ModifierDropdownFooter';
import { Dropdown } from 'components/elements';
import { fetchModifiers } from 'queries/modifiers';
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
  const artifact = useSelector(state => state.artifacts.artifact);
  const query = { artifactId: artifact?._id };
  const modifiersQuery = useQuery(['modifiers', query], () => fetchModifiers(query), {
    enabled: query.artifactId != null
  });
  const modifiersByInputType = modifiersQuery.data?.modifiersByInputType ?? {};
  const fieldStyles = useFieldStyles();
  const spacingStyles = useSpacingStyles();
  const styles = useStyles();

  const newModifiers = elementInstance.modifiers?.concat(modifiersToAdd) || modifiersToAdd;
  const returnTypeWithNewModifiers =
    newModifiers.length === 0 ? elementInstance.returnType : newModifiers[newModifiers.length - 1].returnType;
  let selectableModifiers = modifiersByInputType[returnTypeWithNewModifiers] ?? [];
  if (hasLimitedModifiers)
    selectableModifiers = selectableModifiers.filter(({ returnType }) => returnType === elementInstance.returnType);
  const modifierOptions = selectableModifiers.map(selectableModifier => {
    return {
      value: selectableModifier.id,
      label: selectableModifier.name,
      isExternal: selectableModifier.type && selectableModifier.type === 'ExternalModifier'
    };
  });

  const handleSelectModifier = modifierId => {
    setTimeout(() => document.activeElement.blur(), 0); // removes focus from dropdown after selection
    const modifierToAdd = _.cloneDeep(selectableModifiers.find(modifier => modifier.id === modifierId));
    modifierToAdd.uniqueId = `${modifierId}-${uuidv4()}`;
    setModifiersToAdd(modifiersToAdd.concat([modifierToAdd]));
  };

  const handleUpdateModifier = (index, values) => {
    const newModifiersToAdd = _.cloneDeep(modifiersToAdd);
    newModifiersToAdd[index].values = { ...newModifiersToAdd[index].values, ...values };
    setModifiersToAdd(newModifiersToAdd);
  };

  return (
    <>
      {hasLimitedModifiers && (
        <Alert className={styles.warningBanner} severity="warning">
          Limited modifiers displayed because return type cannot change while in use.
        </Alert>
      )}

      <div className={styles.navHeader}>
        <div className={styles.navHeaderGroup}>
          <div className={styles.navHeaderButtons}>
            <IconButton aria-label="go back" onClick={handleGoBack} size="large">
              <ArrowBackIosIcon fontSize="small" />
            </IconButton>

            <div className={styles.tag}>with modifiers</div>
          </div>

          {modifiersToAdd.length > 0 && (
            <div className={styles.modifierExpression}>
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

        <div className={styles.rulesCardGroup}>
          {modifiersToAdd.length > 0 && (
            <>
              <div className={clsx(styles.line, styles.lineHorizontal)}></div>
              <div className={clsx(styles.line, styles.lineVertical, styles.lineVerticalBottom)}></div>
            </>
          )}

          <div className={styles.indent}>
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
