import React from 'react';
import PropTypes from 'prop-types';

import { Dropdown } from 'components/elements';

const options = [
  { value: 'true', label: 'True' },
  { value: 'false', label: 'False' }
];

const BooleanEditor = ({ handleUpdateEditor, value }) => (
  <Dropdown
    label={value ? 'Boolean value' : 'Select...'}
    onChange={event => handleUpdateEditor(event.target.value)}
    options={options}
    sx={{ width: { xs: '100px', xxl: '200px' } }}
    value={value}
  />
);

BooleanEditor.propTypes = {
  handleUpdateEditor: PropTypes.func.isRequired,
  value: PropTypes.string
};

export default BooleanEditor;
