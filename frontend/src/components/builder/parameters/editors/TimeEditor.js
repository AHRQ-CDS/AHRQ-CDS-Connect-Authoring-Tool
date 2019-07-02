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
    const formId = _.uniqueId('parameter-');

    return (
      <div className="time-editor">
        <div className="parameter__item row">
          <div className="col-3 bold align-right">
            <label htmlFor={formId}>{label}</label>
          </div>

          <div className="col-9">
            <TimePicker
              id={formId}
              defaultValue={moment(value, 'HH:mm:ss').isValid() ? moment(value, 'HH:mm:ss') : null}
              onChange={ (e) => {
                updateInstance({ name, type, label, value: this.assignValue(e) });
              }}
            />
          </div>
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
