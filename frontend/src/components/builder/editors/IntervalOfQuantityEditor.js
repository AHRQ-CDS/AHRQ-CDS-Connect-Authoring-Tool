import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import _ from 'lodash';

const { Def } = window;

export default class IntervalOfQuantityEditor extends Component {
  constructor(props) {
    super(props);

    const firstQuantity = _.get(props, 'value.firstQuantity', '');
    const secondQuantity = _.get(props, 'value.secondQuantity', '');
    const unit = _.get(props, 'value.unit', '');

    this.state = {
      showInputWarning: this.shouldShowInputWarning(firstQuantity) || this.shouldShowInputWarning(secondQuantity),
      showIncompleteWarning: this.shouldShowIncompleteWarning(firstQuantity, secondQuantity, unit)
    };
  }

  shouldShowInputWarning = (value) => {
    return value && !/^-?\d+(\.\d+)?$/.test(value);
  }

  shouldShowIncompleteWarning = (firstQuantity, secondQuantity, unit) => {
    return (unit && !((firstQuantity || firstQuantity === 0) || (secondQuantity || secondQuantity === 0)));
  }

  componentDidMount = () => {
    new Def.Autocompleter.Search( // eslint-disable-line no-new
      `${this.props.id}-unit-ucum`,
      'https://clin-table-search.lhc.nlm.nih.gov/api/ucum/v3/search',
      { tableFormat: true, valueCols: [0], colHeaders: ['Code', 'Name'] }
    );
  }

  assignValue(evt) {
    let firstQuantity = null;
    let secondQuantity = null;
    let unit = null;
    let str = null;

    switch (evt.target.name) {
      case 'firstQuantity':
        firstQuantity = _.get(evt, 'target.value', '');
        secondQuantity = _.get(this, 'props.value.secondQuantity', '');
        unit = _.get(this, 'props.value.unit', '');
        break;
      case 'secondQuantity':
        firstQuantity = _.get(this, 'props.value.firstQuantity', '');
        secondQuantity = _.get(evt, 'target.value', '');
        unit = _.get(this, 'props.value.unit', '');
        break;
      case 'unit':
        firstQuantity = _.get(this, 'props.value.firstQuantity', '');
        secondQuantity = _.get(this, 'props.value.secondQuantity', '');
        unit = _.get(evt, 'target.value', '');
        break;
      default:
        break;
    }

    this.setState({
      showInputWarning: this.shouldShowInputWarning(firstQuantity) || this.shouldShowInputWarning(secondQuantity),
      showIncompleteWarning: this.shouldShowIncompleteWarning(firstQuantity, secondQuantity, unit)
    });

    if (firstQuantity || secondQuantity || unit) {
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
      return { firstQuantity, secondQuantity, unit, str };
    }
    return null;
  }

  render() {
    const { id, name, type, label, value, updateInstance, condenseUI } = this.props;
    const formId = _.uniqueId('editor-');

    return (
      <div className="editor interval-of-quantity-editor">
        <div className="form__group">
          <label
            className={classnames('editor-container', { condense: condenseUI })}
            htmlFor={formId}
          >
            <div className="editor-label label">{label}</div>

            <div className="editor-input-group">
              <div className="editor-input">
                <input
                  id={formId}
                  name="firstQuantity"
                  value={_.get(value, 'firstQuantity', '')}
                  onChange={ (e) => {
                    updateInstance({ name, type, label, value: this.assignValue(e) });
                  }}
                />
              </div>

              <div className="dash">-</div>

              <div className="editor-input">
                <input
                  id={id}
                  name="secondQuantity"
                  aria-label="Second Quantity"
                  value={_.get(value, 'secondQuantity', '')}
                  onChange={ (e) => {
                    updateInstance({ name, type, label, value: this.assignValue(e) });
                  }}
                />
              </div>

              <div className="editor-input">
                <input
                  type="text"
                  className="quantity-unit-ucum"
                  id={`${this.props.id}-unit-ucum`}
                  name="unit"
                  placeholder="enter unit"
                  aria-label="Enter Unit"
                  value={_.get(value, 'unit', '')}
                  onChange={(e) => {
                    updateInstance({ name, type, label, value: this.assignValue(e) });
                  }}
                  onSelect={(e) => {
                    updateInstance({ name, type, label, value: this.assignValue(e) });
                  }}
                />
              </div>
            </div>
          </label>
        </div>

        {this.state.showInputWarning &&
          <div className="warning">
            {`Warning: A Quantity's numerical value must be valid Decimal.`}
          </div>
        }

        {this.state.showIncompleteWarning &&
          <div className="warning">
            {`Warning: An Interval<Quantity> must have at least one numerical value.`}
          </div>
        }
      </div>
    );
  }
}

IntervalOfQuantityEditor.propTypes = {
  id: PropTypes.string.isRequired,
  name: PropTypes.string,
  type: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  value: PropTypes.object,
  updateInstance: PropTypes.func.isRequired,
  condenseUI: PropTypes.bool
};
