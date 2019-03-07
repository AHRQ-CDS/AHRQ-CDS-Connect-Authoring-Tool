import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';

/* eslint-disable jsx-a11y/no-onchange */
export default class NumberModifier extends Component {
  render() {
    const valueId = _.uniqueId('value-');

    return (
      <div className="number-modifier">
        <label htmlFor={valueId}>
          <input
            type="number"
            placeholder="enter value"
            aria-label="Number Modifier"
            value={this.props.value || ''}
            onChange={(event) => { this.props.updateAppliedModifier(this.props.index, { value: event.target.value }); }}
            onSelect={(event) => { this.props.updateAppliedModifier(this.props.index, { value: event.target.value }); }}
          />
        </label>
      </div>
    );
  }
}

NumberModifier.propTypes = {
  index: PropTypes.number.isRequired,
  value: PropTypes.string,
  updateAppliedModifier: PropTypes.func.isRequired
};
