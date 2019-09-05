import React, { Component } from 'react';
import PropTypes from 'prop-types';
import FontAwesome from 'react-fontawesome';
import Dropzone from 'react-dropzone';

import artifactProps from '../../prop-types/artifact';

import ExternalCqlTable from './ExternalCqlTable';
import ELMErrorModal from './ELMErrorModal';
import Banner from '../elements/Banner';

export default class ExternalCQL extends Component {
  constructor(props) {
    super(props);

    this.state = {
      showUploadErrorBanner: false,
      showLibraryErrorBanner: props.addExternalCqlLibraryError != null,
      showLibraryNotificationBanner:
        props.addExternalCqlLibraryError === null && props.addExternalCqlLibraryErrorMessage !== '',
      showELMErrorModal: false
    };
  }

  UNSAFE_componentWillMount() { // eslint-disable-line camelcase
    const { artifact, loadExternalCqlList } = this.props;
    loadExternalCqlList(artifact._id);
  }

  UNSAFE_componentWillReceiveProps(nextProps) { // eslint-disable-line camelcase
    const showELMErrorModal =
      nextProps.externalCqlErrors ? nextProps.externalCqlErrors.length > 0 : false;
    this.setState({ showELMErrorModal });

    if (nextProps.addExternalCqlLibraryError !== this.props.addExternalCqlLibraryError) {
      this.setState({ showLibraryErrorBanner: nextProps.addExternalCqlLibraryError != null });
      this.setState({ showLibraryNotificationBanner:
          nextProps.addExternalCqlLibraryError === null && nextProps.addExternalCqlLibraryErrorMessage !== '' });
    }

    if (nextProps.addExternalCqlLibraryErrorMessage !== this.props.addExternalCqlLibraryErrorMessage) {
      this.setState({ showLibraryNotificationBanner:
        nextProps.addExternalCqlLibraryError === null && nextProps.addExternalCqlLibraryErrorMessage !== '' });
    }
  }

  componentWillUnmount() {
    const { clearAddLibraryErrorsAndMessages } = this.props;
    clearAddLibraryErrorsAndMessages();
  }

  handleAddExternalCQL = (externalCqlLibrary) => {
    const { artifact } = this.props;
    this.setState({ showUploadErrorBanner: false });

    const reader = new FileReader();
    reader.onload = (e) => {
      const cqlFileName = externalCqlLibrary[0].name;
      const cqlFileType = externalCqlLibrary[0].type;

      const fileContentToSend = e.target.result.slice(e.target.result.indexOf(',') + 1);
      if (cqlFileType !== 'application/zip'
      || (cqlFileType === 'application/zip' && cqlFileName.endsWith('.zip'))) {
        const library = {
          cqlFileName,
          cqlFileContent: fileContentToSend,
          fileType: cqlFileType,
          artifactId: artifact._id
        };

        this.props.addExternalLibrary(library);
        this.setState({ showUploadErrorBanner: false });
      } else {
        this.setState({ showUploadErrorBanner: true });
      }
    };

    try {
      reader.readAsDataURL(externalCqlLibrary[0]);
    } catch (error) {
      this.setState({ showUploadErrorBanner: true });
    }
  }

  dismissBanner = (event, bannerType) => {
    event.stopPropagation();
    this.setState({ [bannerType]: false });
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
      externalCQLLibraryParents,
      deleteExternalCqlLibrary,
      externalCqlLibraryDetails,
      loadExternalCqlLibraryDetails,
      isLoadingExternalCqlDetails,
      clearAddLibraryErrorsAndMessages,
      librariesInUse
    } = this.props;
    if (externalCqlList && externalCqlList.length > 0) {
      return (
        <ExternalCqlTable
          artifactId={artifact._id}
          externalCqlList={externalCqlList}
          externalCQLLibraryParents={externalCQLLibraryParents}
          externalCqlLibraryDetails={externalCqlLibraryDetails}
          deleteExternalCqlLibrary={deleteExternalCqlLibrary}
          loadExternalCqlLibraryDetails={loadExternalCqlLibraryDetails}
          isLoadingExternalCqlDetails={isLoadingExternalCqlDetails}
          clearAddLibraryErrorsAndMessages={clearAddLibraryErrorsAndMessages}
          librariesInUse={librariesInUse} />
      );
    }

    return <div>No external CQL libraries to show.</div>;
  }

  render() {
    const { addExternalCqlLibraryErrorMessage } = this.props;
    const { showUploadErrorBanner, showLibraryErrorBanner, showLibraryNotificationBanner } = this.state;
    const isDropzoneDisabled = this.props.artifact._id === null;

    return (
      <div className="external-cql" id="maincontent">
        <div className="external-cql-wrapper">
          <Dropzone
            className="dropzone"
            onDrop={this.handleAddExternalCQL.bind(this)}
            accept=".cql,application/zip,text/plain"
            disabled={isDropzoneDisabled}
            disabledClassName='disabled'
            multiple={false}>
            {this.renderDropzoneIcon()}

            {showUploadErrorBanner &&
              <Banner type="warning" close={event => this.dismissBanner(event, 'showUploadErrorBanner')}>
                Invalid file type.
              </Banner>
            }

            {showLibraryErrorBanner &&
              <Banner type="warning" close={event => this.dismissBanner(event, 'showLibraryErrorBanner')}>
                {addExternalCqlLibraryErrorMessage || 'An error occurred.'}
              </Banner>
            }

            {showLibraryNotificationBanner &&
              <Banner close={event => this.dismissBanner(event, 'showLibraryNotificationBanner')}>
                {addExternalCqlLibraryErrorMessage}
              </Banner>
            }

            {isDropzoneDisabled && <Banner type="warning">Artifact must be saved before uploading libraries.</Banner>}

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
  externalCQLLibraryParents: PropTypes.object.isRequired,
  isAddingExternalCqlLibrary: PropTypes.bool,
  addExternalCqlLibraryError: PropTypes.number,
  deleteExternalCqlLibrary: PropTypes.func.isRequired,
  addExternalLibrary: PropTypes.func.isRequired,
  loadExternalCqlList: PropTypes.func.isRequired,
  clearExternalCqlValidationWarnings: PropTypes.func.isRequired,
  loadExternalCqlLibraryDetails: PropTypes.func.isRequired,
  isLoadingExternalCqlDetails: PropTypes.bool.isRequired,
  librariesInUse: PropTypes.array.isRequired
};
