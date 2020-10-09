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
      const firstIntegerForString = (firstInteger || firstInteger === 0) ? firstInteger : null;
      const secondIntegerForString = (secondInteger || secondInteger === 0) ? secondInteger : null;
      const str = `Interval[${firstIntegerForString},${secondIntegerForString}]`;
      return { firstInteger, secondInteger, str };
    }
    return null;
  }

  render() {
    const { id, name, type, label, value, updateInstance } = this.props;
    const formId = _.uniqueId('editor-');

    return (
      <div className="interval-of-integer-editor">
        <div className="form__group">
          <label htmlFor={formId}>
            <div className="label">{label}</div>

            <div className="input-group">
              <input
                id={formId}
                name="firstInteger"
                type="number"
                value={
                  (_.get(value, 'firstInteger', null) || _.get(value, 'firstInteger', null) === 0)
                  ? _.get(value, 'firstInteger')
                  : '' }
                onChange={ (e) => {
                  updateInstance({ name, type, label, value: this.assignValue(e) });
                }}
              />

              <div className="dash">-</div>
            </div>


            <div className="input-group">
              <input
                id={id}
                name="secondInteger"
                type="number"
                aria-label="Second Integer"
                value={
                  (_.get(value, 'secondInteger', null) || _.get(value, 'secondInteger', null) === 0)
                  ? _.get(value, 'secondInteger')
                  : '' }
                onChange={ (e) => {
                  updateInstance({ name, type, label, value: this.assignValue(e) });
                }}
              />
            </div>
          </label>
        </div>
      </div>
    );
  }
}

IntervalOfIntegerEditor.propTypes = {
  id: PropTypes.string.isRequired,
  name: PropTypes.string,
  type: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  value: PropTypes.object,
  updateInstance: PropTypes.func.isRequired
};
