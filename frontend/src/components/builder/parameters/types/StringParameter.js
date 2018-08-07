import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import FontAwesome from 'react-fontawesome';
import { UncontrolledTooltip } from 'reactstrap';

/**
 * props are from a templateInstance parameters object,
 * and a function called UpdateInstance that takes an object with
 * key-value pairs that represents that state of the templateInstance
 */
export default class StringParameter extends Component {
  renderInfoIcon = () => (
    <span className="icon">
      <span id={`reference-info-${this.props.uniqueId}`}>
        <FontAwesome name='info-circle' />
      </span>
      <UncontrolledTooltip target={`reference-info-${this.props.uniqueId}`} placement='top'>
        {this.props.info}
      </UncontrolledTooltip>
    </span>
  );

  render() {
    const { id, name, value, updateInstance, info } = this.props;
    const formId = _.uniqueId('parameter-');

    return (
      <div className="string-parameter form__group">
        <label htmlFor={formId}>
          <span className="label">
            {name}
            {(info || info === '') && this.renderInfoIcon()}:
            </span>

          <input
            id={formId}
            type="text"
            name={id}
            value={value || ''}
            aria-label={name}
            onKeyPress={(event) => {
              if (event.which === 34) { // Quotation mark (")
                event.preventDefault();
              }
            }}
            onChange={(event) => {
              updateInstance({ [event.target.name]: event.target.value });
            }}
          />
        </label>
      </div>
    );
  }
}

StringParameter.propTypes = {
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  value: PropTypes.string,
  updateInstance: PropTypes.func.isRequired
};
