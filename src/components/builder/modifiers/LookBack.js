import React, { Component } from 'react';
import _ from 'lodash';

class LookBack extends Component {
  constructor(props) {
    super(props);
    this.state = {  };
  }

  render() {
    const valueId = _.uniqueId('value-');
    const unitId = _.uniqueId('unit-');

    return (
      <div>
        <div >
          <label htmlFor={valueId}>
            Value:
            <input id={valueId} type="number" name="value" value={this.props.value || ""}
              onChange={(event) => {
                this.props.updateAppliedModifier(this.props.index, { value: parseInt(event.target.value, 10) });
              }}
            />
          </label>
          <label htmlFor={unitId}>
            Unit:
            <span className="field">
              <span className="control">
                <span className="select">
                  <select id={unitId} name="unit" value={this.props.unit}
                    onChange={(event) => {
                      this.props.updateAppliedModifier(this.props.index, { unit: event.target.value });
                    }}>
                    <option value="" disabled selected>-- Unit --</option>
                    <option value="years">Year(s)</option>
                    <option value="months">Month(s)</option>
                    <option value="weeks">Week(s)</option>
                    <option value="days">Day(s)</option>
                    <option value="hours">Hour(s)</option>
                    <option value="minutes">Minute(s)</option>
                    <option value="seconds">Second(s)</option>
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

export default LookBack;
