import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Select from 'react-select';
import moment from 'moment';
import DatePicker from 'react-datepicker';
import TimePicker from 'rc-time-picker';
import _ from 'lodash';

/* eslint-disable jsx-a11y/no-onchange */
export default class TimePrecisionModifier extends Component {
  assignValue(evt, name) {
    let time = this.props.time;
    let precision = this.props.precision;

    switch (name) {
      case 'time':
        const timeMoment = evt != null ? evt.format('HH:mm:ss') : null;
        time = timeMoment ? `@T${timeMoment}` : null;
        break;
      case 'precision':
        precision = evt.value;
      default:
        break;
    }

    this.props.updateAppliedModifier(this.props.index, { time, precision });
  }

  render() {
    const timeId = _.uniqueId('time-');
    const precId = _.uniqueId('prec-');

    const options = [
      { value: 'hour', label: 'hour' },
      { value: 'minute', label: 'minute' },
      { value: 'second', label: 'second' },
      { value: 'millisecond', label: 'millisecond' }
    ];

    return (
      <div className="col-9 d-flex">
            <TimePicker
              id={timeId}
              defaultValue={
                moment(this.props.time, 'HH:mm:ss').isValid()
                ? moment(this.props.time, 'HH:mm:ss')
                : null}
              onChange={ (e) => {
                this.assignValue(e, 'time')
              }}
            />

            <label htmlFor={precId}>
              <Select
                name={'Precision'}
                aria-label={'Precision'}
                id={precId}
                value={this.props.precision}
                onChange={ (e) => {
                  this.assignValue(e, 'precision')
                }}
                options={options}
              />
            </label>
          </div>
    );
  }
}

TimePrecisionModifier.propTypes = {
  index: PropTypes.number.isRequired,
  time: PropTypes.string,
  precision: PropTypes.string,
  updateAppliedModifier: PropTypes.func.isRequired
};
