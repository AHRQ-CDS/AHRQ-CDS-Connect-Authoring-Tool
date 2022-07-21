import React from 'react';
import PropTypes from 'prop-types';
import { Dropdown } from 'components/elements';

const ConjunctionTypeSelect = ({ editInstance, name, options }) => {
  const handleTypeChange = (event, selectOptions) => {
    const type = selectOptions.find(option => option.name === event.target.value);
    editInstance(type);
  };

  return (
    <Dropdown
      id="conjunction-select"
      hiddenLabel={Boolean(name)}
      label={name ? null : 'Select one'}
      labelKey="name"
      onChange={event => handleTypeChange(event, options)}
      options={options}
      sx={{ margin: '20px 0', width: '12em' }}
      value={name}
      valueKey="id"
    />
  );
};

ConjunctionTypeSelect.propTypes = {
  editInstance: PropTypes.func.isRequired,
  name: PropTypes.string,
  options: PropTypes.array.isRequired
};

export default ConjunctionTypeSelect;
