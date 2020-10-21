import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import _ from 'lodash';

export default class DecimalEditor extends Component {
  assignValue = (evt) => {
    let decimal = null;
    let str = null;

    decimal = _.get(evt, 'target.value', null);
    if (decimal != null) { decimal = parseFloat(decimal); }

    if (decimal || decimal === 0) {
      if (Number.isInteger(decimal)) {
        str = `${decimal}.0`;
      } else {
        str = `${decimal}`;
      }
      return { decimal, str };
    }
    return null;
  }

  render() {
    const { name, type, label, value, updateInstance, condenseUI } = this.props;
    const formId = _.uniqueId('editor-');

    return (
      <div className="editor decimal-editor">
        <div className="form__group">
          <label
            className={classnames("editor-container", { condense: condenseUI })}
            htmlFor={formId}
          >
            <div className="editor-label label">{label}</div>

            <div className="editor-input-group">
              <div className="editor-input">
                <input
                  id={formId}
                  type="number"
                  value={
                    (_.get(value, 'decimal', null) || _.get(value, 'decimal', null) === 0)
                    ? _.get(value, 'decimal')
                    : NaN }
                  onChange={ (e) => {
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

DecimalEditor.propTypes = {
  name: PropTypes.string,
  type: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  value: PropTypes.object,
  updateInstance: PropTypes.func.isRequired,
  condenseUI: PropTypes.bool
};
