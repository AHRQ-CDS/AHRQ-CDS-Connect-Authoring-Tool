import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCheckCircle, faExclamationTriangle, faSpinner, faMedkit, faExclamationCircle
} from '@fortawesome/free-solid-svg-icons';
import _ from 'lodash';

import { Dropdown, Link, Modal } from 'components/elements';
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

  onCodeSystemSelected = (event, codeSystemOptions) => {
    const selectedCS = codeSystemOptions.find(option => option.value === event.target.value);

    if (!selectedCS) {
      this.setState({ selectedCS: null, displayOtherInput: false });
    } else if (selectedCS.value === 'Other') {
      this.setState({ selectedCS, displayOtherInput: true });
    } else {
      this.setState({ selectedCS, displayOtherInput: false });
    }
  }

  validateCode = () => {
    if (this.props.vsacApiKey) {
      let selectedCodeSystemId;
      if (!this.state.selectedCS) {
        selectedCodeSystemId = '';
      } else if (this.state.selectedCS.value === 'Other') {
        selectedCodeSystemId = this.state.codeSystemText;
      } else {
        selectedCodeSystemId = this.state.selectedCS.id;
      }

      this.props.validateCode(this.state.codeText, selectedCodeSystemId, this.props.vsacApiKey);
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
          <FontAwesomeIcon icon={faCheckCircle} /> Validation Successful!
        </span>
      );
    } else if (this.props.isValidCode === false) {
      return (
        <span className='modal__footer_status'>
          <FontAwesomeIcon icon={faExclamationTriangle} /> Validation Error: Unable to validate code and/or code system.
          Please try again, or select this code without validation.
        </span>
      );
    }
    return null;
  }

  renderCodeData = () => {
    const { isValidCode, isValidatingCode } = this.props;
    if (isValidatingCode) {
      return <div className="loading-icon"><FontAwesomeIcon icon={faSpinner} spin/></div>;
    } else if (isValidCode) {
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

  renderModalHeader = () => {
    const { codeSystemText, codeText, displayOtherInput, selectedCS } = this.state;
    const codeInputLabel = 'Enter code';
    const otherInputLabel = 'Enter system canonical URL';

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
      <div className="code-select-modal__header">
        {displayOtherInput &&
          <div className="notification">
            <FontAwesomeIcon icon={faExclamationCircle} />
            Code systems should use their canonical URL. See{' '}
            <Link
              external
              href="http://build.fhir.org/ig/HL7/cqf-recommendations/documentation-libraries.html"
              text="FHIR® Clinical Guidelines"
            />
            {' '}for more information.
          </div>
        }

        <div className="code-select-modal__search-container">
          <div className="code-select-modal__search">
            <input
              className="code-select-modal__search-code"
              type="text"
              id="code-input"
              placeholder={codeInputLabel}
              aria-label={codeInputLabel}
              title={codeInputLabel}
              value={codeText}
              onChange={this.handleSearchValueChange}
            />
          </div>

          <div className="code-select-modal__code-system">
            <Dropdown
              id="select-code-system"
              label="Code system"
              onChange={event => this.onCodeSystemSelected(event, codeSystemOptions)}
              options={codeSystemOptions}
              value={selectedCS ? selectedCS.value : ''}
            />
          </div>

          {displayOtherInput &&
            <div className="code-select-modal__search-other-system">
              <input
                type="text"
                id="other-code-system"
                placeholder={otherInputLabel}
                aria-label={otherInputLabel}
                title={otherInputLabel}
                value={codeSystemText}
                onChange={this.handleOtherCodeSystemChange}
              />
            </div>
          }

          <button
            className="primary-button code-select-modal__search-button"
            onClick={this.validateCode}
            aria-label="Validate"
          >
            Validate
          </button>
        </div>
      </div>
    );
  };

  render() {
    const { codeSystemText, codeText, displayOtherInput, selectedCS, showCodeSelectModal } = this.state;
    const { isValidCode, labels } = this.props;
    let buttonLabels = { openButtonText: 'Add Code', closeButtonText: 'Close'};
    if (labels) buttonLabels = labels;

    return (
      <span className="code-select-modal">
        <button type="button"
          className="primary-button"
          onClick={this.openCodeSelectModal}
          aria-label={buttonLabels.openButtonText}>
          <FontAwesomeIcon icon={faMedkit} />{' '}{buttonLabels.openButtonText}
        </button>

        <Modal
          Footer={isValidCode && this.renderCodeValidation()}
          handleCloseModal={this.closeCodeSelectModal}
          handleSaveModal={this.chooseCode}
          handleShowModal={showCodeSelectModal}
          hasCancelButton
          Header={this.renderModalHeader()}
          submitButtonText="Select"
          submitDisabled={!selectedCS || !codeText || (displayOtherInput && !codeSystemText)}
          title="Choose code"
        >
          <main className="modal__body code-select-modal__body">
            {this.renderCodeData()}
          </main>
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
