import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { Dropdown } from 'components/elements';

const options = [
  { value: 'is null', label: 'is null' },
  { value: 'is not null', label: 'is not null' }
];

export default class CheckExistence extends Component {
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
          className="field-input field-input-lg"
          id="check-existence"
          label="Check existence"
          onChange={this.handleChange}
          options={options}
          value={value}
        />
      </div>
    );
  }
}

CheckExistence.propTypes = {
  index: PropTypes.number.isRequired,
  updateAppliedModifier: PropTypes.func.isRequired,
  value: PropTypes.string
};
