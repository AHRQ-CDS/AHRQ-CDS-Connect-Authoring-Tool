import React from 'react';
import PropTypes from 'prop-types';
import { useQuery } from 'react-query';
import axios from 'axios';
import clsx from 'clsx';

import { Dropdown } from 'components/elements';
import useStyles from './styles';

const fetchValueSets = (key, { type }) =>
  axios.get(`${process.env.REACT_APP_API_URL}/config/valuesets/${type}`).then(({ data }) => data.expansion);

const ValueSetField = ({ field, updateInstance }) => {
  const styles = useStyles();
  const { data } = useQuery(['valueSets', { type: field.select }], fetchValueSets);
  const valueSets = data ?? [];

  const handleUpdateInstance = event => {
    const value = valueSets.find(valueSet => valueSet.id === event.target.value);
    updateInstance({ [field.id]: value });
  };

  return (
    <div className={clsx('value-set-field', styles.field)}>
      <div className={styles.fieldLabel}>{field.name}:</div>

      <Dropdown
        className={clsx(styles.fieldInput, styles.fieldInputMd)}
        label={field.name}
        onChange={handleUpdateInstance}
        options={valueSets}
        value={valueSets.length > 0 && field.value ? field.value.id : ''}
        valueKey="id"
        labelKey="name"
      />
    </div>
  );
};

ValueSetField.propTypes = {
  field: PropTypes.object,
  updateInstance: PropTypes.func
};

export default ValueSetField;
