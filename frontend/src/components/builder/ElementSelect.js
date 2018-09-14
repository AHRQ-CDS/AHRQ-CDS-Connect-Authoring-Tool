import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import Select from 'react-select';
import FontAwesome from 'react-fontawesome';

import ElementModal from './ElementModal';
import ElementSelectMenuRenderer from './ElementSelectMenuRenderer';
import VSACAuthenticationModal from './VSACAuthenticationModal';
import CodeSelectModal from './CodeSelectModal';
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

const elementOptions = [
  {
    value: 'allergy_intolerance',
    label: 'Allergy Intolerance',
    vsacAuthRequired: true,
    template: 'GenericAllergyIntolerance_vsac'
  },
  { value: 'baseElement', label: 'Base Elements', vsacAuthRequired: false },
  { value: 'condition', label: 'Condition', vsacAuthRequired: true, template: 'GenericCondition_vsac' },
  { value: 'demographics', label: 'Demographics', vsacAuthRequired: false },
  { value: 'encounter', label: 'Encounter', vsacAuthRequired: true, template: 'GenericEncounter_vsac' },
  {
    value: 'medicationStatement',
    label: 'Medication Statement',
    vsacAuthRequired: true,
    template: 'GenericMedicationStatement_vsac'
  },
  {
    value: 'medicationOrder',
    label: 'Medication Order',
    vsacAuthRequired: true,
    template: 'GenericMedicationOrder_vsac'
  },
  { value: 'observation', label: 'Observation', vsacAuthRequired: true, template: 'GenericObservation_vsac' },
  { value: 'booleanParameter', label: 'Parameters', vsacAuthRequired: false },
  { value: 'procedure', label: 'Procedure', vsacAuthRequired: true, template: 'GenericProcedure_vsac' }
];

export default class ElementSelect extends Component {
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
    const paramsIndex = categoriesCopy.findIndex(cat => cat.name === 'Parameters');
    const baseElementsIndex = categoriesCopy.findIndex(cat => cat.name === 'Base Elements');

    if (this.props.baseElements && this.props.baseElements.length && categoriesCopy[baseElementsIndex]) {
      categoriesCopy[baseElementsIndex].entries = this.props.baseElements.map((e) => {
        const returnType = _.isEmpty(e.modifiers) ? e.returnType : _.last(e.modifiers).returnType;
        return ({
          id: _.uniqueId(e.id),
          name: 'Base Element',
          type: 'baseElement',
          template: 'GenericStatement',
          returnType,
          parameters: [
            { id: 'element_name', type: 'string', name: 'Element Name', value: e.parameters[0].value },
            {
              id: 'baseElementReference',
              type: 'reference',
              name: 'reference',
              value: { id: e.uniqueId, type: e.name },
              static: true
            }
          ]
        });
      });
    }
    if (this.props.parameters.length) {
      let parametersCategory;
      if (paramsIndex >= 0) {
        [parametersCategory] = categoriesCopy.splice(paramsIndex, 1);
      } else {
        parametersCategory = { icon: 'sign-in', name: 'Parameters', entries: [] };
      }

      // Only include boolean parameters. Don't include blank parameters to add to workspace.
      parametersCategory.entries = this.props.parameters.map(param => ({
        id: param.name,
        name: param.name,
        type: 'parameter',
        returnType: _.lowerCase(param.type),
        extends: 'Base',
        parameters: [
          { id: 'element_name', type: 'string', name: 'Element Name', value: param.name },
          { id: 'default', type: 'boolean', name: 'Default', value: param.value }
        ]
      }));

      categoriesCopy.push(parametersCategory);
    } else if (this.props.parameters.length === 0 && paramsIndex >= 0) {
      // No parameters have been made. Restrict creating new parameters within the workspace.
      categoriesCopy[paramsIndex].entries = [];
    } else {
      categoriesCopy.push({ icon: 'sign-in', name: 'Parameters', entries: [] });
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
    this.setState({ selectedElement: null });
    const clone = _.cloneDeep(suggestion);
    delete clone.category; // Don't send the category which is only needed for this component
    this.props.onSuggestionSelected(clone);
  }

  onSelectedCategoryChange = (category) => {
    this.setState({ selectedCategory: category });
  }

