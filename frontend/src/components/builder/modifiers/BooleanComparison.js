import React, { Component } from 'react';
import PropTypes from 'prop-types';

import StyledSelect from '../../elements/StyledSelect';

const options = [
  { value: 'is true', label: 'is true' },
  { value: 'is not true', label: 'is not true' },
  { value: 'is false', label: 'is false' },
  { value: 'is not false', label: 'is not false' }
];

/* eslint-disable jsx-a11y/no-onchange */
export default class BooleanComparison extends Component {
  handleChange = (selectedOption) => {
    this.props.updateAppliedModifier(this.props.index, { value: selectedOption ? selectedOption.value : null });
  }

  render() {
    return (
      <div className="boolean-comparison">
        <StyledSelect
          className="Select"
          classNamePrefix="boolean-comparison-select"
          name="Boolean Compare?"
          aria-label="Boolean Comparison"
          title="Boolean Comparison"
          placeholder="boolean"
          value={options.find(({ value }) => value === this.props.value)}
          onChange={this.handleChange}
          options={options}
        />
      </div>
    );
  }
}

BooleanComparison.propTypes = {
  index: PropTypes.number.isRequired,
  value: PropTypes.string,
  updateAppliedModifier: PropTypes.func.isRequired
};
