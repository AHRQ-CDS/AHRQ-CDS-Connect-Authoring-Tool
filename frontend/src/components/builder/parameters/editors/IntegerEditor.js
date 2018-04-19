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
    const { id, name, type, value, updateInstance } = this.props;
    const formId = _.uniqueId('parameter-');

    return (
      <div className="form__group">
        <label htmlFor={formId}>
          Integer:
          <input
            id={id}
            type="number"
            value={(value || value === 0) ? value : ''}
            onChange={ (e) => {
              updateInstance({ name, type, value: this.assignValue(e) });
            }}
          />
        </label>
      </div>
    );
  }
}

IntegerEditor.propTypes = {
  id: PropTypes.string.isRequired,
  name: PropTypes.string,
  type: PropTypes.string.isRequired,
  value: PropTypes.number,
  updateInstance: PropTypes.func.isRequired
};
