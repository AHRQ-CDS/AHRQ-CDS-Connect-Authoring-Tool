import React, { Component } from 'react';
import _ from 'lodash';

/* eslint-disable jsx-a11y/no-onchange */
class ValueComparisonObservation extends Component {
  constructor(props) {
    super(props);
    this.state = { };
  }

  render() {
    const minValueId = _.uniqueId('value-');
    const minOperatorId = _.uniqueId('operator-');
    const maxValueId = _.uniqueId('value2-');
    const maxOperatorId = _.uniqueId('operator2-');
    const unitId = _.uniqueId('unit-');
    return (
      <div>
        <div >
          <span className="field">
            <span className="control">
              <span className="select">
                <select
                  id={minOperatorId}
                  title="Min Operator"
                  aria-label="Min Operator"
                  name="Min Operator"
                  value={this.props.minOperator}
                  defaultValue=""
                  onChange={(event) => {
                    this.props.updateAppliedModifier(this.props.index, { minOperator: event.target.value });
                  }}>
                  <option value="">{'-- Operator --'}</option>
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
                  name="Max Operator"
                  title="Max Operator"
                  aria-label="Max Operator"
                  value={this.props.maxOperator}
                  defaultValue=""
                  onChange={(event) => {
                    this.props.updateAppliedModifier(this.props.index, { maxOperator: event.target.value });
                  }}>
                  <option value="">{'-- Operator --'}</option>
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
            <span className="field">
             <span className="control">
               <span className="select">
                  <select id={unitId} name="Unit" aria-label="Unit" value={this.props.unit}
                    onChange={(event) => {
                      this.props.updateAppliedModifier(this.props.index, { unit: event.target.value });
                    }}>
                    <option defaultValue="">{'-- Select Unit --'}</option>
                    <option value="mg/dL">{'mg/dL'}</option>
                  </select>
                </span>
              </span>
            </span>
          </label>

        </div>
      </div>
    );
  }
}

export default ValueComparisonObservation;
