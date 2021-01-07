import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { TextField } from '@material-ui/core';

import UcumField from 'components/builder/fields/UcumField';

export default class QuantityEditor extends Component {
  constructor(props) {
    super(props);

    const quantity = props.value?.quantity || '';
    const unit = props.value?.unit || '';

    this.state = {
      showInputWarning: this.shouldShowInputWarning(quantity),
      showIncompleteWarning: this.shouldShowIncompleteWarning(quantity, unit)
    };
  }

  handleChange = (newValue, inputType) => {
    const { name, type, label, updateInstance, value } = this.props;
    const quantity = inputType === 'quantity' ? newValue : value?.quantity || '';
    const unit = inputType === 'unit' ? newValue || '' : value?.unit || '';
    const str = this.getString(quantity, unit);

    this.setState({
      showInputWarning: this.shouldShowInputWarning(quantity),
      showIncompleteWarning: this.shouldShowIncompleteWarning(quantity, unit)
    });

    updateInstance({ name, type, label, value: { quantity, unit, str } });
  };

  getString = (quantity, unit) => {
    let str = '';
    const escapedQuoteUnit = (unit ? unit.replace(/'/g, '\\\'') : unit) || '1';
    if (Number.isInteger(parseFloat(quantity))) {
      str = `${quantity}.0 '${escapedQuoteUnit}'`;
    } else {
      str = `${quantity} '${escapedQuoteUnit}'`;
    }

    return str;
  };

  shouldShowInputWarning = value => {
    return Boolean(value && !/^-?\d+(\.\d+)?$/.test(value));
  }

  shouldShowIncompleteWarning = (quantity, unit) => {
    return Boolean((unit && !(quantity || quantity === 0)));
  }

  render() {
    const { label, value } = this.props;
    const { showInputWarning, showIncompleteWarning } = this.state;

    return (
      <div className="editor quantity-editor">
        <div className="editor-label">{label}</div>

        <div className="editor-inputs">
          <TextField
            className="field-input field-input-sm"
            fullWidth
            label="Value"
            onChange={event => this.handleChange(event.target.value, 'quantity')}
            value={value?.quantity || ''}
            variant="outlined"
          />

          <div className="field-input field-input-lg">
            <UcumField
              handleChangeUnit={(event, option) => this.handleChange(option?.value, 'unit')}
              unit={value?.unit || ''}
            />
          </div>
        </div>

        <div className="editor-warnings">
          {showInputWarning &&
            <div className="warning">
              Warning: The Quantity's numerical value must be a valid Decimal.
            </div>
          }

          {showIncompleteWarning &&
            <div className="warning">
              Warning: A Quantity must have at least a numerical value.
            </div>
          }
        </div>
      </div>
    );
  }
}

QuantityEditor.propTypes = {
  name: PropTypes.string,
  type: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  value: PropTypes.object,
  updateInstance: PropTypes.func.isRequired
};
