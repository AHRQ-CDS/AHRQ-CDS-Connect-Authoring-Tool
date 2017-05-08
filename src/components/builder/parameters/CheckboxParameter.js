import React from 'react';
import _ from 'lodash';

export default (props) => {
  const id = _.uniqueId('parameter-');

  return (
    <div className='form__group'>
      <label htmlFor={id}>
        {props.param.name}:

        <input id={id}
          type="checkbox"
          name={props.param.id}
          defaultValue={props.param.value}
          onClick={(event) => {
            const value = event.target.checked;
            props.updateInstance({ [event.target.name]: value });
          }}
        />
      </label>
    </div>
  );
}