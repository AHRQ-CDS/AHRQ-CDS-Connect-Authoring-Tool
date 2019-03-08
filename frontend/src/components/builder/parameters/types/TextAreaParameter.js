import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';

/**
 * props are from a templateInstance parameters object,
 * and a function called UpdateInstance that takes an object with
 * key-value pairs that represents that state of the templateInstance
 */
export default class TextAreaParameter extends Component {
  render() {
    const { id, name, value, updateInstance } = this.props;
    const formId = _.uniqueId('parameter-');

    return (
      <div className="textarea-parameter">
        <div className="form__group">
          <label htmlFor={formId}>
            <div className="label">{name}:</div>

            <div className="input">
              <textarea
                className="auto-expand"
                id={formId}
                name={id}
                value={value || ''}
                aria-label={name}
                onChange={(event) => {
                  updateInstance({ [event.target.name]: event.target.value });
                }}
                rows="1"
                data-min-rows="1"
              />
            </div>
          </label>
        </div>
      </div>
    );
  }
}

TextAreaParameter.propTypes = {
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  value: PropTypes.string,
  updateInstance: PropTypes.func.isRequired
};
