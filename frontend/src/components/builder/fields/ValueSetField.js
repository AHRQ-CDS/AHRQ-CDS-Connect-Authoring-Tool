import React from 'react';
import PropTypes from 'prop-types';
import { useQuery } from 'react-query';
import clsx from 'clsx';

import { Dropdown } from 'components/elements';
import fetchValueSets from 'queries/fetchValueSets';
import { useFieldStyles } from 'styles/hooks';

const ValueSetField = ({ field, handleUpdateField }) => {
  const fieldStyles = useFieldStyles();
  const query = { type: field.select };
  const { data } = useQuery(['valueSets', query], () => fetchValueSets(query), { staleTime: Infinity });
  const valueSets = data ?? [];

  return (
    <div id="value-set-field">
      <Dropdown
        className={clsx(fieldStyles.fieldInput, fieldStyles.fieldInputMd)}
        id={field.id}
        label={field.name}
        labelKey="name"
        onChange={event =>
          handleUpdateField({ [field.id]: valueSets.find(valueSet => valueSet.id === event.target.value) })
        }
        options={valueSets}
        value={valueSets.length > 0 && field.value ? field.value.id : ''}
        valueKey="id"
      />
    </div>
  );
};

ValueSetField.propTypes = {
  field: PropTypes.object.isRequired,
  handleUpdateField: PropTypes.func.isRequired
};

export default ValueSetField;
