import React, { Component } from 'react';
import PropTypes from 'prop-types';
import FontAwesome from 'react-fontawesome';
import Dropzone from 'react-dropzone';

import artifactProps from '../../prop-types/artifact';

import ExternalCqlTable from './ExternalCqlTable';

export default class ExternalCQL extends Component {
  constructor(props) {
    super(props);

    this.state = { uploadError: false };
  }

  addExternalCQL = externalCqlLibrary => {
    const { artifact } = this.props;
    const reader = new FileReader();
    reader.onload = e => {
      const library = {
        cqlFileName: externalCqlLibrary[0].name,
        cqlFileText: e.target.result,
        artifactId: artifact._id
      };

      this.props.addExternalLibrary(library);
    };

    try {
      reader.readAsText(externalCqlLibrary[0]);
    } catch (error) {
      this.setState({ uploadError: true });
    }
  }

  renderDropzoneIcon = () => {
    if (this.props.isAddingExternalCqlLibrary) return <FontAwesome name="spinner" size="5x" spin />;
    return <FontAwesome name="cloud-upload" size="5x" />;
  }

  renderExternalCqlTable() {
    const { externalCqlList, deleteExternalCqlLibrary } = this.props;
    if (externalCqlList && externalCqlList.length > 0) {
      return (
        <ExternalCqlTable
          externalCqlList={externalCqlList}
          deleteExternalCqlLibrary={deleteExternalCqlLibrary} />
      );
    }

    return <div>No external CQL libraries to show.</div>;
  }

  render() {
    return (
      <div className="external-cql" id="maincontent">
        <Dropzone
          className="dropzone"
          onDrop={this.addExternalCQL.bind(this)}
          accept=".cql,text/plain"
          multiple={false}>
          {this.renderDropzoneIcon()}
          {this.state.uploadError && <div className="warning">Invalid file type.</div>}

          <div className="dropzone__instructions">
            Drop a valid external CQL library or zip file here, or click to browse.
          </div>
        </Dropzone>

        <div className="external-cql__display">
          {this.renderExternalCqlTable()}
        </div>
      </div>
    );
  }
}

ExternalCQL.propTypes = {
  artifact: artifactProps,
  externalCqlList: PropTypes.array,
  externalCqlLibrary: PropTypes.object,
  externalCqlFhirVersion: PropTypes.string,
  isAddingExternalCqlLibrary: PropTypes.bool,
  deleteExternalCqlLibrary: PropTypes.func.isRequired,
  addExternalLibrary: PropTypes.func.isRequired
};
