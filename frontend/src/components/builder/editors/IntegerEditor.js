import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';

export default class IntegerEditor extends Component {
  assignValue = (evt) => {
    let value = _.get(evt, 'target.value', null);
    if (value != null) value = parseInt(value, 10);
    return value;
  }

  render() {
    const { name, type, label, value, updateInstance } = this.props;
    const formId = _.uniqueId('editor-');

    return (
      <div className="integer-editor">
        <div className="form-group">
          <label className="label-container" htmlFor={formId}>
            <div className="label">{label}</div>

            <div className="input-group-container">
              <div className="input">
                <input
                  id={formId}
                  type="number"
                  value={(value || value === 0) ? value : NaN}
                  onChange={(e) => {
                    updateInstance({ name, type, label, value: this.assignValue(e) });
                  }}
                />
              </div>
            </div>
          </label>
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
