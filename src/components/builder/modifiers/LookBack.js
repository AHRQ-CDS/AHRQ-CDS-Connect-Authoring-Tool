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
            <input id={valueId} type="number" name="value" value={this.props.value}
              onChange={(event) => {
                this.props.updateAppliedModifier(this.props.index, { value: parseInt(event.target.value, 10) });
              }}
            />
          </label>
          <label htmlFor={unitId}>
            Unit:
            <select id={unitId} name="unit" value={this.props.unit}
              onChange={(event) => {
                this.props.updateAppliedModifier(this.props.index, { unit: event.target.value });
              }}>
              <option value="" disabled selected>-- Unit --</option>
              <option value="year">Year(s)</option>
              <option value="month">Month(s)</option>
              <option value="week">Week(s)</option>
              <option value="day">Day(s)</option>
              <option value="hour" value="year">Hour(s)</option>
              <option value="minute">Minute(s)</option>
              <option value="second">Second(s)</option>
            </select>
          </label>

        </div>
      </div>
    );
  }
}

export default LookBack;
