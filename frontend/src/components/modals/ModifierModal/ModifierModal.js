import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Button } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';

import ModifierModalHeader from './ModifierModalHeader';
import ModifierSelector from './ModifierSelector';
import ModifierBuilder from './ModifierBuilder';
import FhirVersionSelect from './FhirVersionSelect';
import { Tooltip } from 'components/elements';
import { ruleTreeIsEmpty } from './ModifierBuilder/utils/ruleTreeIsEmpty';
import { Modal } from 'components/elements';
import { updateArtifact } from 'actions/artifacts';
import { resourceMap } from 'queries/modifier-builder/fetchResource';
import useStyles from './styles';
import ruleIsComplete from './ModifierBuilder/utils/ruleIsComplete';

const ModifierModal = ({
  elementInstance,
  handleCloseModal,
  handleUpdateModifiers,
  hasLimitedModifiers = false,
  modifierToEdit
}) => {
  const artifact = useSelector(state => state.artifacts.artifact);
  const [displayMode, setDisplayMode] = useState(modifierToEdit ? 'editModifier' : null);
  const [modifiersToAdd, setModifiersToAdd] = useState(modifierToEdit ? [modifierToEdit] : []);
  const [fhirVersion, setFhirVersion] = useState(artifact.fhirVersion);
  const dispatch = useDispatch();
  const styles = useStyles();
  const typeSupportedByBuilder =
    Boolean(resourceMap[elementInstance.returnType]) &&
    (fhirVersion === '' || resourceMap[elementInstance.returnType].supportedVersions.includes(fhirVersion));
  const hasModifiers = elementInstance.modifiers?.length !== 0;

  let modalTitle = 'Add Modifiers';
  if (displayMode === 'selectModifiers') modalTitle = 'Select Modifiers';
  if (displayMode === 'buildModifier') modalTitle = 'Build Modifier';
  if (displayMode === 'editModifier') modalTitle = 'Edit Modifier';

  const handleSaveModal = async () => {
    if (fhirVersion !== artifact.fhirVersion) await dispatch(updateArtifact(artifact, { fhirVersion: fhirVersion }));
    handleUpdateModifiers(modifierToEdit ? modifiersToAdd : elementInstance.modifiers.concat(modifiersToAdd));
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

  let submitDisabled = true;
  if (displayMode === 'selectModifiers') submitDisabled = modifiersToAdd.length === 0;
  else if (displayMode === 'buildModifier' || displayMode === 'editModifier')
    submitDisabled =
      modifiersToAdd.length === 0 ||
      ruleTreeIsEmpty(modifiersToAdd[0]) ||
      !modifiersToAdd[0]?.where?.rules?.every(rule => ruleIsComplete(rule));

  return (
    <Modal
      handleCloseModal={handleCloseModal}
      handleSaveModal={handleSaveModal}
      Header={<ModifierModalHeader elementInstance={elementInstance} modifiersToAdd={modifiersToAdd} />}
      hasCancelButton
      hasEnterKeySubmit={false}
      isOpen
      submitButtonText={modifierToEdit ? 'Save' : 'Add'}
      submitDisabled={submitDisabled}
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

            <Tooltip
              enabled={hasModifiers || !typeSupportedByBuilder}
              title={hasModifiers ? 'Cannot add a custom modifier to another modifier' : 'Return type not supported'}
            >
              <Button
                className={styles.displayModeButton}
                color="primary"
                disabled={hasModifiers || !typeSupportedByBuilder}
                onClick={() =>
                  setDisplayMode(
                    ['1.0.2', '3.0.0', '4.0.0'].includes(fhirVersion) ? 'buildModifier' : 'selectFhirVersion'
                  )
                }
                variant="contained"
              >
                Build New Modifier
              </Button>
            </Tooltip>
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

        {(displayMode === 'buildModifier' || displayMode === 'editModifier') && (
          <ModifierBuilder
            elementInstanceReturnType={elementInstance.returnType}
            fhirVersion={fhirVersion}
            handleGoBack={handleReset}
            modifiersToAdd={modifiersToAdd}
            modifierToEdit={modifierToEdit}
            setModifiersToAdd={setModifiersToAdd}
          />
        )}
      </div>
    </Modal>
  );
};

ModifierModal.propTypes = {
  elementInstance: PropTypes.object.isRequired,
  handleCloseModal: PropTypes.func.isRequired,
  handleUpdateModifiers: PropTypes.func.isRequired,
  hasLimitedModifiers: PropTypes.bool,
  modifierToEdit: PropTypes.object
};

export default ModifierModal;
