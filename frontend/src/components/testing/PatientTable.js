import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button, IconButton } from '@material-ui/core';
import {
  Check as CheckIcon,
  CheckBox as CheckBoxIcon,
  CheckBoxOutlineBlank as CheckBoxOutlineBlankIcon,
  Delete as DeleteIcon,
  Lock as LockIcon,
  Visibility as VisibilityIcon
} from '@material-ui/icons';
import { UncontrolledTooltip } from 'reactstrap';
import _ from 'lodash';

import { renderDate } from 'utils/dates';
import { sortAlphabeticallyByPatientName } from 'utils/sort';
import patientProps from 'prop-types/patient';
import artifactProps from 'prop-types/artifact';

import { Dropdown, Modal } from 'components/elements';
import { DeleteConfirmationModal, VSACAuthenticationModal } from 'components/modals';
import CodeService from 'utils/code_service/CodeService';
import PatientView from './PatientView';
import TestingParameters from './TestingParameters';

export default class PatientTable extends Component {
  constructor(props) {
    super(props);

    this.state = {
      artifactToExecute: null,
      codeService: new CodeService(),
      paramsToExecute: [],
      patientsToExecute: [],
      patientToDelete: null,
      patientToView: null,
      showConfirmDeleteModal: false,
      showExecuteCQLModal: false,
      showViewDetailsModal: false,
      showVSACAuthenticationModal: false,
      testReport: null,
    };
  }

  // ----------------------- VSAC AUTHENTICATION MODAL -------------------------- //

  openVSACAuthenticationModal = () => {
    this.setState({ showVSACAuthenticationModal: true });
  }

  closeVSACAuthenticationModal = () => {
    this.setState({ showVSACAuthenticationModal: false });
  }

  // ----------------------- CONFIRM DELETE MODAL -------------------------- //

  openConfirmDeleteModal = (patient, patientSelected) => {
    if (patientSelected) return;
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

  updatePatientsToExecute = (patient, differentFHIRVersion) => {
    if (differentFHIRVersion) return;
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

  renderViewDetailsModal = () => (
    <Modal
      title="View Patient Details"
      isOpen={this.state.showViewDetailsModal}
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
        isOpen={this.state.showExecuteCQLModal}
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
          <span id={`SelectPatientTooltip-${patient._id}`}>
            <IconButton
              aria-label="view"
              color="primary"
              disabled={differentFHIRVersion}
              onClick={() => this.updatePatientsToExecute(patient, differentFHIRVersion)}
            >
              {patientSelected ? <CheckBoxIcon size="small" /> : <CheckBoxOutlineBlankIcon size="small" />}
            </IconButton>
          </span>
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

        <td className="patients__tablecell-buttons" data-th="">
          <Button
            color="primary"
            onClick={() => this.openViewDetailsModal(patient)}
            startIcon={<VisibilityIcon />}
            variant="contained"
          >
            View
          </Button>

          <span id={`DeletePatientTooltip-${patient._id}`}>
            <Button
              color="secondary"
              disabled={patientSelected}
              onClick={() => this.openConfirmDeleteModal(patient, patientSelected)}
              startIcon={<DeleteIcon />}
              variant="contained"
            >
              Delete
            </Button>
          </span>

          {patientSelected &&
            <UncontrolledTooltip target={`DeletePatientTooltip-${patient._id}`} placement="top">
              To delete this patient, first deselect it.
            </UncontrolledTooltip>
          }
        </td>
      </tr>
    );
  }

  render() {
    const { patients, vsacApiKey } = this.props;
    const { patientToDelete, patientsToExecute, showConfirmDeleteModal, showVSACAuthenticationModal } = this.state;
    const patientName = `${_.chain(patientToDelete)
      .get('patient.entry').find({ resource: { resourceType: 'Patient' } })
      .get('resource.name[0].given[0]').value() || 'given_placeholder'}
      ${_.chain(patientToDelete).get('patient.entry').find({ resource: { resourceType: 'Patient' } })
      .get('resource.name[0].family').value() || 'family_placeholder'}`;

    return (
      <div className="patient-table">
        <div className="patient-table__buttons">
          <Button
            color="primary"
            disabled={Boolean(vsacApiKey)}
            onClick={this.openVSACAuthenticationModal}
            variant="contained"
            startIcon={Boolean(vsacApiKey) ? <CheckIcon /> : <LockIcon />}
          >
            {Boolean(vsacApiKey) ? 'VSAC Authenticated' : 'Authenticate VSAC' }
          </Button>

          {showVSACAuthenticationModal && (
            <VSACAuthenticationModal handleCloseModal={this.closeVSACAuthenticationModal} />
          )}

          <Button
            color="primary"
            disabled={!Boolean(vsacApiKey) || patientsToExecute.length === 0}
            onClick={() => this.openExecuteCQLModal()}
            variant="contained"
          >
            Execute CQL on Selected Patients
          </Button>
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

        {showConfirmDeleteModal &&
          <DeleteConfirmationModal
            deleteType="Patient"
            handleCloseModal={this.closeConfirmDeleteModal}
            handleDelete={this.handleDeletePatient}
          >
            <div>Name: {patientName}</div>
          </DeleteConfirmationModal>
        }

        {this.renderViewDetailsModal()}
        {this.renderExecuteCQLModal()}
      </div>
    );
  }
}

PatientTable.propTypes = {
  artifacts: PropTypes.arrayOf(artifactProps).isRequired,
  deletePatient: PropTypes.func.isRequired,
  executeCQLArtifact: PropTypes.func.isRequired,
  patients: PropTypes.arrayOf(patientProps).isRequired,
  vsacApiKey: PropTypes.string
};
