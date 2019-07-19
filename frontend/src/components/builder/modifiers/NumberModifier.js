import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';

/* eslint-disable jsx-a11y/no-onchange */
export default class NumberModifier extends Component {
  render() {
    const { value } = this.props;
    const valueId = _.uniqueId('value-');

    return (
      /* eslint-disable jsx-a11y/label-has-for */
      <div className="number-modifier">
        <label>
          {`${this.props.name}: `}
        </label>

        <span>  </span>

        <label htmlFor={valueId}>
          <input
            type="number"
            placeholder="enter value"
            aria-label="Number Modifier"
            value={(value || value === 0) ? value : ''}
            onChange={(event) => {
              this.props.updateAppliedModifier(
                this.props.index,
                { value: _.isNaN(parseFloat(event.target.value)) ? null : parseFloat(event.target.value) }
              );
            }}
            onSelect={(event) => {
              this.props.updateAppliedModifier(
                this.props.index,
                { value: _.isNaN(parseFloat(event.target.value)) ? null : parseFloat(event.target.value) }
              );
            }}
          />
        </label>
      </div>
    );
  }
}

NumberModifier.propTypes = {
  index: PropTypes.number.isRequired,
  name: PropTypes.string.isRequired,
  value: PropTypes.number,
  updateAppliedModifier: PropTypes.func.isRequired
};
