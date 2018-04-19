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
        if (firstDecimal != null) { firstDecimal = parseFloat(firstDecimal, 10); }
        secondDecimal = _.get(this, 'props.value.secondDecimal', null);
        break;
      case 'secondDecimal':
        firstDecimal = _.get(this, 'props.value.firstDecimal', null);
        secondDecimal = _.get(evt, 'target.value', null);
        if (secondDecimal != null) { secondDecimal = parseFloat(secondDecimal, 10); }
        break;
      default:
        break;
    }

    if ((firstDecimal || firstDecimal === 0) || (secondDecimal || secondDecimal === 0)) {
      if (Number.isInteger(firstDecimal)) {
        if (Number.isInteger(secondDecimal)) {
          str = `Interval[${firstDecimal}.0,${secondDecimal}.0]`;
        } else {
          str = `Interval[${firstDecimal}.0,${secondDecimal}]`;
        }
      } else if (Number.isInteger(secondDecimal)) {
        str = `Interval[${firstDecimal},${secondDecimal}.0]`;
      } else {
        str = `Interval[${firstDecimal},${secondDecimal}]`;
      }
      return { firstDecimal, secondDecimal, str };
    }
    return null;
  }

  render() {
    const { id, name, type, value, updateInstance } = this.props;
    const formId = _.uniqueId('parameter-');

    return (
      <div className="form__group">
        <label htmlFor={formId}>
          <form>
            <label htmlFor={formId}>First Decimal:</label>
            <input
              id={id}
              name="firstDecimal"
              type="number"
              value={
                (_.get(value, 'firstDecimal', null) || _.get(value, 'firstDecimal', null) === 0)
                ? _.get(value, 'firstDecimal')
                : '' }
              onChange={ (e) => {
                updateInstance({ name, type, value: this.assignValue(e) });
              }}
            />

            <label htmlFor={formId}>Second Decimal:</label>
            <input
              id={id}
              name="secondDecimal"
              type="number"
              value={
                (_.get(value, 'secondDecimal', null) || _.get(value, 'secondDecimal', null) === 0)
                ? _.get(value, 'secondDecimal')
                : '' }
              onChange={ (e) => {
                updateInstance({ name, type, value: this.assignValue(e) });
              }}
            />
          </form>
        </label>
      </div>
    );
  }
}

IntervalOfDecimalEditor.propTypes = {
  id: PropTypes.string.isRequired,
  name: PropTypes.string,
  type: PropTypes.string.isRequired,
  value: PropTypes.object,
  updateInstance: PropTypes.func.isRequired
};
