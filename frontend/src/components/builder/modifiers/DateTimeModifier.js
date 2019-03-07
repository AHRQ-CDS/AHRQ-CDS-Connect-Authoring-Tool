import React, { Component } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import DatePicker from 'react-datepicker';
import TimePicker from 'rc-time-picker';
import _ from 'lodash';

/* eslint-disable jsx-a11y/no-onchange */
export default class DateTimeModifier extends Component {
  assignValue(evt, name) {
    let date = this.props.date;
    let time = this.props.time;

    switch (name) {
      case 'date': {
        console.log(evt);
        const dateMoment = evt != null ? evt.format('YYYY-MM-DD') : null;
        date = dateMoment ? `@${dateMoment}` : null;
        break;
      }
      case 'time': {
        const timeMoment = evt != null ? evt.format('HH:mm:ss') : null;
        time = timeMoment ? `T${timeMoment}` : null;
        break;
      }
      default: {
        break;
      }
    }

    this.props.updateAppliedModifier(this.props.index, { date, time });
  }

  render() {
    const dateId = _.uniqueId('date-');
    const timeId = _.uniqueId('time-');

    return (
      <div className="col-9 d-flex">
            <DatePicker
              id={dateId}
              selected={
                moment(this.props.date, 'YYYY-MM-DD').isValid()
                ? moment(this.props.date, 'YYYY-MM-DD')
                : null}
              dateFormat="L"
              onChange={ (e) => {
                this.assignValue(e, 'date');
              }}
            />

            <span className="dash">_</span>

            <TimePicker
              id={timeId}
              defaultValue={
                moment(this.props.time, 'HH:mm:ss').isValid()
                ? moment(this.props.time, 'HH:mm:ss')
                : null}
              onChange={ (e) => {
                this.assignValue(e, 'time');
              }}
            />
          </div>
    );
  }
}

DateTimeModifier.propTypes = {
  index: PropTypes.number.isRequired,
  date: PropTypes.string,
  time: PropTypes.string,
  updateAppliedModifier: PropTypes.func.isRequired
};
