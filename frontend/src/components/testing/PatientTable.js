import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckSquare, faSquare, faEye, faCheck, faTimes } from '@fortawesome/free-solid-svg-icons';
import { UncontrolledTooltip } from 'reactstrap';
import _ from 'lodash';

import renderDate from '../../utils/dates';
import { sortAlphabeticallyByPatientName } from '../../utils/sort';
import patientProps from '../../prop-types/patient';
import artifactProps from '../../prop-types/artifact';

import { Dropdown, Modal } from 'components/elements';
import VSACAuthenticationModal from '../builder/VSACAuthenticationModal';
import CodeService from '../../utils/code_service/CodeService';
import PatientView from './PatientView';
import TestingParameters from './TestingParameters';

export default class PatientTable extends Component {
  constructor(props) {
    super(props);

    this.state = {
      patientToDelete: null,
      showConfirmDeleteModal: false,
      patientToView: null,
      showViewDetailsModal: false,
      patientsToExecute: [],
      artifactToExecute: null,
      paramsToExecute: [],
      showExecuteCQLModal: false,
      testReport: null,
      codeService: new CodeService()
    };
  }

  // ----------------------- CONFIRM DELETE MODAL -------------------------- //

  openConfirmDeleteModal = (patient) => {
    this.setState({ showConfirmDeleteModal: true, patientToDelete: patient });
  }

  closeConfirmDeleteModal = () => {
    this.setState({ showConfirmDeleteModal: false, patientToDelete: null });
  }

  handleDeletePatient = () => {
    this.props.deletePatient(this.state.patientToDelete);
    this.closeConfirmDeleteModal();
  }

  // ----------------------- VIEW DETAILS MODAL -------------------------- //

  openViewDetailsModal = (patient) => {
    this.setState({ showViewDetailsModal: true, patientToView: patient });
  }

  closeViewDetailsModal = () => {
    this.setState({ showViewDetailsModal: false, patientToView: null });
  }

  handleViewDetails = () => {
    this.closeViewDetailsModal();
  }

  // ----------------------- EXECUTE CQL MODALS -------------------------- //

  openExecuteCQLModal = () => {
    this.setState({ showExecuteCQLModal: true });
  }

  closeExecuteCQLModal = () => {
    this.setState({
      showExecuteCQLModal: false,
      artifactToExecute: null,
      paramsToExecute: []
    });
  }

  selectArtifactForCQLModal = (event, validArtifactsToExecute) => {
    const artifactValue = validArtifactsToExecute.find(artifact => artifact.name === event.target.value);
    const artifact = { label: event.target.value, value: artifactValue };

    if (!artifact) {
      this.setState({ artifactToExecute: null, paramsToExecute: [] });
    } else {
      let params = [];
      if (artifact.value && artifact.value.parameters) {
        params = artifact.value.parameters.map(p => ({
          name: p.name,
          type: p.type,
          value: _.clone(p.value)
        }));
      }
      this.setState({ artifactToExecute: artifact, paramsToExecute: params });
    }
  }

  handleExecuteCQL = () => {
    this.executeCQL(this.state.artifactToExecute.value, this.state.paramsToExecute, this.state.patientsToExecute);
    this.closeExecuteCQLModal();
  }

  // ----------------------- HANDLE PATIENTS ---------------------------- //

  updatePatientsToExecute = (patient) => {
    const patientsClone = [...this.state.patientsToExecute];
    const patientIndex = patientsClone.findIndex(p => p._id === patient._id);

    if (patientIndex !== -1) {
      patientsClone.splice(patientIndex, 1);
    } else {
      patientsClone.push(patient);
    }

    this.setState({ patientsToExecute: patientsClone });
  }

  // ----------------------- HANDLE PARAMETERS -------------------------- //

  updateParameters = (params) => {
    this.setState({ paramsToExecute: params });
  }

  // ----------------------- PERFORM CQL EXECUTION -------------------------- //

  executeCQL = (artifact, params, patients) => {
    const dataModel = { name: 'FHIR', version: '' };
    if (patients[0].fhirVersion === 'DSTU2') {
      dataModel.version = '1.0.2';
    } else if (patients[0].fhirVersion === 'STU3') {
      dataModel.version = '3.0.0';
    } else {
      dataModel.version = '4.0.0';
    }

    const patientsInfo = patients
      .map(patient => patient.patient);

    this.props.executeCQLArtifact(
      artifact,
      params,
      patientsInfo,
      this.props.vsacApiKey,
      this.state.codeService,
      dataModel
    );
  }

  // ----------------------- RENDER ---------------------------------------- //

