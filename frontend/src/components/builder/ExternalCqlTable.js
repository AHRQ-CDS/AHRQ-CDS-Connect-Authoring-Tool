import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye } from '@fortawesome/free-solid-svg-icons';
import { UncontrolledTooltip } from 'reactstrap';

import { Modal }  from 'components/elements';
import ExternalCqlDetails from './ExternalCqlDetails';

import { sortMostRecent } from 'utils/sort';
import renderDate from 'utils/dates';
import changeToCase from 'utils/strings';

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

  getFhirVersion = (version) => {
    if (version === '1.0.2') return '1.0.2 (DSTU2)';
    if (version.startsWith('3.0.')) return `${version} (STU3)`;
    if (version.startsWith('4.0.')) return `${version} (R4)`;
    return version;
  }

  // ----------------------- VIEW DETAILS MODAL ---------------------------- //

  openViewDetailsModal = (externalCqlLibrary) => {
    const { clearAddLibraryErrorsAndMessages } = this.props;
    clearAddLibraryErrorsAndMessages();
    this.setState({ showViewDetailsModal: true, externalCqlLibraryToView: externalCqlLibrary });
  }

  closeViewDetailsModal = () => {
    this.setState({ showViewDetailsModal: false, externalCqlLibraryToView: null });
  }

  handleViewDetails = () => {
    this.closeViewDetailsModal();
  }

  // ----------------------- DELETE MODAL ---------------------------------- //

  openConfirmDeleteModal = (externalCqlLibrary) => {
    const { clearAddLibraryErrorsAndMessages } = this.props;
    clearAddLibraryErrorsAndMessages();
    this.setState({ showConfirmDeleteModal: true, externalCqlLibraryToDelete: externalCqlLibrary });
  }

  closeConfirmDeleteModal = () => {
    this.setState({ showConfirmDeleteModal: false, externalCqlLibraryToDelete: null });
  }

  handleDeleteExternalCqlLibrary = () => {
    const { artifact, deleteExternalCqlLibrary } = this.props;
    const { externalCqlLibraryToDelete } = this.state;
    deleteExternalCqlLibrary(externalCqlLibraryToDelete._id, artifact);
    this.closeConfirmDeleteModal();
  }

  // ----------------------- RENDER ---------------------------------------- //

  renderTableRow = (externalCqlLibrary) => {
    const { librariesInUse } = this.props;
    const libName = changeToCase(externalCqlLibrary.name, 'paramCase');
    const libVersion = externalCqlLibrary.version;
    const currentLibraryParents =
      this.props.externalCQLLibraryParents[`${libName}-${libVersion}`] || [];
    const disableForDependency = currentLibraryParents.length > 0;
    const disableForUse = librariesInUse.includes(externalCqlLibrary.name);
    const disableDelete = disableForDependency || disableForUse;
    const disabledClass = disableDelete ? 'disabled' : '';
    return (
      <tr key={externalCqlLibrary._id}>
        <td className="external-cql-table__tablecell-wide" data-th="Library">
          <div>{externalCqlLibrary.name}</div>
        </td>

        <td className="external-cql-table__tablecell-short" data-th="Updated">
          <div>{renderDate(externalCqlLibrary.updatedAt)}</div>
        </td>

        <td className="external-cql-table__tablecell-short center" data-th="Version">
          <div>{externalCqlLibrary.version}</div>
        </td>

        <td className="external-cql-table__tablecell-short" data-th="FHIR Version">
          <div>{this.getFhirVersion(externalCqlLibrary.fhirVersion)}</div>
        </td>

        <td className="external-cql-table__tablecell-button" data-th="">
          <button aria-label="View"
            className="button primary-button details-button"
            onClick={() => this.openViewDetailsModal(externalCqlLibrary)}
          >
            <FontAwesomeIcon icon={faEye} />
          </button>

          <button
            className={`button danger-button ${disabledClass}`}
            id={`DeleteLibraryTooltip-${externalCqlLibrary._id}`}
            aria-label="Delete"
            onClick={() => { if (!disableDelete) this.openConfirmDeleteModal(externalCqlLibrary); }}
          >
            Delete
          </button>

          {disableForUse &&
            <UncontrolledTooltip target={`DeleteLibraryTooltip-${externalCqlLibrary._id}`} placement="left">
              To delete this library, first remove all references to it.
            </UncontrolledTooltip>
          }

          {!disableForUse && disableForDependency &&
            <UncontrolledTooltip target={`DeleteLibraryTooltip-${externalCqlLibrary._id}`} placement="left">
              To delete this library, first remove all libraries that depend on it.
            </UncontrolledTooltip>
          }
        </td>
      </tr>
    );
  };

  renderConfirmDeleteModal() {
    const { externalCqlLibraryToDelete } = this.state;

    return (
      <Modal
        title="Delete External CQL Library Confirmation"
        submitButtonText="Delete"
        handleShowModal={this.state.showConfirmDeleteModal}
        handleCloseModal={this.closeConfirmDeleteModal}
        handleSaveModal={this.handleDeleteExternalCqlLibrary}
      >
        <div className="delete-external-cql-library-confirmation-modal modal__content">
          <h5>Are you sure you want to permanently delete the following external CQL library?</h5>

          <div className="external-cql-library-info">
            <span>Library: </span>
            <span>{externalCqlLibraryToDelete && externalCqlLibraryToDelete.name}</span>
          </div>
        </div>
      </Modal>
    );
  }

  render() {
    const {
      externalCqlList, externalCqlLibraryDetails, loadExternalCqlLibraryDetails, isLoadingExternalCqlDetails
    } = this.props;
    const { showViewDetailsModal, externalCqlLibraryToView } = this.state;

    return (
      <div className="external-cql-table">
        <table className="external-cql-table__table">
          <thead>
            <tr>
              <th scope="col" className="external-cql-table__tablecell-wide">Library</th>
              <th scope="col" className="external-cql-table__tablecell-short">Last Updated</th>
              <th scope="col" className="external-cql-table__tablecell-short center">Version</th>
              <th scope="col" className="external-cql-table__tablecell-short">FHIR<sup>®</sup> Version</th>
              <th></th>
            </tr>
          </thead>

          <tbody>
            {externalCqlList.sort(sortMostRecent).map(externalCqlLibrary => this.renderTableRow(externalCqlLibrary))}
          </tbody>
        </table>

        {showViewDetailsModal &&
          <ExternalCqlDetails
            openModal={showViewDetailsModal}
            closeModal={this.closeViewDetailsModal}
            externalCqlLibrary={externalCqlLibraryToView}
            externalCqlLibraryDetails={externalCqlLibraryDetails}
            loadExternalCqlLibraryDetails={loadExternalCqlLibraryDetails}
            isLoadingExternalCqlDetails={isLoadingExternalCqlDetails}
          />
        }

        {this.renderConfirmDeleteModal()}
      </div>
    );
  }
}

ExternalCqlTable.propTypes = {
  artifact: PropTypes.object,
  externalCqlList: PropTypes.array,
  externalCqlLibraryDetails: PropTypes.object,
  externalCQLLibraryParents: PropTypes.object.isRequired,
  deleteExternalCqlLibrary: PropTypes.func.isRequired,
  loadExternalCqlLibraryDetails: PropTypes.func.isRequired,
  isLoadingExternalCqlDetails: PropTypes.bool.isRequired,
  librariesInUse: PropTypes.array.isRequired
};
