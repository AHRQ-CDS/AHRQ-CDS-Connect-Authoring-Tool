import React from 'react';
import Select from 'react-select';
import _ from 'lodash';
import FontAwesome from 'react-fontawesome';


// Don't allow additional components to be added in for observation lists.
// NOTE - This may not be the functionality we want and may be changed in the future.
 // TODO: LVR is using 'number' now instead of 'observation' - this might be changed in the future with more comparison elements added in

export default (props) => {
  const id = _.uniqueId('parameter-');

  const typeList = [
    {value : "boolean", label : "boolean"},
    {value : "number", label : "number"},
    {value : "string", label : "string"}
  ];
  let returnType = {label : 'boolean', value : 'boolean'};
  function setType(value) {
    returnType = value;
  }


  const filteredValues = props.values.filter(
    v => v.returnType === 'boolean');
// <div>{props.joinOperator}</div>
  return (
    <div className="form__group">
      <label htmlFor={id}>
        {/*<Select
          autofocus
          options={typeList}
          clearable={true}
          value={returnType}
          onChange={setType}
          searchable={true}
        /><br/>*/}
        {/*{props.param.name}:*/}
        <table width="100%">
          <thead>
            <tr>
              <th>Case</th>
              <th>Result</th>
            </tr>
          </thead>
          <tbody>
            {props.param.value.map((v, index) =>
            <tr key={index}>
              {index > 0}
              <td width="50%">
                <Select key={index}
                      labelKey={'name'}
                      autofocus
                      options={filteredValues}
                      clearable={true}
                      name={props.param.id}
                      value={v.case}
                      onChange={(value) => {
                        props.updateList(props.param.id, value, index, 'case');
                      }}
                      searchable={true}/>
              </td>
              <td width="50%">
                <Select key={-index}
                      labelKey={'name'}
                      autofocus
                      options={filteredValues}
                      clearable={true}
                      name={props.param.id}
                      value={v.result}
                      onChange={(value) => {
                        props.updateList(props.param.id, value, index, 'result');
                      }}
                      searchable={true}/>
              </td>
          
            </tr>
          )}
          </tbody>
        </table>
        { (props.param.subType !== 'number')
        ? <button
            onClick={() => { props.addComponent(props.param.id); }}
            aria-label={'Add component'}>
            <FontAwesome fixedWidth name='plus'/>
          </button>
        : null }
      </label>

    </div>
  );
};