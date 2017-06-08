import React from 'react';
import Select from 'react-select';
import _ from 'lodash';

// TODO: Probably a way to use some of the other parameters in here (like import a <Component> and use it)
// TODO: NESTING
// TODO: __ is null option

export default (props) => {
  const id = _.uniqueId('parameter-');
  
  const conditionalValues = props.values.filter((element) => {
    return element.returnType === 'boolean';
  });
  // TODO: the blocks of statements are probably going to need to be more than the string parameters
  const stringValues = props.values.filter((element) => {
    return (element.returnType === 'string' || element.returnType === 'recommendation');
  });
  
  return (
    <div className="form__group">
      <label htmlFor={id}>
        {props.value.map((value, index) => {
          if (index !== props.value.length-1) {
            return (<div key={index}>
              <div>
                Condition { index+1 }:
                <Select
                  labelKey={'name'}
                  autofocus
                  options={conditionalValues}
                  value={value ? value.condition : null}
                  onChange={(value) => {props.updateConditional(props.param.id, value, index, 'condition')}}/>
              </div>
              <div>
                Block:
                <Select
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
               <button onClick={() => props.addCondition(props.param.id)}>
                 Add Condition/Block
               </button>
               <div>
                 Default:
                 <Select
                   labelKey={'name'}
                   autofocus
                   options={stringValues.concat({name: 'null'})}
                   value={value ? value.block : null}
                   onChange={(value) => {props.updateConditional(props.param.id, value, index, 'default')}}/>
               </div>
           </div>
           );
         }
        })}
      </label>
    </div>
  );
}