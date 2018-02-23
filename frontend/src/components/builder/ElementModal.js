import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Modal from 'react-modal';
import FontAwesome from 'react-fontawesome';
// import { sortAlphabeticallyByKey } from '../../utils/sort';

// const getRelevantElements = (category, value) => {
//   let elements = category.entries;
//   const inputValue = value.trim().toLowerCase();
//
//   if (inputValue.length) {
//     elements = elements.filter(elem => elem.name.toLowerCase().indexOf(inputValue) >= 0);
//   } else if (category.name === 'All') {
//     return elements.sort(sortAlphabeticallyByKey('category', 'name'));
//   } else {
//     return elements.sort(sortAlphabeticallyByKey('name'));
//   }
//
//   return elements.sort((a, b) => {
//     const aLower = a.name.toLowerCase();
//     const bLower = b.name.toLowerCase();
//     const queryPosA = aLower.indexOf(inputValue);
//     const queryPosB = bLower.indexOf(inputValue);
//
//     if (queryPosA !== queryPosB) {
//       return queryPosA - queryPosB;
//     }
//
//     return aLower < bLower ? -1 : 1;
//   });
// };

class ElementModal extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isOpen: false,
      searchValue: '',
      selectedElement: null
    };
  }

  static propTypes = {
    onElementSelected: PropTypes.func,
    searchVSACByKeyword: PropTypes.func.isRequired,
    isSearchingVSAC: PropTypes.bool.isRequired,
    vsacSearchResults: PropTypes.array.isRequired,
    vsacSearchCount: PropTypes.number.isRequired,
    template: PropTypes.object,
    getVSDetails: PropTypes.func.isRequired,
    isRetrievingDetails: PropTypes.bool.isRequired,
    vsacDetailsCodes: PropTypes.array.isRequired,
    selectedElement: PropTypes.shape({ name: PropTypes.string.isRequired, oid: PropTypes.string.isRequired }),
    labels: PropTypes.object
  }

  handleSearchValueChange = (event) => {
    const searchValue = event.target.value;

    // Only update input box value if searching, not if viewing VS details.
    if (!this.state.selectedElement) this.setState({ searchValue });
  }

  searchVSAC = () => {
    this.props.searchVSACByKeyword(this.state.searchValue);
  }

  handleElementSelected = (selectedElement) => {
    this.props.getVSDetails(selectedElement.oid);
    this.setState({ selectedElement: { name: selectedElement.name, oid: selectedElement.oid } });
  }

  handleChosenVS = () => {
    const element = this.state.selectedElement;
    const selectedTemplate = this.props.template;
    if (selectedTemplate === undefined) return;

    // Update template with value set selection
    selectedTemplate.parameters[0].value = element.name;
    selectedTemplate.parameters[1].value = element.oid;
    selectedTemplate.parameters[1].vsName = element.name;
    selectedTemplate.parameters[1].static = true;

    // Only call this function if adding a new element. Existing elements will be updated automatically.
    if (this.props.onElementSelected) this.props.onElementSelected(selectedTemplate);
    this.closeModal();
  }

  backToSearchResults = () => {
    this.setState({ selectedElement: null });
  }

  openModal = () => {
    const { selectedElement } = this.props;
    this.setState({ isOpen: true, selectedElement });
    if (selectedElement) this.props.getVSDetails(selectedElement.oid);
  }

  closeModal = () => {
    this.handleSearchValueChange({ target: { value: '' } }); // Always start with no search term filtering
    this.props.searchVSACByKeyword('');
    this.setState({ isOpen: false, selectedElement: null });
  }

  enterKeyCheck = (func, argument, event) => {
    if (!event || event.type !== 'keydown' || event.key !== 'Enter') return;
    event.preventDefault();
    if (argument) { func(argument); } else { func(); }
  }

  renderList = () => (
    <tbody aria-label="Element List">
      { this.props.vsacSearchResults.map((elem, i) =>
        <tr key={ `${elem.name}-${i}` }
          tabIndex="0"
          aria-label={elem.name}
          onClick={() => this.handleElementSelected(elem)}
          onKeyDown={ e => this.enterKeyCheck(this.handleElementSelected, elem, e) }>
            <td data-th="Type" title={elem.type}>
              { elem.type === 'Grouping' ?
                <FontAwesome name="puzzle-piece" /> :
                <FontAwesome name="sitemap" />
              }
            </td>
            <td data-th="Name">{ elem.name }</td>
            <td data-th="Code System">
                { elem.codeSystem.map((cs, j) => {
                  if (j < elem.codeSystem.length - 1) {
                    return `${cs}, `;
                  }
                  return cs;
                })}
            </td>
            <td data-th="Steward">{ elem.steward }</td>
            <td data-th="Codes">{ elem.codeCount }</td>
        </tr>)
      }
    </tbody>
  )

  renderDetailsList = () => (
    <tbody aria-label="Value Set Details List">
      { this.props.vsacDetailsCodes.map((code, i) =>
        <tr key={`${code.code}-${i}`}
          aria-label={code.displayName}>
          <td data-th="Code">{code.code}</td>
          <td data-th="Name">{code.displayName}</td>
          <td data-th="Code System">{code.codeSystemName}</td>
        </tr>)
      }
    </tbody>
  );

  renderSearchResultsTable = () => {
    if (this.props.isSearchingVSAC || this.props.isRetrievingDetails) {
      return (
        <div>Loading...</div>
      );
    } else if (this.state.selectedElement) {
      return (
        <table className="search__table">
          <thead>
            <tr>
              <th>Code</th>
              <th>Name</th>
              <th>Code System</th>
            </tr>
          </thead>
          { this.renderDetailsList() }
        </table>
      );
    } else if (this.props.vsacSearchResults.length > 0) {
      return (
        <table className="search__table selectable icons">
          <thead>
            <tr>
              <th>Type</th>
              <th>Name</th>
              <th>Code System</th>
              <th>Steward</th>
              <th>Codes</th>
            </tr>
          </thead>
          { this.renderList() }
        </table>
      );
    }
    return null;
  }

  render() {
    const modalInputLabel = 'Enter value set keyword...';

    let buttonLabels = {
      openButtonText: 'Choose Value Sets',
      closeButtonText: 'Close'
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
        <button
          className="primary-button"
          onClick={ this.openModal }
          onKeyDown={ e => this.enterKeyCheck(this.openModal, null, e) }>
          <FontAwesome name="th-list" />{' '}{buttonLabels.openButtonText}
        </button>
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
            </header>
            <main className="modal__body">
              <div className="element-modal__search">
                {this.state.selectedElement ?
                  <span className="nav-icon">
                    <FontAwesome name="arrow-left"
                      tabIndex="0"
                      onClick={this.backToSearchResults}
                      onKeyDown={ e => this.enterKeyCheck(this.backToSearchResults, null, e) }/>
                  </span> : null}
                <input
                  type="text"
                  disabled={this.state.selectedElement ? true : false}
                  placeholder={ modalInputLabel }
                  aria-label={ modalInputLabel }
                  title={ modalInputLabel }
                  value={ inputDisplayValue }
                  onChange={ this.handleSearchValueChange }
                  onKeyDown={ e => this.enterKeyCheck(this.searchVSAC, this.state.searchValue, e)}/>
                  {
                    this.state.selectedElement ?
                      <button className="primary-button element-modal__searchbutton" onClick={ this.handleChosenVS }>
                        Select
                      </button> :
                      <button className="primary-button element-modal__searchbutton" onClick={ this.searchVSAC }>
                        Search
                      </button>
                  }
              </div>
              <div className="element-modal__content">
                { this.renderSearchResultsTable() }
              </div>
            </main>
            <footer className="modal__footer">
              <button className="primary-button"
                      onClick={ this.closeModal }
                      onKeyDown={ e => this.enterKeyCheck(this.closeModal, null, e) }>
                      {buttonLabels.closeButtonText}
              </button>
            </footer>
          </div>
        </Modal>
      </span>
    );
  }
}

export default ElementModal;
