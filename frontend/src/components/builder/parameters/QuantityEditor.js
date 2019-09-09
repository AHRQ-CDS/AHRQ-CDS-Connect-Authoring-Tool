import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';

const { Def } = window;

export default class QuantityEditor extends Component {
  componentDidMount = () => {
    new Def.Autocompleter.Search( // eslint-disable-line no-new
      `${this.props.id}-unit-ucum`,
      'https://clin-table-search.lhc.nlm.nih.gov/api/ucum/v3/search',
      { tableFormat: true, valueCols: [0], colHeaders: ['Code', 'Name'] }
    );
  }

  assignValue(evt) {
    let quantity = null;
    let unit = null;
    let str = null;

    switch (evt.target.name) {
      case 'quantity':
        quantity = _.get(evt, 'target.value', null);
        if (quantity != null) { quantity = parseFloat(quantity); }
        unit = _.get(this, 'props.value.unit', null);
        break;
      case 'unit':
        quantity = _.get(this, 'props.value.quantity', null);
        unit = _.get(evt, 'target.value', null);
        break;
      default:
        break;
    }

    if ((quantity || quantity === 0) || unit) {
      const escapedQuoteUnit = (unit ? unit.replace(/'/g, '\\\'') : unit) || '1';
      if (Number.isInteger(quantity)) {
        str = `${quantity}.0 '${escapedQuoteUnit}'`;
      } else {
        str = `${quantity} '${escapedQuoteUnit}'`;
      }
      return { quantity, unit, str };
    }
    return null;
  }

  render() {
    const { id, name, type, label, value, updateInstance } = this.props;
    const formId = _.uniqueId('parameter-');

    return (
      <div className="quantity-editor">
        <div className="parameter__item row">
          <div className="col-3 bold align-right">
            <label htmlFor={formId}>{label}</label>
          </div>

          <div className="col-9">
            <input
              id={id}
              name="quantity"
              type="number"
              value={
                (_.get(value, 'quantity', null) || _.get(value, 'quantity', null) === 0)
                ? _.get(value, 'quantity')
                : '' }
              onChange={ (e) => {
                updateInstance({ name, type, label, value: this.assignValue(e) });
              }}
            />

            <span>  </span>

            <input
              type="text"
              id={`${this.props.id}-unit-ucum`}
              className="quantity-unit-ucum"
              name="unit"
              placeholder="enter unit"
              aria-label="Enter Unit"
              value={_.get(value, 'unit', null) || ''}
              onChange={(e) => {
                updateInstance({ name, type, label, value: this.assignValue(e) });
              }}
              onSelect={(e) => {
                updateInstance({ name, type, label, value: this.assignValue(e) });
              }}
            />
          </div>
        </div>
      </div>
    );
  }
}

QuantityEditor.propTypes = {
  id: PropTypes.string.isRequired,
  name: PropTypes.string,
  type: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  value: PropTypes.object,
  updateInstance: PropTypes.func.isRequired
};
