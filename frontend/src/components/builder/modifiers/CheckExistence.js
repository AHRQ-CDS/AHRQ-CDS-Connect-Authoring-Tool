import React, { Component } from 'react';

/* eslint-disable jsx-a11y/no-onchange */
export default class CheckExistence extends Component {
  render() {
    return (
      <div className="check-existance">
        <span className="field">
          <span className="control">
            <span className="select">
              <select name="Check Existence?" aria-label="Check Existence" title="Check Existence"
                value={this.props.value}
                onChange={(event) => {
                  this.props.updateAppliedModifier(this.props.index, { value: event.target.value });
                }}>
                <option defaultValue="" value="">{'-- Check Existence --'}</option>
                <option value="is null">{'is null'}</option>
                <option value="is not null">{'is not null'}</option>
              </select>
            </span>
          </span>
        </span>
      </div>
    );
  }
}
