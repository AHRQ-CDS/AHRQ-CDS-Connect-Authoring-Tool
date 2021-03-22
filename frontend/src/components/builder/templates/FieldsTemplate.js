import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';

import { NumberField, StaticField, StringField, TextAreaField, ValueSetField } from 'components/builder/fields';
import { useFieldStyles } from 'styles/hooks';

const FieldTemplate = ({ field, handleUpdateField }) => {
  const fieldStyles = useFieldStyles();

  const fieldComponent = (() => {
    if (field.static) return <StaticField handleUpdateField={handleUpdateField} />;

    switch (field.type) {
      case 'number':
        return <NumberField field={field} handleUpdateField={handleUpdateField} />;
      case 'allergyIntolerance_vsac':
      case 'condition_vsac':
      case 'device_vsac':
      case 'encounter_vsac':
      case 'immunization_vsac':
      case 'medicationRequest_vsac':
      case 'medicationStatement_vsac':
      case 'observation_vsac':
      case 'procedure_vsac':
      case 'string':
        return <StringField field={field} handleUpdateField={handleUpdateField} />;
      case 'textarea':
        return <TextAreaField field={field} handleUpdateField={handleUpdateField} />;
      case 'valueset':
        return <ValueSetField field={field} handleUpdateField={handleUpdateField} />;
      default:
        return null;
    }
  })();

  return (
    <div className={fieldStyles.field} id="field-template">
      <div className={clsx(fieldStyles.fieldLabel, fieldStyles.fieldLabelWithInput)}>{field.name}:</div>

      <div className={fieldStyles.fieldInputGroup}>
        {fieldComponent}
      </div>
    </div>
  );
};

FieldTemplate.propTypes = {
  field: PropTypes.object.isRequired,
  handleUpdateField: PropTypes.func.isRequired
};

const FieldsTemplate = ({ fields, handleUpdateField }) => (
  <div id="fields-template">
    {fields.map((field, index) =>
      <FieldTemplate key={index} field={field} handleUpdateField={handleUpdateField} />
    )}
  </div>
);

FieldsTemplate.propTypes = {
  fields: PropTypes.array.isRequired,
  handleUpdateField: PropTypes.func.isRequired
};

export default FieldsTemplate;
