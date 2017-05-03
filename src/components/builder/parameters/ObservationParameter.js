import React from 'react';
import Select from 'react-select';
import _ from 'lodash';


export default (props) => {
  const id = _.uniqueId('parameter-');

  const observations = props.resources['observations'];
  return (
    <div className="form__group">
      <label htmlFor={id}>
        {props.param.name}:
				<Select labelKey={"name"} 
				        autofocus 
				        options={observations}
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
