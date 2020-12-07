import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { TextField } from '@material-ui/core';

export default class DecimalEditor extends Component {
  constructor(props) {
    super(props);

    const decimal = props.value?.decimal || '';

    this.state = {
      showInputWarning: this.shouldShowInputWarning(decimal)
    };
  }

  handleChange = newValue => {
    const { name, type, label, updateInstance } = this.props;
    const str = Number.isInteger(parseFloat(newValue)) ? `${newValue}.0` : `${newValue}`;

    this.setState({ showInputWarning: this.shouldShowInputWarning(newValue) });
    updateInstance({ name, type, label, value: { decimal: newValue, str } });
  };

  shouldShowInputWarning = value => {
    return value && !/^-?\d+(\.\d+)?$/.test(value);
  }

  render() {
    const { label, value } = this.props;
    const { showInputWarning } = this.state;
    const decimal = value?.decimal || '';

    return (
      <div className="editor decimal-editor">
        <div className="editor-label">{label}</div>

        <div className="editor-inputs">
          <div className="field-input field-input-md">
            <TextField
              fullWidth
              label="Value"
              onChange={event => this.handleChange(event.target.value)}
              value={decimal}
              variant="outlined"
            />
          </div>
        </div>

        <div className="editor-warnings">
          {showInputWarning &&
            <div className="warning">
              Warning: The value is not a valid Decimal.
            </div>
          }
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
