import React, { Component } from 'react';

/**
 * props are from a templateInstance parameters object,
 * and a function called UpdateInstance that takes an object with
 * key-value pairs that represents that state of the templateInstance,
 * and a function called Validation that validates what is entered
 */
class StaticParameter extends Component {
  render() {
    return (
      <div className="static-parameter">
        <input
          type="hidden"
          aria-hidden="true"
          name={this.props.id}
          defaultValue={this.props.value}
        />
      </div>
    );
  }
}

export default StaticParameter;
