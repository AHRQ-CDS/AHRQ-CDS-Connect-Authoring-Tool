import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

import renderDate from '../../utils/dates';
import { sortMostRecent } from '../../utils/sort';
import patientProps from '../../prop-types/patient';

export default class PatientTable extends Component {
  constructor(props) {
    super(props);

    this.state = {
      patientToDelete: null,
      showConfirmDeleteModal: false
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
              {this.state.patientToDelete !== null ? this.state.patientToDelete.name : 'name_placeholder'}
            </span>
          </div>
        </div>
      </Modal>
    );
  }

  renderTableRow = patient => (
    <tr key={patient._id}>
      <td className="artifacts__tablecell-wide" data-th="Patient Name">
        <Link to={`build/${patient._id}`}>
          {patient.name}
        </Link>
      </td>

      <td data-th="Updated">{renderDate(patient.updatedAt)}</td>

      <td data-th="">
        <button className="danger-button"
          onClick={() => this.openConfirmDeleteModal(artifact)}>
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
      </div>
    );
  }
}

PatientTable.propTypes = {
  patients: PropTypes.arrayOf(patientProps),
  deleteArtifact: PropTypes.func.isRequired
};
