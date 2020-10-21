import React, { Component } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import TimePicker from 'rc-time-picker';
import _ from 'lodash';

export default class TimeEditor extends Component {
  assignValue = (evt) => {
    let time = evt != null ? evt.format('HH:mm:ss') : null;
    time = time ? `@T${time}` : null;
    return time;
  }

  render() {
    const { name, type, label, value, updateInstance } = this.props;
    const formId = _.uniqueId('editor-');

    return (
      <div className="time-editor">
        <div className="form__group">
          <label className="label-container" htmlFor={formId}>
            <div className="label">{label}</div>

            <div className="input-group-container">
              <div className="input">
                <TimePicker
                  id={formId}
                  defaultValue={moment(value, 'HH:mm:ss').isValid() ? moment(value, 'HH:mm:ss') : null}
                  autoComplete="off"
                  onChange={ (e) => {
                    updateInstance({ name, type, label, value: this.assignValue(e) });
                  }}
                />
              </div>
            </div>
          </label>
        </div>
      </div>
    );
  }
}

TimeEditor.propTypes = {
  name: PropTypes.string,
  type: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  value: PropTypes.string,
  updateInstance: PropTypes.func.isRequired
};
