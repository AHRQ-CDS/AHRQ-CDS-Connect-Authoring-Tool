import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import Modal from 'react-modal';

import Inspector from 'react-inspector';

export default class Patient extends Component {
  constructor(props) {
    super(props);

    this.state = {
      modalIsOpen: false
    };
  }

  openModal() {
    this.setState({modalIsOpen: true});
  }

  closeModal() {
    this.setState({modalIsOpen: false});
  }

  render() {
    const { index, bundle, deletePatient } = this.props;

    return (
        <div key={`patient-${index}`} className="card-group">
          <Modal
            style={{"max-height": "100%", "overflow-y": "auto"}}
            isOpen={this.state.modalIsOpen}
            onRequestClose={this.closeModal.bind(this)}
            shouldCloseOnOverlayClick={true}
            className="modal-style modal-style__light modal-style--full-height element-modal"
            overlayClassName='modal-overlay modal-overlay__dark'
          >
            <div className="element-modal__container">
              <header className="modal__header">
                <span className="modal__heading">Patient Data</span>
              </header>
              <main className="modal__body">
                <Inspector data={this.props.bundle} />
              </main>
              <footer className="modal__footer">
                <button className="primary-button"
                  onClick={this.closeModal.bind(this)}
                  onKeyDown={ e => this.enterKeyCheck(this.closeModal.bind(this), null, e) }>
                  Close
                </button>
              </footer>
            </div>
          </Modal>

          {!_.chain(bundle)
            .get('entry')
            .find({"resource": {"resourceType": "Patient"}})
            .value()
            && <div className="warning">Warning: No valid FHIR DSTU2 Patient in Bundle.</div>}
          <label>
            {_.chain(bundle)
              .get('entry')
              .find({"resource": {"resourceType": "Patient"}})
              .get('resource.name[0].given[0]')
              .value()}
            {_.chain(bundle)
              .get('entry')
              .find({"resource": {"resourceType": "Patient"}})
              .get('resource.name[0].family[0]')
              .value()}
          </label>
          <button className="button primary-button" onClick={() => { this.openModal(); }}>
            View Data
          </button>
        <button className="button primary-button" onClick={() => { deletePatient(index); }}>
          Delete Patient
        </button>
      </div>
    );
  }
}

Patient.propTypes = {
  index: PropTypes.number.isRequired,
  bundle: PropTypes.object.isRequired,
  deletePatient: PropTypes.func.isRequired,
};
