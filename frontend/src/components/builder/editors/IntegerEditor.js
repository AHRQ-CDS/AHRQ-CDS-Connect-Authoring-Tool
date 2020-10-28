import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import _ from 'lodash';

export default class IntegerEditor extends Component {
  assignValue = (evt) => {
    let value = _.get(evt, 'target.value', null);
    console.log(value);
    if (value != null) value = parseInt(value, 10);
    return value;
  };

  render() {
    const { name, type, label, value, updateInstance, condenseUI } = this.props;
    const formId = _.uniqueId('editor-');

    return (
      <div className="editor integer-editor">
        <div className="form-group">
          <label
            className={classnames('editor-container', { condense: condenseUI })}
            htmlFor={formId}
          >
            <div className="editor-label label">{label}</div>

            <div className="editor-input-group">
              <div className="editor-input">
                <input
                  id={formId}
                  type="number"
                  value={(value || value === 0) ? value : 'NaN'}
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
  updateInstance: PropTypes.func.isRequired,
  condenseUI: PropTypes.bool
};
