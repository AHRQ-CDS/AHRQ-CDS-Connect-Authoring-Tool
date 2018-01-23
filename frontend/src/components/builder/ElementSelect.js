import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import Select from 'react-select';
import FontAwesome from 'react-fontawesome';

// import ElementModal from './ElementModal';
import ElementSelectMenuRenderer from './ElementSelectMenuRenderer';
import filterUnsuppressed from '../../utils/filter';
import { sortAlphabeticallyByKey } from '../../utils/sort';

const getAllElements = categories => _.flatten(categories.map(cat => (
  cat.entries.map(e => ({
    category: cat.name.replace(/s\s*$/, ''),
    ...e
  }))
)));

const optionRenderer = option => (
  <div className="element-select__option">
    <span className="element-select__option-value">{option.label}</span>

    {option.vsacAuthRequired &&
      <FontAwesome name="key" className="element-select__option-category" />
    }
  </div>
);

class ElementSelect extends Component {
  constructor(props) {
    super(props);

    this.internalCategories = this.generateInternalCategories();

    this.state = {
      categories: this.internalCategories.sort(sortAlphabeticallyByKey('name')),
      selectedElement: null
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

  // Needed to correctly update this.props.categories after parameters were merged in Builder
  componentWillReceiveProps() {
    // Updates the categories and their entries to have correct parameters
    this.internalCategories = this.generateInternalCategories();
    this.setState({
      categories: this.internalCategories.sort(sortAlphabeticallyByKey('name'))
    });

    // Keep the category that is selected the same
    const updatedCategory = this.state.categories.find(g =>
      g.name === this.state.selectedCategory.name);
    this.onSelectedCategoryChange(updatedCategory);
  }

  generateInternalCategories = () => {
    let categoriesCopy = _.cloneDeep(this.props.categories);
    categoriesCopy = filterUnsuppressed(categoriesCopy);

    if (this.props.parameters.length) {
      const paramsIndex = categoriesCopy.findIndex(cat => cat.name === 'Parameters');
      let parametersCategory;
      if (paramsIndex >= 0) {
        [parametersCategory] = categoriesCopy.splice(paramsIndex, 1);
      } else {
        parametersCategory = { icon: 'sign-in', name: 'Parameters', entries: [] };
      }
      parametersCategory.entries = parametersCategory.entries.concat(this.props.parameters.map(param => ({
        name: param.name,
        parameters: [{ value: param.name }],
        template: 'EmptyParameter',
        cannotHaveModifiers: true,
        returnType: 'boolean'
      })));

      categoriesCopy.push(parametersCategory);
    }

    _.each(categoriesCopy, (cat) => {
      cat.entries = filterUnsuppressed(cat.entries);
    });

    categoriesCopy.unshift({
      icon: 'bars',
      name: 'All',
      entries: getAllElements(categoriesCopy)
    });

    return categoriesCopy;
  }

  onSuggestionSelected = (suggestion) => {
    const clone = _.cloneDeep(suggestion);
    delete clone.category; // Don't send the category which is only needed for this component
    this.props.onSuggestionSelected(clone);
  }

  onSelectedCategoryChange = (category) => {
    this.setState({ selectedCategory: category });
  }

  onDemographicElementSelected = (demographic) => {
    this.setState({
      selectedElement: null
    });
    const suggestion = this.state.categories
      .find(cat => cat.name === 'Demographics')
      .entries.find(entry => entry.id === demographic.value);
    this.onSuggestionSelected(suggestion);
  }

  onElementSelected = (selectedElement) => {
    this.setState({ selectedElement });
  }

  render() {
    const { selectedElement } = this.state;
    // const placeholderText = 'Add element';
    const placeholderText = 'Choose element type';
    const elementOptions = [
      { value: 'condition', label: 'Condition', vsacAuthRequired: true },
      { value: 'demographics', label: 'Demographics', vsacAuthRequired: false },
      { value: 'encounter', label: 'Encounter', vsacAuthRequired: true },
      { value: 'medication', label: 'Medication', vsacAuthRequired: true },
      { value: 'observation', label: 'Observation', vsacAuthRequired: true }
    ];
    const demographicOptions = this.state.categories
      .find(cat => cat.name === 'Demographics')
      .entries.map(({ id, name }) => ({ value: id, label: name }));
    const value = selectedElement && selectedElement.value;

    return (
      <div>
        <div className="element-select form__group">
          <div className="element-select__label">
            <FontAwesome name="plus" />
            Add element
          </div>

          <Select
            className="element-select__element-field"
            name="element-select__element-field"
            value={value}
            placeholder={placeholderText}
            aria-label={placeholderText}
            clearable={false}
            options={elementOptions}
            onChange={this.onElementSelected}
            optionRenderer={optionRenderer}
            menuRenderer={ElementSelectMenuRenderer}
            menuContainerStyle={{ maxHeight: '320px' }}
            menuStyle={{ minHeight: '320px' }}
          />

          {
            selectedElement && selectedElement.value === 'demographics' &&
              <Select
                className="element-select__element-field"
                placeholder="Select demographic type"
                aria-label="Select demographic type"
                options={demographicOptions}
                onChange={this.onDemographicElementSelected}
                />
          }

          {/* <ElementModal
            className="element-select__modal"
            categories={this.state.categories}
            selectedCategory={this.state.selectedCategory}
            setSelectedCategory={this.onSelectedCategoryChange}
            onElementSelected={this.onSuggestionSelected}
          /> */}
        </div>
        {
          selectedElement && selectedElement.vsacAuthRequired &&
            <button className="primary-button">
              <FontAwesome name="key" />
              {' '}Authenticate VSAC
            </button>
        }
      </div>
    );

    // return (
    //   <div className="form__group element-select">
    //     <Select
    //       className="element-select__element-field"
    //       name="element-select__element-field"
    //       value="start"
    //       valueKey="name"
    //       placeholder={placeholderText}
    //       aria-label={placeholderText}
    //       clearable={false}
    //       options={this.state.selectedCategory.entries}
    //       labelKey='name'
    //       matchProp='label'
    //       optionRenderer={optionRenderer}
    //       onChange={this.onSuggestionSelected}
    //       inputProps={{ id: this.elementInputId, 'aria-label': placeholderText, title: placeholderText }}
    //     />

    //     <Select
    //       className="element-select__category-field"
    //       name="element-select__category-field"
    //       value={this.state.selectedCategory}
    //       valueKey='name'
    //       searchable={false}
    //       clearable={false}
    //       options={this.state.categories}
    //       labelKey='name'
    //       onChange={this.onSelectedCategoryChange}
    //       inputProps={{
    //         id: this.categoryInputId,
    //         'aria-label': 'Narrow elements by category',
    //         title: 'Narrow elements by category'
    //       }}
    //     />
    //   </div>
    // );
  }
}

export default ElementSelect;
