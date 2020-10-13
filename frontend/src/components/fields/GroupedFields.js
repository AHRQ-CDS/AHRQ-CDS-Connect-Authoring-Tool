import React, { memo, useCallback } from 'react';
import { FieldArray } from 'formik';
import classnames from 'classnames';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faPlus } from '@fortawesome/free-solid-svg-icons';

import { isCpgComplete } from '../../utils/fields';

const FastGroupedField = memo(({ name, colSize, index, remove, fields }) => {
  const handleRemove = useCallback(() => remove(index), [remove, index]);
  const namePrefix = `${name}[${index}]`;

  return (
    <div className={classnames('grouped-field', 'form__group', `flex-col-${colSize}`)}>
      <FontAwesomeIcon icon={faTimes} className="delete-grouped-field-button" onClick={handleRemove} />

      <div className="form__group flex-col-1">
        {fields.map(field => {
          const FormComponent = field.component;
          return (
            <FormComponent
              key={field.name}
              {...field}
              name={field.name}
              namePrefix={namePrefix}
            />
          );
        })}
      </div>
    </div>
  );
});

const FastGroupedFieldArray = memo(({
  name,
  label,
  colSize,
  buttonText,
  fields,
  values,
  defaultValue,
  push,
  remove,
  isCpgField
}) => {
  const hasGroupedFields = values[name].length > 0;
  const addGroup = useCallback(() => push(defaultValue), [push, defaultValue]);
  const cpgFieldComplete = isCpgComplete(name, values);

  return (
    <div className="form__group flex-col-1">
      <label htmlFor={name}>
        {label}
        {isCpgField &&
          <span className={classnames('cpg-tag', cpgFieldComplete && 'cpg-tag-complete')}>CPG</span>
        }:
      </label>

      <div className={classnames('grouped-fields', hasGroupedFields && 'has-grouped-fields')}>
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

        <button
          className={classnames('grouped-field-button', 'primary-button', hasGroupedFields && 'has-grouped-fields')}
          onClick={addGroup}
          aria-label={buttonText}
          type="button"
        >
          <FontAwesomeIcon icon={faPlus} /> {buttonText}
        </button>
      </div>
    </div>
  );
});

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
