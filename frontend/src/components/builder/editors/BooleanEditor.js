import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';

import { Dropdown } from 'components/elements';
import { useFieldStyles } from 'styles/hooks';

const options = [
  { value: 'true', label: 'True' },
  { value: 'false', label: 'False' }
];

const BooleanEditor = ({ handleUpdateEditor, value }) => {
  const fieldStyles = useFieldStyles();

  return (
    <div className={clsx(fieldStyles.fieldInput, fieldStyles.fieldInputMd)} id="boolean-editor">
      <Dropdown
        label={value ? 'Boolean value' : 'Select...'}
        onChange={event => handleUpdateEditor(event.target.value)}
        options={options}
        value={value}
      />
    </div>
  );
};

BooleanEditor.propTypes = {
  handleUpdateEditor: PropTypes.func.isRequired,
  value: PropTypes.string
};

export default BooleanEditor;
