import React, { Component, PropTypes } from 'react';
import _ from 'lodash';
import Select from 'react-select';

const flatten = arr => arr.reduce(
  (acc, val) => acc.concat(Array.isArray(val) ? flatten(val) : val), []
);

const filterUnsuppressed = items => items.filter(item => !item.suppress);

const sortAlphabeticallyByName = (a, b) => {
  if (a.name < b.name) return -1;
  if (a.name > b.name) return 1;
  return 0;
};

const getAllElements = categories => flatten(filterUnsuppressed(categories).map(cat => filterUnsuppressed(cat.entries).map(e => Object.assign({ category: cat.name.replace(/s\s*$/, '') }, e))));

const optionRenderer = option => (
    <div className="element-select__option">
      <span className="element-select__option-value">{option.name}</span>
      { option.category && <span className="element-select__option-category">({option.category})</span> }
    </div>
  );

class ElementSelect extends Component {
  constructor(props) {
    super(props);

    this.internalCategories = this.generateInternalCategories();

    this.state = {
      categories: filterUnsuppressed(this.internalCategories).sort(sortAlphabeticallyByName)
    };

    this.elementInputId = '';
    this.categoryInputId = '';
  }

  static propTypes = {
    categories: PropTypes.array.isRequired,
    onSuggestionSelected: PropTypes.func.isRequired
  }

  componentWillMount() {
    this.setState({ selectedCategory: this.state.categories.find(g => g.name === 'All') });
    this.elementInputId = _.uniqueId('element-select__element-input-');
    this.categoryInputId = _.uniqueId('element-select__category-input-');
  }

  // Needed to correctly update this.props.categories after parameters were merged in BuilderPage
  componentWillReceiveProps() {
    // Updates the categories and their entries to have correct parameters
    this.internalCategories = this.generateInternalCategories();
    this.setState({
      categories: filterUnsuppressed(this.internalCategories).sort(sortAlphabeticallyByName)
    });

    // Keep the category that is selected the same
    const updatedCategory = this.state.categories.find(
      g => g.name === this.state.selectedCategory.name);
    this.onSelectedCategoryChange(updatedCategory);
  }

  generateInternalCategories = () => {
    const categoriesCopy = Object.assign([], this.props.categories);

    categoriesCopy.unshift({
      icon: 'bars',
      name: 'All',
      entries: getAllElements(categoriesCopy)
    });

    return categoriesCopy;
  }

  onSuggestionSelected = (suggestion) => {
    let clone = _.cloneDeep(suggestion);
    delete clone['category']; // Don't send the category which is only needed for this component
    this.props.onSuggestionSelected(clone);
  }

  onSelectedCategoryChange = (category) => {
    this.setState({ selectedCategory: category });
  }

  render() {
    const placeholderText = 'Add element';

    return (
      <div className="form__group element-select">
        <Select
          className="element-select__element-field"
          name="element-select__element-field"
          value="start"
          placeholder={placeholderText}
          aria-label={placeholderText}
          clearable={false}
          options={this.state.selectedCategory.entries.filter(g => !g.suppress)}
          labelKey='name'
          matchProp='label'
          optionRenderer={optionRenderer}
          onChange={this.onSuggestionSelected}
          inputProps={{ id: this.elementInputId }}
        />
        <Select
          className="element-select__category-field"
          name="element-select__category-field"
          value={this.state.selectedCategory}
          valueKey='name'
          searchable={false}
          clearable={false}
          options={this.state.categories}
          labelKey='name'
          onChange={this.onSelectedCategoryChange}
          inputProps={{ id: this.categoryInputId, 'aria-label': 'Narrow elements by category' }}
        />
      </div>
    );
  }
}

export default ElementSelect;
