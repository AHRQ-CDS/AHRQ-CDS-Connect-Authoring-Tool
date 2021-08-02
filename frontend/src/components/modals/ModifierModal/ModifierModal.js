import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Button, Tooltip } from '@material-ui/core';
import { updateArtifact } from 'actions/artifacts';
import { useSelector, useDispatch } from 'react-redux';
import _ from 'lodash';

import ModifierModalHeader from './ModifierModalHeader';
import ModifierSelector from './ModifierSelector';
import ModifierBuilder from './ModifierBuilder';
import FhirVersionSelect from './FhirVersionSelect';
import { getIsRuleTreeEmpty } from './ModifierBuilder/utils/utils';
import { Modal } from 'components/elements';
import useStyles from './styles';

// Note: The flag editDirect when set will allow you to edit a single modifier directly.
// It is used without this flag in TemplateInstance.js -- it shows the entire modal.
// It is used with  this flag in UserDefinedModifier.js -- it shows only the builder/editor AND
// handleUpdateModifiers is called with the new modifier only.

const ModifierModal = ({
  elementInstance,
  elementInstanceReturnType,
  handleCloseModal,
  handleUpdateModifiers,
  hasLimitedModifiers,
  editDirect = false,
  modifier = undefined
}) => {
  const artifact = useSelector(state => state.artifacts.artifact);
  const [displayMode, setDisplayMode] = useState(
    editDirect === true && modifier !== undefined ? 'buildModifier' : undefined
  );
  const [modifiersToAdd, setModifiersToAdd] = useState(editDirect === true && modifier !== undefined ? [modifier] : []);
  const [fhirVersion, setFhirVersion] = useState(artifact.fhirVersion);
  const dispatch = useDispatch();
  const styles = useStyles();

  let modalTitle = 'Add Modifiers';
  if (displayMode === 'selectModifiers') modalTitle = 'Select Modifiers';
  if (displayMode === 'buildModifier') modalTitle = 'Build Modifier';

  const handleUpdateInstance = async () => {
    if (editDirect) {
      let modifierToUpdate = _.last(modifiersToAdd);
      handleUpdateModifiers(modifierToUpdate);
    } else {
      if (fhirVersion !== artifact.fhirVersion) await dispatch(updateArtifact(artifact, { fhirVersion: fhirVersion }));
      handleUpdateModifiers(elementInstance.modifiers.concat(modifiersToAdd));
    }
    handleCloseModal();
  };

  const handleReset = () => {
    setFhirVersion(artifact.fhirVersion);
    setDisplayMode(null);
    setModifiersToAdd([]);
  };

  const handleSetFhirVersion = newVersion => {
    setFhirVersion(newVersion);
    setDisplayMode('buildModifier');
  };

  const getIsSubmitDisabled = () => {
    if (displayMode === 'selectModifiers') {
      return modifiersToAdd.length === 0;
    } else if (displayMode === 'buildModifier') {
      return !(modifiersToAdd.length !== 0 && getIsRuleTreeEmpty(modifiersToAdd[0]));
    } else return true;
  };

  return (
    <Modal
      handleCloseModal={handleCloseModal}
      handleSaveModal={handleUpdateInstance}
      Header={
        <ModifierModalHeader
          elementInstance={elementInstance}
          elementInstanceReturnType={elementInstanceReturnType}
          modifiersToAdd={modifiersToAdd}
        />
      }
      hasCancelButton
      hasEnterKeySubmit={false}
      isOpen
      submitButtonText="Add"
      submitDisabled={getIsSubmitDisabled()}
      title={modalTitle}
      maxWidth="xl"
    >
      <div className={styles.modifierModalContent}>
        {!displayMode && (
          <div className={styles.displayModeSelector}>
            <Button
              className={styles.displayModeButton}
              color="primary"
              onClick={() => setDisplayMode('selectModifiers')}
              variant="contained"
            >
              Select Modifiers
            </Button>

            <span>or</span>

            {(() => {
              const wrapInTooltip = (jsxElement, toolTipText) => (
                <Tooltip arrow title={toolTipText}>
                  {jsxElement}
                </Tooltip>
              );

              let buildButton = (
                <div>
                  <Button
                    className={styles.displayModeButton}
                    color="primary"
                    disabled={elementInstance.modifiers.length !== 0}
                    onClick={() =>
                      setDisplayMode(
                        ['1.0.2', '3.0.0', '4.0.0'].includes(fhirVersion) ? 'buildModifier' : 'selectFhirVersion'
                      )
                    }
                    variant="contained"
                  >
                    Build New Modifier
                  </Button>
                </div>
              );

              return elementInstance.modifiers.length !== 0
                ? wrapInTooltip(buildButton, 'Cannot add a custom modifier to another modifier.')
                : buildButton;
            })()}
          </div>
        )}

        {displayMode === 'selectModifiers' && (
          <ModifierSelector
            elementInstance={elementInstance}
            handleGoBack={handleReset}
            hasLimitedModifiers={hasLimitedModifiers}
            modifiersToAdd={modifiersToAdd}
            setModifiersToAdd={setModifiersToAdd}
          />
        )}

        {displayMode === 'selectFhirVersion' && <FhirVersionSelect handleSetFhirVersion={handleSetFhirVersion} />}

        {displayMode === 'buildModifier' && (
          <ModifierBuilder
            editDirect={editDirect}
            elementInstanceReturnType={elementInstanceReturnType}
            fhirVersion={fhirVersion}
            handleGoBack={handleReset}
            modifiersToAdd={modifiersToAdd}
            modifier={modifier}
            setModifiersToAdd={setModifiersToAdd}
          />
        )}
      </div>
    </Modal>
  );
};

ModifierModal.propTypes = {
  elementInstance: PropTypes.object.isRequired,
  elementInstanceReturnType: PropTypes.string.isRequired,
  handleCloseModal: PropTypes.func.isRequired,
  handleUpdateModifiers: PropTypes.func.isRequired,
  hasLimitedModifiers: PropTypes.bool.isRequired
};

export default ModifierModal;
