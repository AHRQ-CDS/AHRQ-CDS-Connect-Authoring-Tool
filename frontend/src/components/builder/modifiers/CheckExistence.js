import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Select from 'react-select';

/* eslint-disable jsx-a11y/no-onchange */
export default class CheckExistence extends Component {
  handleChange = (selectedOption) => {
    this.props.updateAppliedModifier(this.props.index, { value: selectedOption ? selectedOption.value : null });
  }

  render() {
    return (
      <div className="check-existence">
        <Select
          name="Check Existence?"
          aria-label="Check Existence"
          title="Check Existence"
          placeholder="check existence value"
          value={this.props.value}
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

CheckExistence.propTypes = {
  index: PropTypes.number.isRequired,
  value: PropTypes.string,
  updateAppliedModifier: PropTypes.func.isRequired
};
