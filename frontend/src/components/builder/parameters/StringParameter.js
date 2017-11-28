import React, { Component } from 'react';
import _ from 'lodash';

/**
 * props are from a templateInstance parameters object,
 * and a function called UpdateInstance that takes an object with
 * key-value pairs that represents that state of the templateInstance
 */
class StringParameter extends Component {
  render() {
    const id = _.uniqueId('parameter-');

    return (
      <div className="form__group">
        <label htmlFor={id}>
          {this.props.name}:

          <input id={id}
            type="text"
            name={this.props.id}
            value={this.props.value || ''}
            onChange={(event) => {
              const name = event.target.name;
              const value = event.target.value;
              this.props.updateInstance({ [name]: value });
            }}
          />
        </label>
      </div>
    );
  }
}

export default StringParameter;
