import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBook } from '@fortawesome/free-solid-svg-icons';

/* eslint-disable jsx-a11y/label-has-for */
export default class ExternalModifier extends Component {
  render() {
    const { value } = this.props;
    const valueId = _.uniqueId('value-');

    return (
      <div className="external-modifier form__group">
        <label>
          {this.props.name} <FontAwesomeIcon icon={faBook} />
        </label>

        <span>  </span>

        <label htmlFor={valueId}>
          <input
            type="number"
            placeholder="enter value"
            aria-label="External Modifier"
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
};

ExternalModifier.propTypes = {
  index: PropTypes.number.isRequired,
  name: PropTypes.string.isRequired,
  value: PropTypes.number,
  updateAppliedModifier: PropTypes.func.isRequired
};
