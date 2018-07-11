import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Select from 'react-select';
import FontAwesome from 'react-fontawesome';
import Inspector from 'react-inspector';
import _ from 'lodash';

import renderDate from '../../utils/dates';
import { sortMostRecent } from '../../utils/sort';
import patientProps from '../../prop-types/patient';
import artifactProps from '../../prop-types/artifact';

import Modal from '../elements/Modal';
import VSACAuthenticationModal from '../builder/VSACAuthenticationModal';

export default class PatientTable extends Component {
  constructor(props) {
    super(props);

    this.state = {
      patientToDelete: null,
      showConfirmDeleteModal: false,
      patientToView: null,
      showViewDetailsModal: false,
      patientToExecute: null,
      artifactToExecute: null,
      showExecuteCQLModal: false,
      testReport: null
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

  // ----------------------- EXECUTE CQL MODAL -------------------------- //

  openExecuteCQLModal = (patient) => {
    this.setState({ showExecuteCQLModal: true, patientToExecute: patient });
  }

  closeExecuteCQLModal = () => {
    this.setState({ showExecuteCQLModal: false, patientToExecute: null, artifactToExecute: null });
  }

  selectArtifactForCQLModal = (artifact) => {
    this.setState({ artifactToExecute: artifact });
  }

  handleExecuteCQL = () => {
    this.executeCQL(this.state.artifactToExecute.value, this.state.patientToExecute);
    this.closeExecuteCQLModal();
  }

  // ----------------------- PERFORM CQL EXECUTION -------------------------- //

  executeCQL = (artifact, patient) => {
    this.props.executeCQLArtifact(artifact, patient.patient, this.props.vsacFHIRCredentials);
  }

  // ----------------------- RENDER ---------------------------------------- //

  renderConfirmDeleteModal() {
    return (
      <Modal
        modalTitle="Delete Patient Confirmation"
        modalId="confirm-delete-modal"
        modalTheme="light"
        modalSubmitButtonText="Delete"
        handleShowModal={this.state.showConfirmDeleteModal}
        handleCloseModal={this.closeConfirmDeleteModal}
        handleSaveModal={this.handleDeletePatient}>

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
                .get('resource.name[0].family[0]')
                .value() || 'family_placeholder'}
            </span>
          </div>
        </div>
      </Modal>
    );
  }

  renderViewDetailsModal() {
    return (
      <Modal
        modalTitle="View Patient Details"
        modalId="view-details-modal"
        modalTheme="light"
        handleShowModal={this.state.showViewDetailsModal}
        handleCloseModal={this.closeViewDetailsModal}
        handleSaveModal={this.handleViewDetails}>

        <div className="patient-table__modal modal__content">
          <h5>Viewing Patient:</h5>

          <div className="patient-info">
            <Inspector data={this.state.patientToView}/>
          </div>
        </div>
      </Modal>
    );
  }

  renderExecuteCQLModal() {
    const artifactOptions = _.map(this.props.artifacts, a => ({ value: a, label: a.name }));

    return (
      <Modal
        modalTitle="Execute CQL"
        modalId="execute-cql-modal"
        modalTheme="light"
        modalSubmitButtonText="Execute CQL"
        handleShowModal={this.state.showExecuteCQLModal}
        handleCloseModal={this.closeExecuteCQLModal}
        handleSaveModal={this.handleExecuteCQL}>

        <div className="patient-table__modal modal__content">
          <h5>Executing on Patient:</h5>

          <div className="patient-info">
            <span>Name: </span>
            <span>
              {_.chain(this.state.patientToExecute)
                  .get('patient.entry')
                  .find({ resource: { resourceType: 'Patient' } })
                  .get('resource.name[0].given[0]')
                  .value() || 'given_placeholder'}
              {' '}
              {_.chain(this.state.patientToExecute)
                .get('patient.entry')
                .find({ resource: { resourceType: 'Patient' } })
                .get('resource.name[0].family[0]')
                .value() || 'family_placeholder'}
            </span>
          </div>

          <br/>

          <Select
            aria-label={'Select Artifact'}
            inputProps={{ title: 'Select Artifact' }}
            clearable={false}
            options={artifactOptions}
            value={this.state.artifactToExecute}
            onChange={this.selectArtifactForCQLModal}
          />
        </div>
      </Modal>
    );
  }

  renderTableRow = patient => (
    <tr key={patient._id}>
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
            .get('resource.name[0].family[0]')
            .value() || 'family_placeholder'}
        </div>
      </td>

      <td className="patients__tablecell-wide" data-th="Gender">
        <div>
          {_.chain(patient)
              .get('patient.entry')
              .find({ resource: { resourceType: 'Patient' } })
              .get('resource.gender')
              .value() || 'gender_placeholder'}
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

      <td data-th="Updated">{renderDate(patient.updatedAt)}</td>

      <td data-th="">
        <button aria-label="View"
          className="button primary-button"
          onClick={() => this.openViewDetailsModal(patient)}>
          <FontAwesome name='eye'/>
        </button>

        <button aria-label="Execute CQL"
          disabled={this.props.vsacFHIRCredentials.username == null}
          className={`button primary-button ${
            this.props.vsacFHIRCredentials.username != null ? '' : 'disabled-button'
          }`}
          onClick={() => this.openExecuteCQLModal(patient)}>
          Execute CQL
        </button>

        <button
          className="button danger-button"
          onClick={() => this.openConfirmDeleteModal(patient)}>
          Delete
        </button>
      </td>
    </tr>
  );

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
            vsacIsAuthenticating={this.props.vsacIsAuthenticating} />
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
    const patients = this.props.patients;

    return (
      <div className="patient-table">
        <table className="patients__table">
          <thead>
            <tr>
              <th scope="col" className="patients__tablecell-wide">Name</th>
              <th scope="col" className="patients__tablecell-wide">Gender</th>
              <th scope="col" className="patients__tablecell-wide">Birth Date</th>
              <th scope="col">Last Updated</th>
              <th>{this.renderVSACLogin()}</th>
            </tr>
          </thead>

          <tbody>
            {patients.sort(sortMostRecent).map(this.renderTableRow)}
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
  timeLastAuthenticated: PropTypes.instanceOf(Date),
  vsacFHIRCredentials: PropTypes.object,
  loginVSACUser: PropTypes.func.isRequired,
  setVSACAuthStatus: PropTypes.func.isRequired,
  vsacStatus: PropTypes.string,
  vsacStatusText: PropTypes.string,
  vsacIsAuthenticating: PropTypes.bool.isRequired
};
