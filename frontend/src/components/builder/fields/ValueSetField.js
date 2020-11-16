import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import { useQuery } from 'react-query';
import _ from 'lodash';

import { Dropdown } from 'components/elements';

const fetchValueSets = (key, { type }) =>
  axios.get(`${process.env.REACT_APP_API_URL}/config/valuesets/${type}`).then(({ data }) => data.expansion);

const ValueSetField = ({ field, updateInstance }) => {
  const id = useMemo(() => _.uniqueId('field-'), []);
  const { data } = useQuery(['valueSets', { type: field.select }], fetchValueSets);
  const valueSets = data ?? [];
  const handleUpdateInstance = event => {
    const value = valueSets.find(valueSet => valueSet.id === event.target.value);
    updateInstance({ [field.id]: value });
  };

  return (
    <div className="field value-set-field">
      <div className="form__group">
        <label htmlFor={id}>
          <div className="label">{field.name}:</div>

          <div className="input">
            <div className="value-set-field__dropdown">
              <Dropdown
                id={id}
                label={field.name}
                onChange={handleUpdateInstance}
                options={valueSets}
                value={valueSets.length > 0 && field.value ? field.value.id : ''}
                valueKey="id"
                labelKey="name"
              />
            </div>
          </div>
        </label>
      </div>
    </div>
  );
};

ValueSetField.propTypes = {
  field: PropTypes.object,
  updateInstance: PropTypes.func
};

export default ValueSetField;
