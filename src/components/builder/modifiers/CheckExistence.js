import React, { Component } from 'react';

class CheckExistence extends Component {
  render() {
    return (
      <div>
        <span className="field">
         <span className="control">
           <span className="select">
              <select name="Check Existence?" aria-label="Check Existence" value={this.props.value}
                onChange={(event) => {
                  this.props.updateAppliedModifier(this.props.index, { value: event.target.value });
                }}>
                <option defaultValue="">{"-- Check Existence --"}</option>
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

export default CheckExistence;
