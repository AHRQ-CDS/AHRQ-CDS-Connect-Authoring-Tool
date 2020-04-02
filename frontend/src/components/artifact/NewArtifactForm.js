import React, { Component } from 'react';
import PropTypes from 'prop-types';
import FontAwesome from 'react-fontawesome';
import _ from 'lodash';
import { onVisitExternalLink } from '../../utils/handlers';

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
        {this.state.version && !(/^\d+\.\d+\.\d+$/.test(this.state.version))
          && <div className="notification">
                <FontAwesome name="exclamation-circle" />
                Version should follow the Apache APR versioning scheme (e.g., 1.0.0).
                See <a href="http://build.fhir.org/ig/HL7/cqf-recommendations/documentation-libraries.html" target="_blank" rel="noopener noreferrer" onClick={onVisitExternalLink}>FHIR Clinical Guidelines</a> for more information.
              </div>}
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

          <button type="submit"
            className="primary-button ml-auto p-2"
            aria-label="Create">
          Create
          </button>
        </div>
      </form>
    );
  }
}

NewArtifactForm.propTypes = {
  addArtifact: PropTypes.func.isRequired
};
