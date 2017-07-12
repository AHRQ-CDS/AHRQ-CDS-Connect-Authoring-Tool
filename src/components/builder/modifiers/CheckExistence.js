import React, { Component } from 'react';
import _ from 'lodash';

class BooleanComparison extends Component {
  render() {
    const existenceId = _.uniqueId('existence-');
    return (
      <div>
        <div>
          <label htmlFor={existenceId}>
            <select id={existenceId} name="Check Existence?" value={this.props.value}
              onChange={(event) => {
                this.props.updateAppliedModifier(this.props.index, { value: event.target.value });
              }}>
              <option defaultValue="">{"-- Check Existence --"}</option>
              <option value="is null">{'is null'}</option>
              <option value="is not null">{'is not null'}</option>
            </select>
          </label>
        </div>
      </div>
    );
  }
}

export default BooleanComparison;
