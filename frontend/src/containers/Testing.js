import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Dropzone from 'react-dropzone';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner, faCloudUploadAlt } from '@fortawesome/free-solid-svg-icons';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Jumbotron, Breadcrumb } from 'reactstrap';
import _ from 'lodash';

import { loadPatients, addPatient, deletePatient } from '../actions/testing';
import {
  loadArtifacts,
  clearArtifactValidationWarnings,
  clearExecutionResults,
  executeCQLArtifact
} from '../actions/artifacts';
import { loginVSACUser, setVSACAuthStatus, validateCode, resetCodeValidation } from '../actions/vsac';

import patientProps from '../prop-types/patient';
import artifactProps from '../prop-types/artifact';

import PatientTable from '../components/testing/PatientTable';
import PatientVersionModal from '../components/testing/PatientVersionModal';
import ResultsDataSection from '../components/testing/ResultsDataSection';
import ELMErrorModal from '../components/builder/ELMErrorModal';

class Testing extends Component {
  constructor(props) {
    super(props);

    this.state = {
      showPatientVersionModal: false,
      patientData: null,
      patientVersion: null,
      showELMErrorModal: false,
      uploadError: false
    };
  }

  UNSAFE_componentWillMount() { // eslint-disable-line camelcase
    this.props.loadPatients();
    this.props.loadArtifacts();
  }

  UNSAFE_componentWillReceiveProps(newProps) { // eslint-disable-line camelcase
    this.setState({
      showELMErrorModal: (newProps.executeStatus != null) && (newProps.downloadedArtifact.elmErrors.length > 0)
    });
  }

  addPatient = (patient) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      this.setState({ patientData: JSON.parse(e.target.result) });
      const patientDataResourceType = _.get(this.state.patientData, 'resourceType');
      const patientResource = _.chain(this.state.patientData)
        .get('entry')
        .find({ resource: { resourceType: 'Patient' } })
        .get('resource')
        .value();

      // Check for FHIR Bundle containing FHIR Patient
      if ((patientDataResourceType === 'Bundle') && (patientResource)) { // Check for FHIR Patient in Bundle
        this.showPatientVersionModal();
      } else { // No patient could be found
        this.setState({ uploadError: true });
      }
    };

    try {
      reader.readAsText(patient[0]);
    } catch (error) {
      this.setState({ uploadError: true });
    }
  }

  showPatientVersionModal = () => {
    this.setState({ showPatientVersionModal: true });
  }

  closePatientVersionModal = () => {
    this.setState({ showPatientVersionModal: false });
  }

  showELMErrorModal = () => {
    this.setState({ showELMErrorModal: true });
  }

  closeELMErrorModal = () => {
    this.setState({ showELMErrorModal: false });
    this.props.clearExecutionResults();
    this.props.clearArtifactValidationWarnings();
  }

  selectVersion = (patientData, patientVersion) => {
    Promise.resolve(this.setState({ patientVersion: patientVersion }))
      .then(() => {
        this.props.addPatient(patientData, this.state.patientVersion);
        this.closePatientVersionModal();
      });
  }

  renderResults = () => {
    const { results, artifactExecuted, patientsExecuted, isExecuting } = this.props;

    if (results) {
      const resultsArray = Object.values(results.patientResults);
      const resultsCount = resultsArray.length;
      const resultsIncludedCount = resultsArray.filter(r => r.MeetsInclusionCriteria).length;
      const resultsExcludedCount = resultsArray.filter(r => r.MeetsExclusionCriteria).length;

      return (
        <Jumbotron className="patient-table">
          <div className="patient-table__title">CQL Execution Results</div>

          <div className="patient-table__meta">
            <div className="meta-label">Artifact:</div>
            <div>{artifactExecuted.name}</div>
          </div>

          <div className="patient-table__meta">
            <div className="meta-label">Meets Inclusion Criteria:</div>
            <div>{resultsIncludedCount} of {resultsCount} patients</div>
          </div>

          <div className="patient-table__meta">
            <div className="meta-label">Meets Exclusion Criteria:</div>
            <div>{resultsExcludedCount} of {resultsCount} patients</div>
          </div>

          <div className="patients__table">
            {patientsExecuted.map(p => this.renderResultsDataSection(p))}
          </div>
        </Jumbotron>
      );
    } else if (isExecuting) {
      return <div className="execution-loading"><FontAwesomeIcon icon={faSpinner} spin size="4x" /></div>;
    } else if (!this.props.vsacApiKey) {
      return (
        <Breadcrumb className="execution-message">
          Log in to VSAC to execute CQL.
        </Breadcrumb>
      );
    }

    return (
      <Breadcrumb className="execution-message">
        {this.props.errorMessage && <div className="warning">{this.props.errorMessage}</div>}
        <div>Select one or more patients below and execute CQL.</div>
      </Breadcrumb>
    );
  }

  renderResultsDataSection = (patientExecuted) => {
    const { results } = this.props;
    const patientResource = _.chain(patientExecuted)
      .get('entry')
      .find({ resource: { resourceType: 'Patient' } })
      .get('resource')
      .value();
    const patientId = patientResource.id;
    const patientNameGiven = _.get(patientResource, 'name[0].given[0]', 'given_placeholder');
    const patientNameFamily = _.get(patientResource, 'name[0].family', 'family_placeholder');
    const patientResults = results.patientResults[patientId];

    return (
      <ResultsDataSection
        key={patientId}
        title={`${patientNameGiven} ${patientNameFamily}`}
        results={patientResults}
      />
    );
  }

  renderPatientsTable() {
    if (this.props.patients && this.props.patients.length > 0) {
      return (
        <PatientTable
          patients={this.props.patients}
          artifacts={this.props.artifacts}
          deletePatient={this.props.deletePatient}
          executeCQLArtifact={this.props.executeCQLArtifact}
          vsacApiKey={this.props.vsacApiKey}
          loginVSACUser={this.props.loginVSACUser}
          setVSACAuthStatus={this.props.setVSACAuthStatus}
          vsacStatus={this.props.vsacStatus}
          vsacStatusText={this.props.vsacStatusText}
          vsacIsAuthenticating={this.props.vsacIsAuthenticating}
          isValidatingCode={this.props.isValidatingCode}
          isValidCode={this.props.isValidCode}
          codeData={this.props.codeData}
          validateCode={this.props.validateCode}
          resetCodeValidation={this.props.resetCodeValidation}
        />
      );
    }

    return <div>No patients to show.</div>;
  }

  renderDropzoneIcon = () => {
    if (this.props.isAdding) return <FontAwesomeIcon icon={faSpinner} size="5x" spin />;
    return <FontAwesomeIcon icon={faCloudUploadAlt} size="5x" />;
  }

  render() {
    return (
      <div className="testing" id="maincontent">
        <div className="testing-wrapper">
          <Dropzone
            onDrop={acceptedFiles => this.addPatient(acceptedFiles)}
            accept="application/json"
            multiple={false}
            aria-label="Testing Patient Dropzone"
          >
            {({ getRootProps, getInputProps }) => (
              <section className="container">
                <div {...getRootProps({ className: 'dropzone' })}>
                  <input {...getInputProps()} />

                  {this.renderDropzoneIcon()}

                  {this.state.uploadError &&
                    <div className="warning">
                      Invalid file type. Only valid JSON FHIR<sup>®</sup> Bundles are accepted.
                    </div>
                  }

                  <p className="dropzone__instructions">
                    Drop a valid JSON FHIR<sup>®</sup> bundle containing a synthetic patient here, or click to browse.
                  </p>

                  <p className="dropzone__warning">
                    Do not upload any Personally Identifiable Information (PII) or Protected Health Information (PHI).
                    Upload synthetic data only.
                  </p>
                </div>
              </section>
            )}
          </Dropzone>

          <div className="testing-wrapper">
            {this.renderResults()}
            {this.renderPatientsTable()}
          </div>

          <ELMErrorModal
            isOpen={this.state.showELMErrorModal}
            closeModal={this.closeELMErrorModal}
            errors={this.props.downloadedArtifact.elmErrors}
          />

          <PatientVersionModal
            isOpen={this.state.showPatientVersionModal}
            closeModal={this.closePatientVersionModal}
            patientData={this.state.patientData}
            selectVersion={this.selectVersion}
          />
        </div>
      </div>
    );
  }
}

