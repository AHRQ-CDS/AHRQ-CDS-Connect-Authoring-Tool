import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';

const { Def } = window;

export default class IntervalOfQuantityEditor extends Component {
  componentDidMount = () => {
    new Def.Autocompleter.Search( // eslint-disable-line no-new
      `${this.props.id}-unit-ucum`,
      'https://clin-table-search.lhc.nlm.nih.gov/api/ucum/v3/search',
      { tableFormat: true, valueCols: [0], colHeaders: ['Code', 'Name'] }
    );
  }

  assignValue(evt) {
    let firstQuantity = null;
    let secondQuantity = null;
    let unit = null;
    let str = null;

    switch (evt.target.name) {
      case 'firstQuantity':
        firstQuantity = _.get(evt, 'target.value', null);
        if (firstQuantity != null) { firstQuantity = parseFloat(firstQuantity, 10); }
        secondQuantity = _.get(this, 'props.value.secondQuantity', null);
        unit = _.get(this, 'props.value.unit', null);
        break;
      case 'secondQuantity':
        firstQuantity = _.get(this, 'props.value.firstQuantity', null);
        secondQuantity = _.get(evt, 'target.value', null);
        if (secondQuantity != null) { secondQuantity = parseFloat(secondQuantity, 10); }
        unit = _.get(this, 'props.value.unit', null);
        break;
      case 'unit':
        firstQuantity = _.get(this, 'props.value.firstQuantity', null);
        secondQuantity = _.get(this, 'props.value.secondQuantity', null);
        unit = _.get(evt, 'target.value', null);
        break;
      default:
        break;
    }

    if ((firstQuantity || firstQuantity === 0) || (secondQuantity || secondQuantity === 0) || unit) {
      const escapedQuoteUnit = unit ? unit.replace(/'/g, '\\\'') : unit;
      if (Number.isInteger(firstQuantity)) {
        if (Number.isInteger(secondQuantity)) {
          str = `Interval[${firstQuantity}.0 '${escapedQuoteUnit}',${secondQuantity}.0 '${escapedQuoteUnit}']`;
        } else {
          str = `Interval[${firstQuantity}.0 '${escapedQuoteUnit}',${secondQuantity} '${escapedQuoteUnit}']`;
        }
      } else if (Number.isInteger(secondQuantity)) {
        str = `Interval[${firstQuantity} '${escapedQuoteUnit}',${secondQuantity}.0 '${escapedQuoteUnit}']`;
      } else {
        str = `Interval[${firstQuantity} '${escapedQuoteUnit}',${secondQuantity} '${escapedQuoteUnit}']`;
      }
      return { firstQuantity, secondQuantity, unit, str };
    }
    return null;
  }

  render() {
    const { id, name, type, value, updateInstance } = this.props;
    const formId = _.uniqueId('parameter-');

    return (
      <div className="interval-of-quantity-editor">
        <div className="parameter__item row">
          <div className="col-3 bold align-right">
            <label htmlFor={formId}>Quantity Inverval:</label>
          </div>

          <div className="col-9 d-flex">
            <input
              id={formId}
              name="firstQuantity"
              type="number"
              value={
                (_.get(value, 'firstQuantity', null) || _.get(value, 'firstQuantity', null) === 0)
                ? _.get(value, 'firstQuantity')
                : '' }
              onChange={ (e) => {
                updateInstance({ name, type, value: this.assignValue(e) });
              }}
            />

            <span className="dash">_</span>

            <input
              id={id}
              name="secondQuantity"
              type="number"
              value={
                (_.get(value, 'secondQuantity', null) || _.get(value, 'secondQuantity', null) === 0)
                ? _.get(value, 'secondQuantity')
                : '' }
              onChange={ (e) => {
                updateInstance({ name, type, value: this.assignValue(e) });
              }}
            />

            <span className="dash">_</span>

            <input
              type="text"
              className="interval-of-quantity-unit-ucum"
              id={`${this.props.id}-unit-ucum`}
              name="unit"
              placeholder="enter unit"
              aria-label="Enter Unit"
              value={_.get(value, 'unit', null) || ''}
              onChange={(e) => {
                updateInstance({ name, type, value: this.assignValue(e) });
              }}
              onSelect={(e) => {
                updateInstance({ name, type, value: this.assignValue(e) });
              }}
            />
          </div>
        </div>
      </div>
    );
  }
}

IntervalOfQuantityEditor.propTypes = {
  id: PropTypes.string.isRequired,
  name: PropTypes.string,
  type: PropTypes.string.isRequired,
  value: PropTypes.object,
  updateInstance: PropTypes.func.isRequired
};
