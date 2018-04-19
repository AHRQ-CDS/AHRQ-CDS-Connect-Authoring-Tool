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
    const { id, name, type, value, updateInstance } = this.props;
    const formId = _.uniqueId('parameter-');

    return (
      <div className="form__group">
        <label htmlFor={formId}>
          Time: <TimePicker
            id={id}
            defaultValue={moment(value, 'HH:mm:ss').isValid() ? moment(value, 'HH:mm:ss') : null}
            onChange={ (e) => {
              updateInstance({ name, type, value: this.assignValue(e) });
            }}
          />
        </label>
      </div>
    );
  }
}

TimeEditor.propTypes = {
  id: PropTypes.string.isRequired,
  name: PropTypes.string,
  type: PropTypes.string.isRequired,
  value: PropTypes.string,
  updateInstance: PropTypes.func.isRequired
};
