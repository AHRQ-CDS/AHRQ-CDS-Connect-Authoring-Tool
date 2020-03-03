import React, { Component } from 'react';
import PropTypes from 'prop-types';
import FontAwesome from 'react-fontawesome';
import _ from 'lodash';
import Modal from 'react-modal';

import StyledSelect from '../elements/StyledSelect';
import { getFieldWithId, getFieldWithType } from '../../utils/instances';

export default class CodeSelectModal extends Component {
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

    this.props.resetCodeValidation();
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
    if (!selectedCS) {
      this.setState({ selectedCS: null, displayOtherInput: false });
    } else if (selectedCS.value === 'Other') {
      this.setState({ selectedCS, displayOtherInput: true });
    } else {
      this.setState({ selectedCS, displayOtherInput: false });
    }
  }

  validateCode = () => {
    if (this.props.vsacFHIRCredentials) {
      const username = this.props.vsacFHIRCredentials.username;
      const password = this.props.vsacFHIRCredentials.password;

      let selectedCodeSystemId;
      if (!this.state.selectedCS) {
        selectedCodeSystemId = '';
      } else if (this.state.selectedCS.value === 'Other') {
        selectedCodeSystemId = this.state.codeSystemText;
      } else {
        selectedCodeSystemId = this.state.selectedCS.id;
      }

      this.props.validateCode(this.state.codeText, selectedCodeSystemId, username, password);
    }
  }

  chooseCode = () => {
    // Updating a modifier is different than selecting the code for a base element
    if (this.props.updateModifier) {
      this.props.updateModifier({
        display: this.props.codeData ? this.props.codeData.display : '',
        code: this.state.codeText,
        codeSystem: { name: this.state.selectedCS.value, id: this.state.selectedCS.id || this.state.codeSystemText }
      });

      this.closeCodeSelectModal();
      return;
    }

    // If adding to a parameter, add it
    if (this.props.addToParameter) {
      if (this.state.selectedCS === null) return;
      this.props.addToParameter({
        system: this.state.selectedCS.value,
        uri: this.state.selectedCS.id || this.state.codeSystemText,
        code: this.state.codeText,
        display: this.props.codeData ? this.props.codeData.display : ''
      });

      this.closeCodeSelectModal();
      return;
    }

    const selectedTemplate = _.cloneDeep(this.props.template);
    if (selectedTemplate === undefined) return;

    // Push the newly selected code
    const vsacField = getFieldWithType(selectedTemplate.fields, '_vsac');
    let codesToAdd = vsacField.codes;
    if (codesToAdd === undefined) codesToAdd = [];
    if (this.state.selectedCS === null) return;

    const newCode = {
      code: this.state.codeText,
      codeSystem: { name: this.state.selectedCS.value, id: this.state.selectedCS.id },
      display: this.props.codeData ? this.props.codeData.display : ''
    };
    if (this.state.selectedCS.value === 'Other') newCode.codeSystem.id = this.state.codeSystemText;
    codesToAdd.push(newCode);

    const nameField = getFieldWithId(selectedTemplate.fields, 'element_name');
    const lastCodeIndex = codesToAdd.length - 1;

    // Adding a new element and editing an existing element use different functions that take different parameters
    if (this.props.onElementSelected) {
      // Set the template's values initially to add it to the workspace.
      if (nameField.value === undefined || nameField.value === '') {
        if (this.props.codeData && this.props.codeData.display && this.props.codeData.display.length < 60) {
          nameField.value = this.props.codeData.display;
        } else {
          nameField.value = `${codesToAdd[lastCodeIndex].codeSystem.name} ${codesToAdd[lastCodeIndex].code}`;
        }
      }
      vsacField.codes = codesToAdd;
      vsacField.static = true;
      this.props.onElementSelected(selectedTemplate);
    } else if (this.props.updateElement) {
      // Update an existing element in the workspace
      // Create array of which field to update, the new value to set, and the attribute to update (value is default)
      const arrayToUpdate = [
        { [vsacField.id]: codesToAdd, attributeToEdit: 'codes' },
        { [vsacField.id]: true, attributeToEdit: 'static' }
      ];
      if (nameField.value === undefined || nameField.value === '') {
        let newName;
        if (this.props.codeData && this.props.codeData.display && this.props.codeData.display.length < 60) {
          newName = this.props.codeData.display;
        } else {
          newName = `${codesToAdd[lastCodeIndex].codeSystem.name} ${codesToAdd[lastCodeIndex].code}`;
        }
        arrayToUpdate.push({ [nameField.id]: newName });
      }
      this.props.updateElement(arrayToUpdate);
    }
    this.closeCodeSelectModal();
  }

  renderCodeValidation = () => {
    if (this.props.isValidCode === true) {
      return (
        <span className='modal__footer_status'>
          <FontAwesome name='check-circle'/> Validation Successful!
        </span>
      );
    } else if (this.props.isValidCode === false) {
      return (
        <span className='modal__footer_status'>
          <FontAwesome name='exclamation-triangle'/> Validation Error: Unable to validate code and/or code system.
          Please try again, or select this code without validation.
        </span>
      );
    }
    return null;
  }

  renderCodeData = () => {
    if (this.props.isValidatingCode) {
      return <div className="loading-icon"><FontAwesome name="spinner" spin/></div>;
    } else if (this.props.isValidCode) {
      return (
        <div className="code-display">
          <div className="code-display__code">{this.props.codeData.code}</div>
          <div className="code-display__system-name">{this.props.codeData.systemName}</div>
          <div className="code-display__display">{this.props.codeData.display}</div>
        </div>
      );
    }

    return null;
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
      { value: 'ICD-9-CM', label: 'ICD-9-CM', id: 'http://hl7.org/fhir/sid/icd-9-cm' },
      { value: 'ICD-10-CM', label: 'ICD-10-CM', id: 'http://hl7.org/fhir/sid/icd-10-cm' },
      { value: 'NCI', label: 'NCI', id: 'http://ncimeta.nci.nih.gov' },
      { value: 'LOINC', label: 'LOINC', id: 'http://loinc.org' },
      { value: 'RXNORM', label: 'RXNORM', id: 'http://www.nlm.nih.gov/research/umls/rxnorm' },
      { value: 'Other', label: 'Other' }
    ];

    return (
      <span className="element-select__modal element-modal">
        <button type="button"
          className="primary-button"
          onClick={this.openCodeSelectModal}
          aria-label={buttonLabels.openButtonText}>
          <FontAwesome name="medkit" />{' '}{buttonLabels.openButtonText}
        </button>

        <Modal
          isOpen={this.state.showCodeSelectModal}
          onRequestClose={this.closeCodeSelectModal}
          shouldCloseOnOverlayClick={ true }
          contentLabel="Choose code"
          className="modal-style modal-style__light modal-style--full-height code-select-modal element-modal"
          overlayClassName='modal-overlay modal-overlay__dark'>
          <div className="element-modal__container">
            <header className="modal__header">
              <span className="modal__heading">Choose Code</span>
              <button
                className="element__deletebutton transparent-button"
                onClick={this.closeCodeSelectModal}
                onKeyDown={e => this.enterKeyCheck(this.closeCodeSelectModal, null, e)}
                aria-label="Close Code Select Modal">
                <FontAwesome name='close'/>
              </button>
            </header>

            <main className="modal__body">
              <div className="element-modal__search">
                <input
                  className="element-modal__search-code"
                  type="text"
                  id="code-input"
                  placeholder={codeInputLabel}
                  aria-label={codeInputLabel}
                  title={codeInputLabel}
                  value={this.state.codeText}
                  onChange={this.handleSearchValueChange}
                />

                <div>
                  <StyledSelect
                    className="element-modal__search-system"
                    placeholder={'Select code system'}
                    aria-label="Select code system"
                    value={this.state.selectedCS}
                    options={codeSystemOptions}
                    onChange={this.onCodeSystemSelected}
                    classNamePrefix="search-system-select"
                  />

                  {this.state.displayOtherInput &&
                    <div className="element-modal__search-other-system">
                      <input
                        type="text"
                        id="other-code-system"
                        placeholder={otherInputLabel}
                        aria-label={otherInputLabel}
                        title={otherInputLabel}
                        value={this.state.codeSystemText}
                        onChange={this.handleOtherCodeSystemChange}
                      />
                    </div>
                  }
                </div>

                <button className="primary-button element-modal__search-button"
                  onClick={this.validateCode}
                  aria-label="Validate">
                  Validate
                </button>
              </div>

              {this.renderCodeData()}
            </main>

            <footer className="modal__footer">
              {this.renderCodeValidation()}

              <button className="secondary-button"
                onClick={this.closeCodeSelectModal}
                aria-label="Cancel">
              Cancel
              </button>

              <button
                className="primary-button element-modal__search-button"
                disabled={
                  !this.state.selectedCS
                  || !this.state.codeText
                  || (this.state.displayOtherInput && !this.state.codeSystemText)
                }
                onClick={this.chooseCode}
                aria-label="Select">
                Select
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
  template: PropTypes.object,
  updateElement: PropTypes.func,
  selectedCode: PropTypes.arrayOf(PropTypes.shape({
    code: PropTypes.string.isRequired,
    codeSystem: PropTypes.shape({ name: PropTypes.string.isRequired, id: PropTypes.string.isRequired })
  })),
  labels: PropTypes.object,
  updateModifier: PropTypes.func,
  addToParameter: PropTypes.func,
  isValidatingCode: PropTypes.bool,
  isValidCode: PropTypes.bool,
  codeData: PropTypes.object,
  validateCode: PropTypes.func,
  resetCodeValidation: PropTypes.func
};
