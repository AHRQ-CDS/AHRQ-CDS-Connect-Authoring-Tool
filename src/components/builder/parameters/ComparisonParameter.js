import React, { Component } from 'react';
import Select from 'react-select';
import _ from 'lodash';

class ComparisonParameter extends Component {

  render() {
    const option = [  { value: '>', label: 'greater than' },
                      { value: '>=', label: 'greater than or equal to' },
                      { value: '=', label: 'equal to' },
                      { value: '!=', label: 'not equal to' },
                      { value: '<', label: 'less than' },
                      { value: '<=', label: 'less than or equal to' },
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
            onChange={operator => {
              this.props.updateInstance({ [this.props.param.id]: operator ? operator.value : null});
            }}
            searchable={true} />
        </label>
      </div>
    );
  }
}

export default ComparisonParameter;
