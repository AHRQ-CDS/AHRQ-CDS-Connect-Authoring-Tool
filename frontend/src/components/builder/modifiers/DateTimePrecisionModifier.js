import React, { Component } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import DatePicker from 'react-datepicker';
import TimePicker from 'rc-time-picker';
import _ from 'lodash';

import { Dropdown } from 'components/elements';

const options = [
  { value: 'year', label: 'year' },
  { value: 'month', label: 'month' },
  { value: 'day', label: 'day' },
  { value: 'hour', label: 'hour' },
  { value: 'minute', label: 'minute' },
  { value: 'second', label: 'second' }
];

/* eslint-disable jsx-a11y/no-onchange */
export default class DateTimePrecisionModifier extends Component {
  assignValue(event, name) {
    let date = this.props.date;
    let time = this.props.time;
    let precision = this.props.precision;

    switch (name) {
      case 'date': {
        const dateMoment = event != null ? event.format('YYYY-MM-DD') : null;
        date = dateMoment ? `@${dateMoment}` : null;
        break;
      }
      case 'time': {
        const timeMoment = event != null ? event.format('HH:mm:ss') : null;
        time = timeMoment ? `T${timeMoment}` : null;
        break;
      }
      case 'precision': {
        precision = event.target.value;
        break;
      }
      default: {
        break;
      }
    }

    this.props.updateAppliedModifier(this.props.index, { date, time, precision });
  }

  render() {
    const { date, name, precision, time } = this.props;
    const dateId = _.uniqueId('date-');
    const timeId = _.uniqueId('time-');
    const precId = _.uniqueId('prec-');

    return (
      /* eslint-disable jsx-a11y/label-has-for */
      <div className="col-9 d-flex modifier-vert-aligned">
        <label className="modifier-label">{name}</label>

        <div className="modifier-input">
          <DatePicker
            id={dateId}
            selected={
              moment(date, 'YYYY-MM-DD').isValid()
              ? moment(date, 'YYYY-MM-DD').toDate()
              : null
            }
            dateFormat="MM/dd/yyyy"
            autoComplete="off"
            onChange={event => this.assignValue(moment(event), 'date')}
          />
        </div>

        <div className="modifier-input">
          <TimePicker
            id={timeId}
            defaultValue={
              moment(time, 'HH:mm:ss').isValid()
              ? moment(time, 'HH:mm:ss')
              : null}
            autoComplete="off"
            onChange={ (e) => {
              this.assignValue(e, 'time');
            }}
          />
        </div>

        <label htmlFor={precId} className="modifier-dropdown">
          <Dropdown
            id={precId}
            label="Precision"
            onChange={event => this.assignValue(event, 'precision')}
            options={options}
            value={precision}
          />
        </label>
      </div>
    );
  }
}

DateTimePrecisionModifier.propTypes = {
  index: PropTypes.number.isRequired,
  name: PropTypes.string.isRequired,
  date: PropTypes.string,
  time: PropTypes.string,
  precision: PropTypes.string,
  updateAppliedModifier: PropTypes.func.isRequired
};
