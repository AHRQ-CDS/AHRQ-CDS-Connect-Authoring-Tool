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
      if (firstTime) {
        if (secondTime) {
          str = `Interval[@${firstDate}T${firstTime},@${secondDate}T${secondTime}]`;
        } else {
          str = `Interval[@${firstDate}T${firstTime},@${secondDate}]`;
        }
      } else if (secondTime) {
        str = `Interval[@${firstDate},@${secondDate}T${secondTime}]`;
      } else {
        str = `Interval[@${firstDate},@${secondDate}]`;
      }
      return { firstDate, firstTime, secondDate, secondTime, str };
    }
    return null;
  }

  render() {
    const { id, name, type, value, updateInstance } = this.props;
    const formIdFirst = _.uniqueId('parameter-date-');
    const formIdSecond = _.uniqueId('parameter-time-');

    return (
      <div className="interval-of-date-time-editor">
        <div className="parameter__item row">
          <div className="col-3 bold align-right">
            <label htmlFor={formIdFirst}>First Date and Time:</label>
          </div>

          <div className="col-9 d-flex">
            <DatePicker
              id={formIdFirst}
              selected={
                moment(_.get(value, 'firstDate', null), 'YYYY-MM-DD').isValid()
                ? moment(value.firstDate, 'YYYY-MM-DD')
                : null}
              dateFormat="L"
              onChange={(e) => {
                updateInstance({ name, type, value: this.assignValue(e, 'firstDate') });
              }}
            />

            <span className="dash">_</span>

            <TimePicker
              id={id}
              defaultValue={
                moment(_.get(value, 'firstTime', null), 'HH:mm:ss').isValid()
                ? moment(value.firstTime, 'HH:mm:ss')
                : null}
              onChange={(e) => {
                updateInstance({ name, type, value: this.assignValue(e, 'firstTime') });
              }}
            />
          </div>
        </div>

        <div className="parameter__item row">
          <div className="col-3 bold align-right">
            <label htmlFor={formIdSecond}>Second Date and Time:</label>
          </div>

          <div className="col-9 d-flex">
            <DatePicker
              id={formIdSecond}
              selected={
                moment(_.get(value, 'secondDate', null), 'YYYY-MM-DD').isValid()
                ? moment(value.secondDate, 'YYYY-MM-DD')
                : null}
              dateFormat="L"
              onChange={(e) => {
                updateInstance({ name, type, value: this.assignValue(e, 'secondDate') });
              }}
            />

            <span className="dash">_</span>

            <TimePicker
              id={id}
              defaultValue={
                moment(_.get(value, 'secondTime', null), 'HH:mm:ss').isValid()
                ? moment(value.secondTime, 'HH:mm:ss')
                : null}
              onChange={(e) => {
                updateInstance({ name, type, value: this.assignValue(e, 'secondTime') });
              }}
            />
          </div>
        </div>
      </div>
    );
  }
}

IntervalOfDateTimeEditor.propTypes = {
  id: PropTypes.string.isRequired,
  name: PropTypes.string,
  type: PropTypes.string.isRequired,
  value: PropTypes.object,
  updateInstance: PropTypes.func.isRequired
};
