import React, { Component } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import DatePicker from 'react-datepicker';
import TimePicker from 'rc-time-picker';
import _ from 'lodash';

export default class DateTimeEditor extends Component {
  constructor(props) {
    super(props);

    const date = _.get(props, 'value.date', null);
    const time = _.get(props, 'value.time', null);
  
    this.state = {
      showInputWarning: (time && !date)
    };
  }

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

    this.setState({ showInputWarning: (time && !date) });

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
    const { id, name, type, label, value, updateInstance } = this.props;
    const formId = _.uniqueId('editor-');

    return (
      <div className="date-time-editor">
        <div className="form__group">
          <label className="label-container" htmlFor={formId}>
            <div className="label">{label}</div>

            <div className="input-group-container">
              <div className="input-group">
                <span className="date-label">Date:</span>

                <DatePicker
                  id={id}
                  selected={
                    moment(_.get(value, 'date', null), 'YYYY-MM-DD').isValid()
                    ? moment(value.date, 'YYYY-MM-DD').toDate()
                    : null}
                  dateFormat="MM/dd/yyyy"
                  autoComplete="off"
                  onChange={ (e) => {
                    updateInstance({ name, type, label, value: this.assignValue(moment(e), 'date') });
                  }}
                />
              </div>

              <div className="input-group">
                <span className="date-label">Time:</span>

                <TimePicker
                  id={id}
                  defaultValue={
                    moment(_.get(value, 'time', null), 'HH:mm:ss').isValid()
                    ? moment(value.time, 'HH:mm:ss')
                    : null}
                  autoComplete="off"
                  onChange={ (e) => {
                    updateInstance({ name, type, label, value: this.assignValue(e, 'time') });
                  }}
                />
              </div>
            </div>
          </label>
        </div>

        {this.state.showInputWarning &&
          <div className="warning">
            {`Warning: A DateTime must have at least a date.`}
          </div>
        }
      </div>
    );
  }
}

DateTimeEditor.propTypes = {
  id: PropTypes.string.isRequired,
  name: PropTypes.string,
  type: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  value: PropTypes.object,
  updateInstance: PropTypes.func.isRequired
};
