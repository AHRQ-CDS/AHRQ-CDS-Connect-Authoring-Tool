import React, { Component } from 'react';
import FontAwesome from 'react-fontawesome';
import ReactModal from 'react-modal';
import ArtifactForm from './ArtifactForm';

// For screen readers to not see the background text
ReactModal.setAppElement('#root');

class EditModal extends Component {
  render() {
    return (
      <ReactModal contentLabel="Edit modal"
        id='edit-modal'
        isOpen={this.props.showModal}
        onRequestClose={this.props.closeModal}
        className="modal-style"
        overlayClassName='modal-overlay'>
        <div className="modal__header">
          <span className="modal__heading">
            Edit Artifact
          </span>
          <div className="modal__buttonbar">
            <button onClick={this.props.closeModal}
              className="modal__deletebutton"
              aria-label="Close edit modal">
              <FontAwesome fixedWidth name='close'/>
            </button>
          </div>
        </div>
        <div className="modal__body">
        <ArtifactForm buttonLabel="Save"
          onSubmitFunction={this.props.editArtifactName}
          defaultName={this.props.artifactEditingName}
          defaultVersion={this.props.artifactEditingVersion}/>
        </div>
      </ReactModal>
    );
  }
}

export default EditModal;
