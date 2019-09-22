import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';

/* eslint-disable jsx-a11y/no-onchange */
export default class WithUnit extends Component {
  componentDidMount = () => {
    new window.Def.Autocompleter.Search( // eslint-disable-line no-new
      this.props.uniqueId,
      'https://clin-table-search.lhc.nlm.nih.gov/api/ucum/v3/search',
      { tableFormat: true, valueCols: [0], colHeaders: ['Code', 'Name'] }
    );
  }

  render() {
    const unitId = _.uniqueId('unit-');

    return (
      <div className="with-unit">
        <label htmlFor={unitId}>
          <input
            type="text"
            id={this.props.uniqueId}
            className="with-unit-ucum"
            placeholder="enter unit"
            aria-label="With Unit"
            value={this.props.unit || ''}
            onChange={(event) => { this.props.updateAppliedModifier(this.props.index, { unit: event.target.value }); }}
            onSelect={(event) => { this.props.updateAppliedModifier(this.props.index, { unit: event.target.value }); }}
          />
        </label>
      </div>
    );
  }
}

WithUnit.propTypes = {
  index: PropTypes.number.isRequired,
  uniqueId: PropTypes.string.isRequired,
  unit: PropTypes.string,
  updateAppliedModifier: PropTypes.func.isRequired
};
