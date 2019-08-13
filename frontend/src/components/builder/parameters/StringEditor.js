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
    const { name, type, label, value, updateInstance } = this.props;
    const formId = _.uniqueId('parameter-');

    return (
      <div className="string-editor">
        <div className="parameter__item row">
          <div className="col-3 bold align-right">
            <label htmlFor={formId}>{label}</label>
          </div>

          <div className="col-9">
            <input
              id={formId}
              type="text"
              value={value ? value.replace(/'/g, '') : ''}
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

StringEditor.propTypes = {
  name: PropTypes.string,
  type: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  value: PropTypes.string,
  updateInstance: PropTypes.func.isRequired
};
