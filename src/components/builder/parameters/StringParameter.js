import React, { Component } from 'react';
import _ from 'lodash';

/**
 * props are from a templateInstance parameters object,
 * and a function called UpdateInstance that takes an object with
 * key-value pairs that represents that state of the templateInstance,
 * and a function called Validation that validates what is entered
 */
class StringParameter extends Component {
  constructor(props) {
    super(props);
    this.state = { valid: null }; // no validation at start
  }

  render() {
    const id = _.uniqueId('parameter-');
    const helpId = _.uniqueId('parameter-help-');
    let validityClassName = null;
    if (this.state.valid) {
      validityClassName = 'form__group-valid';
    } else if (this.state.valid === false) {
      validityClassName = 'form__group-invalid';
    }

    return (
      <div className={`form__group ${validityClassName}`}>
        <label htmlFor={id}>
          {this.props.name}:

          <input id={id}
            type="text"
            name={this.props.id}
            aria-describedby={helpId}
            defaultValue={this.props.value}
            onChange={(event) => {
              const name = event.target.name;
              const value = event.target.value;
              this.setState({ valid: this.props.validation(value) });
              if (this.state.valid) {
                this.props.updateInstance({ [name]: value });
              }
            }}
          />
        </label>
        <span id={helpId} role='alert' aria-live='assertive'>
        { this.state.valid === false
          ? 'Spaces are prohibited in element names' /* TODO: Have validation message provided by the validation function or some other prop */
          : null }
        </span>
      </div>
    );
  }
}

export default StringParameter;
