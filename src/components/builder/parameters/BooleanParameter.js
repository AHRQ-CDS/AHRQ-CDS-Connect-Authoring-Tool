import React from 'react';
import Select from 'react-select';
import _ from 'lodash';


export default (props) => {
  const id = _.uniqueId('parameter-');

  const values = [{ id: 'true', name: 'True' }, { id: 'false', name: 'False' }];
  return (
    <div className="form__group">
      <label htmlFor={id}>
        {props.param.name}:
        <Select labelKey={'name'}
                autofocus
                options={values}
                inputProps={{ id }}
                simpleValue
                valueKey={'id'}
                clearable={false}
                name={props.param.id}
                value={props.param.value}
                onChange={(value) => {
                  props.updateInstance({ [props.param.id]: value });
                }}
                searchable={false} />
      </label>
    </div>
  );
};
