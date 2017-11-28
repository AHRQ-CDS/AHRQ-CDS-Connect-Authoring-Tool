import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Modal from 'react-modal';
import FontAwesome from 'react-fontawesome';
import { sortAlphabeticallyByKey } from '../../helpers/utils';

const getRelevantElements = (category, value) => {
  let elements = category.entries;
  const inputValue = value.trim().toLowerCase();

  if (inputValue.length) {
    elements = elements.filter(elem => elem.name.toLowerCase().indexOf(inputValue) >= 0);
  } else if (category.name === 'All') {
    return elements.sort(sortAlphabeticallyByKey('category', 'name'));
  } else {
    return elements.sort(sortAlphabeticallyByKey('name'));
  }

  return elements.sort((a, b) => {
    const aLower = a.name.toLowerCase();
    const bLower = b.name.toLowerCase();
    const queryPosA = aLower.indexOf(inputValue);
    const queryPosB = bLower.indexOf(inputValue);

    if (queryPosA !== queryPosB) {
      return queryPosA - queryPosB;
    }

    return aLower < bLower ? -1 : 1;
  });
};

class ElementModal extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isOpen: false,
      searchValue: '',
      elementList: []
    };
  }

  static propTypes = {
    categories: PropTypes.array.isRequired,
    selectedCategory: PropTypes.object.isRequired,
    setSelectedCategory: PropTypes.func.isRequired,
    onElementSelected: PropTypes.func.isRequired
  }

  componentWillReceiveProps(props) {
    const elementList = getRelevantElements(props.selectedCategory, this.state.searchValue);

    this.setState({ elementList });
  }

  handleSearchValueChange = (event) => {
    const searchValue = event.target.value;
    const elementList = getRelevantElements(this.props.selectedCategory, searchValue);

    this.setState({
      searchValue,
      elementList
    });
  }

  handleElementSelected = (element) => {
    this.props.onElementSelected(element);
    this.closeModal();
  }

  handleCategorySelected = (cat) => {
    this.props.setSelectedCategory(cat);
  }

  openModal = () => {
    this.handleSearchValueChange({ target: { value: '' } }); // Always start with no search term filtering
    this.setState({ isOpen: true });
  }

  closeModal = () => {
    this.setState({ isOpen: false });
  }

  enterKeyCheck = (func, argument, event) => {
    if (!event || event.type !== 'keydown' || event.key !== 'Enter') return;
    event.preventDefault();
    if (argument) { func(argument); } else { func(); }
  }

  renderSidebar = () => (
      <aside className="element-modal__sidebar" aria-label="Element Categories">
        { this.props.categories.map((cat, i) =>
          <button
            key={ `${cat.name}-${i}` }
            className={ `transparent-button${cat.name === this.props.selectedCategory.name ? ' selected' : ''}` }
            onClick={ () => this.handleCategorySelected(cat) }
            onKeyDown={ e => this.enterKeyCheck(this.handleCategorySelected, cat, e) }>
              { cat.name }
          </button>) }
      </aside>
  )

  renderList = () => (
      <section className="element-modal__list" aria-label="Element List">
        { this.state.elementList.map((elem, i) =>
          <button
            key={ `${elem.name}-${i}` }
            className="transparent-button element-select__option"
            onClick={ () => this.handleElementSelected(elem) }
            onKeyDown={ e => this.enterKeyCheck(this.handleElementSelected, elem, e) }>
              <div className="button-style"><FontAwesome className='fa-fw fa-plus' name='plus' /></div>
              { elem.name }
              { elem.category && <span className="element-select__option-category">({ elem.category })</span> }
          </button>) }
      </section>
  )

  render() {
    const modalInputLabel = 'Search elements';

    return (
      <div className={ `${this.props.className} element-modal` }>
        <button
           className="transparent-button link-style"
           onClick={ this.openModal }
           onKeyDown={ e => this.enterKeyCheck(this.openModal, null, e) }>
           Browse
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
              <span className="modal__heading">Elements</span>
            </header>
            <main className="modal__body">
              <div className="element-modal__search">
                <input
                  type="text"
                  placeholder={ modalInputLabel }
                  aria-label={ modalInputLabel }
                  title={ modalInputLabel }
                  value={ this.state.searchValue }
                  onChange={ this.handleSearchValueChange } />
              </div>
              <div className="element-modal__content">
                { this.renderSidebar() }
                { this.renderList() }
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
      </div>
    );
  }
}

export default ElementModal;
