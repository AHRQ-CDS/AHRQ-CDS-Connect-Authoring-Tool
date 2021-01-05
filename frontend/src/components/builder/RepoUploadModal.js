import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { get, post } from 'axios';
import { Button, TextField } from '@material-ui/core';

import { Modal }  from 'components/elements';

const API_BASE = process.env.REACT_APP_API_URL;
const REPO_BASE = process.env.REACT_APP_REPO_URL;

const AUTHENTICATE = 'AUTHENTICATE';
const LIST = 'LIST';
const STATUS = 'STATUS';
const ERROR = 'ERROR';

export default class RepoUploadModal extends Component {
  constructor(props) {
    super(props);

    this.state = {
      userName: '',
      password: '',
      artifacts: [],
      errors: [],
      authToken: null,
      showModal: props.showModal,
      page: AUTHENTICATE,
      artifactNID: null,
      uploadStatus: null
    };
  }

  openModal() {
    this.setState({ showModal: true });
  }

  closeModal = () => {
    this.setState({ showModal: false, page: AUTHENTICATE, authToken: null });
    this.props.closeModal();
  }

  // This function needs to invalidate the authToken state
  // in the case of changing anything we don't know if it's valid.
  updateUserName = (name) => {
    this.setState({ page: AUTHENTICATE, authToken: null, userName: name });
  }

  // This function needs to invalidate the authToken state
  // in the case of changing anything we don't know if it's valid.
  updatePassword = (password) => {
    this.setState({ page: AUTHENTICATE, authToken: null, password });
  }

  authenticate = () => {
    get(`${API_BASE}/rest/session/token`).then((res) => {
      this.setState({ authToken: res.data });
      this.fetchArtifacts();
    }).catch((res) => {
      this.setState({ page: ERROR });
    });
  }

  fetchArtifacts = () => {
    get(`${API_BASE}/repository/artifacts`).then((res) => {
      this.setState({ artifacts: res.data, page: LIST });
    });
  }

  uploadArtifact = (nid) => {
    const { artifact } = this.props;
    const auth = { username: this.state.userName, password: this.state.password };
    const { closeModal } = this;
    const options = {
      data: artifact,
      nid,
      auth,
      version: this.props.artifact.version
    };

    post(`${API_BASE}/cql/publish`, options)
      .then((res) => {
        console.log('Success');
        closeModal();
      })
      .catch(() => this.setState({ page: ERROR }));

    this.setState({ page: STATUS, artifactNID: nid });
  }

  renderLogin = () => (
    <div>
      <h3>Log in to CDS Connect</h3>

      <div className='form__group repo-login-form'>
        <TextField
          className="repo-login-form__input"
          fullWidth
          label="username"
          onChange={event => this.updateUserName(event.target.value)}
          value={this.state.userName}
          variant="outlined"
        />

        <TextField
          className="repo-login-form__input"
          fullWidth
          label="password"
          onChange={event => this.updatePassword(event.target.value)}
          type="password"
          value={this.state.password}
          variant="outlined"
        />

        <div className="repo-login-form__input">
          <Button color="primary" onClick={this.fetchArtifacts} variant="contained">
            Login
          </Button>
        </div>
      </div>
    </div>
  );

  renderRepositoryArtifacts = () => (
    <div className="repo-list">
      <table className="artifacts__table" role="table" aria-label="Artifacts">
        <thead>
          <tr>
            <th scope="col" className="artifacts__tablecell-wide">Artifact Name</th>
            <th scope="col" className="artifacts__tablecell-short">Version</th>
            <th scope="col" className="artifacts__tablecell-short">Update</th>
          </tr>
        </thead>

        <tbody>
          {this.state.artifacts.map(a => (
            <tr key={a.nid}>
              <td>{a.title.replace(/<\/?[^>]+(>|$)/g, '')}</td>
              <td>{a.field_version}</td>
              <td>
                <Button color="primary" onClick={() => this.uploadArtifact(a.nid)} variant="contained">
                  Update
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  renderUploadStatus = () => (
    <div>
      Uploading artifact {this.state.artifactNID} to <a href={`${REPO_BASE}`}>repository</a>...
    </div>
  );

  renderErrorState = () => (
    <div>
      <div className="modal__header">
        <span className="modal__heading">Error</span>
      </div>

      <p className="repo-upload-error-message">
        {
          // TODO: Should put more detailed error info here when API is ready
          //       Should also include 'Retry' button when applicable.
        }
        The <a href={`${REPO_BASE}`}>Artifact Repository</a> could not be reached.
      </p>
    </div>
  );

  renderPage() {
    switch (this.state.page) {
      case AUTHENTICATE:
        return this.renderLogin();
      case LIST:
        return this.renderRepositoryArtifacts();
      case STATUS:
        return this.renderUploadStatus();
      case ERROR:
        return this.renderErrorState();
      default:
        return null;
    }
  }

  render() {
    return (
      <Modal
        title="Submit to Repository"
        handleShowModal={this.props.showModal}
        handleCloseModal={this.closeModal}
        handleSaveModal={this.closeModal}
      >
        {this.renderPage()}
      </Modal>
    );
  }
}

RepoUploadModal.propTypes = {
  showModal: PropTypes.bool.isRequired,
  closeModal: PropTypes.func.isRequired,
  artifact: PropTypes.object.isRequired
};
