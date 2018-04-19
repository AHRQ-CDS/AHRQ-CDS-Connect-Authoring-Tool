import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';

export default class QuantityEditor extends Component {
  assignValue(evt) {
    let quantity = null;
    let unit = null;
    let str = null;

    switch (evt.target.name) {
      case 'quantity':
        quantity = _.get(evt, 'target.value', null);
        if (quantity != null) { quantity = parseFloat(quantity, 10); }
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
      if (Number.isInteger(quantity)) {
        str = `${quantity}.0 '${unit}'`;
      } else {
        str = `${quantity} '${unit}'`;
      }
      return { quantity, unit, str };
    }
    return null;
  }

  render() {
    const { id, name, type, value, updateInstance } = this.props;
    const formId = _.uniqueId('parameter-');

    return (
      <div className="quantity-editor">
        <div className="parameter__item row">
          <div className="col-3 bold align-right">
            <label htmlFor={formId}>Quantity:</label>
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
                updateInstance({ name, type, value: this.assignValue(e) });
              }}
            />

            <span>  </span>

            <input
              id={id}
              name="unit"
              type="text"
              value={ _.get(value, 'unit', null) || '' }
              onChange={ (e) => {
                updateInstance({ name, type, value: this.assignValue(e) });
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
  value: PropTypes.object,
  updateInstance: PropTypes.func.isRequired
};
