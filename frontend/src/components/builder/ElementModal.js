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
    };
  }

  static propTypes = {
    onElementSelected: PropTypes.func.isRequired,
    searchVSACByKeyword: PropTypes.func.isRequired,
    isSearchingVSAC: PropTypes.bool.isRequired,
    vsacSearchResults: PropTypes.array.isRequired,
    vsacSearchCount: PropTypes.number.isRequired
  }

  handleSearchValueChange = (event) => {
    const searchValue = event.target.value;

    this.setState({ searchValue });
  }

  searchVSAC = () => {
    this.props.searchVSACByKeyword(this.state.searchValue);
  }

  handleElementSelected = (element) => {
    const selectedTemplate = this.props.template;
    if (selectedTemplate === undefined) return;

    // Update template with value set selection
    selectedTemplate.parameters[0].value = element.name;
    selectedTemplate.parameters[1].value = element.oid;
    selectedTemplate.parameters[1].vsName = element.name;
    selectedTemplate.parameters[1].static = true;

    this.props.onElementSelected(selectedTemplate);
    this.closeModal();
  }

  openModal = () => {
    this.setState({ isOpen: true });
  }

  closeModal = () => {
    this.handleSearchValueChange({ target: { value: '' } }); // Always start with no search term filtering
    this.props.searchVSACByKeyword('');
    this.setState({ isOpen: false });
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

  renderSearchResultsTable = () => {
    if (this.props.isSearchingVSAC) {
      return (
        <div>Loading...</div>
      );
    } else if (this.props.vsacSearchResults.length > 0) {
      return (
        <table className="search__table">
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
    const modalInputLabel = 'Enter value set code or keyword...';

    return (
      <span className={ `${this.props.className} element-modal` }>
        <button
          className="primary-button"
          onClick={ this.openModal }
          onKeyDown={ e => this.enterKeyCheck(this.openModal, null, e) }>
          <FontAwesome name="th-list" />{' '}Choose Value Sets
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
                <span><FontAwesome name="th-list" />{' '}{this.props.vsacSearchCount}</span> :
                null}
            </header>
            <main className="modal__body">
              <div className="element-modal__search">
                <input
                  type="text"
                  placeholder={ modalInputLabel }
                  aria-label={ modalInputLabel }
                  title={ modalInputLabel }
                  value={ this.state.searchValue }
                  onChange={ this.handleSearchValueChange }
                  onKeyDown={ e => this.enterKeyCheck(this.searchVSAC, this.state.searchValue, e)}/>
                  <button className="button element-modal__searchbutton" onClick={ this.searchVSAC }>Search</button>
              </div>
              <div className="element-modal__content">
                { this.renderSearchResultsTable() }
              </div>
            </main>
            <footer className="modal__footer">
              <button className="primary-button"
                      onClick={ this.closeModal }
                      onKeyDown={ e => this.enterKeyCheck(this.closeModal, null, e) }>
                      Close
              </button>
            </footer>
          </div>
        </Modal>
      </span>
    );
  }
}

export default ElementModal;
