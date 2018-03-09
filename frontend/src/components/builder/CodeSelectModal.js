import React, { Component } from 'react';
import PropTypes from 'prop-types';
import FontAwesome from 'react-fontawesome';
import Select from 'react-select';

import Modal from 'react-modal';

class CodeSelectModal extends Component {
  constructor(props) {
    super(props);

    this.state = {
      showCodeSelectModal: false,
      codeText: '',
      codeSystemText: '',
      selectedCS: null,
      displayOtherInput: false
    };
  }
  
  openCodeSelectModal = () => {
    this.setState({ showCodeSelectModal: true });
  }

  closeCodeSelectModal = () => {
    // Reset modal when closing
    this.setState({ 
      showCodeSelectModal: false,
      codeText: '',
      codeSystemText: '',
      selectedCS: null,
      displayOtherInput: false
    });
  }
  
  enterKeyCheck = (func, argument, event) => {
    if (!event || event.type !== 'keydown' || event.key !== 'Enter') return;
    event.preventDefault();
    if (argument) { func(argument); } else { func(); }
  }
  
  handleSearchValueChange = (event) => {
    const codeText = event.target.value;
    this.setState({ codeText });
  }
  
  handleOtherCodeSystemChange = (event) => {
    const codeSystemText = event.target.value;
    this.setState({ codeSystemText });
  }
  
  onCodeSystemSelected = (selectedCS) => {
    if (selectedCS.value === 'Other') {
      this.setState({ selectedCS, displayOtherInput: true });
    } else {
      this.setState({ selectedCS, displayOtherInput: false });
    }
  }
  
  chooseCode = () => {
    const codes = [{ code: this.state.codeText, codeSystem: this.state.selectedCS.value }];
    const selectedTemplate = this.props.template;
    selectedTemplate.parameters[0].value = `${codes[0].codeSystem} ${codes[0].code}`;
    selectedTemplate.parameters[1].codes = codes;
    selectedTemplate.parameters[1].static = true;
    this.props.onElementSelected(selectedTemplate);
    this.closeCodeSelectModal();
  }
  
  render() {
    const codeInputLabel = 'Enter code';
    const otherInputLabel = 'Enter code system URI or OID';
    const codeSystemOptions = [
      { value: 'SNOMED', label: 'SNOMED'},
      { value: 'ICD-9', label: 'ICD-9'},
      { value: 'ICD-10', label: 'ICD-10'},
      { value: 'NIC', label: 'NIC'},
      { value: 'LOINC', label: 'LOINC'},
      { value: 'Other', label: 'Other'}
    ];
    return (
      <span className={ `element-select__modal element-modal` }>
        <button className="primary-button" onClick={this.openCodeSelectModal}>
          <FontAwesome name="medkit" />{' '}Choose Code
        </button>
        <Modal
          isOpen={ this.state.showCodeSelectModal }
          onRequestClose={ this.closeCodeSelectModal }
          shouldCloseOnOverlayClick={ true }
          contentLabel="Choose code"
          className="modal-style modal-style__light modal-style--full-height element-modal"
          overlayClassName='modal-overlay modal-overlay__dark'>
          <div className="element-modal__container">
            <header className="modal__header">
              <span className="modal__heading">Choose Code</span>
            </header>
            <main className="modal__body">
              <div className="element-modal__search">
                <input
                  type="text"
                  placeholder={ codeInputLabel }
                  aria-label={ codeInputLabel }
                  title={ codeInputLabel }
                  value={ this.state.codeText }
                  onChange={ this.handleSearchValueChange }
                />
                <Select
                  className="element-select__element-field"
                  placeholder={`Select code system`}
                  aria-label={`Select code system`}
                  clearable={false}
                  value={this.state.selectedCS}
                  options={codeSystemOptions}
                  onChange={this.onCodeSystemSelected}
                  />
                  {/* TODO style this under the select element */}
                  {
                    this.state.displayOtherInput ? 
                    <input
                      type="text"
                      placeholder={ otherInputLabel }
                      aria-label={ otherInputLabel }
                      title={ otherInputLabel }
                      value={ this.state.codeSystemText }
                      onChange={ this.handleOtherCodeSystemChange }
                    />
                    : null
                  }
                  <button className="primary-button element-modal__searchbutton" onClick={ this.chooseCode }>
                    Select
                  </button>
              </div>
            </main>
            <footer className="modal__footer">
              <button className="primary-button"
                      onClick={ this.closeCodeSelectModal }
                      onKeyDown={ e => this.enterKeyCheck(this.closeCodeSelectModal, null, e) }>
                      Close
              </button>
            </footer>
          </div>
        </Modal>
      </span>
    );
  }
}

CodeSelectModal.propTypes = {
  // TODO
};

export default CodeSelectModal;
