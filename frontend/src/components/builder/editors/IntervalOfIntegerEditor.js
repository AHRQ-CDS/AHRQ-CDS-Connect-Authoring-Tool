import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import _ from 'lodash';

export default class IntervalOfIntegerEditor extends Component {
  constructor(props) {
    super(props);

    const firstInteger = _.get(props, 'value.firstInteger', '');
    const secondInteger = _.get(props, 'value.secondInteger', '');

    this.state = {
      showInputWarning: this.shouldShowInputWarning(firstInteger) || this.shouldShowInputWarning(secondInteger)
    };
  }

  shouldShowInputWarning = (value) => {
    return value && !/^-?\d+$/.test(value);
  }

  assignValue(evt) {
    let firstInteger = null;
    let secondInteger = null;

    switch (evt.target.name) {
      case 'firstInteger':
        firstInteger = _.get(evt, 'target.value', '');
        secondInteger = _.get(this, 'props.value.secondInteger', '');
        break;
      case 'secondInteger':
        firstInteger = _.get(this, 'props.value.firstInteger', '');
        secondInteger = _.get(evt, 'target.value', '');
        break;
      default:
        break;
    }

    this.setState({
      showInputWarning:
        this.shouldShowInputWarning(firstInteger) || this.shouldShowInputWarning(secondInteger)
    });

    if (firstInteger || secondInteger) {
      const firstIntegerForString = firstInteger || null;
      const secondIntegerForString = secondInteger || null;
      const str = `Interval[${firstIntegerForString},${secondIntegerForString}]`;
      return { firstInteger, secondInteger, str };
    }
    return null;
  }

  render() {
    const { id, name, type, label, value, updateInstance, condenseUI } = this.props;
    const formId = _.uniqueId('editor-');

    return (
      <div className="editor interval-of-integer-editor">
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
                  name="firstInteger"
                  value={_.get(value, 'firstInteger', '')}
                  onChange={ (e) => {
                    updateInstance({ name, type, label, value: this.assignValue(e) });
                  }}
                />
              </div>

              <div className="dash">-</div>

              <div className="editor-input">
                <input
                  id={id}
                  name="secondInteger"
                  aria-label="Second Integer"
                  value={_.get(value, 'secondInteger', '')}
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
            {`Warning: At least one of the values is not a valid Integer.`}
          </div>
        }
      </div>
    );
  }
}

IntervalOfIntegerEditor.propTypes = {
  id: PropTypes.string.isRequired,
  name: PropTypes.string,
  type: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  value: PropTypes.object,
  updateInstance: PropTypes.func.isRequired,
  condenseUI: PropTypes.bool
};
