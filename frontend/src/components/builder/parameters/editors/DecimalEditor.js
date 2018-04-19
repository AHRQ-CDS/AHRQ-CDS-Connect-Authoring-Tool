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
    const { id, name, type, value, updateInstance } = this.props;
    const formId = _.uniqueId('parameter-');

    return (
      <div className="form__group">
        <label htmlFor={formId}>
          Decimal:
          <input
            id={id}
            type="number"
            value={
              (_.get(value, 'decimal', null) || _.get(value, 'decimal', null) === 0)
              ? _.get(value, 'decimal')
              : '' }
            onChange={ (e) => {
              updateInstance({ name, type, value: this.assignValue(e) });
            }}
          />
        </label>
      </div>
    );
  }
}

DecimalEditor.propTypes = {
  id: PropTypes.string.isRequired,
  name: PropTypes.string,
  type: PropTypes.string.isRequired,
  value: PropTypes.object,
  updateInstance: PropTypes.func.isRequired
};
