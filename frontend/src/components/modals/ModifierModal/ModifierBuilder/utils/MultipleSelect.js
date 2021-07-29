import React, { useEffect, useState } from 'react';
import Autocomplete from '@material-ui/lab/Autocomplete';
import TextField from '@material-ui/core/TextField';
import clsx from 'clsx';
import { useFieldStyles } from 'styles/hooks';
import useStyles from '../../styles';

const getCurrentTextInput = renderInputParams => {
  return renderInputParams.inputProps.value;
};

const MultipleSelect = ({ allowCustom = false, onChange, options, value }) => {
  const fieldStyles = useFieldStyles();
  const modalStyles = useStyles();

  const [currentTextInput, setCurrentTextInput] = useState();

  let currentOptions = [...options];

  if (allowCustom) {
    if (currentTextInput !== '' && !options.includes(currentTextInput)) currentOptions.unshift(currentTextInput);
    currentOptions = [...new Set(currentOptions.concat(value))];
  } else {
    currentOptions = currentOptions.filter(option => option.startsWith(currentTextInput));
  }

  return (
    <Autocomplete
      className={clsx(fieldStyles.fieldInput, fieldStyles.fieldInputSm, modalStyles.noMarginBottom)}
      multiple
      options={currentOptions}
      onChange={(event, eventValue) => onChange(eventValue)}
      getOptionLabel={option => option}
      renderInput={params => {
        // eslint-disable-next-line
        useEffect(() => {
          if (getCurrentTextInput(params) !== currentTextInput) setCurrentTextInput(getCurrentTextInput(params));
        }, [params]);
        return <TextField {...params} label="Code(s)" variant="outlined" />;
      }}
      value={value || []}
    />
  );
};

export default MultipleSelect;
