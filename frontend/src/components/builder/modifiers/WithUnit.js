import React, { Component } from 'react';
import _ from 'lodash';

/* eslint-disable jsx-a11y/no-onchange */
class WithUnit extends Component {
  constructor(props) {
    super(props);
    this.state = { };
  }

  render() {
    const unitId = _.uniqueId('unit-');
    return (
      <div>
        <div >
          <label htmlFor={unitId}>
            Value:
            <span className="field">
             <span className="control">
               <span className="select">
                  <select id={unitId} name="With Unit" aria-label="With Unit" value={this.props.unit}
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

export default WithUnit;
