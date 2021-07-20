import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';

import {
  BooleanEditor,
  CodeEditor,
  DateTimeEditor,
  NumberEditor,
  QuantityEditor,
  StringEditor
} from 'components/builder/editors';
import { useFieldStyles } from 'styles/hooks';

const EditorsTemplate = ({ errors, handleUpdateEditor, isNested, label, type, value }) => {
  const fieldStyles = useFieldStyles();

  const editor = (() => {
    switch (type) {
      case 'boolean':
        return <BooleanEditor handleUpdateEditor={handleUpdateEditor} value={value} />;
      case 'datetime':
        return <DateTimeEditor errors={errors} handleUpdateEditor={handleUpdateEditor} value={value} />;
      case 'decimal':
        return <NumberEditor errors={errors} handleUpdateEditor={handleUpdateEditor} isDecimal value={value} />;
      case 'integer':
        return <NumberEditor errors={errors} handleUpdateEditor={handleUpdateEditor} value={value} />;
      case 'string':
        return <StringEditor handleUpdateEditor={handleUpdateEditor} value={value} />;
      case 'system_code':
        return <CodeEditor handleUpdateEditor={handleUpdateEditor} value={value} />;
      case 'system_concept':
        return <CodeEditor handleUpdateEditor={handleUpdateEditor} isConcept value={value} />;
      case 'system_quantity':
        return <QuantityEditor errors={errors} handleUpdateEditor={handleUpdateEditor} value={value} />;
      case 'time':
        return <DateTimeEditor errors={errors} handleUpdateEditor={handleUpdateEditor} isTime value={value} />;
      case 'interval_of_integer':
        return <NumberEditor errors={errors} handleUpdateEditor={handleUpdateEditor} isInterval value={value} />;
      case 'interval_of_datetime':
        return <DateTimeEditor errors={errors} handleUpdateEditor={handleUpdateEditor} isInterval value={value} />;
      case 'interval_of_decimal':
        return (
          <NumberEditor errors={errors} handleUpdateEditor={handleUpdateEditor} isDecimal isInterval value={value} />
        );
      case 'interval_of_quantity':
        return <QuantityEditor errors={errors} handleUpdateEditor={handleUpdateEditor} isInterval value={value} />;
      default:
        return null;
    }
  })();

  return (
    <div className={clsx(fieldStyles.field, isNested && fieldStyles.nestedField)} id="editors-template">
      {label && (
        <div
          className={clsx(fieldStyles.fieldLabel, fieldStyles.fieldLabelTall, isNested && fieldStyles.nestedFieldLabel)}
        >
          {label}:
        </div>
      )}

      <div className={fieldStyles.fieldInputGroupContainer}>
        <div className={fieldStyles.fieldInputGroup}>{editor}</div>
      </div>
    </div>
  );
};

EditorsTemplate.propTypes = {
  errors: PropTypes.object,
  handleUpdateEditor: PropTypes.func.isRequired,
  isNested: PropTypes.bool,
  label: PropTypes.string,
  type: PropTypes.string.isRequired,
  value: PropTypes.any
};

export default EditorsTemplate;
