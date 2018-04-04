import React, { Component } from 'react';
import Select from 'react-select';

/* eslint-disable jsx-a11y/no-onchange */
export default class BooleanComparison extends Component {
  state = {
    selectedOption: this.props.value,
  }

  handleChange = (selectedOption) => {
    this.setState({ selectedOption });
    this.props.updateAppliedModifier(this.props.index, { value: selectedOption });
  }

  render() {
    const { selectedOption } = this.state;
    const value = selectedOption && selectedOption.value;

    return (
      <div className="boolean-comparison">
        <Select
          name="Boolean Compare?"
          aria-label="Boolean Comparison"
          title="Boolean Comparison"
          placeholder="boolean"
          value={value}
          onChange={this.handleChange}
          options={[
            { value: 'is true', label: 'is true' },
            { value: 'is not true', label: 'is not true' },
            { value: 'is false', label: 'is false' },
            { value: 'is not false', label: 'is not false' }
          ]}
        />
      </div>
    );
  }
}
