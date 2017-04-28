import React, { Component } from 'react';
import axios from 'axios';
import _ from 'lodash';

class ArtifactForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      version: ''
    };

    this.addArtifact = this.addArtifact.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.editArtifact = this.editArtifact.bind(this);
  }

  handleInputChange(e) {
    this.setState({ [e.target.name]: e.target.value });
  }

  addArtifact(e) {
    e.preventDefault();
    axios.post('http://localhost:3001/api/artifacts', {
      name: this.state.name,
      version: this.state.version
    }).then((result) => {
      this.props.afterAddArtifact();
      this.setState({ name: '', version: '' });
    });
  }

  editArtifact(e) {
    console.log("edit form!")
    console.log(this.state)
  }

  componentWillMount() {
    const nameID = _.uniqueId('artifact-name-');
    const versionID = _.uniqueId('artifact-version-');
    this.setState({ nameID, versionID });
  }

  render() {
    return (
      <form className='form__inline' onSubmit={ this.addArtifact }>
      <div className='form__group'>
        <label htmlFor={this.state.nameID}>
          Artifact Name
          <input id={this.state.nameID}
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
