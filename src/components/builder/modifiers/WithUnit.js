import React, { Component } from 'react';
import _ from 'lodash';

class WithUnit extends Component {
  constructor(props) {
    super(props);
    this.state = {  };
  }

  render() {
    const unitId = _.uniqueId('unit-');

    return (
      <div>
        <div >
          <label htmlFor={unitId}>
            Value:
            <input id={unitId} type="text" name="unit" value={this.props.unit || ""}
              onChange={(event) => {
                this.props.updateAppliedModifier(this.props.index, { unit: event.target.value });
              }}
            />
          </label>

        </div>
      </div>
    );
  }
}

export default WithUnit;
