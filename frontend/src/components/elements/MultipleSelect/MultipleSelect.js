import React from 'react';
import PropTypes from 'prop-types';
import { TextField } from '@mui/material';
import Autocomplete, { createFilterOptions } from '@mui/material/Autocomplete';

const MultipleSelect = ({ allowCustomInput = false, label, onChange, options, value, ...props }) => {
  const filter = createFilterOptions();

  const filterOptions = (options, params) => {
    const filtered = filter(options, params);

    // Suggest the creation of a new value
    if (allowCustomInput && params.inputValue !== '') filtered.push({ inputValue: params.inputValue });

    return filtered;
  };

  return (
    <Autocomplete
      autoSelect
      autoHighlight
      filterOptions={filterOptions}
      freeSolo={allowCustomInput}
      fullWidth
      getOptionLabel={option => option.inputValue || option}
      multiple
      onChange={(event, newValue) => onChange(newValue.inputValue || newValue)}
      options={options}
      renderInput={params => (
        <TextField
          {...params}
          label={label}
          placeholder={allowCustomInput ? 'Select or type custom option...' : 'Select...'}
        />
      )}
      value={value || []}
      {...props}
    />
  );
};

MultipleSelect.propTypes = {
  allowCustomInput: PropTypes.bool,
  label: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  options: PropTypes.array.isRequired,
  value: PropTypes.array
};

export default MultipleSelect;