  renderVSACLogin = () => {
    // If last time authenticated was less than 7.5 hours ago, force user to log in again.
    if (this.props.timeLastAuthenticated < new Date() - 27000000 || this.props.vsacFHIRCredentials.username == null) {
      return (
        <div className="vsac-authenticate">
          <VSACAuthenticationModal
            loginVSACUser={this.props.loginVSACUser}
            setVSACAuthStatus={this.props.setVSACAuthStatus}
            vsacStatus={this.props.vsacStatus}
            vsacStatusText={this.props.vsacStatusText}
          />
        </div>
      );
    }

    const { selectedElement } = this.state;

    // Get template for selected element
    let selectedTemplate;
    this.props.categories.find((group) => {
      selectedTemplate = group.entries.find(entry => entry.id === selectedElement.template);
      // If a template is found in the entries of a group, stop searching.
      return selectedTemplate !== undefined;
    });

    return (
      <div className="vsac-authenticate">
        <button className="disabled-button" disabled={true}>
          <FontAwesome name="check" /> VSAC Authenticated
        </button>

        <ElementModal
          className="element-select__modal"
          onElementSelected={this.onSuggestionSelected}
          searchVSACByKeyword={this.props.searchVSACByKeyword}
          isSearchingVSAC={this.props.isSearchingVSAC}
          vsacSearchResults={this.props.vsacSearchResults}
          vsacSearchCount={this.props.vsacSearchCount}
          template={selectedTemplate}
          getVSDetails={this.props.getVSDetails}
          isRetrievingDetails={this.props.isRetrievingDetails}
          vsacDetailsCodes={this.props.vsacDetailsCodes}
          vsacFHIRCredentials={this.props.vsacFHIRCredentials}

        />

        <CodeSelectModal
          className="element-select__modal"
          onElementSelected={this.onSuggestionSelected}
          template={selectedTemplate}
          vsacFHIRCredentials={this.props.vsacFHIRCredentials}
          isValidatingCode={this.props.isValidatingCode}
          isValidCode={this.props.isValidCode}
          codeData={this.props.codeData}
          validateCode={this.props.validateCode}
          resetCodeValidation={this.props.resetCodeValidation}
        />
      </div>
    );
  }

  onNoAuthElementSelected = (element) => {
    const suggestion = this.state.categories
      .find(cat => cat.name === element.type)
      .entries.find(entry => entry.id === element.value);

    this.onSuggestionSelected(suggestion);
  }

  onElementSelected = (selectedElement) => {
    this.setState({ selectedElement });
  }

  render() {
    const { selectedElement } = this.state;
    const placeholderText = 'Choose element type';
    const elementOptionsToDisplay = elementOptions.filter((e) => {
      if (this.props.inBaseElements) {
        return e.value !== 'baseElement';
      }
      return true;
    });
    let noAuthElementOptions;
    if (selectedElement && !selectedElement.vsacAuthRequired) {
      noAuthElementOptions = this.state.categories
        .find(cat => cat.name === selectedElement.label)
        .entries.map(({ id, name, type, parameters }) => {
          // Base elements display the parameter element_name entered by user, not the generic 'Base Element'.
          const label = type === 'baseElement' ? parameters[0].value : name;
          return ({ value: id, label, type: selectedElement.label });
        });
    }
    const value = selectedElement && selectedElement.value;

    return (
      <div className="element-select form__group">
        <div className="element-select__add-element">
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
            options={elementOptionsToDisplay}
            onChange={this.onElementSelected}
            optionRenderer={optionRenderer}
            menuRenderer={ElementSelectMenuRenderer}
          />

          {selectedElement && !selectedElement.vsacAuthRequired &&
            <Select
              className="element-select__element-field"
              placeholder={`Select ${selectedElement.label} element`}
              aria-label={`Select ${selectedElement.label} element`}
              options={noAuthElementOptions}
              onChange={this.onNoAuthElementSelected}
              />
          }
        </div>

        {selectedElement && selectedElement.vsacAuthRequired && this.renderVSACLogin()}
      </div>
    );
  }
}

ElementSelect.propTypes = {
  categories: PropTypes.array.isRequired,
  onSuggestionSelected: PropTypes.func.isRequired,
  booleanParameters: PropTypes.arrayOf(PropTypes.shape({
    name: PropTypes.string,
    value: PropTypes.string
  })),
  loginVSACUser: PropTypes.func.isRequired,
  setVSACAuthStatus: PropTypes.func.isRequired,
  vsacStatus: PropTypes.string,
  vsacStatusText: PropTypes.string,
  timeLastAuthenticated: PropTypes.instanceOf(Date),
  searchVSACByKeyword: PropTypes.func.isRequired,
  isSearchingVSAC: PropTypes.bool.isRequired,
  vsacSearchResults: PropTypes.array.isRequired,
  vsacSearchCount: PropTypes.number.isRequired,
  getVSDetails: PropTypes.func.isRequired,
  isRetrievingDetails: PropTypes.bool.isRequired,
  vsacDetailsCodes: PropTypes.array.isRequired,
  isValidatingCode: PropTypes.bool.isRequired,
  isValidCode: PropTypes.bool,
  codeData: PropTypes.object,
  validateCode: PropTypes.func.isRequired,
  resetCodeValidation: PropTypes.func.isRequired,
  inBaseElements: PropTypes.bool.isRequired,
};
