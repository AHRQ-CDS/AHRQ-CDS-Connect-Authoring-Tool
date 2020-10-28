import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import _ from 'lodash';

export default class IntervalOfDecimalEditor extends Component {
  constructor(props) {
    super(props);

    const firstDecimal = _.get(props, 'value.firstDecimal', '');
    const secondDecimal = _.get(props, 'value.secondDecimal', '');

    this.state = {
      showInputWarning:
        this.shouldShowInputWarning(firstDecimal) || this.shouldShowInputWarning(secondDecimal)
    };
  }

  shouldShowInputWarning = (value) => {
    return value && !/^-?\d+(\.\d+)?$/.test(value);
  }

  assignValue(evt) {
    let firstDecimal = null;
    let secondDecimal = null;
    let str = null;

    switch (evt.target.name) {
      case 'firstDecimal':
        firstDecimal = _.get(evt, 'target.value', '');
        secondDecimal = _.get(this, 'props.value.secondDecimal', '');
        break;
      case 'secondDecimal':
        firstDecimal = _.get(this, 'props.value.firstDecimal', '');
        secondDecimal = _.get(evt, 'target.value', '');
        break;
      default:
        break;
    }

    this.setState({
      showInputWarning:
        this.shouldShowInputWarning(firstDecimal) || this.shouldShowInputWarning(secondDecimal)
    });

    if (firstDecimal || secondDecimal) {
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
      return { firstDecimal, secondDecimal, str };
    }
    return null;
  }

  render() {
    const { id, name, type, label, value, updateInstance, condenseUI } = this.props;
    const formId = _.uniqueId('editor-');

    return (
      <div className="editor interval-of-decimal-editor">
        <div className="form-group">
          <label
            className={classnames('editor-container', { condense: condenseUI })}
            htmlFor={formId}
          >
            <div className="editor-label label">{label}</div>

            <div className="editor-input-group">
              <div className="editor-input">
                <input
                  id={formId}
                  name="firstDecimal"
                  value={_.get(value, 'firstDecimal', '')}
                  onChange={ (e) => {
                    updateInstance({ name, type, label, value: this.assignValue(e) });
                  }}
                />
              </div>

              <div className="dash">-</div>

              <div className="editor-input">
                <input
                  id={id}
                  name="secondDecimal"
                  aria-label="Second Decimal"
                  value={_.get(value, 'secondDecimal', '')}
                  onChange={ (e) => {
                    updateInstance({ name, type, label, value: this.assignValue(e) });
                  }}
                />
              </div>
            </div>
          </label>
        </div>

        {this.state.showInputWarning &&
          <div className="warning">
            {`Warning: At least one of the values is not a valid Decimal.`}
          </div>
        }
      </div>
    );
  }
}

IntervalOfDecimalEditor.propTypes = {
  id: PropTypes.string.isRequired,
  name: PropTypes.string,
  type: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  value: PropTypes.object,
  updateInstance: PropTypes.func.isRequired,
  condenseUI: PropTypes.bool
};
