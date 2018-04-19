import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';

export default class StringEditor extends Component {
  assignValue = (evt) => {
    let str = _.get(evt, 'target.value', null);
    str = str ? `'${str}'` : null;
    return str;
  }

  render() {
    const { id, name, type, value, updateInstance } = this.props;
    const formId = _.uniqueId('parameter-');

    return (
      <div className="form__group">
        <label htmlFor={formId}>
          String:
          <input
            id={id}
            type="text"
            value={value ? value.replace(/'/g, '') : ''}
            onChange={ (e) => {
              updateInstance({ name, type, value: this.assignValue(e) });
            }}
          />
        </label>
      </div>
    );
  }
}

StringEditor.propTypes = {
  id: PropTypes.string.isRequired,
  name: PropTypes.string,
  type: PropTypes.string.isRequired,
  value: PropTypes.string,
  updateInstance: PropTypes.func.isRequired
};
