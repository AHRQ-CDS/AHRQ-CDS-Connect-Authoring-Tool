import React from 'react';
import Select from 'react-select';
import _ from 'lodash';
import FontAwesome from 'react-fontawesome';


// Don't allow additional components to be added in for observation lists.
// NOTE - This may not be the functionality we want and may be changed in the future.
 // TODO: LVR is using 'number' now instead of 'observation' - this might be changed in the future with more comparison elements added in

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
