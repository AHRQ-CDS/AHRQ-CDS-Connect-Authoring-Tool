import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';

export default class IntervalOfDecimalEditor extends Component {
  assignValue(evt) {
    let firstDecimal = null;
    let secondDecimal = null;
    let str = null;

    switch (evt.target.name) {
      case 'firstDecimal':
        firstDecimal = _.get(evt, 'target.value', null);
        if (firstDecimal != null) { firstDecimal = parseFloat(firstDecimal); }
        secondDecimal = _.get(this, 'props.value.secondDecimal', null);
        break;
      case 'secondDecimal':
        firstDecimal = _.get(this, 'props.value.firstDecimal', null);
        secondDecimal = _.get(evt, 'target.value', null);
        if (secondDecimal != null) { secondDecimal = parseFloat(secondDecimal); }
        break;
      default:
        break;
    }

    if ((firstDecimal || firstDecimal === 0) || (secondDecimal || secondDecimal === 0)) {
      const firstDecimalForString = (firstDecimal || firstDecimal === 0) ? firstDecimal : null;
      const secondDecimalForString = (secondDecimal || secondDecimal === 0) ? secondDecimal : null;
      if (Number.isInteger(firstDecimal)) {
        if (Number.isInteger(secondDecimal)) {
          str = `Interval[${firstDecimalForString}.0,${secondDecimalForString}.0]`;
        } else {
          str = `Interval[${firstDecimalForString}.0,${secondDecimalForString}]`;
        }
      } else if (Number.isInteger(secondDecimal)) {
        str = `Interval[${firstDecimalForString},${secondDecimalForString}.0]`;
      } else {
        str = `Interval[${firstDecimalForString},${secondDecimalForString}]`;
      }
      return { firstDecimal, secondDecimal, str };
    }
    return null;
  }

  render() {
    const { id, name, type, label, value, updateInstance } = this.props;
    const formId = _.uniqueId('parameter-');

    return (
      <div className="interval-of-decimal-editor">
        <div className="parameter__item row">
          <div className="col-3 bold align-right">
            <label htmlFor={formId}>{label}</label>
          </div>

          <div className="col-9 d-flex">
            <input
              id={formId}
              name="firstDecimal"
              type="number"
              value={
                (_.get(value, 'firstDecimal', null) || _.get(value, 'firstDecimal', null) === 0)
                ? _.get(value, 'firstDecimal')
                : '' }
              onChange={ (e) => {
                updateInstance({ name, type, label, value: this.assignValue(e) });
              }}
            />

            <span className="dash">_</span>

            <input
              id={id}
              name="secondDecimal"
              type="number"
              value={
                (_.get(value, 'secondDecimal', null) || _.get(value, 'secondDecimal', null) === 0)
                ? _.get(value, 'secondDecimal')
                : '' }
              onChange={ (e) => {
                updateInstance({ name, type, label, value: this.assignValue(e) });
              }}
            />
          </div>
        </div>
      </div>
    );
  }
}

IntervalOfDecimalEditor.propTypes = {
  id: PropTypes.string.isRequired,
  name: PropTypes.string,
  type: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  value: PropTypes.object,
  updateInstance: PropTypes.func.isRequired
};
