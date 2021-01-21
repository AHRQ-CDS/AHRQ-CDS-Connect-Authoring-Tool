import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { Button } from '@material-ui/core';
import { Delete as DeleteIcon, Edit as EditIcon } from '@material-ui/icons';

import renderDate from 'utils/dates';
import { sortMostRecent } from 'utils/sort';
import artifactProps from 'prop-types/artifact';

import { Modal }  from 'components/elements';
import ArtifactModal from './ArtifactModal';

export default class ArtifactTable extends Component {
  constructor(props) {
    super(props);

    this.state = {
      artifactEditing: null,
      artifactToDelete: null,
      showArtifactModal: false,
      showConfirmDeleteModal: false
    };
  }

  // ----------------------- EDIT ARTIFACT MODAL --------------------------- //

  openArtifactModal = (artifact) => {
    this.setState({ artifactEditing: artifact, showArtifactModal: true });
  }

  closeArtifactModal = () => {
    this.setState({ showArtifactModal: false });
  }

  // ----------------------- CONFIRM DELETE MODAL -------------------------- //

  openConfirmDeleteModal = (artifact) => {
    this.setState({ showConfirmDeleteModal: true, artifactToDelete: artifact });
  }

  closeConfirmDeleteModal = () => {
    this.setState({ showConfirmDeleteModal: false, artifactToDelete: null });
  }

  handleDeleteArtifact = () => {
    this.props.deleteArtifact(this.state.artifactToDelete);
    this.closeConfirmDeleteModal();
  }

  // ----------------------- RENDER ---------------------------------------- //

  renderConfirmDeleteModal() {
    return (
      <Modal
        title="Delete Artifact Confirmation"
        submitButtonText="Delete"
        isOpen={this.state.showConfirmDeleteModal}
        handleCloseModal={this.closeConfirmDeleteModal}
        handleSaveModal={this.handleDeleteArtifact}
      >

        <div className="delete-artifact-confirmation-modal modal__content">
          <h5>Are you sure you want to permanently delete the following CDS Artifact?</h5>

          <div className="artifact-info">
            <span>Name: </span>
            <span>
              {this.state.artifactToDelete !== null ? this.state.artifactToDelete.name : 'name_placeholder'}
            </span>
          </div>

          <div className="artifact-info">
            <span>Version: </span>
            <span>
              {this.state.artifactToDelete !== null ? this.state.artifactToDelete.version : 'version_placeholder'}
            </span>
          </div>
        </div>
      </Modal>
    );
  }

  renderTableRow = artifact => (
    <tr key={artifact._id}>
      <td className="artifacts__tablecell-wide" data-th="Artifact Name">
        <Link to={`build/${artifact._id}`}>
          {artifact.name}
        </Link>
      </td>

      <td className="artifacts__tablecell-short"
        data-th="Version">
        {artifact.version}
      </td>

      <td data-th="Updated">{renderDate(artifact.updatedAt)}</td>

      <td data-th="" className="artifacts__tablecell-buttons">
        <Button
          color="primary"
          onClick={() => this.openArtifactModal(artifact)}
          startIcon={<EditIcon />}
          variant="contained"
        >
          Edit Info
        </Button>

        <Button
          color="secondary"
          onClick={() => this.openConfirmDeleteModal(artifact)}
          startIcon={<DeleteIcon />}
          variant="contained"
        >
          Delete
        </Button>
      </td>
    </tr>
  );

  render() {
    const { artifacts } = this.props;

    return (
      <div className="artifact-table">
        <table className="artifacts__table" role="table" aria-label="Artifacts">
          <thead>
            <tr>
              <th scope="col" className="artifacts__tablecell-wide">Artifact Name</th>
              <th scope="col" className="artifacts__tablecell-short">Version</th>
              <th scope="col">Last Updated</th>
              <th scope="col" aria-label="buttons"></th>
            </tr>
          </thead>

          <tbody>
            {artifacts.sort(sortMostRecent).map(this.renderTableRow)}
          </tbody>
        </table>

        <ArtifactModal
          artifactEditing={this.state.artifactEditing}
          showModal={this.state.showArtifactModal}
          closeModal={this.closeArtifactModal} />

        {this.renderConfirmDeleteModal()}
      </div>
    );
  }
}

ArtifactTable.propTypes = {
  artifacts: PropTypes.arrayOf(artifactProps),
  deleteArtifact: PropTypes.func.isRequired,
};
