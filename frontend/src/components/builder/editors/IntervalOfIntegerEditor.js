import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { TextField } from '@material-ui/core';
import { Remove as DashIcon } from '@material-ui/icons';

export default class IntervalOfIntegerEditor extends Component {
  constructor(props) {
    super(props);

    const firstInteger = props.value?.firstInteger || '';
    const secondInteger = props.value?.secondInteger || '';

    this.state = {
      showInputWarning: this.shouldShowInputWarning(firstInteger) || this.shouldShowInputWarning(secondInteger)
    };
  }

  handleChange = (newValue, inputType) => {
    const { name, type, label, updateInstance, value } = this.props;
    const firstInteger = inputType === 'firstInteger' ? newValue : value?.firstInteger || '';
    const secondInteger = inputType === 'secondInteger'? newValue : value?.secondInteger || '';
    const str = `Interval[${firstInteger},${secondInteger}]`;

    this.setState({
      showInputWarning:
        this.shouldShowInputWarning(firstInteger) || this.shouldShowInputWarning(secondInteger)
    });

    updateInstance({ name, type, label, value: { firstInteger, secondInteger, str } });
  };

  shouldShowInputWarning = value => {
    return value && !/^-?\d+$/.test(value);
  };

  render() {
    const { label, value } = this.props;
    const { showInputWarning } = this.state;

    return (
      <div className="editor interval-of-integer-editor">
        <div className="editor-label">{label}</div>

        <div className="editor-inputs">
          <div className="field-input field-input-sm">
            <TextField
              fullWidth
              label="Value"
              onChange={event => this.handleChange(event.target.value, 'firstInteger')}
              value={value?.firstInteger || ''}
              variant="outlined"
            />
          </div>

          <div className="field-input"><DashIcon /></div>

          <div className="field-input field-input-sm">
            <TextField
              fullWidth
              label="Value"
              onChange={event => this.handleChange(event.target.value, 'secondInteger')}
              value={value?.secondInteger || ''}
              variant="outlined"
            />
          </div>
        </div>

        <div className="editor-warnings">
          {showInputWarning &&
            <div className="warning">
              Warning: At least one of the values is not a valid Integer.
            </div>
          }
        </div>
      </div>
    );
  }
}

IntervalOfIntegerEditor.propTypes = {
  name: PropTypes.string,
  type: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  value: PropTypes.object,
  updateInstance: PropTypes.func.isRequired
};
