import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';

export default class IntegerEditor extends Component {
  assignValue = (evt) => {
    let value = _.get(evt, 'target.value', null);
    // read the value as an int, then convert it to a string
    if (value != null) { value = parseInt(value, 10); }
    return value;
  }

  render() {
    const { name, type, label, value, updateInstance } = this.props;
    const formId = _.uniqueId('parameter-');

    return (
      <div className="integer-editor">
        <div className="parameter__item row">
          <div className="col-3 bold align-right">
            <label htmlFor={formId}>{label}</label>
          </div>

          <div className="col-9">
            <input
              id={formId}
              type="number"
              value={(value || value === 0) ? value : ''}
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

IntegerEditor.propTypes = {
  name: PropTypes.string,
  type: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  value: PropTypes.number,
  updateInstance: PropTypes.func.isRequired
};
