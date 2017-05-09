import React, { Component } from 'react';
import Select from 'react-select';
import axios from 'axios';
import _ from 'lodash';

class ValueSetParameter extends Component {
  constructor(props) {
    super(props);

    this.state = {'valueset': []};
  }

  componentWillMount() {
    const url = 'http://localhost:3001/api';
    axios.get(`${url}/valuesets/${this.props.param.select}`)
      .then((result) => {
        this.setState({'valueset' : result.data.expansion });
      })
  }

  render() {
    const id = _.uniqueId('parameter-');
    return (
      <div className="form__group">
        <label htmlFor={id}>
          {this.props.param.name}:
          <Select labelKey={"name"} 
            autofocus 
            options={this.state.valueset}
            inputProps={{'id': id}}
            clearable={true} 
            name={this.props.param.id}
            value={this.props.param.value} 
            onChange={(value) => {
                this.props.updateInstance({ [this.props.param.id]: value })
            }} 
            searchable={true} />
        </label>
      </div>
    );
  }
}

export default ValueSetParameter;