import React from 'react';
import Select from 'react-select';
import _ from 'lodash';
import FontAwesome from 'react-fontawesome';


export default (props) => {
  const id = _.uniqueId('parameter-');

  const values = [{name: 'A', id: 'AA'}, {name: 'B', id: 'BB'}, {name: 'C', id: 'CC'}];
  return (
    <div className="form__group">
      <label htmlFor={id}>
        {props.param.name}:
        {props.param.value.map((v, index) =>
        <Select key={index}
                labelKey={'name'}
                autofocus
                options={values}
                clearable={true}
                name={props.param.id}
                value={v}
                onChange={(value) => {
                  props.updateInstance({ [props.param.id]: value }, index);
                }}
                searchable={true} />
        )}
        <button
          onClick={() => { props.addComponent(props.param.id); }}
          aria-label={"Add component"}>
          <FontAwesome fixedWidth name='plus'/>
        </button>
      </label>

    </div>
  );
};
