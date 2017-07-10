import React, { Component } from 'react';
import _ from 'lodash';


class CheckBoxParameter extends Component {
  constructor(props) {
    super(props);
    this.state = {
      checked: this.props.param.checked
    };
  }

  render() {
    const id = _.uniqueId('parameter-');

    return (
      <div className="form__caption">
          <input id={id}
            type='checkbox'
            checked={this.state.checked}
            onChange={(event) => {
              this.props.param.checked = event.target.checked;
              this.setState({ checked: event.target.checked });
              this.props.updateComparison(this.state.checked);
            }}
            aria-label={'Make double sided?'}/>
          <label htmlFor={`${id}-double-sided`}>{this.props.param.name}</label>
        </div>
    );
  }
}

export default CheckBoxParameter;
