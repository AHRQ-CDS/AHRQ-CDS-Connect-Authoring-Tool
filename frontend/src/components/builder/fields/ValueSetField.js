import React from 'react';
import PropTypes from 'prop-types';
import { useQuery } from 'react-query';
import clsx from 'clsx';

import { Dropdown } from 'components/elements';
import fetchValueSets from 'queries/fetchValueSets';
import { useFieldStyles } from 'styles/hooks';

const ValueSetField = ({ field, updateInstance }) => {
  const fieldStyles = useFieldStyles();
  const query = { type: field.select };
  const { data } = useQuery(['valueSets', query], () => fetchValueSets(query));
  const valueSets = data ?? [];

  const handleUpdateInstance = event => {
    const value = valueSets.find(valueSet => valueSet.id === event.target.value);
    updateInstance({ [field.id]: value });
  };

  return (
    <div className={clsx('value-set-field', fieldStyles.field)}>
      <div className={fieldStyles.fieldLabel}>{field.name}:</div>

      <Dropdown
        className={clsx(fieldStyles.fieldInput, fieldStyles.fieldInputMd)}
        label={field.name}
        onChange={handleUpdateInstance}
        options={valueSets}
        value={valueSets.length > 0 && field.value ? field.value.id : ''}
        valueKey="id"
        labelKey="name"
        id={field.id}
      />
    </div>
  );
};

ValueSetField.propTypes = {
  field: PropTypes.object,
  updateInstance: PropTypes.func
};

export default ValueSetField;
