import React, { memo } from 'react';
import { Field } from 'formik';
import { Paper } from '@mui/material';
import clsx from 'clsx';

import { isCpgComplete } from 'utils/fields';
import { useFieldStyles } from 'styles/hooks';
import useStyles from './styles';

const FastNested = memo(({ name, fields }) => {
  const fieldStyles = useFieldStyles();
  const styles = useStyles();

  return (
    <Paper className={styles.fieldGroupContainer}>
      {fields.map(field => {
        const FormComponent = field.component;

        return (
          <FormComponent
            className={fieldStyles.fieldInput}
            key={field.name}
            name={field.name}
            namePrefix={name}
            {...field}
          />
        );
      })}
    </Paper>
  );
});

const FastNestedField = memo(({ name, label, fields, values, isCpgField }) => {
  const cpgFieldComplete = isCpgComplete(name, values);
  const fieldStyles = useFieldStyles();
  const styles = useStyles();

  return (
    <div className={clsx(fieldStyles.field, styles.groupedFields)}>
      <label htmlFor={name} className={clsx(fieldStyles.fieldLabel, fieldStyles.fieldLabelGroup)}>
        <div>{label}</div>
        {isCpgField && <div className={clsx(styles.cpgTag, cpgFieldComplete && styles.cpgTagComplete)}>CPG</div>}:
      </label>

      <FastNested name={name} fields={fields} />
    </div>
  );
});

export default memo(function NestedField({ name, label, fields = [], isCpgField = false, isCpgComplete }) {
  return (
    <Field
      name={name}
      children={({ form }) => (
        <FastNestedField
          name={name}
          label={label}
          fields={fields}
          values={form.values}
          isCpgField={isCpgField}
          isCpgComplete={isCpgComplete}
        />
      )}
    />
  );
});
