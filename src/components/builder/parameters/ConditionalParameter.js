import React from 'react';
import Select from 'react-select';
import _ from 'lodash';

// TODO: Probably a way to use some of the other parameters in here (like import a <Component> and use it)
// TODO: Make some way to add in more 'else if' conditions
// TODO: Need to have selecting an option actually save a value on the parameter correctly
// TODO: if add the default first, the things above become null and creates an error
// TODO: NESTING
// TODO: add in more conditions
// TODO: Get rid of the unnecessary keys

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
        {props.value.map((value, index) => {
          console.log(value)
          if (index !== props.value.length-1) {
            return (<div key={index}>
              <div key={'a'}>
                Condition { index+1 }:
                <Select key={'a'}
                  labelKey={'name'}
                  autofocus
                  options={conditionalValues}
                  value={value ? value.condition : null}
                  onChange={(value) => {props.updateConditional(props.param.id, value, index, 'condition')}}/>
              </div>
              <div key={'b'}>
                Block:
                <Select key={'b'}
                  labelKey={'name'}
                  autofocus
                  options={stringValues}
                  value={value ? value.block : null}
                  onChange={(value) => {props.updateConditional(props.param.id, value, index, 'block')}}/>
              </div>
            </div>);
         } else {
           return (
             <div key={index}>
               <button
                 onClick={() => console.log("condition")}>
                 Add Condition/Block
               </button>
               <button
                 onClick={() => console.log("nested")}>
                 Add Nested
               </button>
               <div key={'c'}>
                 Default:
                 <Select key={'c'}
                   labelKey={'name'}
                   autofocus
                   options={stringValues.concat({name: 'null'})}
                   value={value ? value.block : null}
                   onChange={(value) => {console.log("Im last"); console.log(value); props.updateConditional(props.param.id, value, index, 'default')}}/>
               </div>
           </div>
           );
         }
        })}
      </label>
    </div>
  );
}