import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { TextField } from '@material-ui/core';
import { Remove as DashIcon } from '@material-ui/icons';

import UcumField from 'components/builder/fields/UcumField';

export default class IntervalOfQuantityEditor extends Component {
  constructor(props) {
    super(props);

    const firstQuantity = props.value?.firstQuantity || '';
    const secondQuantity = props.value?.secondQuantity || '';
    const unit = props.value?.unit || '';

    this.state = {
      showInputWarning: this.shouldShowInputWarning(firstQuantity) || this.shouldShowInputWarning(secondQuantity),
      showIncompleteWarning: this.shouldShowIncompleteWarning(firstQuantity, secondQuantity, unit)
    };
  }

  handleChange = (newValue, inputType) => {
    const { name, type, label, updateInstance, value } = this.props;
    const firstQuantity = inputType === 'firstQuantity' ? newValue : value?.firstQuantity || '';
    const secondQuantity = inputType === 'secondQuantity' ? newValue : value?.secondQuantity || '';
    const unit = inputType === 'unit' ? newValue || '' : value?.unit || '';
    const str = this.getString(firstQuantity, secondQuantity, unit);

    this.setState({
      showInputWarning: this.shouldShowInputWarning(firstQuantity) || this.shouldShowInputWarning(secondQuantity),
      showIncompleteWarning: this.shouldShowIncompleteWarning(firstQuantity, secondQuantity, unit)
    });

    updateInstance({ name, type, label, value: { firstQuantity, secondQuantity, unit, str } });
  };

  getString = (firstQuantity, secondQuantity, unit) => {
    let str = '';
    const escapedQuoteUnit = (unit ? unit.replace(/'/g, '\\\'') : unit) || '1';
    const firstQuantityForString = firstQuantity || null;
    const secondQuantityForString = secondQuantity || null;
    const firstUnitForString = firstQuantity ? ` '${escapedQuoteUnit}'` : '';
    const secondUnitForString = secondQuantity ? ` '${escapedQuoteUnit}'` : '';

    if (Number.isInteger(parseFloat(firstQuantity))) {
      if (Number.isInteger(parseFloat(secondQuantity))) {
        str = `Interval[${firstQuantityForString}.0${firstUnitForString},`
          + `${secondQuantityForString}.0${secondUnitForString}]`;
      } else {
        str = `Interval[${firstQuantityForString}.0${firstUnitForString},`
          + `${secondQuantityForString}${secondUnitForString}]`;
      }
    } else if (Number.isInteger(parseFloat(secondQuantity))) {
      str = `Interval[${firstQuantityForString}${firstUnitForString},`
        + `${secondQuantityForString}.0${secondUnitForString}]`;
    } else {
      str = `Interval[${firstQuantityForString}${firstUnitForString},`
        + `${secondQuantityForString}${secondUnitForString}]`;
    }

    return str;
  };

  shouldShowInputWarning = (value) => {
    return Boolean(value && !/^-?\d+(\.\d+)?$/.test(value));
  }

  shouldShowIncompleteWarning = (firstQuantity, secondQuantity, unit) => {
    return Boolean((unit && !((firstQuantity || firstQuantity === 0) || (secondQuantity || secondQuantity === 0))));
  }

  render() {
    const { label, value } = this.props;
    const { showInputWarning, showIncompleteWarning } = this.state;

    return (
      <div className="editor interval-of-quantity-editor">
        <div className="editor-label">{label}</div>

        <div className="editor-inputs">
          <TextField
            className="field-input field-input-sm"
            label="Value"
            onChange={event => this.handleChange(event.target.value, 'firstQuantity')}
            value={value?.firstQuantity || ''}
            variant="outlined"
          />

          <div className="field-input"><DashIcon /></div>

          <TextField
            className="field-input field-input-sm"
            label="Value"
            onChange={event => this.handleChange(event.target.value, 'secondQuantity')}
            value={value?.secondQuantity || ''}
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
              Warning: A Quantity's numerical value must be a valid Decimal.
            </div>
          }

          {showIncompleteWarning &&
            <div className="warning">
              Warning: An Interval{'<Quantity>'} must have at least one numerical value.
            </div>
          }
        </div>
      </div>
    );
  }
}

IntervalOfQuantityEditor.propTypes = {
  name: PropTypes.string,
  type: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  value: PropTypes.object,
  updateInstance: PropTypes.func.isRequired
};
