import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ReactModal from 'react-modal';
import FontAwesome from 'react-fontawesome';

// For screen readers to not see the background text
ReactModal.setAppElement('#root');

export default class Modal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      classNames: Modal.modalClassNames(props)
    };
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      classNames: Modal.modalClassNames(nextProps)
    });
  }

  static modalClassNames({ modalTheme, modalId }) {
    const classNames = {};

    if (modalTheme === 'light' || modalTheme == null) {
      classNames.modal = `${modalId}-modal element-modal modal-style modal-style__light`;
      classNames.overlay = 'modal-overlay modal-overlay__dark';
    } else {
      classNames.modal = `${modalId}-modal element-modal modal-style modal-style__dark`;
      classNames.overlay = 'modal-overlay modal-overlay__light';
    }

    return classNames;
  }

  handleFormSubmit = (event) => {
    event.preventDefault();
    this.props.handleSaveModal(event);
  }

  render() {
    const {
      handleShowModal, handleCloseModal, modalTitle, modalId,
      modalSubmitButtonText, children
    } = this.props;

    return (
      <ReactModal
        contentLabel={modalTitle}
        id={modalId}
        isOpen={handleShowModal}
        onRequestClose={handleCloseModal}
        className={this.state.classNames.modal}
        shouldCloseOnOverlayClick={false}
        overlayClassName={this.state.classNames.overlay}>

        <div className="modal__header">
          <div className="modal__heading">{modalTitle}</div>

          <div className="modal__buttonbar">
            <button type="button" onClick={handleCloseModal} className="modal__deletebutton" aria-label="close modal">
              <FontAwesome fixedWidth name='close' />
            </button>
          </div>
        </div>

        <form onSubmit={this.handleFormSubmit}>
          <div className="modal__body">
            {children}
          </div>

          <footer className="modal__footer">
            <button type="button" className="secondary-button" onClick={handleCloseModal}>Cancel</button>
            <button type="submit" className="primary-button">{modalSubmitButtonText}</button>
          </footer>
        </form>
      </ReactModal>
    );
  }
}

Modal.propTypes = {
  modalTitle: PropTypes.string.isRequired,
  modalId: PropTypes.string.isRequired,
  modalSubmitButtonText: PropTypes.string.isRequired,
  modalTheme: PropTypes.string,
  handleShowModal: PropTypes.bool.isRequired,
  handleCloseModal: PropTypes.func.isRequired,
  handleSaveModal: PropTypes.func.isRequired,
  children: PropTypes.element.isRequired
};
