import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useQuery } from 'react-query';
import { Autocomplete, CircularProgress, TextField } from '@mui/material';
import { Search as SearchIcon } from '@mui/icons-material';

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
      freeSolo
      getOptionLabel={option => option?.label || option || ''}
      isOptionEqualToValue={(option, value) => option.value === value}
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
      sx={{ width: { xs: '200px', xxl: '300px' } }}
      value={unit || null}
    />
  );
};

UcumField.propTypes = {
  handleChangeUnit: PropTypes.func.isRequired,
  unit: PropTypes.string
};

export default UcumField;
