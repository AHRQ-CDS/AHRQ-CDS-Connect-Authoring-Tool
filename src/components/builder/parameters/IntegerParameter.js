import React from 'react';
import _ from 'lodash';

// props are from a templateInstance parameters object,
// and a function called UpdateInstance that takes an object with
// key-value pairs that represents that state of the templateInstance
export default (props) => {
  const id = _.uniqueId('parameter-');

  return (
    <div className='form__group'>
      <label htmlFor={id}>
        {props.param.name}:

        <input id={id}
          type="number"
          name={props.param.id}
          defaultValue={props.param.value}
          value={props.value}
          onChange={(event) => {
            const value = parseInt(event.target.value, 10);
            props.updateInstance({ [event.target.name]: value });
          }}
        />
      </label>
    </div>
  );
};
