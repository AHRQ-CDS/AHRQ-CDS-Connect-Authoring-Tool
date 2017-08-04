import React, { Component } from 'react';

class BooleanComparison extends Component {
  render() {
    return (
      <div>
        <span className="field">
         <span className="control">
           <span className="select">
            <select name="Boolean Compare?" aria-label="Boolean Comparison" title="Boolean Comparison" value={this.props.value}
              onChange={(event) => {
                this.props.updateAppliedModifier(this.props.index, { value: event.target.value });
              }}>
              <option value="" disabled selected>-- Boolean Compare --</option>
              <option value="is true">{'is true'}</option>
              <option value="is not true">{'is not true'}</option>
              <option value="is false">{'is false'}</option>
              <option value="is not false">{'is not false'}</option>
            </select>
            </span>
          </span>
        </span>
      </div>
    );
  }
}

export default BooleanComparison;
