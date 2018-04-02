import React, { Component } from 'react';
import _ from 'lodash';

const { Def } = window;

/* eslint-disable jsx-a11y/no-onchange */
export default class WithUnit extends Component {
  componentDidMount = () => {
    new Def.Autocompleter.Search( // eslint-disable-line no-new
      'with-unit-ucum',
      'https://clin-table-search.lhc.nlm.nih.gov/api/ucum/v3/search',
      { tableFormat: true, valueCols: [0], colHeaders: ['Code', 'Name'] }
    );
  }

  render() {
    const unitId = _.uniqueId('unit-');

    return (
      <div className="with-unit">
        <label htmlFor={unitId}>
          Unit:
          {/* <span className="field">
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
          </span> */}
          <input
            type="text"
            id="with-unit-ucum"
            placeholder="Enter unit"
            value={this.props.unit}
            onChange={(event) => { this.props.updateAppliedModifier(this.props.index, { unit: event.target.value }); }}
            onSelect={(event) => { this.props.updateAppliedModifier(this.props.index, { unit: event.target.value }); }}
          />
        </label>
      </div>
    );
  }
}
