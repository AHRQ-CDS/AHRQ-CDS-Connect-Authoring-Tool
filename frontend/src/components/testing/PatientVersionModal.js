import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Modal from 'react-modal';

class PatientVersionModal extends Component {
  static propTypes = {
    isOpen: PropTypes.bool.isRequired,
    closeModal: PropTypes.func.isRequired,
    patientData: PropTypes.object,
    selectStu3: PropTypes.func.isRequired,
    selectDstu2: PropTypes.func.isRequired
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
                FHIR version could not be automatically detected. Please select the FHIR
                version of this patient from the options below.
              </div>
            </main>
            <footer className="modal__footer">
              <button className="primary-button"
                      onClick={ () => this.props.selectStu3(this.props.patientData) }>
                      STU3
              </button>
              <button className="primary-button"
                      onClick={ () => this.props.selectDstu2(this.props.patientData) }>
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
