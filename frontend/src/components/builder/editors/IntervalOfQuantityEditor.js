import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import _ from 'lodash';

const { Def } = window;

export default class IntervalOfQuantityEditor extends Component {
  constructor(props) {
    super(props);

    const firstQuantity = _.get(props, 'value.firstQuantity', null);
    const secondQuantity = _.get(props, 'value.secondQuantity', null);
    const unit = _.get(props, 'value.unit', null);

    this.state = {
      showInputWarning: (unit && !((firstQuantity || firstQuantity === 0) || (secondQuantity || secondQuantity === 0)))
    };
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
        firstQuantity = _.get(evt, 'target.value', null);
        if (firstQuantity != null) { firstQuantity = parseFloat(firstQuantity); }
        secondQuantity = _.get(this, 'props.value.secondQuantity', null);
        unit = _.get(this, 'props.value.unit', null);
        break;
      case 'secondQuantity':
        firstQuantity = _.get(this, 'props.value.firstQuantity', null);
        secondQuantity = _.get(evt, 'target.value', null);
        if (secondQuantity != null) { secondQuantity = parseFloat(secondQuantity); }
        unit = _.get(this, 'props.value.unit', null);
        break;
      case 'unit':
        firstQuantity = _.get(this, 'props.value.firstQuantity', null);
        secondQuantity = _.get(this, 'props.value.secondQuantity', null);
        unit = _.get(evt, 'target.value', null);
        break;
      default:
        break;
    }

    this.setState({
      showInputWarning: (unit && !((firstQuantity || firstQuantity === 0) || (secondQuantity || secondQuantity === 0)))
    });

    if ((firstQuantity || firstQuantity === 0) || (secondQuantity || secondQuantity === 0) || unit) {
      const escapedQuoteUnit = (unit ? unit.replace(/'/g, '\\\'') : unit) || '1';
      const firstQuantityForString = (firstQuantity || firstQuantity === 0) ? firstQuantity : null;
      const secondQuantityForString = (secondQuantity || secondQuantity === 0) ? secondQuantity : null;
      const firstUnitForString = (firstQuantity || firstQuantity === 0) ? ` '${escapedQuoteUnit}'` : '';
      const secondUnitForString = (secondQuantity || secondQuantity === 0) ? ` '${escapedQuoteUnit}'` : '';
      if (Number.isInteger(firstQuantity)) {
        if (Number.isInteger(secondQuantity)) {
          str = `Interval[${firstQuantityForString}.0${firstUnitForString},`
            + `${secondQuantityForString}.0${secondUnitForString}]`;
        } else {
          str = `Interval[${firstQuantityForString}.0${firstUnitForString},`
            + `${secondQuantityForString}${secondUnitForString}]`;
        }
      } else if (Number.isInteger(secondQuantity)) {
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
                  type="number"
                  value={
                    (_.get(value, 'firstQuantity', null) || _.get(value, 'firstQuantity', null) === 0)
                    ? _.get(value, 'firstQuantity')
                    : 'NaN' }
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
                  type="number"
                  aria-label="Second Quantity"
                  value={
                    (_.get(value, 'secondQuantity', null) || _.get(value, 'secondQuantity', null) === 0)
                    ? _.get(value, 'secondQuantity')
                    : 'NaN' }
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
                  value={_.get(value, 'unit', null) || ''}
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
