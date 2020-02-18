import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import FontAwesome from 'react-fontawesome';

import renderDate from '../../utils/dates';
import { sortMostRecent } from '../../utils/sort';
import artifactProps from '../../prop-types/artifact';

import Modal from '../elements/Modal';
import EditArtifactModal from './EditArtifactModal';

export default class ArtifactTable extends Component {
  constructor(props) {
    super(props);

    this.state = {
      artifactEditing: null,
      artifactToDelete: null,
      showEditArtifactModal: false,
      showConfirmDeleteModal: false
    };
  }

  // ----------------------- EDIT ARTIFACT MODAL --------------------------- //

  openEditArtifactModal = (artifact) => {
    this.setState({ artifactEditing: artifact, showEditArtifactModal: true });
  }

  closeEditArtifactModal = () => {
    this.setState({ showEditArtifactModal: false });
  }

  handleEditArtifact = (props) => {
    this.props.updateAndSaveArtifact(this.state.artifactEditing, props);
    this.closeEditArtifactModal(false);
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
        modalTitle="Delete Artifact Confirmation"
        modalId="confirm-delete-modal"
        modalTheme="light"
        modalSubmitButtonText="Delete"
        handleShowModal={this.state.showConfirmDeleteModal}
        handleCloseModal={this.closeConfirmDeleteModal}
        handleSaveModal={this.handleDeleteArtifact}>

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

      <td data-th="">
        <button aria-label="Edit"
          className="primary-button edit-artifact-button"
          onClick={() => this.openEditArtifactModal(artifact)}>
          <FontAwesome name='pencil' /> Edit Info
        </button>

        <button className="danger-button"
          onClick={() => this.openConfirmDeleteModal(artifact)}>
          <FontAwesome name='times' /> Delete
        </button>
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

        <EditArtifactModal
          artifactEditing={this.state.artifactEditing}
          showModal={this.state.showEditArtifactModal}
          closeModal={this.closeEditArtifactModal}
          saveModal={this.handleEditArtifact} />

        {this.renderConfirmDeleteModal()}
      </div>
    );
  }
}

ArtifactTable.propTypes = {
  artifacts: PropTypes.arrayOf(artifactProps),
  deleteArtifact: PropTypes.func.isRequired,
  updateAndSaveArtifact: PropTypes.func.isRequired
};
