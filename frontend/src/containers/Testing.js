import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Dropzone from 'react-dropzone';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner, faCloudUploadAlt } from '@fortawesome/free-solid-svg-icons';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Jumbotron, Breadcrumb } from 'reactstrap';
import _ from 'lodash';

import { loadPatients, addPatient, deletePatient } from 'actions/testing';
import {
  loadArtifacts,
  clearArtifactValidationWarnings,
  clearExecutionResults,
  executeCQLArtifact
} from 'actions/artifacts';

import patientProps from 'prop-types/patient';
import artifactProps from 'prop-types/artifact';

import { ELMErrorModal, PatientVersionModal } from 'components/modals';
import PatientTable from 'components/testing/PatientTable';
import ResultsDataSection from 'components/testing/ResultsDataSection';

class Testing extends Component {
  constructor(props) {
    super(props);

    this.state = {
      showPatientVersionModal: false,
      patientData: null,
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
      try {
        this.setState({ patientData: JSON.parse(e.target.result) });
        const patientDataResourceType = _.get(this.state.patientData, 'resourceType');
        const patientResource = _.chain(this.state.patientData)
          .get('entry')
          .find({ resource: { resourceType: 'Patient' } })
          .get('resource')
          .value();

        // Check for FHIR Bundle containing FHIR Patient
        if ((patientDataResourceType === 'Bundle') && (patientResource)) { // Check for FHIR Patient in Bundle
          this.setState({ showPatientVersionModal: true });
        } else { // No patient could be found
          this.setState({ uploadError: true });
        }
      } catch (error) {
        this.setState({ uploadError: true });
      }
    };

    try {
      reader.readAsText(patient[0]);
    } catch (error) {
      this.setState({ uploadError: true });
    }
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

  selectVersion = patientVersion => {
    this.props.addPatient(this.state.patientData, patientVersion);
    this.closePatientVersionModal();
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
    } else if (!Boolean(this.props.vsacApiKey)) {
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
          artifacts={this.props.artifacts}
          deletePatient={this.props.deletePatient}
          executeCQLArtifact={this.props.executeCQLArtifact}
          patients={this.props.patients}
          vsacApiKey={this.props.vsacApiKey}
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
    const { downloadedArtifact } = this.props;
    const { showELMErrorModal, showPatientVersionModal, uploadError } = this.state;

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

                  {uploadError &&
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

          {showELMErrorModal &&
            <ELMErrorModal handleCloseModal={this.closeELMErrorModal} errors={downloadedArtifact.elmErrors} />
          }

          {showPatientVersionModal &&
            <PatientVersionModal
              handleCloseModal={this.closePatientVersionModal}
              selectVersion={this.selectVersion}
            />
          }
        </div>
      </div>
    );
  }
}

Testing.propTypes = {
  addPatient: PropTypes.func.isRequired,
  artifactExecuted: artifactProps,
  artifacts: PropTypes.arrayOf(artifactProps).isRequired,
  deletePatient: PropTypes.func.isRequired,
  executeCQLArtifact: PropTypes.func.isRequired,
  executeStatus: PropTypes.string,
  isAdding: PropTypes.bool.isRequired,
  isExecuting: PropTypes.bool.isRequired,
  loadArtifacts: PropTypes.func.isRequired,
  loadPatients: PropTypes.func.isRequired,
  patients: PropTypes.arrayOf(patientProps).isRequired,
  patientsExecuted: PropTypes.arrayOf(patientProps),
  results: PropTypes.object,
  vsacApiKey: PropTypes.string
};

// these props are used for dispatching actions
function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    addPatient,
    clearArtifactValidationWarnings,
    clearExecutionResults,
    deletePatient,
    executeCQLArtifact,
    loadArtifacts,
    loadPatients
  }, dispatch);
}

// these props come from the application's state when it is started
function mapStateToProps(state) {
  return {
    artifactExecuted: state.artifacts.executeArtifact.artifactExecuted,
    artifacts: state.artifacts.artifacts,
    downloadedArtifact: state.artifacts.downloadArtifact,
    errorMessage: state.artifacts.executeArtifact.errorMessage,
    executeStatus: state.artifacts.executeArtifact.executeStatus,
    isAdding: state.testing.addPatient.isAdding,
    isExecuting: state.artifacts.executeArtifact.isExecuting,
    patients: state.testing.patients,
    patientsExecuted: state.artifacts.executeArtifact.patientsExecuted,
    results: state.artifacts.executeArtifact.results,
    vsacApiKey: state.vsac.apiKey
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Testing);
