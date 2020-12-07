import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { TextField } from '@material-ui/core';

export default class IntegerEditor extends Component {
  constructor(props) {
    super(props);

    this.state = {
      showInputWarning: this.shouldShowInputWarning(props.value)
    };
  };

  handleChange = newValue => {
    const { name, type, label, updateInstance } = this.props;
    this.setState({ showInputWarning: this.shouldShowInputWarning(newValue) });
    updateInstance({ name, type, label, value: newValue });
  };

  shouldShowInputWarning = value => {
    return value && !/^-?\d+$/.test(value);
  };

  render() {
    const { label, value } = this.props;
    const { showInputWarning } = this.state;

    return (
      <div className="editor integer-editor">
        <div className="editor-label">{label}</div>

        <div className="editor-inputs">
          <div className="field-input field-input-md">
            <TextField
              fullWidth
              label="Value"
              onChange={event => this.handleChange(event.target.value)}
              value={value || ''}
              variant="outlined"
            />
          </div>
        </div>

        <div className="editor-warnings">
          {showInputWarning &&
            <div className="warning">
              Warning: The value is not a valid Integer.
            </div>
          }
        </div>
      </div>
    );
  }
}

IntegerEditor.propTypes = {
  name: PropTypes.string,
  type: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  value: PropTypes.string,
  updateInstance: PropTypes.func.isRequired
};
