import React, { Component } from 'react';
import ReactModal from 'react-modal';
import { get, post } from 'axios';
import FontAwesome from 'react-fontawesome';

import Config from '../../../config';

ReactModal.setAppElement('#root');

const AUTHENTICATE = 'AUTHENTICATE';
const LIST = 'LIST';
const STATUS = 'STATUS';
const ERROR = 'ERROR';

class RepoUploadModal extends Component {
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

    this.closeModal = this._closeModal.bind(this);
    this.updateUserName = this._updateUserName.bind(this);
    this.updatePassword = this._updatePassword.bind(this);
    this.fetchArtifacts = this._fetchArtifacts.bind(this);
    this.authenticate = this._authenticate.bind(this);
    this.uploadArtifact = this._uploadArtifact.bind(this);
  }

  _openModal() {
    this.setState({ showModal: true });
  }

  _closeModal() {
    this.setState({ showModal: false, page: AUTHENTICATE, authToken: null });
    this.props.closeModal();
  }

  // This function needs to invalidate the authToken state
  // in the case of changing anything we don't know if it's valid.
  _updateUserName(name) {
    this.setState({ page: AUTHENTICATE, authToken: null, userName: name });
  }

  // This function needs to invalidate the authToken state
  // in the case of changing anything we don't know if it's valid.
  _updatePassword(password) {
    this.setState({ page: AUTHENTICATE, authToken: null, password });
  }

  _authenticate() {
    // let auth = {username: this.state.userName, password: this.state.password};
    get(`${Config.repo.baseUrl}/rest/session/token`).then((res) => {
      this.setState({ authToken: res.data });
      this.fetchArtifacts();
    }).catch((res) => {
      this.setState({ page: ERROR });
    });
  }

  _fetchArtifacts() {
    const headers = { 'Content-type': 'application/hal+json', 'X-CSRF-Token': this.state.authToken };
    get('/api/repository/artifacts').then((res) => {
      this.setState({ artifacts: res.data, page: LIST });
    });
  }

  _uploadArtifact(nid) {
    const artifact = this.props.prepareArtifact();
    const auth = { username: this.state.userName, password: this.state.password };
    const closeModal = this.closeModal;
    post(`${Config.api.baseUrl}/cql/publish`, { data: artifact, nid, auth, version: this.props.version })
    .then((res) => {
      console.log('Success');
      closeModal();
    })
    .catch(() => this.setState({ page: ERROR }));
    this.setState({ page: STATUS, artifactNID: nid });
  }

  renderLogin() {
    return (
      <div>
        <div className="modal__header">
          <span className="modal__heading">
            Log in to CDS Connect
          </span>
          <div className="modal__buttonbar">
            <button onClick={this.closeModal}
              className="modal__deletebutton"
              aria-label="Close CDS Connect login modal">
              <FontAwesome fixedWidth name='close'/>
            </button>
          </div>
        </div>
        <div className='form__group repo-login-form'>
          <label htmlFor={'repoUserName'}>
            Username
          </label>
          <input id='repoUserName'
            className='repo-login-field'
            value={this.state.userName}
            type="text"
            name={this.state.userName}
            aria-describedby={'repoUserName'}
            onChange={(event) => {
              this.updateUserName(event.target.value);
            }}
          />
          <label htmlFor={'repoPassword'}>
            Password
          </label>
          <input id='repoPassword'
            className='repo-login-field'
            value={this.state.password}
            type="password"
            name={this.state.password}
            aria-describedby={'repoPassword'}
            onChange={(event) => {
              this.updatePassword(event.target.value);
            }}
          />
          <button className="primary-button" onClick={this.fetchArtifacts}>Login</button>
        </div>
      </div>
    );
  }

  renderRepositoryArtifacts() {
    return (
      <div className="repo-list">
        <table className="artifacts__table">
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
                <td><button onClick={() => this.uploadArtifact(a.nid)}>Update</button></td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="buttonbar">
          <button onClick={this.closeModal}
            className="modal__deletebutton"
            aria-label="Close modal">
            Cancel
          </button>
        </div>
      </div>
    );
  }

  renderUploadStatus() {
    return (
      <div>
        Uploading artifact {this.state.artifactNID} to <a href={`${Config.repo.baseUrl}`}>repository</a>...
      </div>
    );
  }

  renderErrorState() {
    return (
      <div>
        <div className="modal__header">
          <span className="modal__heading">
            Error
          </span>
          <div className="modal__buttonbar">
            <button onClick={this.closeModal}
              className="modal__deletebutton"
              aria-label="Close CDS Connect error modal">
              <FontAwesome fixedWidth name='close'/>
            </button>
          </div>
        </div>
        <p className="repo-upload-error-message">
          {
            // TODO: Should put more detailed error info here when API is ready
            //       Should also include 'Retry' button when applicable.
          }
          The <a href={`${Config.repo.baseUrl}`}>Artifact Repository</a> could not be reached.
        </p>
      </div>
    );
  }

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
        <ReactModal contentLabel="Submit to Repository"
          isOpen={this.props.showModal}
          onRequestClose={this.closeModal}
          className={`${this.state.page === AUTHENTICATE ? 'repo-login-modal' : ''} modal-style repo-upload-modal`}>
          {this.renderPage()}
        </ReactModal>
    );
  }
}

export default RepoUploadModal;
