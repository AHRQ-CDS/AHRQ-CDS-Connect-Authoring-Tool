import React, { Component } from 'react';
import _ from 'lodash';

class BooleanComparison extends Component {
  render() {
    const booleanCompareId = _.uniqueId('booleanCompare-');
    return (
      <div>
        <div>
          <label htmlFor={booleanCompareId}>
            <select id={booleanCompareId} name="Boolean Compare?" value={this.props.value}
              onChange={(event) => {
                this.props.updateAppliedModifier(this.props.index, { value: event.target.value });
              }}>
              <option value="" disabled selected>-- Boolean Compare --</option>
              <option value="is true">{'is true'}</option>
              <option value="is not true">{'is not true'}</option>
              <option value="is false">{'is false'}</option>
              <option value="is not false">{'is not false'}</option>
            </select>
          </label>
        </div>
      </div>
    );
  }
}

export default BooleanComparison;
