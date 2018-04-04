import React, { Component } from 'react';
import Select from 'react-select';

/* eslint-disable jsx-a11y/no-onchange */
export default class CheckExistence extends Component {
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
      <div className="check-existence">
        <Select
          name="Check Existence?"
          aria-label="Check Existence"
          title="Check Existence"
          placeholder="check existence value"
          value={value}
          onChange={this.handleChange}
          options={[
            { value: 'is null', label: 'is null' },
            { value: 'is not null', label: 'is not null' }
          ]}
        />
      </div>
    );
  }
}
