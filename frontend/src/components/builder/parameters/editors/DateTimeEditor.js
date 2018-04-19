import React, { Component } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import DatePicker from 'react-datepicker';
import TimePicker from 'rc-time-picker';
import _ from 'lodash';

export default class DateTimeEditor extends Component {
  assignValue(evt, name) {
    let date = null;
    let time = null;
    let str = null;

    switch (name) {
      case 'date':
        date = evt != null ? evt.format('YYYY-MM-DD') : null;
        time = _.get(this, 'props.value.time', null);
        break;
      case 'time':
        date = _.get(this, 'props.value.date', null);
        time = evt != null ? evt.format('HH:mm:ss') : null;
        break;
      default:
        break;
    }

    if (date || time) {
      if (time) {
        str = `@${date}T${time}`;
      } else {
        str = `@${date}`;
      }
      return { date, time, str };
    }

    return null;
  }

  render() {
    const { id, name, type, value, updateInstance } = this.props;
    const formId = _.uniqueId('parameter-');

    return (
      <div className="form__group">
        <label htmlFor={formId}>
          Date: <DatePicker
            id={id}
            selected={
              moment(_.get(value, 'date', null), 'YYYY-MM-DD').isValid()
              ? moment(value.date, 'YYYY-MM-DD')
              : null}
            dateFormat="L"
            onChange={ (e) => {
              updateInstance({ name, type, value: this.assignValue(e, 'date') });
            }}
          />

          Time: <TimePicker
            id={id}
            defaultValue={
              moment(_.get(value, 'time', null), 'HH:mm:ss').isValid()
              ? moment(value.time, 'HH:mm:ss')
              : null}
            onChange={ (e) => {
              updateInstance({ name, type, value: this.assignValue(e, 'time') });
            }}
          />
        </label>
      </div>
    );
  }
}

DateTimeEditor.propTypes = {
  id: PropTypes.string.isRequired,
  name: PropTypes.string,
  type: PropTypes.string.isRequired,
  value: PropTypes.object,
  updateInstance: PropTypes.func.isRequired
};
