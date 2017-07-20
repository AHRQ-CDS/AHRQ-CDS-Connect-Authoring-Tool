import React from 'react';
import Select from 'react-select';
import _ from 'lodash';

// TODO: We may want to have this parameter line up more closely with CaseParameter.
// The two work similiarly now, but this might change, depending on how nesting is handled.
// TODO: Handle nesting in a more user intuitive way.

export default (props) => {
  const id = _.uniqueId('parameter-');

  const conditionalValues = props.values.filter(element => element.returnType === 'boolean');

  const blockValues = props.values.filter(element => (element.returnType !== undefined));

  return (
    <div className="form__group">
        {props.value.map((value, index) => {
          if (index !== props.value.length - 1) {
            return (<div key={index}>
              <label htmlFor={`${id}-condition-${index}`}>
                Condition { index + 1 }:
                <Select
                  inputProps={{ id: `${id}-condition-${index}` }}
                  labelKey={'name'}
                  autofocus
                  options={conditionalValues}
                  value={value ? value.condition : null}
                  onChange={(v) => { props.updateIfStatement(props.param.id, v, index, 'condition'); }}/>
              </label>
              <label htmlFor={`${id}-block-${index}`}>
                Block:
                <Select
                  inputProps={{ id: `${id}-block-${index}` }}
                  labelKey={'name'}
                  autofocus
                  options={blockValues}
                  value={value ? value.block : null}
                  onChange={(v) => { props.updateIfStatement(props.param.id, v, index, 'block'); }}/>
              </label>
            </div>);
          }
          return (
             <div key={index}>
               <button onClick={() => props.addIfComponent(props.param.id)}>
                 Add Condition/Block
               </button>
               <label htmlFor={`${id}-default`}>
                 Default:
                 <Select
                   inputProps={{ id: `${id}-default` }}
                   labelKey={'name'}
                   autofocus
                   options={blockValues.concat({ name: 'Null' })}
                   value={value ? value.block : null}
                   onChange={(v) => { props.updateIfStatement(props.param.id, v, index, 'block'); }}/>
               </label>
           </div>
          );
        })}
    </div>
  );
};
