import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';

/**
 * props are from a templateInstance field object,
 * and a function called UpdateInstance that takes an object with
 * key-value pairs that represents that state of the templateInstance
 */
export default class StringField extends Component {
  render() {
    const { id, name, value, updateInstance } = this.props;
    const formId = _.uniqueId('field-');

    return (
      <div className="string-field">
        <div className="form__group">
          <label htmlFor={formId}>
            <div className="label">{name}:</div>

            <input
              id={formId}
              type="text"
              name={id}
              value={value || ''}
              disabled={this.props.disabled}
              className={this.props.disabled ? 'input disabled' : 'input'}
              aria-label={name}
              onKeyPress={(event) => {
                if (event.which === 34) { // Quotation mark (")
                  event.preventDefault();
                }
              }}
              onChange={(event) => {
                updateInstance({ [event.target.name]: event.target.value });
              }}
            />
          </label>
        </div>
      </div>
    );
  }
}

StringField.propTypes = {
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  value: PropTypes.string,
  disabled: PropTypes.bool,
  updateInstance: PropTypes.func.isRequired
};
