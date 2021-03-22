import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button } from '@material-ui/core';
import {
  Delete as DeleteIcon,
  Visibility as VisibilityIcon
} from '@material-ui/icons';
import { UncontrolledTooltip } from 'reactstrap';

import { DeleteConfirmationModal } from 'components/modals';
import ExternalCqlDetails from './ExternalCqlDetails';

import { sortMostRecent } from 'utils/sort';
import { renderDate } from 'utils/dates';
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

  openConfirmDeleteModal = (disableDelete, externalCqlLibrary) => {
    if (disableDelete) return;
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
          <Button
            color="primary"
            onClick={() => this.openViewDetailsModal(externalCqlLibrary)}
            startIcon={<VisibilityIcon />}
            variant="contained"
          >
            View
          </Button>

          <span id={`DeleteLibraryTooltip-${externalCqlLibrary._id}`}>
            <Button
              color="secondary"
              disabled={disableForUse || disableForDependency}
              onClick={() => this.openConfirmDeleteModal(disableDelete, externalCqlLibrary)}
              startIcon={<DeleteIcon />}
              variant="contained"
            >
              Delete
            </Button>
          </span>

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

  render() {
    const {
      externalCqlLibraryDetails,
      externalCqlList,
      isLoadingExternalCqlDetails,
      loadExternalCqlLibraryDetails
    } = this.props;
    const {
      externalCqlLibraryToDelete,
      externalCqlLibraryToView,
      showConfirmDeleteModal,
      showViewDetailsModal
    } = this.state;

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

        {showConfirmDeleteModal &&
          <DeleteConfirmationModal
            deleteType="External CQL Library"
            handleCloseModal={this.closeConfirmDeleteModal}
            handleDelete={this.handleDeleteExternalCqlLibrary}
          >
            <div>Library: {externalCqlLibraryToDelete.name}</div>
          </DeleteConfirmationModal>
        }
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
