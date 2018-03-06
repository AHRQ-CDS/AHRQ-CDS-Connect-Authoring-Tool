import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Modal from 'react-modal';

class ELMErrorModal extends Component {
  static propTypes = {
    isOpen: PropTypes.bool.isRequired,
    closeModal: PropTypes.func.isRequired,
    errors: PropTypes.array.isRequired
  }

  enterKeyCheck = (func, argument, event) => {
    if (!event || event.type !== 'keydown' || event.key !== 'Enter') return;
    event.preventDefault();
    if (argument) { func(argument); } else { func(); }
  }

  render() {
    const uniqueErrors = [...new Set(this.props.errors.map(e => e.message))];

    return (
      <div className="element-modal">
        <Modal
          isOpen={this.props.isOpen}
          onRequestClose={this.props.closeModal}
          shouldCloseOnOverlayClick={ true }
          contentLabel="ELM Download Warnings"
          className="modal-style modal-style__light modal-style--full-height element-modal"
          overlayClassName='modal-overlay modal-overlay__dark'>
          <div className="element-modal__container">
            <header className="modal__header">
              <span className="modal__heading">About your download...</span>
            </header>
            <main className="modal__body">
              We detected some errors in the ELM files you just downloaded:
              <ul>
                {uniqueErrors.map((e, i) => <li key={i}> {e} </li>)}
              </ul>
            </main>
            <footer className="modal__footer">
              <button className="primary-button"
                      onClick={ this.props.closeModal }
                      onKeyDown={ e => this.enterKeyCheck(this.props.closeModal, null, e) }>
                      Close
              </button>
            </footer>
          </div>
        </Modal>
      </div>
    );
  }
}

export default ELMErrorModal;
