import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';

export default class ValueComparison extends Component {
  render() {
    const minId = _.uniqueId('min-');
    const minInclusiveId = _.uniqueId('minInclusive-');
    const maxId = _.uniqueId('max-');
    const maxInclusiveId = _.uniqueId('maxInclusive-');

    return (
      <div className="value-comparison">
        <label htmlFor={minId}>
          Min:
          <input id={minId} type="number" name="min" value={this.props.min}
            onChange={(event) => {
              this.props.updateAppliedModifier(this.props.index, { min: parseInt(event.target.value, 10) });
            }}
          />
        </label>

        <label htmlFor={minInclusiveId}>
          <input id={minInclusiveId} type="checkbox" name="minInclusive" checked={this.props.minInclusive}
            onChange={(event) => {
              this.props.updateAppliedModifier(this.props.index, { minInclusive: event.target.checked });
            }}
          />
          Inclusive
        </label>

        <label htmlFor={maxId}>
          Max:
          <input id={maxId} type="number" name="max" value={this.props.max}
            onChange={(event) => {
              this.props.updateAppliedModifier(this.props.index, { max: parseInt(event.target.value, 10) });
            }}
          />
        </label>

        <label htmlFor={maxInclusiveId}>
          <input id={maxInclusiveId} type="checkbox" name="maxInclusive" checked={this.props.maxInclusive}
            onChange={(event) => {
              this.props.updateAppliedModifier(this.props.index, { maxInclusive: event.target.checked });
            }}
          />
          Inclusive
        </label>
      </div>
    );
  }
}

ValueComparison.propTypes = {
  index: PropTypes.number.isRequired,
  min: PropTypes.number.isRequired,
  max: PropTypes.number.isRequired,
  minInclusive: PropTypes.bool.isRequired,
  maxInclusive: PropTypes.bool.isRequired,
  updateAppliedModifier: PropTypes.func.isRequired
};
