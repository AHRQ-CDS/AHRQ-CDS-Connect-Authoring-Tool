import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';

import { Dropdown } from 'components/elements';

const options = [
  { value: '>', label: '>' },
  { value: '>=', label: '>=' },
  { value: '=', label: '=' },
  { value: '!=', label: '!=' },
  { value: '<', label: '<' },
  { value: '<=', label: '<=' }
];

/* eslint-disable jsx-a11y/no-onchange */
export default class ValueComparisonNumber extends Component {
  handleChangeMin = event => {
    const { index, updateAppliedModifier } = this.props;
    const selectedMinOption = options.find(option => option.value === event.target.value);
    const value = selectedMinOption ? selectedMinOption.value : null;
    updateAppliedModifier(index, { minOperator: value });
  }

  handleChangeMax = event => {
    const { index, updateAppliedModifier } = this.props;
    const selectedMaxOption = options.find(option => option.value === event.target.value);
    const value = selectedMaxOption ? selectedMaxOption.value : null;
    updateAppliedModifier(index, { maxOperator: value });
  }

  render() {
    const { index, minOperator, maxOperator, minValue, maxValue, updateAppliedModifier } = this.props;
    const minValueId = _.uniqueId('value-');
    const minOperatorId = _.uniqueId('operator-');
    const maxValueId = _.uniqueId('value2-');
    const maxOperatorId = _.uniqueId('operator2-');

    return (
      <div className="value-comparison-observation">
        <div className="modifier-dropdown-short">
          <Dropdown
            id={minOperatorId}
            label="minOp"
            onChange={this.handleChangeMin}
            options={options}
            value={minOperator}
          />
        </div>

        <div className="modifier-input">
          <label htmlFor={minValueId}>
            <input
              id={minValueId}
              placeholder="minValue"
              className="modifier__comparison__value"
              type="number"
              step="any"
              name="Min value"
              aria-label="Min Value"
              value={(minValue || minValue === 0) ? minValue : ''}
              onChange={event => {
                updateAppliedModifier(index, { minValue: parseFloat(event.target.value) });
              }}
            />
          </label>
        </div>

        <div className="modifier-dropdown-short">
          <Dropdown
            id={maxOperatorId}
            label="maxOp"
            onChange={this.handleChangeMax}
            options={options}
            value={maxOperator}
          />
        </div>

        <div className="modifier-input">
          <label htmlFor={maxValueId}>
            <input
              placeholder="maxValue"
              id={maxValueId}
              className="modifier__comparison__value"
              type="number"
              step="any"
              name="Max value"
              aria-label="Max Value"
              value={(maxValue || maxValue === 0) ? maxValue : ''}
              onChange={event => {
                updateAppliedModifier(index, { maxValue: parseFloat(event.target.value) });
              }}
            />
          </label>
        </div>
      </div>
    );
  }
}

ValueComparisonNumber.propTypes = {
  index: PropTypes.number.isRequired,
  uniqueId: PropTypes.string.isRequired,
  minOperator: PropTypes.string,
  minValue: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  maxOperator: PropTypes.string,
  maxValue: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  updateAppliedModifier: PropTypes.func.isRequired
};
