import React, { Component } from 'react';
import _ from 'lodash';

class ValueComparisonObservation extends Component {
  constructor(props) {
    super(props);
    this.state = {  };
  }

  render() {
    const minValueId = _.uniqueId('value-');
    const minOperatorId = _.uniqueId('operator-');
    const maxValueId = _.uniqueId('value2-');
    const maxOperatorId = _.uniqueId('operator2-');
    return (
      <div>
        <div >
          <label htmlFor={minOperatorId}>
            <select
              id={minOperatorId}
              name="Min Operator"
              value={this.props.minOperator}
              defaultValue=""
              onChange={(event) => {
                this.props.updateAppliedModifier(this.props.index, { minOperator: event.target.value });
              }}>
              <option value="">{"-- Operator --"}</option>
              <option value=">">{'>'}</option>
              <option value=">=">{'>='}</option>
              <option value="=">{'='}</option>
              <option value="!=">{'!='}</option>
              <option value="<">{'<'}</option>
              <option value="<=">{'<='}</option>
            </select>
          </label>

          <label htmlFor={minValueId}>
            Value:
            <input id={minValueId} className="modifier__comparison__value" type="number" step="any" name="Min value" value={this.props.minValue || ""}
              onChange={(event) => {
                this.props.updateAppliedModifier(this.props.index, { minValue: parseFloat(event.target.value, 10) });
              }}
            />
          </label>

          <label htmlFor={maxOperatorId}>
            <select id={maxOperatorId}
              name="Max Operator"
              value={this.props.maxOperator}
              defaultValue=""
              onChange={(event) => {
                this.props.updateAppliedModifier(this.props.index, { maxOperator: event.target.value });
              }}>
              <option value="">{"-- Operator --"}</option>
              <option value=">">{'>'}</option>
              <option value=">=">{'>='}</option>
              <option value="=">{'='}</option>
              <option value="!=">{'!='}</option>
              <option value="<">{'<'}</option>
              <option value="<=">{'<='}</option>
            </select>
          </label>

          <label htmlFor={maxValueId}>
            Value:
            <input id={maxValueId} className="modifier__comparison__value" type="number" step="any" name="Max value" value={this.props.maxValue || ""}
              onChange={(event) => {
                this.props.updateAppliedModifier(this.props.index, { maxValue: parseFloat(event.target.value, 10) });
              }}
            />
          </label>

        </div>
      </div>
    );
  }
}

export default ValueComparisonObservation;
