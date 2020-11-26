import React, { Component } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import TimePicker from 'rc-time-picker';
import _ from 'lodash';

import { Dropdown } from 'components/elements';

const options = [
  { value: 'hour', label: 'hour' },
  { value: 'minute', label: 'minute' },
  { value: 'second', label: 'second' }
];

/* eslint-disable jsx-a11y/no-onchange */
export default class TimePrecisionModifier extends Component {
  assignValue(event, name) {
    let time = this.props.time;
    let precision = this.props.precision;

    switch (name) {
      case 'time': {
        const timeMoment = event != null ? event.format('HH:mm:ss') : null;
        time = timeMoment ? `@T${timeMoment}` : null;
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

    this.props.updateAppliedModifier(this.props.index, { time, precision });
  }

  render() {
    const { name, precision, time } = this.props;
    const timeId = _.uniqueId('time-');
    const precId = _.uniqueId('prec-');

    return (
      /* eslint-disable jsx-a11y/label-has-for */
      <div className="col-9 d-flex modifier-vert-aligned">
        <label className="modifier-label">{name}</label>

        <div className="modifier-input">
          <TimePicker
            id={timeId}
            defaultValue={
              moment(time, 'HH:mm:ss').isValid()
              ? moment(time, 'HH:mm:ss')
              : null
            }
            autoComplete="off"
            onChange={event => this.assignValue(event, 'time')}
          />
        </div>

        <div className="modifier-dropdown">
          <Dropdown
            id={precId}
            label="Precision"
            onChange={event => this.assignValue(event, 'precision')}
            options={options}
            value={precision}
          />
        </div>
      </div>
    );
  }
}

TimePrecisionModifier.propTypes = {
  index: PropTypes.number.isRequired,
  name: PropTypes.string.isRequired,
  time: PropTypes.string,
  precision: PropTypes.string,
  updateAppliedModifier: PropTypes.func.isRequired
};
