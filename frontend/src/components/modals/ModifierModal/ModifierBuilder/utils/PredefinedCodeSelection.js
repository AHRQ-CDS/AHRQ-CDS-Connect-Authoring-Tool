import React from 'react';
import MultipleSelect from './MultipleSelect';
import useStyles from '../../styles';

const PredefinedCodeSelection = ({ allowsCustomCodes = false, options, value, onChange }) => {
  const modalStyles = useStyles();

  return (
    <>
      <div className={modalStyles.multipleSelect}>
        <MultipleSelect
          allowCustom={allowsCustomCodes}
          onChange={v => onChange(v)}
          options={options}
          value={value || []}
        />
      </div>
    </>
  );
};

export default PredefinedCodeSelection;
