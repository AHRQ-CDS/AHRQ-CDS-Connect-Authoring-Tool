import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';

export default class IntervalOfQuantityEditor extends Component {
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
      if (Number.isInteger(firstQuantity)) {
        if (Number.isInteger(secondQuantity)) {
          str = `Interval[${firstQuantity}.0 '${unit}',${secondQuantity}.0 '${unit}']`;
        } else {
          str = `Interval[${firstQuantity}.0 '${unit}',${secondQuantity} '${unit}']`;
        }
      } else if (Number.isInteger(secondQuantity)) {
        str = `Interval[${firstQuantity} '${unit}',${secondQuantity}.0 '${unit}']`;
      } else {
        str = `Interval[${firstQuantity} '${unit}',${secondQuantity} '${unit}']`;
      }
      return { firstQuantity, secondQuantity, unit, str };
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
            <label htmlFor={formId}>First Quantity:</label>
            <input
              id={id}
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

            <label htmlFor={formId}>Second Quantity:</label>
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

            <label htmlFor={formId}>Unit:</label>
            <input
              id={id}
              name="unit"
              type="text"
              value={ _.get(value, 'unit', null) || '' }
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

IntervalOfQuantityEditor.propTypes = {
  id: PropTypes.string.isRequired,
  name: PropTypes.string,
  type: PropTypes.string.isRequired,
  value: PropTypes.object,
  updateInstance: PropTypes.func.isRequired
};
