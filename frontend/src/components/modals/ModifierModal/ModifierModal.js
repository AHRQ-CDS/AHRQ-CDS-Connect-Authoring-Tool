import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Button } from '@material-ui/core';

import ModifierModalHeader from './ModifierModalHeader';
import ModifierSelector from './ModifierSelector';
import ModifierBuilder from './ModifierBuilder';
import { Modal } from 'components/elements';
import useStyles from './styles';

const ModifierModal = ({
  elementInstance,
  elementInstanceReturnType,
  handleCloseModal,
  handleUpdateModifiers,
  hasLimitedModifiers
}) => {
  const [displayMode, setDisplayMode] = useState(null);
  const [modifiersToAdd, setModifiersToAdd] = useState([]);
  const modifierModalStyles = useStyles();

  let modalTitle = 'Add Modifiers';
  if (displayMode === 'selectModifiers') modalTitle = 'Select Modifiers';
  if (displayMode === 'buildModifier') modalTitle = 'Build Modifier';

  const handleAddModifiers = () => {
    handleUpdateModifiers(elementInstance.modifiers.concat(modifiersToAdd));
    handleCloseModal();
  };

  const handleReset = () => {
    setDisplayMode(null);
    setModifiersToAdd([]);
  };

  return (
    <Modal
      handleCloseModal={handleCloseModal}
      handleSaveModal={handleAddModifiers}
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
      submitDisabled={modifiersToAdd.length === 0}
      title={modalTitle}
      maxWidth="xl"
    >
      <div className={modifierModalStyles.modifierModalContent}>
        {!displayMode && (
          <div className={modifierModalStyles.displayModeSelector}>
            <Button
              className={modifierModalStyles.displayModeButton}
              color="primary"
              onClick={() => setDisplayMode('selectModifiers')}
              variant="contained"
            >
              Select Modifiers
            </Button>

            <span>or</span>

            <Button
              className={modifierModalStyles.displayModeButton}
              color="primary"
              onClick={() => setDisplayMode('buildModifier')}
              variant="contained"
            >
              Build New Modifier
            </Button>
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

        {displayMode === 'buildModifier' && <ModifierBuilder handleGoBack={handleReset} />}
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
