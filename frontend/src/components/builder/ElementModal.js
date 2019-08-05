import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Modal from 'react-modal';
import FontAwesome from 'react-fontawesome';
import _ from 'lodash';

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

    let valuesetsToAdd = selectedTemplate.fields[1].valueSets;
    if (valuesetsToAdd === undefined) {
      valuesetsToAdd = [];
    }
    valuesetsToAdd.push({ name: element.name, oid: element.oid });
    const nameField = selectedTemplate.fields[0];

    // Adding a new element and editing an existing element use different functions that take different parameters
    if (this.props.onElementSelected) {
      // Set the template's values based on value set selection initially to add it to the workspace.
      if (!nameField.value) {
        // Only set name of element if there isn't one already.
        selectedTemplate.fields[0].value = element.name;
      }
      selectedTemplate.fields[1].valueSets = valuesetsToAdd;
      selectedTemplate.fields[1].static = true;
      this.props.onElementSelected(selectedTemplate);
    } else if (this.props.updateElement) {
      // Update an existing element in the workspace
      // Create array of which field to update, the new value to set, and the attribute to update (value is default)
      const arrayToUpdate = [
        { [selectedTemplate.fields[1].id]: valuesetsToAdd, attributeToEdit: 'valueSets' },
        { [selectedTemplate.fields[1].id]: true, attributeToEdit: 'static' }
      ];
      if (!nameField.value) {
        // Only set name of element if there isn't one already.
        arrayToUpdate.push({ [selectedTemplate.fields[0].id]: element.name });
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
        <tr key={ `${elem.name}-${i}` }
          tabIndex="0"
          aria-label={elem.name}
          onClick={() => this.handleElementSelected(elem)}
          onKeyDown={e => this.enterKeyCheck(this.handleElementSelected, elem, e)}>
            <td data-th="Name">{this.renderName(elem.name, elem.oid)}</td>
            <td data-th="Steward">{elem.steward}</td>
            <td data-th="Codes">{elem.codeCount}</td>
        </tr>)
      }
    </tbody>
  )

  renderDetailsList = () => (
    <tbody aria-label="Value Set Details List">
      {this.props.vsacDetailsCodes.map((code, i) =>
        <tr key={`${code.code}-${i}`}
          aria-label={code.displayName}>
          <td data-th="Code">{code.code}</td>
          <td data-th="Name">{code.displayName}</td>
          <td data-th="Code System">{code.codeSystemName}</td>
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
        <table className="search__table">
          <thead>
            <tr>
              <th>Code</th>
              <th>Name</th>
              <th>Code System</th>
            </tr>
          </thead>

          {this.renderDetailsList()}
        </table>
      );
    } else if (this.props.vsacSearchResults && this.props.vsacSearchResults.length > 0) {
      return (
        <table className="search__table selectable icons">
          <thead>
            <tr>
              <th>Name/OID</th>
              <th>Steward</th>
              <th>Codes</th>
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
      <button className="primary-button element-modal__searchbutton" onClick={this.searchVSAC}>
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
        onClick={this.handleChosenVS}>
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
          onKeyDown={e => this.enterKeyCheck(this.openModal, null, e)}>
          <FontAwesome name={this.props.iconForButton}/>
        </span>
      );
    }

    return (
      <button
        className="primary-button"
        onClick={this.openModal}
        onKeyDown={e => this.enterKeyCheck(this.openModal, null, e)}>
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
                aria-label={'Close Value Set Select Modal'}>
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
                onKeyDown={ e => this.enterKeyCheck(this.closeModal, null, e) }>
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
