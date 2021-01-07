import React, { memo, useCallback } from 'react';
import { FieldArray } from 'formik';
import { Button, IconButton, Paper } from '@material-ui/core';
import { Add as AddIcon, Close as CloseIcon } from '@material-ui/icons';
import clsx from 'clsx';

import { isCpgComplete } from 'utils/fields';

const FastGroupedField = memo(({ name, colSize, index, remove, fields }) => {
  const handleRemove = useCallback(() => remove(index), [remove, index]);
  const namePrefix = `${name}[${index}]`;

  return (
    <Paper className="field-group-container">
      <div className="close-button">
        <IconButton aria-label="close" color="primary" onClick={handleRemove}>
          <CloseIcon />
        </IconButton>
      </div>

      {fields.map(field => {
        const FormComponent = field.component;

        return (
          <FormComponent
            className="field-input"
            key={field.name}
            name={field.name}
            namePrefix={namePrefix}
            {...field}
          />
        );
      })}
    </Paper>
  );
});

const FastGroupedFieldArray = memo(({
    name, label, colSize, buttonText, fields, values, defaultValue, push, remove, isCpgField
  }) => {
    const hasGroupedFields = values[name].length > 0;
    const addGroup = useCallback(() => push(defaultValue), [push, defaultValue]);
    const cpgFieldComplete = isCpgComplete(name, values);

    return (
      <div className="field grouped-fields">
        <label htmlFor={name} className="field-label">
          {label}
          {isCpgField && <span className={clsx('cpg-tag', cpgFieldComplete && 'cpg-tag-complete')}>CPG</span>}:
        </label>

        <div className="field-groups">
          {hasGroupedFields && (
            <div className="field-group">
              {values[name].map((value, index) => (
                <FastGroupedField
                  name={name}
                  key={index}
                  colSize={colSize}
                  index={index}
                  remove={remove}
                  fields={fields}
                />
              ))}
            </div>
          )}

          <div className="field-input">
            <Button
              color="primary"
              onClick={addGroup}
              startIcon={<AddIcon />}
              variant="contained"
            >
              {buttonText}
            </Button>
          </div>
        </div>
      </div>
    );
  }
);

export default memo(function GroupedFields({
  name,
  label,
  colSize = '1',
  buttonText = 'Add',
  fields = [],
  defaultValue = {},
  isCpgField = false,
  isCpgComplete
}) {
  return (
    <FieldArray
      name={name}
      render={({ push, remove, form }) => (
        <FastGroupedFieldArray
          name={name}
          label={label}
          colSize={colSize}
          buttonText={buttonText}
          fields={fields}
          values={form.values}
          push={push}
          remove={remove}
          defaultValue={defaultValue}
          isCpgField={isCpgField}
          isCpgComplete={isCpgComplete}
        />
      )}
    />
  );
});
