import React, { Component } from 'react';
import _ from 'lodash';

// this.props are from a templateInstance parameters object,
// and a function called UpdateInstance that takes an object with
// key-value pairs that represents that state of the templateInstance
class IntegerParameter extends Component {
  constructor(props) {
    super(props);
    this.state = { checked: this.props.param.exclusive };

    this.updateExclusive = this.updateExclusive.bind(this);
  }

  updateExclusive(event) {
    this.props.param.exclusive = event.target.checked;
    this.setState({ checked: event.target.checked });
  }

  render() {
    const id = _.uniqueId('parameter-');

    return (
      <div>
      <div className='form__group'>
        <label htmlFor={id}>
          {this.props.param.name}:

          <input id={id}
            type="number"
            name={this.props.param.id}
            defaultValue={this.props.param.value}
            onChange={(event) => {
              const value = parseInt(event.target.value, 10);
              this.props.updateInstance({ [event.target.name]: value });
            }}
          />
          { ('exclusive' in this.props.param)
          ? <div className="form__caption">
              <input id={id}
                type='checkbox'
                checked={this.state.checked}
                onChange={event => this.updateExclusive(event)}/>
              <label htmlFor={`${id}-exclusive`}>{'Exclusive'}</label>
            </div>
          : null }
        </label>
      </div>
      </div>
    );
  }
}

export default IntegerParameter;
