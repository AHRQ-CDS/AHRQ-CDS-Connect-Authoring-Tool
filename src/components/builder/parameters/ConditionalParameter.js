import React from 'react';
import Select from 'react-select';
import _ from 'lodash';

// TODO: Probably a way to use some of the other parameters in here (like import a <Component> and use it)
// TODO: Make some way to add in more 'else if' conditions
// TODO: Need to have selecting an option actually save a value on the parameter correctly

export default (props) => {
  const id = _.uniqueId('parameter-');
  
  const conditionalValues = props.values.filter((element) => {
    return element.returnType === 'boolean';
  });
  // TODO: the blocks of statements are probably going to need to be more than the string parameters
  const stringValues = props.values.filter((element) => {
    return element.returnType === 'string';
  });
  
  return (
    <div className="form__group">
      <label htmlFor={id}>
        {/* Put some sort of name here */}
        <div key={'a'}>
          Condition: { /*Put a number here? */}
          <Select key={'a'}
            labelKey={'name'}
            autofocus
            options={conditionalValues}
            onChange={() => {console.log("Im first")}}/>
        </div>
        <div key={'b'}>
          Block:
          <Select key={'b'}
            labelKey={'name'}
            autofocus
            options={stringValues}
            onChange={() => {console.log("Im second")}}/>
        </div>
        <div key={'c'}>
          Default:
          <Select key={'c'}
            labelKey={'name'}
            autofocus
            options={stringValues.concat({name: 'null'})}
            onChange={() => {console.log("Im last")}}/>
        </div>
      </label>
    </div>
  );
}