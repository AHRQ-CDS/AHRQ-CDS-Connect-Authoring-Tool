import React from 'react';
import Select from 'react-select';
import _ from 'lodash';


export default (props) => {
  const id = _.uniqueId('parameter-');

  let valueset;
  if (props.valueset !== undefined) {
    // Get the list of valusets based on the type of parameter
    const indexOfValueset = props.valueset.findIndex((element) => { 
      return element.id === props.param.id });
    valueset = props.valueset[indexOfValueset].valuesets;
  }
  return (
    <div className="form__group">
      <label htmlFor={id}>
        {props.param.name}:
        <Select labelKey={"name"} 
          autofocus 
          options={valueset}
          inputProps={{'id': id}}
          clearable={true} 
          name={props.param.id}
          value={props.param.value} 
          onChange={(value) => {
              props.updateInstance({ [props.param.id]: value })
          }} 
          searchable={true} />
      </label>
    </div>
  );
}