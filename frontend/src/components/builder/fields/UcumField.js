import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useQuery } from 'react-query';
import { TextField, CircularProgress } from '@material-ui/core';
import { Search as SearchIcon } from '@material-ui/icons';
import { Autocomplete } from '@material-ui/lab';

import fetchUnitsOfMeasure from 'queries/fetchUnitsOfMeasure';

const UcumField = ({ handleChangeUnit, unit }) => {
  const [ucumTerm, setUcumTerm] = useState(unit);
  const query = { terms: ucumTerm };
  const { data: ucumOptions, isLoading } = useQuery(['fetchUnitsOfMeasure', query], () => fetchUnitsOfMeasure(query), {
    enabled: Boolean(ucumTerm)
  });

  const handleChangeUcumTerm = (event, term, reason) => {
    if (reason === 'input' || reason === 'clear') setUcumTerm(term);
  };

  return (
    <Autocomplete
      getOptionLabel={option => option?.label || option || ''}
      getOptionSelected={(option, value) => option.value === value}
      loading={isLoading}
      noOptionsText="Search..."
      onChange={handleChangeUnit}
      onInputChange={handleChangeUcumTerm}
      options={ucumOptions || []}
      popupIcon={<SearchIcon fontSize="small" />}
      renderInput={params => (
        <TextField
          {...params}
          label="Unit"
          variant="outlined"
          InputProps={{
            ...params.InputProps,
            endAdornment: (
              <>
                {isLoading ? <CircularProgress color="inherit" size={20} /> : null}
                {params.InputProps.endAdornment}
              </>
            )
          }}
        />
      )}
      value={unit || null}
    />
  );
};

UcumField.propTypes = {
  handleChangeUnit: PropTypes.func.isRequired,
  unit: PropTypes.string
};

export default UcumField;
