import React, { Component } from 'react';
import Select from 'react-select';
import _ from 'lodash';

class BooleanComparisonParameter extends Component {

  render() {
    const option = [{ value: 'is true', label: 'is true' },
                      { value: 'is not true', label: 'is not true' },
                      { value: 'is false', label: 'is false' },
                      { value: 'is not false', label: 'is not false' },
    ];
    const id = _.uniqueId('parameter-');
    return (
      <div className="form__group">
        <label htmlFor={id}>
          {this.props.param.name}:
          <Select
            autofocus
            options={option}
            name={this.props.value}
            value={this.props.param.value}
            onChange={(operator) => {
              this.props.updateInstance({
                [this.props.param.id]: operator ? operator.value : null });
            }}
            searchable={true} />
        </label>
      </div>
    );
  }
}

export default BooleanComparisonParameter;
