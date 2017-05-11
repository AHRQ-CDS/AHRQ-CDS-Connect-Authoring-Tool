import React from 'react';
import Select from 'react-select';
import _ from 'lodash';
import FontAwesome from 'react-fontawesome';


// *** filter by boolean

export default (props) => {
  const id = _.uniqueId('parameter-');

  const filteredValues = props.values.filter(
    v => v.returnType === props.param.subType);

  return (
    <div className="form__group">
      <label htmlFor={id}>
        {props.param.name}:
        {props.param.value.map((v, index) =>
        <div key={index}>
          {index > 0 && <div>{props.joinOperator}</div> }
          <Select key={index}
                  labelKey={'name'}
                  autofocus
                  options={filteredValues}
                  clearable={true}
                  name={props.param.id}
                  value={v}
                  onChange={(value) => {
                    props.updateList(props.param.id, value, index);
                  }}
                  searchable={true} />
        </div>
          )}
        <button
          onClick={() => { props.addComponent(props.param.id); }}
          aria-label={'Add component'}>
          <FontAwesome fixedWidth name='plus'/>
        </button>
      </label>

    </div>
  );
};
