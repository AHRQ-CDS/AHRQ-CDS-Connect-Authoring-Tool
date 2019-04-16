import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';

/* eslint-disable jsx-a11y/no-onchange */
export default class NumberModifier extends Component {
  render() {
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
            value={this.props.value || ''}
            onChange={(event) => {
              this.props.updateAppliedModifier(
                this.props.index,
                { value: parseFloat(event.target.value, 10) ? parseFloat(event.target.value, 10).toString() : null }
              );
            }}
            onSelect={(event) => {
              this.props.updateAppliedModifier(
                this.props.index,
                { value: parseFloat(event.target.value, 10) ? parseFloat(event.target.value, 10).toString() : null }
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
  value: PropTypes.string,
  updateAppliedModifier: PropTypes.func.isRequired
};
