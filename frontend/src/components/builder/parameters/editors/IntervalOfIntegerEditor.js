import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';

export default class IntervalOfIntegerEditor extends Component {
  assignValue(evt) {
    let firstInteger = null;
    let secondInteger = null;

    switch (evt.target.name) {
      case 'firstInteger':
        firstInteger = _.get(evt, 'target.value', null);
        if (firstInteger != null) { firstInteger = parseInt(firstInteger, 10); }
        secondInteger = _.get(this, 'props.value.secondInteger', null);
        break;
      case 'secondInteger':
        firstInteger = _.get(this, 'props.value.firstInteger', null);
        secondInteger = _.get(evt, 'target.value', null);
        if (secondInteger != null) { secondInteger = parseInt(secondInteger, 10); }
        break;
      default:
        break;
    }

    if ((firstInteger != null) || (secondInteger != null)) {
      const str = `Interval[${firstInteger},${secondInteger}]`;
      return { firstInteger, secondInteger, str };
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
            <label htmlFor={formId}>First Integer:</label>
            <input
              id={id}
              name="firstInteger"
              type="number"
              value={
                (_.get(value, 'firstInteger', null) || _.get(value, 'firstInteger', null) === 0)
                ? _.get(value, 'firstInteger')
                : '' }
              onChange={ (e) => {
                updateInstance({ name, type, value: this.assignValue(e) });
              }}
            />

            <label htmlFor={formId}>Second Integer:</label>
            <input
              id={id}
              name="secondInteger"
              type="number"
              value={
                (_.get(value, 'secondInteger', null) || _.get(value, 'secondInteger', null) === 0)
                ? _.get(value, 'secondInteger')
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

IntervalOfIntegerEditor.propTypes = {
  id: PropTypes.string.isRequired,
  name: PropTypes.string,
  type: PropTypes.string.isRequired,
  value: PropTypes.object,
  updateInstance: PropTypes.func.isRequired
};
