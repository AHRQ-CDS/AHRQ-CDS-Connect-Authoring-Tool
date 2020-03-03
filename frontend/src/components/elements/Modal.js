import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ReactModal from 'react-modal';
import FontAwesome from 'react-fontawesome';

export default class Modal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      classNames: Modal.modalClassNames(props)
    };
  }

  UNSAFE_componentWillReceiveProps(nextProps) { // eslint-disable-line camelcase
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
      handleShowModal,
      handleCloseModal,
      modalTitle,
      modalId,
      hasSecondaryButton,
      modalSubmitButtonText,
      submitDisabled,
      children
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
            {hasSecondaryButton
              && <button type="button" className="secondary-button"
              onClick={handleCloseModal}
              aria-label="Cancel">
              Cancel
            </button>}
            {modalSubmitButtonText
              && <button
                type="submit"
                disabled={submitDisabled}
                className={`primary-button ${submitDisabled ? 'disabled-button' : ''}`}
                aria-label={modalSubmitButtonText}>
                {modalSubmitButtonText}
              </button>}
          </footer>
        </form>
      </ReactModal>
    );
  }
}

Modal.propTypes = {
  modalTitle: PropTypes.string.isRequired,
  modalId: PropTypes.string.isRequired,
  modalSubmitButtonText: PropTypes.string,
  submitDisabled: PropTypes.bool,
  modalTheme: PropTypes.string,
  hasSecondaryButton: PropTypes.bool,
  handleShowModal: PropTypes.bool.isRequired,
  handleCloseModal: PropTypes.func.isRequired,
  handleSaveModal: PropTypes.func.isRequired,
  children: PropTypes.element.isRequired
};

Modal.defaultTypes = {
  hasSecondaryButton: true,
  submitDisabled: false
};