  renderConfirmDeleteModal = () => (
    <Modal
      title="Delete Patient Confirmation"
      submitButtonText="Delete"
      hasCancelButton
      handleShowModal={this.state.showConfirmDeleteModal}
      handleCloseModal={this.closeConfirmDeleteModal}
      handleSaveModal={this.handleDeletePatient}
    >
      <div className="delete-patient-confirmation-modal modal__content">
        <h5>Are you sure you want to permanently delete the following Patient?</h5>

        <div className="patient-info">
          <span>Name: </span>
          <span>
            {_.chain(this.state.patientToDelete)
                .get('patient.entry')
                .find({ resource: { resourceType: 'Patient' } })
                .get('resource.name[0].given[0]')
                .value() || 'given_placeholder'}
            {' '}
            {_.chain(this.state.patientToDelete)
              .get('patient.entry')
              .find({ resource: { resourceType: 'Patient' } })
              .get('resource.name[0].family')
              .value() || 'family_placeholder'}
          </span>
        </div>
      </div>
    </Modal>
  );

  renderViewDetailsModal = () => (
    <Modal
      title="View Patient Details"
      handleShowModal={this.state.showViewDetailsModal}
      handleCloseModal={this.closeViewDetailsModal}
      handleSaveModal={this.handleViewDetails}
      submitButtonText="Close"
    >
      <div className="patient-table__modal modal__content">
        <div className="patient-info">
          <PatientView patient={this.state.patientToView} />
        </div>
      </div>
    </Modal>
  );

  renderExecuteCQLModal() {
    const { artifactToExecute } = this.state;
    const fhirVersionMap = { '1.0.2': 'DSTU2', '3.0.0': 'STU3', '4.0.0': 'R4' };
    const validArtifactsToExecute = this.props.artifacts.filter((a) => {
      const noFHIRVersion = a.fhirVersion === '';
      const sameFHIRVersion =
        fhirVersionMap[a.fhirVersion] === _.get(this.state, 'patientsToExecute[0].fhirVersion', '');
      return noFHIRVersion || sameFHIRVersion;
    });
    const artifactOptions = _.map(validArtifactsToExecute, a => ({ value: a.name, label: a.name }));

    return (
      <Modal
        title="Execute CQL on Selected Patients"
        submitButtonText="Execute CQL"
        submitDisabled={this.state.artifactToExecute == null}
        handleShowModal={this.state.showExecuteCQLModal}
        handleCloseModal={this.closeExecuteCQLModal}
        handleSaveModal={this.handleExecuteCQL}
      >
        <div className="patient-table__modal modal__content">
          <div className="select-label">FHIR Compatible Artifacts:</div>

          <Dropdown
            id="select-artifact"
            label={artifactToExecute ? null : 'Select...'}
            onChange={event => this.selectArtifactForCQLModal(event, validArtifactsToExecute)}
            options={artifactOptions}
            value={artifactToExecute ? artifactToExecute.label : ''}
          />

          <TestingParameters
            parameters={this.state.paramsToExecute}
            updateParameters={this.updateParameters}
            vsacApiKey={this.props.vsacApiKey}
            loginVSACUser={this.props.loginVSACUser}
            setVSACAuthStatus={this.props.setVSACAuthStatus}
            vsacStatus={this.props.vsacStatus}
            vsacStatusText={this.props.vsacStatusText}
            isValidatingCode={this.props.isValidatingCode}
            isValidCode={this.props.isValidCode}
            codeData={this.props.codeData}
            validateCode={this.props.validateCode}
            resetCodeValidation={this.props.resetCodeValidation}
          />
        </div>
      </Modal>
    );
  }

