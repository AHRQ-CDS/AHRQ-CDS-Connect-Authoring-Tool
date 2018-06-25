import React, { Component } from 'react';
import PropTypes from 'prop-types';
import FontAwesome from 'react-fontawesome';
import Inspector from 'react-inspector';
import _ from 'lodash';

import renderDate from '../../utils/dates';
import { sortMostRecent } from '../../utils/sort';
import patientProps from '../../prop-types/patient';

import Modal from '../elements/Modal';

export default class PatientTable extends Component {
  constructor(props) {
    super(props);

    this.state = {
      patientToDelete: null,
      showConfirmDeleteModal: false,
      patientToView: null,
      showViewDetailsModal: false
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

        <div className="delete-artifact-confirmation-modal modal__content">
          <h5>Are you sure you want to permanently delete the following Patient?</h5>

          <div className="artifact-info">
            <span>Name: </span>
            <span>
              {_.chain(this.state.patientToDelete)
                  .get('patient.entry')
                  .find({ resource: { resourceType: 'Patient' } })
                  .get('resource.name[0].given[0]')
                  .value() || 'given_placeholder'}
              {" "}
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

        <div className="artifact-table__modal modal__content">
          <h5>Viewing Patient:</h5>

          <div className="artifact-info">
            <Inspector data={this.state.patientToView} expandLevel="2"/>
          </div>
        </div>
      </Modal>
    );
  }

  renderTableRow = patient => (
    <tr key={patient._id}>
      <td className="artifacts__tablecell-wide" data-th="Patient Name">
        <div>
          {_.chain(patient)
              .get('patient.entry')
              .find({ resource: { resourceType: 'Patient' } })
              .get('resource.name[0].given[0]')
              .value() || 'given_placeholder'}
          {" "}
          {_.chain(patient)
            .get('patient.entry')
            .find({ resource: { resourceType: 'Patient' } })
            .get('resource.name[0].family[0]')
            .value() || 'family_placeholder'}
        </div>
      </td>

      <td data-th="Updated">{renderDate(patient.updatedAt)}</td>

      <td data-th="">
        <button aria-label="View"
          className="button primary-button"
          onClick={() => this.openViewDetailsModal(patient)}>
          <FontAwesome name='eye'/>
        </button>

        <button aria-label="Test"
          disabled={true}
          className="button primary-button"
          onClick={() => {return false;}}>
          <FontAwesome name='play'/>
        </button>

        <button aria-label="Report"
          disabled={true}
          className="button primary-button"
          onClick={() => {return false;}}>
          <FontAwesome name='book'/>
        </button>

        <button
          className="button danger-button"
          onClick={() => this.openConfirmDeleteModal(patient)}>
          Delete
        </button>
      </td>
    </tr>
  );

  render() {
    const { patients } = this.props;

    return (
      <div className="artifact-table">
        <table className="artifacts__table">
          <thead>
            <tr>
              <th scope="col" className="artifacts__tablecell-wide">Patient Name</th>
              <th scope="col">Last Updated</th>
              <td></td>
            </tr>
          </thead>

          <tbody>
            {patients.sort(sortMostRecent).map(this.renderTableRow)}
          </tbody>
        </table>

        {this.renderConfirmDeleteModal()}
        {this.renderViewDetailsModal()}
      </div>
    );
  }
}

PatientTable.propTypes = {
  patients: PropTypes.arrayOf(patientProps),
  deletePatient: PropTypes.func.isRequired
};
