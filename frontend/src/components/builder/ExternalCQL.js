import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner, faCloudUploadAlt } from '@fortawesome/free-solid-svg-icons';
import Dropzone from 'react-dropzone';
import { Alert } from '@material-ui/lab';

import { ELMErrorModal } from 'components/modals';
import artifactProps from 'prop-types/artifact';
import ExternalCqlTable from './ExternalCqlTable';

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
          artifact
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
    if (isAddingExternalCqlLibrary) return <FontAwesomeIcon icon={faSpinner} size="5x" spin />;
    return <FontAwesomeIcon icon={faCloudUploadAlt} size="5x" />;
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
          artifact={artifact}
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
    const { addExternalCqlLibraryErrorMessage, externalCqlErrors } = this.props;
    const {
      showELMErrorModal,
      showLibraryErrorBanner,
      showLibraryNotificationBanner,
      showUploadErrorBanner
    } = this.state;
    const isDropzoneDisabled = this.props.artifact._id === null;

    return (
      <div className="external-cql" id="maincontent">
        <div className="external-cql-wrapper">
          <Dropzone
            onDrop={acceptedFiles => this.handleAddExternalCQL(acceptedFiles)}
            accept=".cql,application/zip,text/plain"
            disabled={isDropzoneDisabled}
            disabledClassName="disabled"
            multiple={false}
            aria-label="External CQL Dropzone"
          >
            {({ getRootProps, getInputProps }) => (
              <section className="container">
                <div {...getRootProps({ className: 'dropzone' })}>
                  <input {...getInputProps()} />

                  {this.renderDropzoneIcon()}

                  {showUploadErrorBanner &&
                    <Alert severity="error" onClose={event => this.dismissBanner(event, 'showUploadErrorBanner')}>
                      Invalid file type.
                    </Alert>
                  }

                  {showLibraryErrorBanner &&
                    <Alert severity="error" onClose={event => this.dismissBanner(event, 'showLibraryErrorBanner')}>
                      {addExternalCqlLibraryErrorMessage || 'An error occurred.'}
                    </Alert>
                  }

                  {showLibraryNotificationBanner &&
                    <Alert
                      severity="info"
                      onClose={event => this.dismissBanner(event, 'showLibraryNotificationBanner')}
                    >
                      {addExternalCqlLibraryErrorMessage}
                    </Alert>
                  }

                  {isDropzoneDisabled &&
                    <Alert severity="warning">Artifact must be saved before uploading libraries.</Alert>
                  }

                  <div className="dropzone__instructions">
                    Drop a valid external CQL library or zip file here, or click to browse.
                  </div>
                </div>
              </section>
            )}
          </Dropzone>

          <div className="external-cql__display">
            {this.renderExternalCqlTable()}
          </div>
        </div>

        {showELMErrorModal &&
          <ELMErrorModal handleCloseModal={this.closeELMErrorModal} errors={externalCqlErrors} />
        }
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
