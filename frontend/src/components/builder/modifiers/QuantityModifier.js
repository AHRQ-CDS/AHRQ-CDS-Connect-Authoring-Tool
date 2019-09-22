import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';

/* eslint-disable jsx-a11y/no-onchange */
export default class QuantityModifier extends Component {
  componentDidMount = () => {
    new window.Def.Autocompleter.Search( // eslint-disable-line no-new
      this.props.uniqueId,
      'https://clin-table-search.lhc.nlm.nih.gov/api/ucum/v3/search',
      { tableFormat: true, valueCols: [0], colHeaders: ['Code', 'Name'] }
    );
  }

  render() {
    const { value } = this.props;
    const valueId = _.uniqueId('value-');
    const unitId = _.uniqueId('unit-');

    return (
      /* eslint-disable jsx-a11y/label-has-for */
      <div className="quantity-modifier">
        <label>
          {`${this.props.name}: `}
        </label>

        <span>  </span>

        <label htmlFor={valueId}>
          <input
            type="number"
            className="quantity-modifier-value"
            placeholder="enter value"
            aria-label="Quantity Modifier Value"
            value={(value || value === 0) ? value : ''}
            onChange={(event) => {
              this.props.updateAppliedModifier(
                this.props.index,
                { value: _.isNaN(parseFloat(event.target.value)) ? null : parseFloat(event.target.value) }
              );
            }}
            onSelect={(event) => {
              this.props.updateAppliedModifier(
                this.props.index,
                { value: _.isNaN(parseFloat(event.target.value)) ? null : parseFloat(event.target.value) }
              );
            }}
          />
        </label>

        <label htmlFor={unitId}>
          <input
            type="text"
            id={this.props.uniqueId}
            className="quantity-modifier-unit"
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
  name: PropTypes.string.isRequired,
  value: PropTypes.number,
  unit: PropTypes.string,
  updateAppliedModifier: PropTypes.func.isRequired
};
