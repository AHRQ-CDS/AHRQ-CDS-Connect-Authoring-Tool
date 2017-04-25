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
    this.state = { valid: true }
  }

  render() {
    const id = _.uniqueId('parameter-');

    return (
      <div>
        <label htmlFor={id}>
          {this.props.name}:

          <input id={id}
            type="text"
            className={this.state.valid ? null : 'danger'}
            name={this.props.id}
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
          { !this.state.valid 
            ? <span className='danger'> Spaces are prohibited in element names </span> 
            : null }
        </label>
      </div>
    );
  }
}

export default StringParameter;