import React, { Component } from 'react';
import _ from 'lodash';

const { Def } = window;

/* eslint-disable jsx-a11y/no-onchange */
export default class ValueComparisonObservation extends Component {
  componentDidMount = () => {
    new Def.Autocompleter.Search( // eslint-disable-line no-new
      'ucum-unit',
      'https://clin-table-search.lhc.nlm.nih.gov/api/ucum/v3/search',
      { tableFormat: true, valueCols: [0], colHeaders: ['Code', 'Name'] }
    );
  }

  render() {
    const minValueId = _.uniqueId('value-');
    const minOperatorId = _.uniqueId('operator-');
    const maxValueId = _.uniqueId('value2-');
    const maxOperatorId = _.uniqueId('operator2-');
    const unitId = _.uniqueId('unit-');

    return (
      <div className="value-comparison-observation">
        <span className="field">
          <span className="control">
            <span className="select">
              <select
                className="operator"
                id={minOperatorId}
                title="Min Operator"
                aria-label="Min Operator"
                name="Min Operator"
                value={this.props.minOperator}
                defaultValue=""
                onChange={(event) => {
                  this.props.updateAppliedModifier(this.props.index, { minOperator: event.target.value });
                }}>
                <option value="">{'--'}</option>
                <option value=">">{'>'}</option>
                <option value=">=">{'>='}</option>
                <option value="=">{'='}</option>
                <option value="!=">{'!='}</option>
                <option value="<">{'<'}</option>
                <option value="<=">{'<='}</option>
              </select>
            </span>
          </span>
        </span>

        <label htmlFor={minValueId}>
          Value:
          <input id={minValueId} className="modifier__comparison__value" type="number" step="any" name="Min value"
            value={this.props.minValue || ''}
            onChange={(event) => {
              this.props.updateAppliedModifier(this.props.index, { minValue: parseFloat(event.target.value, 10) });
            }}
          />
        </label>

        <span className="field">
          <span className="control">
            <span className="select">
              <select id={maxOperatorId}
                className="operator"
                name="Max Operator"
                title="Max Operator"
                aria-label="Max Operator"
                value={this.props.maxOperator}
                defaultValue=""
                onChange={(event) => {
                  this.props.updateAppliedModifier(this.props.index, { maxOperator: event.target.value });
                }}>
                <option value="">{'--'}</option>
                <option value=">">{'>'}</option>
                <option value=">=">{'>='}</option>
                <option value="=">{'='}</option>
                <option value="!=">{'!='}</option>
                <option value="<">{'<'}</option>
                <option value="<=">{'<='}</option>
              </select>
            </span>
          </span>
        </span>

        <label htmlFor={maxValueId}>
          Value:
          <input id={maxValueId} className="modifier__comparison__value" type="number" step="any" name="Max value"
            value={this.props.maxValue || ''}
            onChange={(event) => {
              this.props.updateAppliedModifier(this.props.index, { maxValue: parseFloat(event.target.value, 10) });
            }}
          />
        </label>

        <label htmlFor={unitId}>
          Unit:

          <input
            type="text"
            id="ucum-unit"
            aria-label="Unit"
            placeholder="Enter unit"
            value={this.props.unit}
            onChange={(event) => {
              this.props.updateAppliedModifier(this.props.index, { unit: event.target.value });
            }}
            onSelect={(event) => {
              this.props.updateAppliedModifier(this.props.index, { unit: event.target.value });
            }}
          />
        </label>
      </div>
    );
  }
}
