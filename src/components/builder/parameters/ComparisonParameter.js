import React, { Component } from 'react';
import Select from 'react-select';
import _ from 'lodash';

class ComparisonParameter extends Component {
  constructor(props) {
    super(props);
    this.state={
      value: this.props.param.value ? this.props.param.value : null // FIXME: updateInstance doesn't force the react component to rerender,
    };            // So using this value to re-render onChange.
  }
  render() {
  const option = [  { value: '>', label: '>' },
                    { value: '>=', label: '≥' },
                    { value: '=', label: '=' },
                    { value: '!=', label: '≠' },
                    { value: '<', label: '<' },
                    { value: '<=', label: '≤' },
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
          value={this.state.value}
          onChange={(operator) => {
            this.props.updateInstance({ [this.props.param.id]: ( operator ? operator.value : undefined)});
            this.setState({value: (operator ? operator.value : undefined)});
          }}
          searchable={true} />
      </label>
    </div>
  );
  }
}

export default ComparisonParameter;
