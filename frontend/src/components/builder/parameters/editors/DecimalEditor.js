import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';

export default class DecimalEditor extends Component {
  assignValue = (evt) => {
    let decimal = null;
    let str = null;

    decimal = _.get(evt, 'target.value', null);
    if (decimal != null) { decimal = parseFloat(decimal, 10); }

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
    const { name, type, label, value, updateInstance } = this.props;
    const formId = _.uniqueId('parameter-');

    return (
      <div className="decimal-editor">
        <div className="parameter__item row">
          <div className="col-3 bold align-right">
            <label htmlFor={formId}>{label}</label>
          </div>

          <div className="col-9">
            <input
              id={formId}
              type="number"
              value={
                (_.get(value, 'decimal', null) || _.get(value, 'decimal', null) === 0)
                ? _.get(value, 'decimal')
                : '' }
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

DecimalEditor.propTypes = {
  name: PropTypes.string,
  type: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  value: PropTypes.object,
  updateInstance: PropTypes.func.isRequired
};
