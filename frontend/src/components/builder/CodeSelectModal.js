import React, { Component } from 'react';
import PropTypes from 'prop-types';
import FontAwesome from 'react-fontawesome';
import Select from 'react-select';
import _ from 'lodash';
import axios from 'axios';
import Modal from 'react-modal';

export default class CodeSelectModal extends Component {
  constructor(props) {
    super(props);

    this.state = {
      showCodeSelectModal: false,
      codeText: '',
      codeSystemText: '',
      selectedCS: null,
      displayOtherInput: false,
      codeIsValid: null,
      codeData: null
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
      displayOtherInput: false,
      codeIsValid: null
    });
  }

  enterKeyCheck = (func, argument, event) => {
    if (!event || event.type !== 'keydown' || event.key !== 'Enter') return;
    event.preventDefault();
    if (argument) { func(argument); } else { func(); }
  }

  handleSearchValueChange = (event) => {
    const codeText = event.target.value;
    this.setState({ codeText, codeIsValid: null });
  }

  handleOtherCodeSystemChange = (event) => {
    const codeSystemText = event.target.value;
    this.setState({ codeSystemText });
  }

  onCodeSystemSelected = (selectedCS) => {
    if (selectedCS.value === 'Other') {
      this.setState({ selectedCS, codeIsValid: null, displayOtherInput: true });
    } else {
      this.setState({ selectedCS, codeIsValid: null, displayOtherInput: false });
    }
  }

  validateCode = () => {
    if (this.props.vsacFHIRCredentials) {
      const auth = {
        username: this.props.vsacFHIRCredentials.username,
        password: this.props.vsacFHIRCredentials.password
      };

      if (!this.state.codeText || !this.state.selectedCS) {
        this.setState({ codeIsValid: false });
        return;
      }

      axios.get(`/authoring/api/fhir/code?code=${this.state.codeText}&system=${this.state.selectedCS.id}`, { auth })
        .then(res => this.setState({ codeIsValid: true, codeData: res.data }))
        .catch(() => this.setState({ codeIsValid: false, codeData: null }));
    }
  }

  chooseCode = () => {
    const selectedTemplate = _.cloneDeep(this.props.template);

    // Updating a modifier is different than selecting the code for a base element
    if (this.props.updateModifier) {
      this.props.updateModifier({
        display: this.state.codeData ? this.state.codeData.display : '',
        code: this.state.codeText,
        codeSystem: { name: this.state.selectedCS.value, id: this.state.selectedCS.id || this.state.codeSystemText }
      });

      this.closeCodeSelectModal();
      return;
    }

    // If adding to a parameter, add it
    if (this.props.addToParameter) {
      this.props.addToParameter({
        system: this.state.selectedCS.value,
        uri: this.state.selectedCS.id || this.state.codeSystemText,
        code: this.state.codeText,
        display: this.state.codeData ? this.state.codeData.display : ''
      });

      this.closeCodeSelectModal();
      return;
    }

    if (selectedTemplate === undefined) return;

    // Push the newly selected code.
    let codesToAdd = selectedTemplate.parameters[1].codes;
    if (codesToAdd === undefined) {
      codesToAdd = [];
    }
    if (this.state.selectedCS === null) {
      return;
    }
    const newCode = {
      code: this.state.codeText,
      codeSystem: { name: this.state.selectedCS.value, id: this.state.selectedCS.id },
      display: this.state.codeData ? this.state.codeData.display : ''
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

  renderCodeValidation = () => {
    if (this.state.codeIsValid === true) {
      return (
        <span className='modal__footer_status'>
          <FontAwesome name='check-circle'/> Validation Successful!
        </span>
      );
    } else if (this.state.codeIsValid === false) {
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
    if (this.state.codeIsValid) {
      return (
        <div className="code-display">
          <div className="code-display__code">{this.state.codeData.code}</div>
          <div className="code-display__system-name">{this.state.codeData.systemName}</div>
          <div className="code-display__display">{this.state.codeData.display}</div>
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
          isOpen={this.state.showCodeSelectModal}
          onRequestClose={this.closeCodeSelectModal}
          shouldCloseOnOverlayClick={ true }
          contentLabel="Choose code"
          className="modal-style modal-style__light modal-style--full-height element-modal"
          overlayClassName='modal-overlay modal-overlay__dark'>
          <div className="element-modal__container">
            <header className="modal__header">
              <span className="modal__heading">Choose Code</span>
              <button
                className="element__deletebutton"
                onClick={this.closeCodeSelectModal}
                onKeyDown={e => this.enterKeyCheck(this.closeCodeSelectModal, null, e)}
                aria-label={'Close Code Select Modal'}>
                <FontAwesome name='close'/>
              </button>
            </header>

            <main className="modal__body">
              <div className="element-modal__search row">
                <input
                  className="element-modal__search-code col-6"
                  type="text"
                  id="code-input"
                  placeholder={codeInputLabel}
                  aria-label={codeInputLabel}
                  title={codeInputLabel}
                  value={this.state.codeText}
                  onChange={this.handleSearchValueChange}
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

                <button className="primary-button element-modal__search-button col-2" onClick={this.validateCode}>
                  Validate
                </button>

                <div className="col-6"></div>

                {this.state.displayOtherInput ?
                  <div className="element-modal__search-other-system col-4">
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
                  : null
                }

                <div className="col-2"></div>
              </div>

              {this.renderCodeData()}
            </main>

            <footer className="modal__footer">
              {this.renderCodeValidation()}

              <button className="primary-button element-modal__search-button" onClick={this.chooseCode}>
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
  addToParameter: PropTypes.func
};
