import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import _ from 'lodash';

export default class DecimalEditor extends Component {
  constructor(props) {
    super(props);

    const decimal = _.get(props, 'value.decimal', '');

    this.state = {
      showInputWarning: this.shouldShowInputWarning(decimal)
    };
  }

  shouldShowInputWarning = (value) => {
    return value && !/^-?\d+(\.\d+)?$/.test(value);
  }

  assignValue = (evt) => {
    let decimal = null;
    let str = null;

    decimal = _.get(evt, 'target.value', '');

    this.setState({ showInputWarning: this.shouldShowInputWarning(decimal) });

    if (decimal) {
      if (Number.isInteger(parseFloat(decimal))) {
        str = `${decimal}.0`;
      } else {
        str = `${decimal}`;
      }
      return { decimal, str };
    }
    return null;
  }

  render() {
    const { name, type, label, value, updateInstance, condenseUI } = this.props;
    const formId = _.uniqueId('editor-');

    return (
      <div className="editor decimal-editor">
        <div className="form__group">
          <label
            className={classnames("editor-container", { condense: condenseUI })}
            htmlFor={formId}
          >
            <div className="editor-label label">{label}</div>

            <div className="editor-input-group">
              <div className="editor-input">
                <input
                  id={formId}
                  value={_.get(value, 'decimal', '')}
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
            {`Warning: The value is not a valid Decimal.`}
          </div>
        }
      </div>
    );
  }
}

DecimalEditor.propTypes = {
  name: PropTypes.string,
  type: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  value: PropTypes.object,
  updateInstance: PropTypes.func.isRequired,
  condenseUI: PropTypes.bool
};
