import React, { Component } from 'react';
import moment from 'moment';
import { Link } from 'react-router-dom';
import axios from 'axios';
import FontAwesome from 'react-fontawesome';
import ReactModal from 'react-modal';
import ArtifactForm from './ArtifactForm';
import Config from '../../../config';

const API_BASE = Config.api.baseUrl;

// For screen readers to not see the background text
ReactModal.setAppElement('#root');

function renderDate(datetime) {
  let formattedDate = '';
  if (datetime) {
    formattedDate = moment(datetime).fromNow();
  }
  return formattedDate;
}

function sortArtifacts(a, b) {
  // most recently updated at top
  if (a.updatedAt > b.updatedAt || (a.updatedAt && !b.updatedAt)) {
    return -1;
  } else if (a.updatedAt < b.updatedAt || (!a.updatedAt && b.updatedAt)) {
    return 1;
  }
  return 0;
}

class ArtifactTable extends Component {
  constructor(props) {
    super(props);
    this.state = { artifacts: props.artifacts,
      artifactEditing: null,
      showModal: false };
    this.deleteArtifact = this.deleteArtifact.bind(this);
    this.renderTableRow = this.renderTableRow.bind(this);
    this.editArtifactName = this.editArtifactName.bind(this);
    this.openModal = this.openModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    if (!nextProps.artifacts) { return; }
    if (this.state.artifacts !== nextProps.artifacts) {
      this.setState({ artifacts: nextProps.artifacts });
    }
  }

  deleteArtifact(id) {
    axios.delete(`${API_BASE}/artifacts/${id}`)
      .then((res) => {
        const list = this.state.artifacts;
        const index = list.findIndex(a => a._id === id);

        const artifacts = [
          ...list.slice(0, index),
          ...list.slice(index + 1),
        ];

        this.setState({ artifacts });
      })
      .catch((err) => {
        console.error(err);
      });
  }

  editArtifactName(e, name, version) {
    e.preventDefault();
    const artifactToUpdate = {
      name,
      version,
      expTreeInclude: this.state.artifactEditing.expTreeInclude,
      expTreeExclude: this.state.artifactEditing.expTreeExclude,
      _id: this.state.artifactEditing._id
    };

    axios.put(`${API_BASE}/artifacts`, artifactToUpdate)
      .then((result) => {
        this.props.afterAddArtifact();
        this.setState({ showModal: false, artifactEditing: null });
      });
  }

  openModal(artifact) {
    this.setState({ showModal: true, artifactEditing: artifact });
  }

  closeModal() {
    this.setState({ showModal: false });
  }

  renderEditForm() {
    return (
      <ArtifactForm buttonLabel="Save"
        onSubmitFunction={this.editArtifactName}
        defaultName={this.state.artifactEditing ? this.state.artifactEditing.name : null}
        defaultVersion={this.state.artifactEditing ? this.state.artifactEditing.version : null} />
    );
  }

  renderTableRow(artifact) {
    return (
      <tr key={artifact._id}>
        <td className="artifacts__tablecell-wide"
          data-th="Artifact Name">
          <button aria-label="Edit"
            className="small-button edit-artifact-button"
            onClick={() => this.openModal(artifact)}>
            <FontAwesome name='pencil' />
          </button>
          <Link to={`${this.props.match.path}/${artifact._id}/build`}>
            {artifact.name}
          </Link>
        </td>
        <td className="artifacts__tablecell-short"
          data-th="Version">
          {artifact.version}
        </td>
        <td data-th="Updated">{renderDate(artifact.updatedAt)}</td>
        <td data-th="">
          <button className="danger-button"
            onClick={() => this.deleteArtifact(artifact._id)}>
            Delete
          </button>
        </td>
      </tr>
    );
  }

  render() {
    return (
      <div>
        <ReactModal contentLabel="Edit modal"
          isOpen={this.state.showModal}
          onRequestClose={this.closeModal}
          className="modal-style">
          <div className="modal__header">
            <span className="modal__heading">
              Edit Artifact
            </span>
            <div className="modal__buttonbar">
              <button onClick={this.closeModal}
                className="modal__deletebutton"
                aria-label="Close edit modal">
                <FontAwesome fixedWidth name='close'/>
              </button>
            </div>
          </div>
          <div className="modal__body">
          {this.renderEditForm()}
          </div>
        </ReactModal>
        <table className="artifacts__table">
          <thead>
            <tr>
              <th scope="col" className="artifacts__tablecell-wide">Artifact Name</th>
              <th scope="col" className="artifacts__tablecell-short">Version</th>
              <th scope="col">Updated</th>
              <td></td>
            </tr>
          </thead>
          <tbody>
          {this.state.artifacts.sort(sortArtifacts).map(this.renderTableRow)}
          </tbody>
        </table>
      </div>
    );
  }
}

export default ArtifactTable;
