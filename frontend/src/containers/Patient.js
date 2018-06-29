import React, { Component } from 'react';
import PropTypes from 'prop-types';
import FontAwesome from 'react-fontawesome';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Dropzone from 'react-dropzone';

import { loadPatients, addPatient, deletePatient } from '../actions/patients';
import { loadArtifacts, executeCQLArtifact } from '../actions/artifacts';
import { loginVSACUser, setVSACAuthStatus } from '../actions/vsac';

import patientProps from '../prop-types/patient';
import artifactProps from '../prop-types/artifact';

import PatientTable from '../components/patient/PatientTable';
import VSACAuthenticationModal from '../components/builder/VSACAuthenticationModal';

class Patient extends Component {
  componentWillMount() {
    this.props.loadPatients();
    this.props.loadArtifacts();
  }

  addPatient = (patient) => {
    const reader = new FileReader();
    // eslint-disable-next-line func-names
    reader.onload = function (e) {
      this.props.addPatient(JSON.parse(e.target.result));
    }.bind(this);
    reader.readAsText(patient[0]);
  }

  // TODO support results for more than one patient
  renderResultsTable() {
    const results = this.props.results;
    if (results) {
      const patientResults = results.patientResults[Object.keys(results.patientResults)[0]];
      return (
        <div className="patient-table">
          <table className="patients__table">
            <tbody>
              <tr>
                <th scope="col" className="patients__tablecell-wide">MeetsInclusionCriteria</th>
                <td>{
                  patientResults.MeetsInclusionCriteria != null
                  ? patientResults.MeetsInclusionCriteria.toString()
                  : 'No Value'}
                </td>
              </tr>
              <tr>
                <th scope="col" className="patients__tablecell-wide">MeetsExclusionCriteria</th>
                <td>{
                  patientResults.MeetsExclusionCriteria != null
                  ? patientResults.MeetsExclusionCriteria.toString()
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
        </div>
      );
    }

    return <div>No results to show.</div>;
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
          vsacStatusText={this.props.vsacStatusText} />
      );
    }

    return <div>No patients to show.</div>;
  }

  renderVSACLogin = () => {
    // If last time authenticated was less than 7.5 hours ago, force user to log in again.
    if (this.props.timeLastAuthenticated < new Date() - 27000000 || this.props.vsacFHIRCredentials.username == null) {
      return (
        <div className="vsac-authenticate">
          <VSACAuthenticationModal
            loginVSACUser={this.props.loginVSACUser}
            setVSACAuthStatus={this.props.setVSACAuthStatus}
            vsacStatus={this.props.vsacStatus}
            vsacStatusText={this.props.vsacStatusText}
          />
        </div>
      );
    }

    return (
      <div className="vsac-authenticate">
        <button className="disabled-button" disabled={true}>
          <FontAwesome name="check" /> VSAC Authenticated
        </button>
      </div>
    );
  }

  render() {
    return (
      <div className="patient" id="maincontent">
        <Dropzone
          className="patient-dropzone"
          onDrop={this.addPatient.bind(this)}
          accept="application/json" multiple={false}
          >
          <FontAwesome name='cloud-upload' size="5x"/>
          <p>Drop a valid JSON FHIR DSTU2 bundle containing a patient here, or click to browse.</p>
        </Dropzone>
        <div className="patient-wrapper">
          {this.renderVSACLogin()}
          {this.renderResultsTable()}
          {this.renderPatientsTable()}
        </div>
      </div>
    );
  }
}

Patient.propTypes = {
  patients: PropTypes.arrayOf(patientProps).isRequired,
  artifacts: PropTypes.arrayOf(artifactProps).isRequired,
  results: PropTypes.object,
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
  vsacStatusText: PropTypes.string
};

// these props are used for dispatching actions
function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    loadPatients,
    addPatient,
    deletePatient,
    loadArtifacts,
    executeCQLArtifact,
    loginVSACUser,
    setVSACAuthStatus
  }, dispatch);
}

// these props come from the application's state when it is started
function mapStateToProps(state) {
  return {
    patients: state.patients.patients,
    artifacts: state.artifacts.artifacts,
    results: state.artifacts.executeArtifact.results,
    vsacStatus: state.vsac.authStatus,
    vsacStatusText: state.vsac.authStatusText,
    timeLastAuthenticated: state.vsac.timeLastAuthenticated,
    vsacFHIRCredentials: { username: state.vsac.username, password: state.vsac.password }
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Patient);
