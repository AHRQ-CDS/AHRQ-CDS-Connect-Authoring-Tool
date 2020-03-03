import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Modal from 'react-modal';
import FontAwesome from 'react-fontawesome';
import _ from 'lodash';

import { getFieldWithId, getFieldWithType } from '../../utils/instances';

export default class ElementModal extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isOpen: false,
      searchValue: '',
      selectedElement: null
    };
  }

  handleSearchValueChange = (event) => {
    const searchValue = event.target.value;

    // Only update input box value if searching, not if viewing VS details.
    if (!this.state.selectedElement) this.setState({ searchValue });
  }

  searchVSAC = () => {
    this.props.searchVSACByKeyword(
      this.state.searchValue,
      this.props.vsacFHIRCredentials.username,
      this.props.vsacFHIRCredentials.password
    );
  }

  handleElementSelected = (selectedElement) => {
    this.props.getVSDetails(
      selectedElement.oid,
      this.props.vsacFHIRCredentials.username,
      this.props.vsacFHIRCredentials.password
    );
    this.setState({ selectedElement: { name: selectedElement.name, oid: selectedElement.oid } });
  }

  handleChosenVS = () => {
    const element = this.state.selectedElement;
    const selectedTemplate = _.cloneDeep(this.props.template);

    // Updating a modifier is different than selecting the value set for a base element
    if (this.props.updateModifier) {
      this.props.updateModifier({ name: element.name, oid: element.oid });
      this.closeModal();
      return;
    }

    if (selectedTemplate === undefined) return;

    const vsacField = getFieldWithType(selectedTemplate.fields, '_vsac');

    let valuesetsToAdd = vsacField.valueSets;
    if (valuesetsToAdd === undefined) {
      valuesetsToAdd = [];
    }
    valuesetsToAdd.push({ name: element.name, oid: element.oid });
    const nameField = getFieldWithId(selectedTemplate.fields, 'element_name');

    // Adding a new element and editing an existing element use different functions that take different parameters
    if (this.props.onElementSelected) {
      // Set the template's values based on value set selection initially to add it to the workspace.
      if (!nameField.value) {
        // Only set name of element if there isn't one already.
        nameField.value = element.name;
      }
      vsacField.valueSets = valuesetsToAdd;
      vsacField.static = true;
      this.props.onElementSelected(selectedTemplate);
    } else if (this.props.updateElement) {
      // Update an existing element in the workspace
      // Create array of which field to update, the new value to set, and the attribute to update (value is default)
      const arrayToUpdate = [
        { [vsacField.id]: valuesetsToAdd, attributeToEdit: 'valueSets' },
        { [vsacField.id]: true, attributeToEdit: 'static' }
      ];
      if (!nameField.value) {
        // Only set name of element if there isn't one already.
        arrayToUpdate.push({ [nameField.id]: element.name });
      }
      this.props.updateElement(arrayToUpdate);
    }
    this.closeModal();
  }

  backToSearchResults = () => {
    this.setState({ selectedElement: null });
  }

  openModal = () => {
    const { selectedElement } = this.props;
    this.setState({ isOpen: true, selectedElement });

    if (selectedElement) {
      this.props.getVSDetails(
        selectedElement.oid,
        this.props.vsacFHIRCredentials.username,
        this.props.vsacFHIRCredentials.password
      );
    }
  }

  closeModal = () => {
    this.handleSearchValueChange({ target: { value: '' } }); // Always start with no search term filtering
    this.props.searchVSACByKeyword('');
    this.setState({ isOpen: false, selectedElement: null, searchValue: '' });
  }

  enterKeyCheck = (func, argument, event) => {
    if (!event || event.type !== 'keydown' || event.key !== 'Enter') return;
    event.preventDefault();
    if (argument) { func(argument); } else { func(); }
  }

  renderName = (name, oid) => (
    <div>
      <div>{name}</div>
      <div className="result-oid">{oid}</div>
    </div>
  );

  renderList = () => (
    <tbody aria-label="Element List">
      {this.props.vsacSearchResults
        .sort((a, b) => b.codeCount - a.codeCount)
        .map((elem, i) =>
        <tr role="row" key={ `${elem.name}-${i}` }
          tabIndex="0"
          aria-label={elem.name}
          onClick={() => this.handleElementSelected(elem)}
          onKeyDown={e => this.enterKeyCheck(this.handleElementSelected, elem, e)}>
            <td role="gridcell" data-th="Name" tabIndex={0}>{this.renderName(elem.name, elem.oid)}</td>
            <td role="gridcell" data-th="Steward" tabIndex={0}>{elem.steward}</td>
            <td role="gridcell" data-th="Codes" tabIndex={0}>{elem.codeCount}</td>
        </tr>)
      }
    </tbody>
  )

  renderDetailsList = () => (
    <tbody aria-label="Value Set Details List">
      {this.props.vsacDetailsCodes.map((code, i) =>
        <tr role="row" key={`${code.code}-${i}`}
          aria-label={code.displayName}>
          <td role="gridcell" data-th="Code" tabIndex={0}>{code.code}</td>
          <td role="gridcell" data-th="Name" tabIndex={0}>{code.displayName}</td>
          <td role="gridcell" data-th="Code System" tabIndex={0}>{code.codeSystemName}</td>
        </tr>)
      }
    </tbody>
  );

  renderErrorMessage = () => (
    <div className="modal__content">
      {this.props.vsacDetailsCodesError}
    </div>
  );

  renderSearchResultsTable = () => {
    if (this.props.isSearchingVSAC || this.props.isRetrievingDetails) {
      return (
        <div className="loading-icon"><FontAwesome name="spinner" spin/></div>
      );
    } else if (this.state.selectedElement) {
      if (this.props.vsacDetailsCodesError) {
        return this.renderErrorMessage();
      }

      return (
        <table role="grid" className="search__table">
          <thead>
            <tr role="row">
              <th role="columnheader" tabIndex={0}>Code</th>
              <th role="columnheader" tabIndex={0}>Name</th>
              <th role="columnheader" tabIndex={0}>Code System</th>
            </tr>
          </thead>

          {this.renderDetailsList()}
        </table>
      );
    } else if (this.props.vsacSearchResults && this.props.vsacSearchResults.length > 0) {
      return (
        <table role="grid" className="search__table selectable icons">
          <thead>
            <tr role="row">
              <th role="columnheader" tabIndex={0}>Name/OID</th>
              <th role="columnheader" tabIndex={0}>Steward</th>
              <th role="columnheader" tabIndex={0}>Codes</th>
            </tr>
          </thead>

          {this.renderList()}
        </table>
      );
    }

    return null;
  }

  renderSearchButton = () => {
    if (this.props.viewOnly || this.state.selectedElement) return null;

    return (
      <button className="primary-button element-modal__searchbutton"
        onClick={this.searchVSAC}
        aria-label="Search">
        Search
      </button>
    );
  }

  renderSelectButton = () => {
    if (this.props.viewOnly) return null;

    return (
      <button
        disabled={!this.state.selectedElement}
        className="primary-button element-modal__searchbutton"
        onClick={this.handleChosenVS}
        aria-label="Select">
        Select
      </button>
    );
  }

  renderBackButton = () => {
    if (this.props.viewOnly) return null;

    if (this.state.selectedElement) {
      return (
        <span className="nav-icon"
          role="button"
          tabIndex="0"
          onClick={this.backToSearchResults}
          onKeyDown={e => this.enterKeyCheck(this.backToSearchResults, null, e)}>
          <FontAwesome name="arrow-left" />
        </span>
      );
    }

    return null;
  }

  renderButtonToOpenModal = (buttonLabels) => {
    if (this.props.useIconButton) {
      return (
        <span
          role="button"
          tabIndex="0"
          onClick={this.openModal}
          onKeyDown={e => this.enterKeyCheck(this.openModal, null, e)}
          aria-label={buttonLabels.openButtonText}>
          <FontAwesome name={this.props.iconForButton}/>
        </span>
      );
    }

    return (
      <button
        className="primary-button"
        onClick={this.openModal}
        onKeyDown={e => this.enterKeyCheck(this.openModal, null, e)}
        aria-label={buttonLabels.openButtonText}>
        <FontAwesome name="th-list" />{' '}{buttonLabels.openButtonText}
      </button>
    );
  }

  render() {
    const modalInputLabel = 'Enter value set keyword...';

    let buttonLabels = {
      openButtonText: 'Add Value Set',
      closeButtonText: 'Cancel'
    };

    if (this.props.labels) {
      buttonLabels = this.props.labels;
    }

    let inputDisplayValue;
    if (this.state.selectedElement) {
      inputDisplayValue = `${this.state.selectedElement.name} (${this.state.selectedElement.oid})`;
    } else {
      inputDisplayValue = this.state.searchValue;
    }

    return (
      <span className={ `${this.props.className} element-modal` }>
        <span id="open-modal-button">{this.renderButtonToOpenModal(buttonLabels)}</span>

        <Modal
          isOpen={ this.state.isOpen }
          onRequestClose={ this.closeModal }
          shouldCloseOnOverlayClick={ true }
          contentLabel="Browse elements"
          className="modal-style modal-style__light modal-style--full-height element-modal"
          overlayClassName='modal-overlay modal-overlay__dark'>
          <div className="element-modal__container">
            <header className="modal__header">
              <span className="modal__heading">Choose Value Sets</span>
              { this.props.vsacSearchCount > 0 ?
                <span><FontAwesome name="th-list" />
                  {' '}{this.state.selectedElement ? 1 : this.props.vsacSearchCount}
                </span> :
                null}
              <button
                className="element__deletebutton transparent-button"
                onClick={this.closeModal}
                onKeyDown={e => this.enterKeyCheck(this.closeModal, null, e)}
                aria-label="Close Value Set Select Modal">
                <FontAwesome name='close' />
              </button>
            </header>

            <main className="modal__body">
              <div className="element-modal__search">
                {this.renderBackButton()}

                <input
                  type="text"
                  disabled={this.state.selectedElement}
                  placeholder={ modalInputLabel }
                  aria-label={ modalInputLabel }
                  title={ modalInputLabel }
                  value={ inputDisplayValue }
                  onChange={ this.handleSearchValueChange }
                  onKeyDown={ e => this.enterKeyCheck(this.searchVSAC, this.state.searchValue, e)}/>

                {this.renderSearchButton()}
              </div>

              <div className="element-modal__content">
                {this.renderSearchResultsTable()}
              </div>
            </main>

            <footer className="modal__footer">
              <button
                className="secondary-button"
                onClick={ this.closeModal }
                onKeyDown={ e => this.enterKeyCheck(this.closeModal, null, e) }
                aria-label="Close">
                {buttonLabels.closeButtonText}
              </button>
              {this.renderSelectButton()}
            </footer>
          </div>
        </Modal>
      </span>
    );
  }
}

ElementModal.propTypes = {
  getVSDetails: PropTypes.func.isRequired,
  iconForButton: PropTypes.string,
  isRetrievingDetails: PropTypes.bool.isRequired,
  isSearchingVSAC: PropTypes.bool.isRequired,
  labels: PropTypes.object,
  onElementSelected: PropTypes.func,
  searchVSACByKeyword: PropTypes.func.isRequired,
  selectedElement: PropTypes.shape({ name: PropTypes.string.isRequired, oid: PropTypes.string.isRequired }),
  template: PropTypes.object,
  updateElement: PropTypes.func,
  useIconButton: PropTypes.bool,
  viewOnly: PropTypes.bool,
  vsacDetailsCodes: PropTypes.array.isRequired,
  vsacDetailsCodesError: PropTypes.string,
  vsacSearchCount: PropTypes.number.isRequired,
  vsacSearchResults: PropTypes.array.isRequired,
};
