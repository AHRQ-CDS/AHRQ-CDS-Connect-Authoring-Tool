import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Remove as DashIcon, Schedule as TimeIcon } from '@material-ui/icons';
import { KeyboardDatePicker, KeyboardTimePicker } from '@material-ui/pickers';
import { format, parse } from 'date-fns';

export default class IntervalOfDateTimeEditor extends Component {
  constructor(props) {
    super(props);

    const firstDate = props.value?.firstDate || null;
    const firstTime = props.value?.firstTime || null;
    const secondDate = props.value?.secondDate || null;
    const secondTime = props.value?.secondTime || null;

    this.state = {
      showInputWarning: (firstTime && !firstDate) || (secondTime && !secondDate)
    };
  }

  handleChange = (newValue, inputType) => {
    if (newValue && Number.isNaN(newValue.valueOf())) return;

    const { name, type, label, updateInstance, value } = this.props;
    const firstDate =
      inputType === 'firstDate' ? (newValue ? format(newValue, 'yyyy-MM-dd') : null) : value?.firstDate || null;
    const firstTime =
      inputType === 'firstTime' ? (newValue ? format(newValue, 'HH:mm:ss') : null) : value?.firstTime || null;
    const secondDate =
      inputType === 'secondDate' ? (newValue ? format(newValue, 'yyyy-MM-dd') : null) : value?.secondDate || null;
    const secondTime =
      inputType === 'secondTime' ? (newValue ? format(newValue, 'HH:mm:ss') : null) : value?.secondTime || null;
    const str = this.getString(firstDate, firstTime, secondDate, secondTime);

    this.setState({ showInputWarning: (firstTime && !firstDate) || (secondTime && !secondDate) });
    updateInstance({ name, type, label, value: { firstDate, firstTime, secondDate, secondTime, str } });
  };

  getString = (firstDate, firstTime, secondDate, secondTime) => {
    let firstDateTime = null;
    let secondDateTime = null;
    if (firstDate) firstDateTime = firstTime ? `@${firstDate}T${firstTime}` : `@${firstDate}`;
    if (secondDate) secondDateTime = secondTime ? `@${secondDate}T${secondTime}` : `@${secondDate}`;
    return `Interval[${firstDateTime},${secondDateTime}]`;
  };

  render() {
    const { label, value } = this.props;
    const { showInputWarning } = this.state;
    const firstDate = value?.firstDate ? parse(value.firstDate, 'yyyy-MM-dd', new Date()) : null;
    const firstTime = value?.firstTime ? parse(value.firstTime, 'HH:mm:ss', new Date()) : null;
    const secondDate = value?.secondDate ? parse(value.secondDate, 'yyyy-MM-dd', new Date()) : null;
    const secondTime = value?.secondTime ? parse(value.secondTime, 'HH:mm:ss', new Date()) : null;

    return (
      <div className="editor interval-of-date-time-editor">
        <div className="editor-label">{label}</div>

        <div className="editor-inputs">
          <div>
            <KeyboardDatePicker
              className="field-input"
              format="MM/dd/yyyy"
              inputVariant="outlined"
              KeyboardButtonProps={{ 'aria-label': 'change date' }}
              label="Date"
              margin="normal"
              onChange={newValue => this.handleChange(newValue, 'firstDate')}
              placeholder="mm/dd/yyyy"
              value={firstDate}
            />

            <KeyboardTimePicker
              className="field-input"
              format="HH:mm:ss"
              inputVariant="outlined"
              KeyboardButtonProps={{ 'aria-label': 'change time' }}
              keyboardIcon={<TimeIcon />}
              label="Time"
              margin="normal"
              onChange={newValue => this.handleChange(newValue, 'firstTime')}
              placeholder="hh:mm:ss"
              value={firstTime}
              views={['hours', 'minutes', 'seconds']}
            />
          </div>


          <div className="field-input"><DashIcon /></div>

          <div>
            <KeyboardDatePicker
              className="field-input"
              format="MM/dd/yyyy"
              inputVariant="outlined"
              KeyboardButtonProps={{ 'aria-label': 'change date' }}
              label="Date"
              margin="normal"
              onChange={newValue => this.handleChange(newValue, 'secondDate')}
              placeholder="mm/dd/yyyy"
              value={secondDate}
            />

            <KeyboardTimePicker
              className="field-input"
              format="HH:mm:ss"
              inputVariant="outlined"
              KeyboardButtonProps={{ 'aria-label': 'change time' }}
              keyboardIcon={<TimeIcon />}
              label="Time"
              margin="normal"
              onChange={newValue => this.handleChange(newValue, 'secondTime')}
              placeholder="hh:mm:ss"
              value={secondTime}
              views={['hours', 'minutes', 'seconds']}
            />
          </div>
        </div>

        <div className="editor-warnings">
          {showInputWarning &&
            <div className="warning">
              Warning: An Interval{'<DateTime>'} cannot include a time without a corresponding date.
            </div>
          }
        </div>
      </div>
    );
  }
}

IntervalOfDateTimeEditor.propTypes = {
  name: PropTypes.string,
  type: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  value: PropTypes.object,
  updateInstance: PropTypes.func.isRequired
};
