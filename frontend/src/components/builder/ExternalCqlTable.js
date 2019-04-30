import React, { Component } from 'react';
import PropTypes from 'prop-types';
import FontAwesome from 'react-fontawesome';

import Modal from '../elements/Modal';

import { sortMostRecent } from '../../utils/sort';

export default class ExternalCqlTable extends Component {
  constructor(props) {
    super(props);

    this.state = {
      externalCqlLibraryToDelete: null,
      showViewDetailsModal: false,
      showConfirmDeleteModal: false,
      externalCqlLibraryToView: null
    };
  }

  // ----------------------- VIEW DETAILS MODAL ---------------------------- //

  openViewDetailsModal = externalCqlLibrary => {
    this.setState({ showViewDetailsModal: true, externalCqlLibraryToView: externalCqlLibrary });
  }

  closeViewDetailsModal = () => {
    this.setState({ showViewDetailsModal: false, externalCqlLibraryToView: null });
  }

  handleViewDetails = () => {
    this.closeViewDetailsModal();
  }

  // ----------------------- DELETE MODAL ---------------------------------- //

  openConfirmDeleteModal = externalCqlLibrary => {
    this.setState({ showConfirmDeleteModal: true, externalCqlLibraryToDelete: externalCqlLibrary });
  }

  closeConfirmDeleteModal = () => {
    this.setState({ showConfirmDeleteModal: false, externalCqlLibraryToDelete: null });
  }

  handleDeleteExternalCqlLibrary = () => {
    this.props.deleteExternalCqlLibrary(this.state.externalCqlLibraryToDelete);
    this.closeConfirmDeleteModal();
  }

  // ----------------------- RENDER ---------------------------------------- //

  renderTableRow = externalCqlLibrary => (
    <tr key={externalCqlLibrary._id}>
      <td className="external-cql-table__tablecell-wide" data-th="Library">
        <div>
          Library Name
        </div>
      </td>

      <td className="external-cql-table__tablecell-short" data-th="Date Added">
        <div>
          Date Added
        </div>
      </td>

      <td className="external-cql-table__tablecell-short" data-th="Version">
        <div>
          Version
        </div>
      </td>

      <td className="external-cql-table__tablecell-short" data-th="FHIR Version">
        <div>
          FHIR Version
        </div>
      </td>

      <td data-th="">
        <button aria-label="View"
          className="button primary-button details-button"
          onClick={() => this.openViewDetailsModal(externalCqlLibrary)}>
          <FontAwesome name='eye'/>
        </button>

        <button
          className="button danger-button"
          onClick={() => this.openConfirmDeleteModal(externalCqlLibrary)}>
          Delete
        </button>
      </td>
    </tr>
  );

  renderViewDetailsModal() {
    return (
      <Modal
        modalTitle="View External CQL Details"
        modalId="view-details-modal"
        modalTheme="light"
        handleShowModal={this.state.showViewDetailsModal}
        handleCloseModal={this.closeViewDetailsModal}
        handleSaveModal={this.handleViewDetails}>

        <div className="external-cql-table__modal modal__content">
          <div className="external-cql-info">
            External CQL Info
          </div>
        </div>
      </Modal>
    );
  }

  renderConfirmDeleteModal() {
    return (
      <Modal
        modalTitle="Delete External CQL Library Confirmation"
        modalId="confirm-delete-modal"
        modalTheme="light"
        modalSubmitButtonText="Delete"
        handleShowModal={this.state.showConfirmDeleteModal}
        handleCloseModal={this.closeConfirmDeleteModal}
        handleSaveModal={this.handleDeleteExternalCqlLibrary}>

        <div className="delete-external-cql-library-confirmation-modal modal__content">
          <h5>Are you sure you want to permanently delete the following external CQL library?</h5>

          <div className="external-cql-library-info">
            <span>Library: </span>
            <span>
              Library
            </span>
          </div>
        </div>
      </Modal>
    );
  }

  render() {
    const { externalCqlList } = this.props;

    return (
      <div className="external-cql-table">
        <table className="external-cql-table__table">
          <thead>
            <tr>
              <th scope="col" className="external-cql-table__tablecell-wide">Library</th>
              <th scope="col" className="external-cql-table__tablecell-short">Date Added</th>
              <th scope="col" className="external-cql-table__tablecell-short">Version</th>
              <th scope="col" className="external-cql-table__tablecell-short">FHIR Version</th>
              <th></th>
            </tr>
          </thead>

          <tbody>
            {externalCqlList.sort(sortMostRecent).map(this.renderTableRow)}
          </tbody>
        </table>

        {this.renderViewDetailsModal()}
        {this.renderConfirmDeleteModal()}
      </div>
    );
  }
}

ExternalCqlTable.propTypes = {
  externalCqlList: PropTypes.array,
  deleteExternalCqlLibrary: PropTypes.func.isRequired
};
