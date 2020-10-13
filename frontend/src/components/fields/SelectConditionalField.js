import React, { memo } from 'react';
import { useField } from 'formik';

import SelectField from './SelectField';

const FastSelectConditionalField = memo(({
  name,
  label,
  colSize,
  helperText,
  options,
  conditions,
  namePrefix,
  currentValue
}) => {
  return (
    <div className="form__group flex-col-1 select-conditional-field">
      <SelectField name={name} label={label} options={options} helperText={helperText} />

      {currentValue && conditions[currentValue] && conditions[currentValue].map((field, index) => {
        const FormComponent = field.component;
        return (
          <FormComponent
            key={index}
            {...field}
            name={field.name}
            namePrefix={namePrefix}
          />
        );
      })}
    </div>
  );
});

export default memo(function SelectConditionalField({
  name,
  label,
  colSize = '1',
  helperText,
  options = [],
  conditions,
  namePrefix
}) {
  const fieldName = namePrefix ? `${namePrefix}.${name}` : name;
  const [field] = useField(fieldName);
  const currentValue = field.value;

  return (
    <FastSelectConditionalField
      name={fieldName}
      label={label}
      colSize={colSize}
      helperText={helperText}
      options={options}
      conditions={conditions}
      namePrefix={namePrefix}
      currentValue={currentValue}
    />
  );
});
