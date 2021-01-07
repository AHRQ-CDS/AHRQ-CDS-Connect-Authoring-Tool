import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button, IconButton, TextField } from '@material-ui/core';
import {
  ArrowBackIos as ArrowBackIosIcon,
  List as ListIcon,
  Visibility as VisibilityIcon
} from '@material-ui/icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner} from '@fortawesome/free-solid-svg-icons';
import classnames from 'classnames';
import _ from 'lodash';

import { Modal } from 'components/elements';
import { getFieldWithId, getFieldWithType } from 'utils/instances';

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

  searchVSAC = event => {
    event.preventDefault();

    this.props.searchVSACByKeyword(
      this.state.searchValue,
      this.props.vsacApiKey
    );
  }

  handleElementSelected = (selectedElement) => {
    this.props.getVSDetails(
      selectedElement.oid,
      this.props.vsacApiKey
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
        this.props.vsacApiKey
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
        <div className="loading-icon"><FontAwesomeIcon icon={faSpinner} spin/></div>
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

  renderBackButton = () => (
    <IconButton
      aria-label="back"
      color="primary"
      onClick={this.backToSearchResults}
    >
      <ArrowBackIosIcon fontSize="small" />
    </IconButton>
  );

  renderButtonToOpenModal = () => {
    const { labels, useIconButton } = this.props;
    let buttonLabels = {
      openButtonText: 'Add Value Set',
      closeButtonText: 'Cancel'
    };

    if (labels) buttonLabels = labels;

    if (useIconButton) {
      return (
        <IconButton
          aria-label={buttonLabels.openButtonText}
          color="primary"
          onClick={this.openModal}
        >
          <VisibilityIcon />
        </IconButton>
      );
    }

    return (
      <Button
        color="primary"
        onClick={this.openModal}
        startIcon={<ListIcon />}
        variant="contained"
      >
        {buttonLabels.openButtonText}
      </Button>
    );
  }

  renderModalHeader = () => {
    const { viewOnly } = this.props;
    const { searchValue, selectedElement } = this.state;

    let inputDisplayValue;
    if (selectedElement) {
      inputDisplayValue = `${selectedElement.name} (${selectedElement.oid})`;
    } else {
      inputDisplayValue = searchValue;
    }

    return (
      <div className="element-modal__header">
        <div className="element-modal__search-container">
          {!viewOnly && selectedElement && this.renderBackButton()}

          <form onSubmit={this.searchVSAC} className="element-modal__search">
            <TextField
              fullWidth
              label="Value set keyword"
              onChange={this.handleSearchValueChange}
              value={inputDisplayValue}
              variant="outlined"
            />

            {!viewOnly && !selectedElement &&
              <Button type="submit" color="primary" variant="contained">
                Search
              </Button>
            }
          </form>
        </div>
      </div>
    );
  };

  render() {
    const { className, viewOnly, vsacSearchCount } = this.props;
    const { isOpen, selectedElement } = this.state;

    return (
      <div className={classnames('element-modal', className)}>
        <div id="open-modal-button">{this.renderButtonToOpenModal()}</div>

        <Modal
          handleCloseModal={this.closeModal}
          handleSaveModal={this.handleChosenVS}
          handleShowModal={isOpen}
          hasCancelButton
          hasEnterKeySubmit={false}
          hasTitleIcon={vsacSearchCount > 0}
          hideSubmitButton={viewOnly}
          Header={this.renderModalHeader()}
          maxWidth="xl"
          submitButtonText="Select"
          submitDisabled={!selectedElement}
          title="Choose value sets"
          TitleIcon={<><ListIcon /> {selectedElement ? 1 : vsacSearchCount}</>}
        >
          <div className="element-modal__content">
            {this.renderSearchResultsTable()}
          </div>
        </Modal>
      </div>
    );
  }
}

ElementModal.propTypes = {
  getVSDetails: PropTypes.func.isRequired,
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
