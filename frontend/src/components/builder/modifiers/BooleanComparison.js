import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { Dropdown } from 'components/elements';

const options = [
  { value: 'is true', label: 'is true' },
  { value: 'is not true', label: 'is not true' },
  { value: 'is false', label: 'is false' },
  { value: 'is not false', label: 'is not false' }
];

/* eslint-disable jsx-a11y/no-onchange */
export default class BooleanComparison extends Component {
  handleChange = event => {
    const { index, updateAppliedModifier } = this.props;
    const selectedOption = options.find(option => option.value === event.target.value);
    updateAppliedModifier(index, { value: selectedOption ? selectedOption.value : null });
  }

  render() {
    const { value } = this.props;

    return (
      <div className="modifier">
        <Dropdown
          className="field-input field-input-md"
          id="boolean-comparison"
          label="Boolean"
          onChange={this.handleChange}
          options={options}
          value={value}
        />
      </div>
    );
  }
}

BooleanComparison.propTypes = {
  index: PropTypes.number.isRequired,
  updateAppliedModifier: PropTypes.func.isRequired,
  value: PropTypes.string
};
