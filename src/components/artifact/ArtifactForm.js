import React, { Component } from 'react';
import axios from 'axios';
import _ from 'lodash';

const API_BASE = process.env.REACT_APP_API_URL;

class ArtifactForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      version: ''
    };
  }

  handleInputChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  }

  addArtifact = (e) => {
    e.preventDefault();
    axios.post(`${API_BASE}/artifacts`, {
      name: this.state.name,
      version: this.state.version,
      recommendations: [],
      subpopulations: [
        {
          special: true,
          subpopulationName: "Doesn't Meet Inclusion Criteria",
          special_subpopulationName: 'not "MeetsInclusionCriteria"',
          uniqueId: 'default-subpopulation-1'
        },
        {
          special: true,
          subpopulationName: 'Meets Exclusion Criteria',
          special_subpopulationName: '"MeetsExclusionCriteria"',
          uniqueId: 'default-subpopulation-2'
        }
      ],
      booleanParameters: [],
      errorStatement: {
        statements: [],
        else: 'null'
      },
      uniqueIdCounter: 0
    }).then((result) => {
      this.props.afterAddArtifact();
      this.setState({
        name: '',
        version: ''
      });
    });
  }

  componentWillMount() {
    const nameID = _.uniqueId('artifact-name-');
    const versionID = _.uniqueId('artifact-version-');
    this.setState({ nameID, versionID });
    if (this.props.defaultName) {
      this.setState({ name: this.props.defaultName });
    }
    if (this.props.defaultVersion) {
      this.setState({ version: this.props.defaultVersion });
    }
  }

  render() {
    return (
      <form className='form__inline'
        aria-label="New Artifact Form"
        onSubmit={this.props.onSubmitFunction
          ? event => this.props.onSubmitFunction(event, this.state.name, this.state.version)
          : this.addArtifact}>
      <div className='form__group'>
        <label htmlFor={this.state.nameID}>
          Artifact Name
          <input id={this.state.nameID}
            required
            className='input__long'
            name='name'
            type='text'
            value={this.state.name}
            onChange={this.handleInputChange} />
        </label>
        </div>
        <div className='form__group'>
        <label htmlFor={this.state.versionID}>
          Version
          <input id={this.state.versionID}
            className='input__short'
            name='version'
            type='text'
            value={this.state.version}
            onChange={this.handleInputChange} />
        </label>
        </div>
        <button type='submit' className='primary-button'>{this.props.buttonLabel}</button>
      </form>
    );
  }
}

export default ArtifactForm;
