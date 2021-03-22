import React from 'react';
import PropTypes from 'prop-types';
import { TextField } from '@material-ui/core';
import clsx from 'clsx';

import { useFieldStyles } from 'styles/hooks';

const StringEditor = ({ handleUpdateEditor, value }) => {
  const fieldStyles = useFieldStyles();

  return (
    <div className={clsx(fieldStyles.fieldInput, fieldStyles.fieldInputMd)} id="string-editor">
      <TextField
        fullWidth
        label="Value"
        onChange={event => handleUpdateEditor(event.target.value ? `'${event.target.value}'` : null)}
        value={value ? value.replace(/'/g, '') : ''}
        variant="outlined"
      />
    </div>
  );
};

StringEditor.propTypes = {
  handleUpdateEditor: PropTypes.func.isRequired,
  value: PropTypes.string
};

export default StringEditor;
