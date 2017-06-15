import React, { Component } from 'react';
import _ from 'lodash';

class ValueComparison extends Component {
  constructor(props) {
    super(props);
    this.state = {  };
  }

  render() {
    const id = _.uniqueId('parameter-');

    return (
      <div>
        <div className='form__group'>
          <label htmlFor={id}>
            Value Comparison:

            <input id={id}
              type="number"
              name="min"
              value={this.props.min}
              onChange={(event) => {
                this.props.updateAppliedModifier(this.props.index, { min: parseInt(event.target.value, 10) });
              }}
            />
          </label>

        </div>
      </div>
    );
  }
}

export default ValueComparison;
