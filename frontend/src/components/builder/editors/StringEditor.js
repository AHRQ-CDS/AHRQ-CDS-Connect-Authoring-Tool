import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { TextField } from '@material-ui/core';

export default class StringEditor extends Component {
  handleChange = newValue => {
    const { name, type, label, updateInstance } = this.props;
    updateInstance({ name, type, label, value: String(newValue) });
  };

  render() {
    const { label, value } = this.props;

    return (
      <div className="editor string-editor">
        <div className="editor-label">{label}</div>

        <div className="editor-inputs">
          <div className="field-input field-input-full-width">
            <TextField
              fullWidth
              label="Value"
              onChange={event => this.handleChange(event.target.value)}
              value={value ? value.replace(/'/g, '') : ''}
              variant="outlined"
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
