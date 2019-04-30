import React, { Component } from 'react';
import PropTypes from 'prop-types';
import FontAwesome from 'react-fontawesome';
import Dropzone from 'react-dropzone';

import ExternalCqlTable from './ExternalCqlTable';

export default class ExternalCQL extends Component {
  constructor(props) {
    super(props);

    this.state = {
      uploadError: false,
      externalCqlLibraryData: null
    };
  }

  addExternalCQL = externalCqlLibrary => {
    const reader = new FileReader();
    reader.onload = (e) => {
      console.debug(JSON.parse(e.target.result));
      // this.setState({ externalCqlLibraryData: JSON.parse(e.target.result) });
      // const libraryVersion = _.get(this.state.externalCqlLibraryData, 'libraryVersion');
      // this.props.addExternalLibrary(this.state.externalCqlLibraryData, this.state.libraryVersion);
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
    if (this.props.externalCqlList && this.props.externalCqlList.length > 0) {
      return (
        <ExternalCqlTable
          externalCqlList={this.props.externalCqlList}
          deleteExternalCqlLibrary={this.props.deleteExternalCqlLibrary} />
      );
    }

    return <div>No external CQL libraries to show.</div>;
  }

  render() {
    return (
      <div className="external-cql" id="maincontent">
        <Dropzone
          className="dropzone"
          onDrop={() => this.addExternalCQL}
          accept="application/json"
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
  externalCqlList: PropTypes.array,
  externalCqlLibrary: PropTypes.object,
  externalCqlFhirVersion: PropTypes.string,
  isAddingExternalCqlLibrary: PropTypes.bool,
  deleteExternalCqlLibrary: PropTypes.func.isRequired,
  addExternalLibrary: PropTypes.func.isRequired
};
