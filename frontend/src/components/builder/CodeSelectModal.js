import React, { Component } from 'react';
import PropTypes from 'prop-types';
import FontAwesome from 'react-fontawesome';
import Select from 'react-select';
import _ from 'lodash';

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
    this.handleSearchValueChange({ target: { value: '' } }); // Always start with no search term filtering
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
    const selectedTemplate = _.cloneDeep(this.props.template);
    if (selectedTemplate === undefined) return;

    // Push the newly selected code.
    let codesToAdd = selectedTemplate.parameters[1].codes;
    if (codesToAdd === undefined) {
      codesToAdd = [];
    }
    const newCode = {
      code: this.state.codeText, codeSystem: { name: this.state.selectedCS.value, id: this.state.selectedCS.id }
    };
    if (this.state.selectedCS.value === 'Other') {
      newCode.codeSystem.id = this.state.codeSystemText;
    }
    codesToAdd.push(newCode);

    // Adding a new element and editing an exisitng element use different functions that take different parameters
    if (this.props.onElementSelected) {
      // Set the template's values initially to add it to the workspace.
      selectedTemplate.parameters[0].value = `${codesToAdd[0].codeSystem.name} ${codesToAdd[0].code}`; // TODO: Best name for element
      selectedTemplate.parameters[1].codes = codesToAdd;
      selectedTemplate.parameters[1].static = true;
      this.props.onElementSelected(selectedTemplate);
    } else if (this.props.updateElement) {
      // Update an existing element in the workspace
      // Create array of which parameter to update, the new value to set, and the attribute to update (value is default)
      const arrayToUpdate = [
        { [selectedTemplate.parameters[0].id]: `${codesToAdd[0].codeSystem.name} ${codesToAdd[0].code}` },
        { [selectedTemplate.parameters[1].id]: codesToAdd, attributeToEdit: 'codes' },
        { [selectedTemplate.parameters[1].id]: true, attributeToEdit: 'static' }
      ];
      this.props.updateElement(arrayToUpdate);
    }
    this.closeCodeSelectModal();
  }

  render() {
    const codeInputLabel = 'Enter code';
    const otherInputLabel = 'Enter system URI or OID';
    let buttonLabels = {
      openButtonText: 'Add Code',
      closeButtonText: 'Close'
    };
    if (this.props.labels) {
      buttonLabels = this.props.labels;
    }

    const codeSystemOptions = [
      { value: 'SNOMED', label: 'SNOMED', id: 'http://snomed.info/sct' },
      { value: 'ICD-9', label: 'ICD-9', id: 'http://hl7.org/fhir/sid/icd-9-cm' },
      { value: 'ICD-10', label: 'ICD-10', id: 'http://hl7.org/fhir/sid/icd-10' },
      { value: 'NCI', label: 'NCI', id: 'http://ncimeta.nci.nih.gov' },
      { value: 'LOINC', label: 'LOINC', id: 'http://loinc.org' },
      { value: 'RXNORM', label: 'RXNORM', id: 'http://www.nlm.nih.gov/research/umls/rxnorm' },
      { value: 'Other', label: 'Other' }
    ];

    return (
      <span className="code-select-modal element-select__modal element-modal">
        <button className="primary-button" onClick={this.openCodeSelectModal}>
          <FontAwesome name="medkit" />{' '}{buttonLabels.openButtonText}
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
              <div className="element-modal__search row">
                <input
                  className="element-modal__search-code col-6"
                  type="text"
                  id="code-input"
                  placeholder={ codeInputLabel }
                  aria-label={ codeInputLabel }
                  title={ codeInputLabel }
                  value={ this.state.codeText }
                  onChange={ this.handleSearchValueChange }
                />

                <Select
                  className="element-modal__search-system col-4"
                  placeholder={'Select code system'}
                  aria-label={'Select code system'}
                  clearable={false}
                  value={this.state.selectedCS}
                  options={codeSystemOptions}
                  onChange={this.onCodeSystemSelected}
                />

                <button className="primary-button element-modal__search-button col-2" onClick={ this.chooseCode }>
                  Select
                </button>

                <div className="col-6"></div>
                {this.state.displayOtherInput ?
                  <div className="element-modal__search-other-system col-4">
                    <input
                      type="text"
                      id="other-code-system"
                      placeholder={ otherInputLabel }
                      aria-label={ otherInputLabel }
                      title={ otherInputLabel }
                      value={ this.state.codeSystemText }
                      onChange={ this.handleOtherCodeSystemChange }
                    />
                  </div>
                  : null
                }
                <div className="col-2"></div>
              </div>
            </main>

            <footer className="modal__footer">
              <button className="primary-button"
                      onClick={ this.closeCodeSelectModal }
                      onKeyDown={ e => this.enterKeyCheck(this.closeCodeSelectModal, null, e) }>
                      {buttonLabels.closeButtonText}
              </button>
            </footer>
          </div>
        </Modal>
      </span>
    );
  }
}

CodeSelectModal.propTypes = {
  onElementSelected: PropTypes.func,
  template: PropTypes.object.isRequired,
  updateElement: PropTypes.func,
  selectedCode: PropTypes.arrayOf(PropTypes.shape({
    code: PropTypes.string.isRequired,
    codeSystem: PropTypes.shape({ name: PropTypes.string.isRequired, id: PropTypes.string.isRequired })
  })),
  labels: PropTypes.object
};

export default CodeSelectModal;
