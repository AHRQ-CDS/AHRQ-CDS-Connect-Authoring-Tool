import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';

export default class NewArtifactForm extends Component {
  constructor(props) {
    super(props);

    this.state = { name: '', version: '' };
  }

  handleInputChange = (event) => {
    this.setState({ [event.target.name]: event.target.value });
  }

  handleAddArtifact = (event) => {
    event.preventDefault();

    this.props.addArtifact({ name: this.state.name, version: this.state.version });
    this.setState({ name: '', version: '' });
  }

  render() {
    const { artifact } = this.props;
    const { name, version } = this.state;
    const nameID = artifact ? artifact.name : _.uniqueId('artifact-name-');
    const versionID = artifact ? artifact.version : _.uniqueId('artifact-version-');

    return (
      <form className="form__inline" aria-label="New Artifact Form" onSubmit={this.handleAddArtifact}>
        <div className="artifact-form__inputs d-flex justify-content-start">
          <div className="form__group p-2">
            <label htmlFor={nameID}>Artifact Name</label>
            <input id={nameID} required className="input__long" name="name" type="text"
              value={name} onChange={this.handleInputChange} />
          </div>

          <div className="form__group p-2">
            <label htmlFor={versionID}>Version</label>
            <input id={versionID} className="input__short" name="version" type="text"
              value={version} onChange={this.handleInputChange} />
          </div>

          <button type="submit" className="primary-button ml-auto p-2">Create</button>
        </div>
      </form>
    );
  }
}

NewArtifactForm.propTypes = {
  addArtifact: PropTypes.func.isRequired
};
