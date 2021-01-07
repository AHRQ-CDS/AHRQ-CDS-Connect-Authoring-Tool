import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { TextField } from '@material-ui/core';
import { Remove as DashIcon } from '@material-ui/icons';

export default class IntervalOfDecimalEditor extends Component {
  constructor(props) {
    super(props);

    const firstDecimal = props.value?.firstDecimal || '';
    const secondDecimal = props.value?.secondDecimal || '';

    this.state = {
      showInputWarning:
        this.shouldShowInputWarning(firstDecimal) || this.shouldShowInputWarning(secondDecimal)
    };
  }

  handleChange = (newValue, inputType) => {
    const { name, type, label, updateInstance, value } = this.props;
    const firstDecimal = inputType === 'firstDecimal' ? newValue : value?.firstDecimal || '';
    const secondDecimal = inputType === 'secondDecimal' ? newValue : value?.secondDecimal || '';
    const str = this.getString(firstDecimal, secondDecimal);

    this.setState({
      showInputWarning:
        this.shouldShowInputWarning(firstDecimal) || this.shouldShowInputWarning(secondDecimal)
    });

    updateInstance({ name, type, label, value: { firstDecimal, secondDecimal, str } });
  };

  shouldShowInputWarning = value => {
    return value && !/^-?\d+(\.\d+)?$/.test(value);
  };

  getString = (firstDecimal, secondDecimal) => {
    let str = '';

    const firstDecimalForString = firstDecimal || null;
    const secondDecimalForString = secondDecimal || null;
    if (Number.isInteger(parseFloat(firstDecimal))) {
      if (Number.isInteger(parseFloat(secondDecimal))) {
        str = `Interval[${firstDecimalForString}.0,${secondDecimalForString}.0]`;
      } else {
        str = `Interval[${firstDecimalForString}.0,${secondDecimalForString}]`;
      }
    } else if (Number.isInteger(parseFloat(secondDecimal))) {
      str = `Interval[${firstDecimalForString},${secondDecimalForString}.0]`;
    } else {
      str = `Interval[${firstDecimalForString},${secondDecimalForString}]`;
    }

    return str;
  };

  render() {
    const { label, value } = this.props;
    const { showInputWarning } = this.state;

    return (
      <div className="editor interval-of-decimal-editor">
        <div className="editor-label">{label}</div>

        <div className="editor-inputs">
          <div className="field-input field-input-sm">
            <TextField
              fullWidth
              label="Value"
              onChange={event => this.handleChange(event.target.value, 'firstDecimal')}
              value={value?.firstDecimal || ''}
              variant="outlined"
            />
          </div>

          <div className="field-input"><DashIcon /></div>

          <div className="field-input field-input-sm">
            <TextField
              fullWidth
              label="Value"
              onChange={event => this.handleChange(event.target.value, 'secondDecimal')}
              value={value?.secondDecimal || ''}
              variant="outlined"
            />
          </div>
        </div>

        <div className="editor-warnings">
          {showInputWarning &&
            <div className="warning">
              Warning: At least one of the values is not a valid Decimal.
            </div>
          }
        </div>
      </div>
    );
  }
}

IntervalOfDecimalEditor.propTypes = {
  name: PropTypes.string,
  type: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  value: PropTypes.object,
  updateInstance: PropTypes.func.isRequired
};
