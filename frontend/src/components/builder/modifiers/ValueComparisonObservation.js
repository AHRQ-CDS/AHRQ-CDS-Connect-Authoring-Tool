import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';

import { Dropdown } from 'components/elements';

const { Def } = window;
const options = [
  { value: '>', label: '>' },
  { value: '>=', label: '>=' },
  { value: '=', label: '=' },
  { value: '!=', label: '!=' },
  { value: '<', label: '<' },
  { value: '<=', label: '<=' }
];

/* eslint-disable jsx-a11y/no-onchange */
export default class ValueComparisonObservation extends Component {
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

  handleChangeUnit = ({ target }) => {
    const { index, updateAppliedModifier } = this.props;
    updateAppliedModifier(index, { unit: target.value });
  }

  componentDidMount = () => {
    if (Def) {
      new Def.Autocompleter.Search( // eslint-disable-line no-new
        this.props.uniqueId,
        'https://clin-table-search.lhc.nlm.nih.gov/api/ucum/v3/search',
        { tableFormat: true, valueCols: [0], colHeaders: ['Code', 'Name'] }
      );
    }
  }

  render() {
    const {
      index,
      maxOperator,
      maxValue,
      minOperator,
      minValue,
      uniqueId,
      unit,
      updateAppliedModifier
    } = this.props;
    const minValueId = _.uniqueId('value-');
    const minOperatorId = _.uniqueId('operator-');
    const maxValueId = _.uniqueId('value2-');
    const maxOperatorId = _.uniqueId('operator2-');
    const unitId = _.uniqueId('unit-');

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

        <label htmlFor={unitId}>
          <input
            type="text"
            id={uniqueId}
            aria-label="Unit"
            placeholder="enter unit"
            value={unit}
            onChange={this.handleChangeUnit}
            onSelect={this.handleChangeUnit}
          />
        </label>
      </div>
    );
  }
}

ValueComparisonObservation.propTypes = {
  index: PropTypes.number.isRequired,
  uniqueId: PropTypes.string.isRequired,
  unit: PropTypes.string,
  minOperator: PropTypes.string,
  minValue: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  maxOperator: PropTypes.string,
  maxValue: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  updateAppliedModifier: PropTypes.func.isRequired
};
