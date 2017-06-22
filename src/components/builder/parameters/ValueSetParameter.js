import React, { Component } from 'react';
import Select from 'react-select';
import axios from 'axios';
import _ from 'lodash';
import Config from '../../../../config';

const API_BASE = Config.api.baseUrl;

class ValueSetParameter extends Component {
  constructor(props) {
    super(props);

    this.state = { valueset: [] };
  }

  componentWillMount() {
    axios.get(`${API_BASE}/config/valuesets/${this.props.param.select}`)
      .then((result) => {
        this.setState({ valueset: result.data.expansion });
      });
  }

  render() {
    const id = _.uniqueId('parameter-');
    return (
      <div className="form__group">
        <label htmlFor={id}>
          {this.props.param.name}:
          <Select labelKey={'name'}
            autofocus
            options={this.state.valueset}
            inputProps={{ id }}
            clearable={true}
            name={this.props.param.id}
            value={this.props.param.value}
            onChange={(value) => {
              this.props.updateInstance({ [this.props.param.id]: value });
            }}
            searchable={true} />
        </label>
      </div>
    );
  }
}

export default ValueSetParameter;