Testing.propTypes = {
  patients: PropTypes.arrayOf(patientProps).isRequired,
  artifacts: PropTypes.arrayOf(artifactProps).isRequired,
  results: PropTypes.object,
  executeStatus: PropTypes.string,
  isExecuting: PropTypes.bool.isRequired,
  isAdding: PropTypes.bool.isRequired,
  artifactExecuted: artifactProps,
  patientsExecuted: PropTypes.arrayOf(patientProps),
  loadPatients: PropTypes.func.isRequired,
  addPatient: PropTypes.func.isRequired,
  deletePatient: PropTypes.func.isRequired,
  loadArtifacts: PropTypes.func.isRequired,
  executeCQLArtifact: PropTypes.func.isRequired,
  vsacApiKey: PropTypes.string,
  loginVSACUser: PropTypes.func.isRequired,
  setVSACAuthStatus: PropTypes.func.isRequired,
  vsacStatus: PropTypes.string,
  vsacStatusText: PropTypes.string,
  validateCode: PropTypes.func.isRequired,
  resetCodeValidation: PropTypes.func.isRequired,
  isValidatingCode: PropTypes.bool.isRequired,
  isValidCode: PropTypes.bool,
  codeData: PropTypes.object,
  vsacIsAuthenticating: PropTypes.bool.isRequired
};

// these props are used for dispatching actions
function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    loadPatients,
    addPatient,
    deletePatient,
    loadArtifacts,
    clearArtifactValidationWarnings,
    clearExecutionResults,
    executeCQLArtifact,
    loginVSACUser,
    setVSACAuthStatus,
    validateCode,
    resetCodeValidation
  }, dispatch);
}

// these props come from the application's state when it is started
function mapStateToProps(state) {
  return {
    patients: state.testing.patients,
    artifacts: state.artifacts.artifacts,
    downloadedArtifact: state.artifacts.downloadArtifact,
    results: state.artifacts.executeArtifact.results,
    executeStatus: state.artifacts.executeArtifact.executeStatus,
    errorMessage: state.artifacts.executeArtifact.errorMessage,
    isExecuting: state.artifacts.executeArtifact.isExecuting,
    isAdding: state.testing.addPatient.isAdding,
    artifactExecuted: state.artifacts.executeArtifact.artifactExecuted,
    patientsExecuted: state.artifacts.executeArtifact.patientsExecuted,
    vsacStatus: state.vsac.authStatus,
    vsacStatusText: state.vsac.authStatusText,
    vsacIsAuthenticating: state.vsac.isAuthenticating,
    vsacApiKey: state.vsac.apiKey,
    isValidatingCode: state.vsac.isValidatingCode,
    isValidCode: state.vsac.isValidCode,
    codeData: state.vsac.codeData,
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Testing);
