import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';

/**
 * props are from a templateInstance field object,
 * and a function called UpdateInstance that takes an object with
 * key-value pairs that represents that state of the templateInstance
 */
const LINE_HEIGHT = 30;

export default class TextAreaField extends Component {
  constructor(props) {
    super(props);

    this.textarea = null;
    this.baseScrollHeight = 0;
    this.state = { minRows: 1, rows: 1 };
  }

  componentDidMount() {
    const { textarea } = this;
    const savedValue = textarea.value;

    textarea.value = '';
    this.baseScrollHeight = textarea.scrollHeight;
    textarea.value = savedValue;

    this.recomputeHeight();
  }

  componentDidUpdate(prevProps) {
    if (prevProps.value !== this.props.value) {
      this.recomputeHeight();
    }
  }

  recomputeHeight = () => {
    const origRows = this.textarea.rows;
    this.textarea.rows = this.state.minRows;

    const rows =
      this.state.minRows +
      Math.ceil((this.textarea.scrollHeight - this.baseScrollHeight) / LINE_HEIGHT);

    this.textarea.rows = origRows;

    this.setState({ rows });
  };

  render() {
    const { id, name, value, updateInstance } = this.props;
    const { rows } = this.state;
    const formId = _.uniqueId('field-');

    return (
      <div className="textarea-field">
        <div className="form__group">
          <label htmlFor={formId}>
            <div className="label">{name}:</div>

            <div className="input">
              <textarea
                rows={rows}
                ref={(ref) => { this.textarea = ref; }}
                id={formId}
                name={id}
                value={value || ''}
                aria-label={name}
                onChange={(event) => {
                  updateInstance({ [event.target.name]: event.target.value });
                }}
              />
            </div>
          </label>
        </div>
      </div>
    );
  }
}

TextAreaField.propTypes = {
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  value: PropTypes.string,
  updateInstance: PropTypes.func.isRequired
};
