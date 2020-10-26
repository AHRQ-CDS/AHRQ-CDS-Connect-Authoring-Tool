import React, { Component } from 'react';
import PropTypes from 'prop-types';
import DatePicker from 'react-datepicker';
import TimePicker from 'rc-time-picker';
import moment from 'moment';
import _ from 'lodash';

export default class IntervalOfDateTimeEditor extends Component {
  assignValue(evt, name) {
    let firstDate = null;
    let firstTime = null;
    let secondDate = null;
    let secondTime = null;
    let str = null;

    switch (name) {
      case 'firstDate':
        firstDate = evt != null ? evt.format('YYYY-MM-DD') : null;
        firstTime = _.get(this, 'props.value.firstTime', null);
        secondDate = _.get(this, 'props.value.secondDate', null);
        secondTime = _.get(this, 'props.value.secondTime', null);
        break;
      case 'firstTime':
        firstDate = _.get(this, 'props.value.firstDate', null);
        firstTime = evt != null ? evt.format('HH:mm:ss') : null;
        secondDate = _.get(this, 'props.value.secondDate', null);
        secondTime = _.get(this, 'props.value.secondTime', null);
        break;
      case 'secondDate':
        firstDate = _.get(this, 'props.value.firstDate', null);
        firstTime = _.get(this, 'props.value.firstTime', null);
        secondDate = evt != null ? evt.format('YYYY-MM-DD') : null;
        secondTime = _.get(this, 'props.value.secondTime', null);
        break;
      case 'secondTime':
        firstDate = _.get(this, 'props.value.firstDate', null);
        firstTime = _.get(this, 'props.value.firstTime', null);
        secondDate = _.get(this, 'props.value.secondDate', null);
        secondTime = evt != null ? evt.format('HH:mm:ss') : null;
        break;
      default:
        break;
    }

    if (firstDate || secondDate || firstTime || secondTime) {
      let firstDateTime = null;
      let secondDateTime = null;

      if (firstDate) {
        if (firstTime) {
          firstDateTime = `@${firstDate}T${firstTime}`;
        } else {
          firstDateTime = `@${firstDate}`;
        }
      }

      if (secondDate) {
        if (secondTime) {
          secondDateTime = `@${secondDate}T${secondTime}`;
        } else {
          secondDateTime = `@${secondDate}`;
        }
      }

      str = `Interval[${firstDateTime},${secondDateTime}]`;

      return { firstDate, firstTime, secondDate, secondTime, str };
    }
    return null;
  }

  render() {
    const { id, name, type, label, value, updateInstance } = this.props;
    const formIdFirst = _.uniqueId('parameter-date-');
    const formIdSecond = _.uniqueId('parameter-time-');

    return (
      <div className="interval-of-date-time-editor">
        <div className="form__group">
          <label htmlFor={formIdFirst}>
            <div className="label">{label}</div>

            <div className="input-group">
              <span className="date-label">Date:</span>

              <DatePicker
                id={formIdFirst}
                selected={
                  moment(_.get(value, 'firstDate', null), 'YYYY-MM-DD').isValid()
                  ? moment(value.firstDate, 'YYYY-MM-DD').toDate()
                  : null}
                dateFormat="MM/dd/yyyy"
                autoComplete="off"
                onChange={(e) => {
                  updateInstance({ name, type, label, value: this.assignValue(moment(e), 'firstDate') });
                }}
              />
            </div>

            <div className="input-group">
              <span className="date-label">Time:</span>

              <TimePicker
                id={id}
                defaultValue={
                  moment(_.get(value, 'firstTime', null), 'HH:mm:ss').isValid()
                  ? moment(value.firstTime, 'HH:mm:ss')
                  : null}
                autoComplete="off"
                onChange={(e) => {
                  updateInstance({ name, type, label, value: this.assignValue(e, 'firstTime') });
                }}
              />
            </div>
          </label>
        </div>

        <div className="form__group">
          <label htmlFor={formIdSecond}>
            <div className="label"></div>

            <div className="input-group">
              <span className="date-label">Date:</span>

              <DatePicker
                id={formIdSecond}
                selected={
                  moment(_.get(value, 'secondDate', null), 'YYYY-MM-DD').isValid()
                  ? moment(value.secondDate, 'YYYY-MM-DD').toDate()
                  : null}
                dateFormat="MM/dd/yyyy"
                autoComplete="off"
                onChange={(e) => {
                  updateInstance({ name, type, label, value: this.assignValue(moment(e), 'secondDate') });
                }}
              />
            </div>

            <div className="input-group">
              <span className="date-label">Time:</span>

              <TimePicker
                id={id}
                defaultValue={
                  moment(_.get(value, 'secondTime', null), 'HH:mm:ss').isValid()
                  ? moment(value.secondTime, 'HH:mm:ss')
                  : null}
                autoComplete="off"
                onChange={(e) => {
                  updateInstance({ name, type, label, value: this.assignValue(e, 'secondTime') });
                }}
              />
            </div>
          </label>
        </div>
      </div>
    );
  }
}

IntervalOfDateTimeEditor.propTypes = {
  id: PropTypes.string.isRequired,
  name: PropTypes.string,
  type: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  value: PropTypes.object,
  updateInstance: PropTypes.func.isRequired
};
