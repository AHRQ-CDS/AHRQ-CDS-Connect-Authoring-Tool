import React, { Component } from 'react';
import ReactModal from 'react-modal';
import { get, post } from 'axios';

import Config from '../../../config';

ReactModal.setAppElement('#root');

const AUTHENTICATE = 'AUTHENTICATE';
const LIST = 'LIST';
const STATUS = 'STATUS';
const ERROR = 'ERROR';

class RepoUploadModal extends Component {
  constructor(props) {
    super(props);

    // TODO REMOVE ME Temporary to bypass
    let mockResponse = [
        {
            "title": "<a href=\"/cds/artifact/aspirin-therapy-primary-prevention-cvd-and-colorectal-cancer\" hreflang=\"en\">Aspirin Therapy for Primary Prevention of CVD and Colorectal Cancer</a>",
            "nid": "26",
            "uuid": "09a63d55-33ad-463e-a7c8-9390a2cd77ff",
            "field_version": "0.1.0"
        },
        {
            "title": "<a href=\"/cds/artifact/statin-therapy-prevention-and-treatment-cardiovascular-disease-cvd-ecqm\" hreflang=\"en\">Statin Therapy for the Prevention and Treatment of Cardiovascular Disease (CVD) eCQM</a>",
            "nid": "21",
            "uuid": "262d9bcd-c79a-4894-a59c-b0218ed1820a",
            "field_version": "0.1.0"
        },
        {
            "title": "<a href=\"/cds/artifact/statin-use-primary-prevention-cvd-adults\" hreflang=\"en\">Statin Use for the Primary Prevention of CVD in Adults</a>",
            "nid": "18",
            "uuid": "0f9f07fe-c5cf-4282-b567-38747b25b816",
            "field_version": "0.1.0"
        }
    ];

    this.state = {
      userName: '',
      password: '',
      // TODO remove me
      artifacts: mockResponse,
      errors: [],
      // TODO Remove me
      authToken: '1234',
      // TODO Remove me
      showModal: props.showModal,
      page: AUTHENTICATE,
      artifactNID: null,
      uploadStatus: null
    }

    this.closeModal = this._closeModal.bind(this);
    this.updateUserName = this._updateUserName.bind(this);
    this.updatePassword = this._updatePassword.bind(this);
    this.fetchArtifacts = this._fetchArtifacts.bind(this);
    this.authenticate = this._authenticate.bind(this);
    this.uploadArtifact = this._uploadArtifact.bind(this);
  }

  _openModal() {
    this.setState({showModal: true});
  }

  _closeModal() {

    this.setState({showModal: false, page: AUTHENTICATE, authToken:null});
    this.props.closeModal();
  }

  // This function needs to invalidate the authToken state
  // in the case of changing anything we don't know if it's valid.
  _updateUserName(name) {
    this.setState({page: AUTHENTICATE, authToken: null, userName: name});
  }

  // This function needs to invalidate the authToken state
  // in the case of changing anything we don't know if it's valid.
  _updatePassword(password) {
    this.setState({page: AUTHENTICATE, authToken: null, password: password});
  }

  _authenticate() {
    this.setState({page: LIST});
    // TODO this is short circuiting the entire function
    return;
    let auth = {username: this.state.userName, password: this.state.password};
    get(`${Config.repo.baseUrl}/rest/session/token`, {auth}).then((res) => {
      this.setState({authToken: res.data});
      this.fetchArtifacts();
    }).catch((res) =>{
      this.setState({page: ERROR})
    });
  }

  _fetchArtifacts() {
    let headers = {'Content-type':'application/hal+json','X-CSRF-Token':this.state.authToken};
    get(`${Config.repo.baseUrl}/rest/views/artifacts`, {headers}).then((res) => {
      this.setState({artifacts: res.data, page: LIST})
    }).catch((res) =>{
      this.setState({page: ERROR})
    });
  }

  _uploadArtifact(nid) {
    const artifact = this.props.prepareArtifact();
    let auth = {username: this.state.userName, password: this.state.password};
    post(`${Config.api.baseUrl}/cql/publish`, {data: artifact, nid: nid, auth}).catch(() => this.setState({page: ERROR}))
    this.setState({page: STATUS, artifactNID: nid});
  }

  renderLogin() {
    return (
      <div className={'form__group'}>
        <label htmlFor={'repoUserName'}>
          Username:
          <input id='repoUserName'
            value={this.state.userName}
            type="text"
            name={this.state.userName}
            aria-describedby={'repoUserName'}
            onChange={(event) => {
              this.updateUserName(event.target.value)
            }}
          />
        </label>
        <label htmlFor={'repoPassword'}>
          Password:
          <input id='repoPassword'
            value={this.state.password}
            type="password"
            name={this.state.password}
            aria-describedby={'repoPassword'}
            onChange={(event) => {
              this.updatePassword(event.target.value)
            }}
          />
        </label>
        <button className="btn btn-primary" onClick={this.authenticate}>Load Artifacts</button>
      </div>
    );
  }

  renderRepositoryArtifacts() {
    return (
      <table className="artifacts__table">
        <thead>
          <tr>
            <th scope="col" className="artifacts__tablecell-wide">Artifact Name</th>
            <th scope="col" className="artifacts__tablecell-short">Version</th>
            <th scope="col" className="artifacts__tablecell-short">Update</th>
          </tr>
        </thead>
        <tbody>
        {this.state.artifacts.map((a)=> {
          return (
            <tr key={a.nid}>
              <td>{a.title.replace(/<\/?[^>]+(>|$)/g, "")}</td>
              <td>{a.field_version}</td>
              <td><button onClick={() => this.uploadArtifact(a.nid)}>Update</button></td>
            </tr>
          );
        })}
        </tbody>
      </table>
    );
  }

  renderUploadStatus() {
    return (
      <div>
        Uploading artifact {this.state.artifactNID}.
        The status of the upload goes here
      </div>
    );
  }

  renderErrorState() {
    return (
      <div>
        The Artifact Repository could not be reached.
      </div>
    )
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
        return null

    }
  }

  render() {
    return (
        <ReactModal contentLabel="Submit to Repository"
          isOpen={this.props.showModal}
          onRequestClose={this.closeModal}
          className="modal-style">
          {this.renderPage()}
        </ReactModal>
    );
  }
}

export default RepoUploadModal;
