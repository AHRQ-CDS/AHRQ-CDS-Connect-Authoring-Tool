import React, { Component } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import TimePicker from 'rc-time-picker';
import _ from 'lodash';

import StyledSelect from '../../elements/StyledSelect';

const options = [
  { value: 'hour', label: 'hour' },
  { value: 'minute', label: 'minute' },
  { value: 'second', label: 'second' }
];

/* eslint-disable jsx-a11y/no-onchange */
export default class TimePrecisionModifier extends Component {
  assignValue(evt, name) {
    let time = this.props.time;
    let precision = this.props.precision;

    switch (name) {
      case 'time': {
        const timeMoment = evt != null ? evt.format('HH:mm:ss') : null;
        time = timeMoment ? `@T${timeMoment}` : null;
        break;
      }
      case 'precision': {
        precision = evt ? evt.value : null;
        break;
      }
      default: {
        break;
      }
    }

    this.props.updateAppliedModifier(this.props.index, { time, precision });
  }

  render() {
    const timeId = _.uniqueId('time-');
    const precId = _.uniqueId('prec-');

    return (
      /* eslint-disable jsx-a11y/label-has-for */
      <div className="col-9 d-flex modifier-vert-aligned">
        <label className="modifier-label">
          {`${this.props.name}: `}
        </label>

        <span>  </span>

        <TimePicker
          id={timeId}
          defaultValue={
            moment(this.props.time, 'HH:mm:ss').isValid()
            ? moment(this.props.time, 'HH:mm:ss')
            : null}
          autoComplete="off"
          onChange={ (e) => {
            this.assignValue(e, 'time');
          }}
        />

        <label htmlFor={precId}>
          <StyledSelect
            className="Select"
            name="Precision"
            aria-label="Precision"
            id={precId}
            value={options.find(({ value }) => value === this.props.precision)}
            onChange={ (e) => {
              this.assignValue(e, 'precision');
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
  name: PropTypes.string.isRequired,
  time: PropTypes.string,
  precision: PropTypes.string,
  updateAppliedModifier: PropTypes.func.isRequired
};
