import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';

const { Def } = window;

/* eslint-disable jsx-a11y/no-onchange */
export default class QuantityModifier extends Component {
  componentDidMount = () => {
    new Def.Autocompleter.Search( // eslint-disable-line no-new
      this.props.uniqueId,
      'https://clin-table-search.lhc.nlm.nih.gov/api/ucum/v3/search',
      { tableFormat: true, valueCols: [0], colHeaders: ['Code', 'Name'] }
    );
  }

  render() {
    const valueId = _.uniqueId('value-');
    const unitId = _.uniqueId('unit-');

    return (
      <div className="quantity-modifier">
        <label htmlFor={valueId}>
          <input
            type="number"
            placeholder="enter value"
            aria-label="Quantity Modifier Value"
            value={this.props.value || ''}
            onChange={(event) => { this.props.updateAppliedModifier(this.props.index, { value: event.target.value }); }}
            onSelect={(event) => { this.props.updateAppliedModifier(this.props.index, { value: event.target.value }); }}
          />
        </label>

        <label htmlFor={unitId}>
          <input
            type="text"
            id={this.props.uniqueId}
            className="quantity-modifier-ucum"
            placeholder="enter unit"
            aria-label="Quantity Modifier Unit"
            value={this.props.unit || ''}
            onChange={(event) => { this.props.updateAppliedModifier(this.props.index, { unit: event.target.value }); }}
            onSelect={(event) => { this.props.updateAppliedModifier(this.props.index, { unit: event.target.value }); }}
          />
        </label>
      </div>
    );
  }
}

QuantityModifier.propTypes = {
  index: PropTypes.number.isRequired,
  uniqueId: PropTypes.string.isRequired,
  value: PropTypes.string,
  unit: PropTypes.string,
  updateAppliedModifier: PropTypes.func.isRequired
};
