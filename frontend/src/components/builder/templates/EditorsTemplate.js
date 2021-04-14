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

const EditorsTemplate = ({ handleUpdateEditor, label, isNested = false, type, value }) => {
  const fieldStyles = useFieldStyles();

  const editor = (() => {
    switch (type) {
      case 'boolean':
        return <BooleanEditor handleUpdateEditor={handleUpdateEditor} value={value} />;
      case 'datetime':
        return <DateTimeEditor handleUpdateEditor={handleUpdateEditor} value={value} />;
      case 'decimal':
        return <NumberEditor handleUpdateEditor={handleUpdateEditor} isDecimal value={value} />;
      case 'integer':
        return <NumberEditor handleUpdateEditor={handleUpdateEditor} value={value} />;
      case 'string':
        return <StringEditor handleUpdateEditor={handleUpdateEditor} value={value} />;
      case 'system_code':
        return <CodeEditor handleUpdateEditor={handleUpdateEditor} value={value} />;
      case 'system_concept':
        return <CodeEditor handleUpdateEditor={handleUpdateEditor} isConcept value={value} />;
      case 'system_quantity':
        return <QuantityEditor handleUpdateEditor={handleUpdateEditor} value={value} />;
      case 'time':
        return <DateTimeEditor handleUpdateEditor={handleUpdateEditor} isTime value={value} />;
      case 'interval_of_integer':
        return <NumberEditor handleUpdateEditor={handleUpdateEditor} isInterval value={value} />;
      case 'interval_of_datetime':
        return <DateTimeEditor handleUpdateEditor={handleUpdateEditor} isInterval value={value} />;
      case 'interval_of_decimal':
        return <NumberEditor handleUpdateEditor={handleUpdateEditor} isDecimal isInterval value={value} />;
      case 'interval_of_quantity':
        return <QuantityEditor handleUpdateEditor={handleUpdateEditor} isInterval value={value} />;
      default:
        return null;
    }
  })();

  return (
    <div className={clsx(fieldStyles.field, isNested && fieldStyles.nestedField)} id="editors-template">
      <div
        className={clsx(fieldStyles.fieldLabel, fieldStyles.fieldLabelTall, isNested && fieldStyles.nestedFieldLabel)}
      >
        {label}:
      </div>

      <div className={fieldStyles.fieldInputGroup}>{editor}</div>
    </div>
  );
};

EditorsTemplate.propTypes = {
  handleUpdateEditor: PropTypes.func.isRequired,
  label: PropTypes.string.isRequired,
  isNested: PropTypes.bool,
  type: PropTypes.string.isRequired,
  value: PropTypes.any
};

export default EditorsTemplate;