  renderTableRow = (patient) => {
    const { patientsToExecute } = this.state;
    const patientSelected = patientsToExecute.some(p => p._id === patient._id);
    const differentFHIRVersion = patientsToExecute.length > 0
      && patientsToExecute[0].fhirVersion !== patient.fhirVersion;

    return (
      <tr key={patient._id}>
        <td className="patients__tablecell-tiny" data-th="Check Box">
          <button aria-label="View"
            id={`SelectPatientTooltip-${patient._id}`}
            className={classnames('button invisible-button', differentFHIRVersion && 'disabled')}
            onClick={() => { if (!differentFHIRVersion) this.updatePatientsToExecute(patient); }}
          >
            <FontAwesomeIcon
              icon={patientSelected ? faCheckSquare : faSquare}
              className={classnames('select-patient-checkbox', patientSelected && 'checked')}
            />
          </button>
        </td>

        {differentFHIRVersion &&
          <UncontrolledTooltip target={`SelectPatientTooltip-${patient._id}`} placement="top">
            To select this patient, first deselect all patients of other FHIR versions.
          </UncontrolledTooltip>
        }

        <td className="patients__tablecell-wide" data-th="Name">
          <div>
            {_.chain(patient)
                .get('patient.entry')
                .find({ resource: { resourceType: 'Patient' } })
                .get('resource.name[0].given[0]')
                .value() || 'given_placeholder'}
            {' '}
            {_.chain(patient)
              .get('patient.entry')
              .find({ resource: { resourceType: 'Patient' } })
              .get('resource.name[0].family')
              .value() || 'family_placeholder'}
          </div>
        </td>

        <td className="patients__tablecell-wide" data-th="Birth Date">
          <div>
            {_.chain(patient)
                .get('patient.entry')
                .find({ resource: { resourceType: 'Patient' } })
                .get('resource.birthDate')
                .value() || 'birthdate_placeholder'}
          </div>
        </td>

        <td className="patients__tablecell-short" data-th="Gender">
          <div>
            {_.chain(patient)
                .get('patient.entry')
                .find({ resource: { resourceType: 'Patient' } })
                .get('resource.gender')
                .value() || 'gender_placeholder'}
          </div>
        </td>

        <td className="patients__tablecell-short" data-th="FHIR Version">
          <div>
            {_.get(patient, 'fhirVersion', 'version_placeholder')}
          </div>
        </td>

        <td className="patients__tablecell-wide" data-th="Updated">
          {renderDate(patient.updatedAt)}
        </td>

        <td data-th="">
          <button aria-label="View"
            className="button primary-button details-button"
            onClick={() => this.openViewDetailsModal(patient)}
          >
            <FontAwesomeIcon icon={faEye} /> View
          </button>

          <button
            id={`DeletePatientTooltip-${patient._id}`}
            className={classnames('button danger-button', patientSelected && 'disabled')}
            onClick={() => { if (!patientSelected) this.openConfirmDeleteModal(patient); }}
            aria-label="Delete"
          >
            <FontAwesomeIcon icon={faTimes} /> Delete
          </button>

          {patientSelected &&
            <UncontrolledTooltip target={`DeletePatientTooltip-${patient._id}`} placement="top">
              To delete this patient, first deselect it.
            </UncontrolledTooltip>
          }
        </td>
      </tr>
    );
  }

  renderVSACLogin = () => {
    // If last time authenticated was less than 7.5 hours ago, force user to log in again.
    if (!this.props.vsacApiKey) {
      return (
        <div className="vsac-authenticate">
          <VSACAuthenticationModal
            loginVSACUser={this.props.loginVSACUser}
            setVSACAuthStatus={this.props.setVSACAuthStatus}
            vsacStatus={this.props.vsacStatus}
            vsacStatusText={this.props.vsacStatusText}
            vsacIsAuthenticating={this.props.vsacIsAuthenticating} />
        </div>
      );
    }

    return (
      <div className="vsac-authenticate">
        <button className="disabled-button" disabled={true} aria-label="VSAC Authenticated">
          <FontAwesomeIcon icon={faCheck} /> VSAC Authenticated
        </button>
      </div>
    );
  }

  render() {
    const patients = this.props.patients;
    const loggedIn = Boolean(this.props.vsacApiKey);

    return (
      <div className="patient-table">
        <div className="patient-table__buttons">
          {this.renderVSACLogin()}

          <button aria-label="Execute CQL on Selected Patients"
            disabled={
              !this.props.vsacApiKey || this.state.patientsToExecute.length === 0
            }
            className={classnames('button primary-button execute-button', !loggedIn && 'disabled-button')}
            onClick={() => this.openExecuteCQLModal()}
          >
            Execute CQL on Selected Patients
          </button>
        </div>

        <table className="patients__table">
          <thead>
            <tr>
              <th scope="col" className="patients__tablecell-tiny"></th>
              <th scope="col" className="patients__tablecell-wide">Name</th>
              <th scope="col" className="patients__tablecell-wide">Birth Date</th>
              <th scope="col" className="patients__tablecell-short">Gender</th>
              <th scope="col" className="patients__tablecell-short">Version</th>
              <th scope="col" className="patients__tablecell-wide">Last Updated</th>
              <th aria-label="buttons"></th>
            </tr>
          </thead>

          <tbody>
            {patients.sort(sortAlphabeticallyByPatientName).map(this.renderTableRow)}
          </tbody>
        </table>

        {this.renderConfirmDeleteModal()}
        {this.renderViewDetailsModal()}
        {this.renderExecuteCQLModal()}
      </div>
    );
  }
}

PatientTable.propTypes = {
  patients: PropTypes.arrayOf(patientProps).isRequired,
  artifacts: PropTypes.arrayOf(artifactProps).isRequired,
  deletePatient: PropTypes.func.isRequired,
  executeCQLArtifact: PropTypes.func.isRequired,
  vsacApiKey: PropTypes.string,
  loginVSACUser: PropTypes.func.isRequired,
  setVSACAuthStatus: PropTypes.func.isRequired,
  vsacStatus: PropTypes.string,
  vsacStatusText: PropTypes.string,
  isValidatingCode: PropTypes.bool.isRequired,
  isValidCode: PropTypes.bool,
  codeData: PropTypes.object,
  validateCode: PropTypes.func.isRequired,
  resetCodeValidation: PropTypes.func.isRequired,
  vsacIsAuthenticating: PropTypes.bool.isRequired
};
