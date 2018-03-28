import React, { Component } from 'react';
import _ from 'lodash';

const { Def } = window;

/* eslint-disable jsx-a11y/no-onchange */
class WithUnit extends Component {
  constructor(props) {
    super(props);
    this.state = { };
  }

  render() {
    new Def.Autocompleter.Search('ucum', 'https://clin-table-search.lhc.nlm.nih.gov/api/ucum/v3/search', {tableFormat: true, valueCols: [0], colHeaders: ['Code', 'Name']});
    const unitId = _.uniqueId('unit-');
    return (
      <div>
        <div >
          <input type="text" id="ucum" placeholder="Code or name"/>
          <label htmlFor={unitId}>
            Unit:
            <span className="field">
             <span className="control">
               <span className="select">
                  <select id={unitId} name="With Unit" aria-label="With Unit" value={this.props.unit}
                    onChange={(event) => {
                      this.props.updateAppliedModifier(this.props.index, { unit: event.target.value });
                    }}>
                    <option defaultValue="" value="">{'-- Select Unit --'}</option>
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
