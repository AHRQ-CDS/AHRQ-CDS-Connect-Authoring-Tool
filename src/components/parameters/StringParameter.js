import React from 'react';
import _ from 'lodash';

// props are from a templateInstance parameters object,
// and a function called UpdateInstance that takes an object with
// key-value pairs that represents that state of the templateInstance
export default (props) => {
  const id = _.uniqueId('parameter-');

  return (
    <div>
      <label htmlFor={id}>
        {props.name}:

        <input id={id}
          type="text"
          name={props.id}
          defaultValue={props.value}
          onChange={(event) => {
          	const name = event.target.name;
            const value = event.target.value;
            props.updateInstance({ [name]: value })
          }}
        />
      </label>
    </div>
  );
}