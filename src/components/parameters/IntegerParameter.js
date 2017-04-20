import React, { Component, PropTypes } from 'react';

class IntegerParameter extends Component {
  static propTypes = {
    parameter: PropTypes.object.isRequired
  }

  constructor(props) {
    super(props);

    this.state = {
      value: this.props.parameter.value
    };

    this.handleChange = this.handleChange.bind(this);    
  }

  handleChange(event) {
    // TODO: I don't know if this is right per react... may want to link together in a better way
    this.props.parameter.value = parseInt(event.target.value)
    this.setState({value: this.props.parameter.value});
  }

  render() {
    return (
      <div>
        <label>
          {this.props.parameter.name}: 
          <input type="number" name={this.props.parameter.id} defaultValue={this.state.value} onChange={this.handleChange}/>
        </label>
      </div>
    );
  }
}

export default IntegerParameter;