import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Modal from 'react-modal';

class PatientVersionModal extends Component {
  static propTypes = {
    isOpen: PropTypes.bool.isRequired,
    closeModal: PropTypes.func.isRequired,
    patientData: PropTypes.object,
    selectVersion: PropTypes.func.isRequired
  }

  render() {
    return (
      <div className="element-modal">
        <Modal
          isOpen={this.props.isOpen}
          onRequestClose={this.props.closeModal}
          shouldCloseOnOverlayClick={ true }
          contentLabel="Patient Version Select"
          className="modal-style modal-style__light modal__content element-modal"
          overlayClassName='modal-overlay modal-overlay__dark'>
          <div className="element-modal__container">
            <header className="modal__header">
              <span className="modal__heading">
                Select a FHIR Version
              </span>
            </header>
            <main className="modal__body">
              <div className="element-modal modal__content">
                Please select the FHIR version of this patient from the options below.
              </div>
            </main>
            <footer className="modal__footer">
              <button className="primary-button"
                      onClick={ () => this.props.selectVersion(this.props.patientData, 'R4') }
                      aria-label="R4">
                      R4
              </button>
              <button className="primary-button"
                      onClick={ () => this.props.selectVersion(this.props.patientData, 'STU3') }
                      aria-label="STU3">
                      STU3
              </button>
              <button className="primary-button"
                      onClick={ () => this.props.selectVersion(this.props.patientData, 'DSTU2') }
                      aria-label="DSTU2">
                      DSTU2
              </button>
            </footer>
          </div>
        </Modal>
      </div>
    );
  }
}

export default PatientVersionModal;
