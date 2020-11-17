import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import _ from 'lodash';

export default class IntegerEditor extends Component {
  constructor(props) {
    super(props);

    this.state = {
      showInputWarning: this.shouldShowInputWarning(props.value)
    };
  }

  shouldShowInputWarning = (value) => {
    return value && !/^-?\d+$/.test(value);
  }

  assignValue = (evt) => {
    let value = _.get(evt, 'target.value', '');
    this.setState({ showInputWarning: this.shouldShowInputWarning(value) });
    return value;
  };

  render() {
    const { name, type, label, value, updateInstance, condenseUI } = this.props;
    const formId = _.uniqueId('editor-');

    return (
      <div className="editor integer-editor">
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
                  value={value || ''}
                  onChange={(e) => {
                    updateInstance({ name, type, label, value: this.assignValue(e) });
                  }}
                />
              </div>
            </div>
          </label>
        </div>

        {this.state.showInputWarning &&
          <div className="warning">
            {`Warning: The value is not a valid Integer.`}
          </div>
        }
      </div>
    );
  }
}

IntegerEditor.propTypes = {
  name: PropTypes.string,
  type: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  value: PropTypes.string,
  updateInstance: PropTypes.func.isRequired,
  condenseUI: PropTypes.bool
};
