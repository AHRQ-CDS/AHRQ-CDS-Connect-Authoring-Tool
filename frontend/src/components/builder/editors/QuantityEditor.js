import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import _ from 'lodash';

const { Def } = window;

export default class QuantityEditor extends Component {
  constructor(props) {
    super(props);

    const quantity = _.get(props, 'value.quantity', null);
    const unit = _.get(props, 'value.unit', null);

    this.state = {
      showInputWarning: (unit && !(quantity || quantity === 0))
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
    let quantity = null;
    let unit = null;
    let str = null;

    switch (evt.target.name) {
      case 'quantity':
        quantity = _.get(evt, 'target.value', null);
        if (quantity != null) { quantity = parseFloat(quantity); }
        unit = _.get(this, 'props.value.unit', null);
        break;
      case 'unit':
        quantity = _.get(this, 'props.value.quantity', null);
        unit = _.get(evt, 'target.value', null);
        break;
      default:
        break;
    }

    this.setState({ showInputWarning: (unit && !(quantity || quantity === 0)) });

    if ((quantity || quantity === 0) || unit) {
      const escapedQuoteUnit = (unit ? unit.replace(/'/g, '\\\'') : unit) || '1';
      if (Number.isInteger(quantity)) {
        str = `${quantity}.0 '${escapedQuoteUnit}'`;
      } else {
        str = `${quantity} '${escapedQuoteUnit}'`;
      }
      return { quantity, unit, str };
    }
    return null;
  }

  render() {
    const { id, name, type, label, value, updateInstance, condenseUI } = this.props;
    const formId = _.uniqueId('editor-');

    return (
      <div className="editor quantity-editor">
        <div className="form__group">
          <label
            className={classnames('editor-container', { condense: condenseUI })}
            htmlFor={formId}
          >
            <div className="editor-label label">{label}</div>

            <div className="editor-input-group">
              <div className="editor-input">
                <input
                  id={id}
                  name="quantity"
                  type="number"
                  value={
                    (_.get(value, 'quantity', null) || _.get(value, 'quantity', null) === 0)
                    ? _.get(value, 'quantity')
                    : 'NaN' }
                  onChange={ (e) => {
                    updateInstance({ name, type, label, value: this.assignValue(e) });
                  }}
                />
              </div>

              <div className="editor-input">
                <input
                  type="text"
                  id={`${this.props.id}-unit-ucum`}
                  className="quantity-unit-ucum"
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
            {`Warning: A Quantity must have at least a numerical value.`}
          </div>
        }
      </div>
    );
  }
}

QuantityEditor.propTypes = {
  id: PropTypes.string.isRequired,
  name: PropTypes.string,
  type: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  value: PropTypes.object,
  updateInstance: PropTypes.func.isRequired,
  condenseUI: PropTypes.bool
};
