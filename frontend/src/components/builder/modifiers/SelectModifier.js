import React from 'react';
import PropTypes from 'prop-types';
import { useQuery } from 'react-query';
import { CircularProgress } from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import clsx from 'clsx';

import { Dropdown } from 'components/elements';
import fetchConversionFunctions from 'queries/fetchConversionFunctions';
import { useFieldStyles } from 'styles/hooks';
import useStyles from './styles';

const SelectModifier = ({ handleUpdateModifier, name, value }) => {
  const { data, error, isLoading, isSuccess } = useQuery('conversion_functions', () => fetchConversionFunctions());
  const conversionFunctions = data ?? [];
  const options = conversionFunctions.map(option => ({ value: option.name, label: option.description }));
  const fieldStyles = useFieldStyles();
  const styles = useStyles();

  const handleChange = (event, options) => {
    const selectedOption = options.find(option => option.value === event.target.value);
    const value = selectedOption ? selectedOption.value : '';
    const description = selectedOption ? selectedOption.label : '';
    handleUpdateModifier({ value, templateName: value, description });
  };

  return (
    <div className={styles.modifier}>
      {error && <Alert severity="error">{error.message}</Alert>}
      {isLoading && <CircularProgress />}

      {isSuccess && (
        <Dropdown
          className={clsx(fieldStyles.fieldInput, fieldStyles.fieldInputXl)}
          id="select-modifier"
          label={name}
          onChange={event => handleChange(event, options)}
          options={options}
          value={value}
        />
      )}
    </div>
  );
};

SelectModifier.propTypes = {
  handleUpdateModifier: PropTypes.func.isRequired,
  name: PropTypes.string.isRequired,
  value: PropTypes.string
};

export default SelectModifier;
