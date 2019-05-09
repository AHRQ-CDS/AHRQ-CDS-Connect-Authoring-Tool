import React, { Component } from 'react';
import PropTypes from 'prop-types';
import FontAwesome from 'react-fontawesome';
import Dropzone from 'react-dropzone';

import artifactProps from '../../prop-types/artifact';

import ExternalCqlTable from './ExternalCqlTable';
import ELMErrorModal from './ELMErrorModal';

export default class ExternalCQL extends Component {
  constructor(props) {
    super(props);

    this.state = { uploadError: false, showELMErrorModal: false };
  }

  componentWillMount() {
    const { artifact, loadExternalCqlList } = this.props;
    loadExternalCqlList(artifact._id);
  }

  componentWillReceiveProps(newProps) {
    const showELMErrorModal =
      newProps.externalCqlErrors ? newProps.externalCqlErrors.length > 0 : false;
    this.setState({ showELMErrorModal });
  }

  handleAddExternalCQL = (externalCqlLibrary) => {
    const { artifact } = this.props;
    const reader = new FileReader();
    reader.onload = (e) => {
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

  showELMErrorModal = () => {
    this.setState({ showELMErrorModal: true });
  }

  closeELMErrorModal = () => {
    this.setState({ showELMErrorModal: false });
    this.props.clearExternalCqlValidationWarnings();
  }

  renderDropzoneIcon = () => {
    const { isAddingExternalCqlLibrary } = this.props;
    if (isAddingExternalCqlLibrary) return <FontAwesome name="spinner" size="5x" spin />;
    return <FontAwesome name="cloud-upload" size="5x" />;
  }

  renderExternalCqlTable() {
    const {
      artifact,
      externalCqlList,
      deleteExternalCqlLibrary,
      externalCqlLibraryDetails,
      loadExternalCqlLibraryDetails,
      isLoadingExternalCqlDetails
    } = this.props;
    if (externalCqlList && externalCqlList.length > 0) {
      return (
        <ExternalCqlTable
          artifactId={artifact._id}
          externalCqlList={externalCqlList}
          externalCqlLibraryDetails={externalCqlLibraryDetails}
          deleteExternalCqlLibrary={deleteExternalCqlLibrary}
          loadExternalCqlLibraryDetails={loadExternalCqlLibraryDetails}
          isLoadingExternalCqlDetails={isLoadingExternalCqlDetails} />
      );
    }

    return <div>No external CQL libraries to show.</div>;
  }

  render() {
    return (
      <div className="external-cql" id="maincontent">
        <div className="external-cql-wrapper">
          <Dropzone
            className="dropzone"
            onDrop={this.handleAddExternalCQL.bind(this)}
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

        <ELMErrorModal
            isOpen={this.state.showELMErrorModal}
            closeModal={this.closeELMErrorModal}
            errors={this.props.externalCqlErrors}/>

      </div>
    );
  }
}

ExternalCQL.propTypes = {
  artifact: artifactProps,
  externalCqlList: PropTypes.array,
  externalCqlLibrary: PropTypes.object,
  externalCqlLibraryDetails: PropTypes.object,
  externalCqlFhirVersion: PropTypes.string,
  externalCqlErrors: PropTypes.array,
  isAddingExternalCqlLibrary: PropTypes.bool,
  deleteExternalCqlLibrary: PropTypes.func.isRequired,
  addExternalLibrary: PropTypes.func.isRequired,
  loadExternalCqlList: PropTypes.func.isRequired,
  clearExternalCqlValidationWarnings: PropTypes.func.isRequired,
  loadExternalCqlLibraryDetails: PropTypes.func.isRequired,
  isLoadingExternalCqlDetails: PropTypes.bool.isRequired
};
