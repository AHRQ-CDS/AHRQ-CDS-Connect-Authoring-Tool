import React, { useState } from 'react';
import MultipleSelect from './MultipleSelect';
import { Button } from '@material-ui/core';
import { TextField } from 'components/fields';
import useStyles from '../../styles';
import clsx from 'clsx';

const PredefinedCodeSelection = ({ allowsCustomCodes = false, options, value, onChange }) => {
  const [showCodeEditor, setShowCodeEditor] = useState(false);

  const modalStyles = useStyles();

  return (
    <>
      <div className={modalStyles.multipleSelect}>
        <MultipleSelect
          allowCustom={allowsCustomCodes}
          onChange={val => onChange(val)}
          options={options}
          value={value || []}
        />
      </div>
    </>
  );
};

export default PredefinedCodeSelection;
