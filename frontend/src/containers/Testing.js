import React, { Component } from 'react';
import PropTypes from 'prop-types';
import FontAwesome from 'react-fontawesome';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Dropzone from 'react-dropzone';
import { Jumbotron, Breadcrumb } from 'reactstrap';
import _ from 'lodash';

import { loadPatients, addPatient, deletePatient } from '../actions/testing';
import { loadArtifacts, clearArtifactValidationWarnings, executeCQLArtifact } from '../actions/artifacts';
import { loginVSACUser, setVSACAuthStatus } from '../actions/vsac';

import patientProps from '../prop-types/patient';
import artifactProps from '../prop-types/artifact';

import PatientTable from '../components/testing/PatientTable';
import ELMErrorModal from '../components/builder/ELMErrorModal';

class Patient extends Component {
  constructor(props) {
    super(props);

    this.state = {
      showELMErrorModal: false,
      uploadError: false
    };
  }

  componentWillMount() {
    this.props.loadPatients();
    this.props.loadArtifacts();
  }

  componentWillReceiveProps(newProps) {
    this.setState({ showELMErrorModal: newProps.downloadedArtifact.elmErrors.length > 0 });
  }

  addPatient = (patient) => {
    const reader = new FileReader();
    // eslint-disable-next-line func-names
    reader.onload = function (e) {
      const patientData = JSON.parse(e.target.result);
      const patientDataResourceType = _.get(patientData, 'resourceType');
      const patientResource = _.chain(patientData)
        .get('entry')
        .find({ resource: { resourceType: 'Patient' } })
        .get('resource')
        .value();
      const patientResourceFamilyName = _.get(patientResource, 'name[0].family');

      // Check for FHIR DSTU2 Bundle containing FHIR Patient
      if ((patientDataResourceType === 'Bundle') // Check for FHIR Bundle
        && (patientResource) // Check for existence of FHIR Patient
        && (typeof patientResourceFamilyName !== 'string')) { // Check for FHIR DSTU2
          this.props.addPatient(patientData);
          this.setState({ uploadError: false });
      } else {
        this.setState({ uploadError: true });
      }
    }.bind(this);
    try {
      reader.readAsText(patient[0]);
    } catch (error) {
      this.setState({ uploadError: true });
    }
  }

  showELMErrorModal = () => {
    this.setState({ showELMErrorModal: true });
  }

  closeELMErrorModal = () => {
    this.setState({ showELMErrorModal: false });
    this.props.clearArtifactValidationWarnings();
  }

  renderBoolean = (bool) => {
    if (bool) return <FontAwesome name="check" className="boolean-check" />;
    return <FontAwesome name="close" className="boolean-x" />;
  }

  // TODO support results for more than one patient
  renderResultsTable = () => {
    const { results, artifactExecuted, patientExecuted, isExecuting } = this.props;

    if (results) {
      const patientResults = results.patientResults[Object.keys(results.patientResults)[0]];
      const patientResource = _.chain(patientExecuted)
        .get('entry')
        .find({ resource: { resourceType: 'Patient' } })
        .get('resource')
        .value();
      const patientNameGiven = _.get(patientResource, 'name[0].given[0]', 'given_placeholder');
      const patientNameFamily = _.get(patientResource, 'name[0].family[0]', 'family_placeholder');

      return (
        <Jumbotron className="patient-table">
          <div className="patient-table__title">CQL Execution Results</div>

          <div className="patient-table__meta">
            <div className="patient-table__meta-patient">
              <span className="meta-label">Patient:</span> {patientNameGiven} {patientNameFamily}
            </div>

            <div className="patient-table__meta-artifact">
              <span className="meta-label">Artifact:</span> {artifactExecuted.name}
            </div>
          </div>

          <table className="patients__table">
            <tbody>
              <tr>
                <th scope="col" className="patients__tablecell-wide">MeetsInclusionCriteria</th>
                <td>{
                  patientResults.MeetsInclusionCriteria != null
                  ? this.renderBoolean(patientResults.MeetsInclusionCriteria)
                  : 'No Value'}
                </td>
              </tr>
              <tr>
                <th scope="col" className="patients__tablecell-wide">MeetsExclusionCriteria</th>
                <td>{
                  patientResults.MeetsExclusionCriteria != null
                  ? this.renderBoolean(patientResults.MeetsExclusionCriteria)
                  : 'No Value'}
                </td>
              </tr>
              <tr>
                <th scope="col" className="patients__tablecell-wide">Recommendation</th>
                <td>{
                  patientResults.Recommendation != null
                  ? patientResults.Recommendation.toString()
                  : 'No Value'}
                </td>
              </tr>
              <tr>
                <th scope="col" className="patients__tablecell-wide">Rationale</th>
                <td>{
                  patientResults.Rationale != null
                  ? patientResults.Rationale.toString()
                  : 'No Value'}
                </td>
              </tr>
              <tr>
                <th scope="col" className="patients__tablecell-wide">Errors</th>
                <td>{
                  patientResults.Errors != null
                  ? patientResults.Errors.toString()
                  : 'No Value'}
                </td>
              </tr>
            </tbody>
          </table>
        </Jumbotron>
      );
    } else if (isExecuting) {
      return <div className="execution-loading"><FontAwesome name="spinner" spin size="4x" /></div>;
    } else if (this.props.vsacFHIRCredentials.username == null) {
      return <Breadcrumb className="execution-message">Log in to VSAC to execute CQL for a patient below.</Breadcrumb>;
    }

    return <Breadcrumb className="execution-message">
      {this.props.errorMessage
        && <div className="warning">{this.props.errorMessage}</div>}
      Execute CQL for a patient below.
    </Breadcrumb>;
  }

