import React, { Component } from 'react';
import _ from 'lodash';

/**
 * props are from a templateInstance parameters object,
 * and a function called UpdateInstance that takes an object with
 * key-value pairs that represents that state of the templateInstance,
 * and a function called Validation that validates what is entered
 */
class StaticParameter extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const id = _.uniqueId('parameter-');

    return (
      <div>
        <input id={id}
          type="hidden"
          name={this.props.id}
          defaultValue={this.props.value}
        />
      </div>
    );
  }
}

export default StaticParameter;