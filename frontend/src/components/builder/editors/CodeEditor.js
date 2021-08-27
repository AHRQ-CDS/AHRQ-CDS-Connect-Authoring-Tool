import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { Button, IconButton, Paper } from '@material-ui/core';
import { Close as CloseIcon, LocalHospital as LocalHospitalIcon, Lock as LockIcon } from '@material-ui/icons';
import { v4 as uuidv4 } from 'uuid';
import clsx from 'clsx';

import { CodeSelectModal, VSACAuthenticationModal } from 'components/modals';
import { useFieldStyles } from 'styles/hooks';

const CodeEditorButtons = ({ codeButtonText, handleSelectCode }) => {
  const [showCodeSelectModal, setShowCodeSelectModal] = useState(false);
  const [showVSACAuthModal, setShowVSACAuthModal] = useState(false);
  const vsacApiKey = useSelector(state => state.vsac.apiKey);

  return (
    <>
      {!Boolean(vsacApiKey) ? (
        <Button color="primary" onClick={() => setShowVSACAuthModal(true)} variant="contained" startIcon={<LockIcon />}>
          Authenticate VSAC
        </Button>
      ) : (
        <Button
          color="primary"
          onClick={() => setShowCodeSelectModal(true)}
          startIcon={<LocalHospitalIcon />}
          variant="contained"
        >
          {codeButtonText}
        </Button>
      )}

      {showVSACAuthModal && <VSACAuthenticationModal handleCloseModal={() => setShowVSACAuthModal(false)} />}

      {showCodeSelectModal && (
        <CodeSelectModal
          handleCloseModal={() => setShowCodeSelectModal(false)}
          handleSelectCode={codeData => handleSelectCode(codeData)}
        />
      )}
    </>
  );
};

CodeEditorButtons.propTypes = {
  codeButtonText: PropTypes.string.isRequired,
  handleSelectCode: PropTypes.func.isRequired
};

const CodeEditorField = ({ label, value }) => {
  const fieldStyles = useFieldStyles();

  return (
    <div className={fieldStyles.field}>
      <div className={clsx(fieldStyles.condensedFieldLabel, fieldStyles.fieldLabelNarrow)}>{label}:</div>
      <div className={fieldStyles.condensedFieldInput}>{value}</div>
    </div>
  );
};

CodeEditorField.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired
};

const CodeEditorPaper = ({ handleDeleteCode, handleSelectCode, isList, value }) => {
  const fieldStyles = useFieldStyles();

  return (
    <Paper className={fieldStyles.fieldCard}>
      <div className={fieldStyles.fieldCardCloseButton}>
        <IconButton aria-label="close" color="primary" onClick={() => handleDeleteCode(value)}>
          <CloseIcon />
        </IconButton>
      </div>

      <CodeEditorField label="Code" value={value.code} />
      <CodeEditorField label="System" value={value.system} />
      <CodeEditorField label="System URI" value={value.uri} />
      {value.display && <CodeEditorField label="Display" value={value.display} />}

      {!isList && (
        <div className={fieldStyles.fieldCardFooter}>
          <CodeEditorButtons codeButtonText="Change Code" handleSelectCode={handleSelectCode} />
        </div>
      )}
    </Paper>
  );
};

const CodeEditor = ({ handleUpdateEditor, isConcept = false, isList = false, value }) => {
  const fieldStyles = useFieldStyles();

  const handleSelectCode = codeData => {
    const codeStr = `Code '${codeData.code.replace(/'/g, "\\'")}' from "${codeData.codeSystem.name}"`;
    const displayStr = ` display '${codeData.display}'`;
    const str = isConcept
      ? `Concept { ${codeStr} }${codeData.display ? displayStr : ''}`
      : `${codeStr}${codeData.display ? displayStr : ''}`;
    const newCode = {
      id: uuidv4(),
      system: codeData.codeSystem.name,
      uri: codeData.codeSystem.id,
      code: codeData.code,
      display: codeData.display,
      str
    };

    handleUpdateEditor(isList ? (value ? value.concat([newCode]) : [newCode]) : newCode);
  };

  return (
    <div className={fieldStyles.fieldInputFullWidth} id="code-editor">
      {value &&
        isList &&
        value.map(codeValue => (
          <CodeEditorPaper
            key={codeValue.id}
            handleDeleteCode={codeToDelete => handleUpdateEditor(value.filter(({ id }) => id !== codeToDelete.id))}
            handleSelectCode={handleSelectCode}
            isList
            value={codeValue}
          />
        ))}

      {value && !isList && (
        <CodeEditorPaper
          key={value.id}
          handleDeleteCode={() => handleUpdateEditor(null)}
          handleSelectCode={handleSelectCode}
          value={value}
        />
      )}

      {(!value || isList) && <CodeEditorButtons codeButtonText="Add Code" handleSelectCode={handleSelectCode} />}
    </div>
  );
};

CodeEditor.propTypes = {
  handleUpdateEditor: PropTypes.func.isRequired,
  isConcept: PropTypes.bool,
  isList: PropTypes.bool,
  value: PropTypes.oneOfType([PropTypes.object, PropTypes.array])
};

export default CodeEditor;