  renderPatientsTable() {
    if (this.props.patients && this.props.patients.length > 0) {
      return (
        <PatientTable
          patients={this.props.patients}
          artifacts={this.props.artifacts}
          deletePatient={this.props.deletePatient}
          executeCQLArtifact={this.props.executeCQLArtifact}
          timeLastAuthenticated={this.props.timeLastAuthenticated}
          vsacFHIRCredentials={this.props.vsacFHIRCredentials}
          loginVSACUser={this.props.loginVSACUser}
          setVSACAuthStatus={this.props.setVSACAuthStatus}
          vsacStatus={this.props.vsacStatus}
          vsacStatusText={this.props.vsacStatusText}
          vsacIsAuthenticating={this.props.vsacIsAuthenticating} />
      );
    }

    return <div>No patients to show.</div>;
  }

  renderDropzoneIcon = () => {
    if (this.props.isAdding) return <FontAwesome name="spinner" size="5x" spin />;
    return <FontAwesome name="cloud-upload" size="5x" />;
  }

  render() {
    return (
      <div className="testing" id="maincontent">
        <Dropzone
          className="patient-dropzone"
          onDrop={this.addPatient.bind(this)}
          accept="application/json" multiple={false}>
          {this.renderDropzoneIcon()}

          {this.state.uploadError
              && <div className="warning">Invalid file type. Only valid FHIR DSTU2 JSON Bundles are accepted.</div>}

          <p>Drop a valid JSON FHIR DSTU2 bundle containing a patient here, or click to browse.</p>
        </Dropzone>

        <div className="testing-wrapper">
          {this.renderResultsTable()}
          {this.renderPatientsTable()}
        </div>

        <ELMErrorModal
          isOpen={this.state.showELMErrorModal}
          closeModal={this.closeELMErrorModal}
          errors={this.props.downloadedArtifact.elmErrors}
          isForTesting={true}/>
      </div>
    );
  }
}

Patient.propTypes = {
  patients: PropTypes.arrayOf(patientProps).isRequired,
  artifacts: PropTypes.arrayOf(artifactProps).isRequired,
  results: PropTypes.object,
  isExecuting: PropTypes.bool.isRequired,
  isAdding: PropTypes.bool.isRequired,
  artifactExecuted: artifactProps,
  patientExecuted: patientProps,
  loadPatients: PropTypes.func.isRequired,
  addPatient: PropTypes.func.isRequired,
  deletePatient: PropTypes.func.isRequired,
  loadArtifacts: PropTypes.func.isRequired,
  executeCQLArtifact: PropTypes.func.isRequired,
  timeLastAuthenticated: PropTypes.instanceOf(Date),
  vsacFHIRCredentials: PropTypes.object,
  loginVSACUser: PropTypes.func.isRequired,
  setVSACAuthStatus: PropTypes.func.isRequired,
  vsacStatus: PropTypes.string,
  vsacStatusText: PropTypes.string,
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
    executeCQLArtifact,
    loginVSACUser,
    setVSACAuthStatus
  }, dispatch);
}

// these props come from the application's state when it is started
function mapStateToProps(state) {
  return {
    patients: state.testing.patients,
    artifacts: state.artifacts.artifacts,
    downloadedArtifact: state.artifacts.downloadArtifact,
    results: state.artifacts.executeArtifact.results,
    errorMessage: state.artifacts.executeArtifact.errorMessage,
    isExecuting: state.artifacts.executeArtifact.isExecuting,
    isAdding: state.testing.addPatient.isAdding,
    artifactExecuted: state.artifacts.executeArtifact.artifactExecuted,
    patientExecuted: state.artifacts.executeArtifact.patientExecuted,
    vsacStatus: state.vsac.authStatus,
    vsacStatusText: state.vsac.authStatusText,
    vsacIsAuthenticating: state.vsac.isAuthenticating,
    timeLastAuthenticated: state.vsac.timeLastAuthenticated,
    vsacFHIRCredentials: { username: state.vsac.username, password: state.vsac.password }
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Patient);
