import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import Select from 'react-select';
import FontAwesome from 'react-fontawesome';
import pluralize from 'pluralize';

import ElementModal from './ElementModal';
import ElementSelectMenuRenderer from './ElementSelectMenuRenderer';
import VSACAuthenticationModal from './VSACAuthenticationModal';
import CodeSelectModal from './CodeSelectModal';
import changeToCase from '../../utils/strings';
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
      <FontAwesome name="key" className={`element-select__option-category ${option.disabled ? 'is-disabled' : ''}`} />
    }
    {option.disabled &&
      <FontAwesome name="ban" className={'element-select__option-category is-disabled'} />
    }
    {option.displayReturnType &&
      <span className="element-select__option-value">{` (${option.displayReturnType})`}</span>
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
  { value: 'externalCqlElement', label: 'External CQL', vsacAuthRequired: false },
  { value: 'listOperations', label: 'List Operations', vsacAuthRequired: false },
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

    this.internalCategories = this.generateInternalCategories(props);

    this.state = {
      categories: this.internalCategories.sort(sortAlphabeticallyByKey('name')),
      selectedElement: null,
      selectedExternalLibrary: null,
      selectedExternalDefinition: null
    };

    this.elementInputId = '';
    this.categoryInputId = '';
  }

  componentWillMount() {
    const { artifactId, loadExternalCqlList } = this.props;
    loadExternalCqlList(artifactId);
    this.setState({ selectedCategory: this.state.categories.find(g => g.name === 'All') });
    this.elementInputId = _.uniqueId('element-select__element-input-');
    this.categoryInputId = _.uniqueId('element-select__category-input-');
  }

  // Needed to correctly update this.props.categories after parameters were merged in Builder
  componentWillReceiveProps(nextProps) {
    // Updates the categories and their entries to have correct parameters
    this.internalCategories = this.generateInternalCategories(nextProps);
    this.setState({
      categories: this.internalCategories.sort(sortAlphabeticallyByKey('name'))
    });

    // Keep the category that is selected the same
    const updatedCategory = this.state.categories.find(g =>
      g.name === this.state.selectedCategory.name);
    this.onSelectedCategoryChange(updatedCategory);
  }

  generateInternalCategories = (props) => {
    let categoriesCopy = _.cloneDeep(props.categories);
    categoriesCopy = filterUnsuppressed(categoriesCopy);
    const paramsIndex = categoriesCopy.findIndex(cat => cat.name === 'Parameters');
    const baseElementsIndex = categoriesCopy.findIndex(cat => cat.name === 'Base Elements');
    const listOperationsIndex = categoriesCopy.findIndex(cat => cat.name === 'List Operations');
    const operationsIndex = categoriesCopy.findIndex(cat => cat.name === 'Operations');
    const externalCqlIndex = categoriesCopy.findIndex(cat => cat.name === 'External CQL');

    if (operationsIndex >= 0 && listOperationsIndex >= 0) {
      const operationEntries = categoriesCopy[operationsIndex].entries.map((entry) => {
        entry.returnType = 'None';
        return entry;
      });
      categoriesCopy[listOperationsIndex].entries =
        categoriesCopy[listOperationsIndex].entries.concat(operationEntries);
    }

    if (props.baseElements && props.baseElements.length && categoriesCopy[baseElementsIndex]) {
      categoriesCopy[baseElementsIndex].entries = props.baseElements.map((e) => {
        const returnType = _.isEmpty(e.modifiers) ? e.returnType : _.last(e.modifiers).returnType;
        const commentParam = e.parameters.find(param => param.id === 'comment');
        const commentDefaultValue = commentParam ? commentParam.value : '';
        const type = e.type === 'parameter' ? e.type : e.name;
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
              value: { id: e.uniqueId, type },
              static: true
            },
            { id: 'comment', type: 'textarea', name: 'Comment', value: commentDefaultValue }
          ]
        });
      });
    }

    if (props.parameters.length) {
      let parametersCategory;
      if (paramsIndex >= 0) {
        parametersCategory = categoriesCopy[paramsIndex];
      } else {
        parametersCategory = { icon: 'sign-in', name: 'Parameters', entries: [] };
      }

      parametersCategory.entries = props.parameters.map((param) => {
        const commentDefaultValue = param.comment || '';
        return ({
          id: changeToCase(param.name, 'paramCase'),
          name: param.name,
          type: 'parameter',
          returnType: _.toLower(param.type),
          template: 'GenericStatement',
          parameters: [
            { id: 'element_name', type: 'string', name: 'Element Name', value: param.name },
            { id: 'default', type: 'boolean', name: 'Default', value: param.value },
            {
              id: 'parameterReference',
              type: 'reference',
              name: 'reference',
              value: { id: param.uniqueId },
              static: true
            },
            { id: 'comment', type: 'textarea', name: 'Comment', value: commentDefaultValue }
          ]
        });
      });
    } else if (props.parameters.length === 0 && paramsIndex >= 0) {
      // No parameters have been made. Restrict creating new parameters within the workspace.
      categoriesCopy[paramsIndex].entries = [];
    } else {
      categoriesCopy.push({ icon: 'sign-in', name: 'Parameters', entries: [] });
    }

    if (props.externalCqlList.length && categoriesCopy[externalCqlIndex]) {
      categoriesCopy[externalCqlIndex].entries = props.externalCqlList.map(e =>
        ({
          id: e.name,
          name: e.name,
          type: 'externalCqlElement',
          definitions: e.details.definitions.concat(e.details.parameters)
        }));
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
    if (this.props.vsacFHIRCredentials.username == null) {
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
          vsacDetailsCodesError={this.props.vsacDetailsCodesError}
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

  onExternalDefinitionSelected = (selectedExternalDefinition) => {
    this.setState({ selectedExternalDefinition });

    const suggestion = {
      id: selectedExternalDefinition.uniqueId,
      name: 'External CQL Element',
      type: selectedExternalDefinition.type,
      template: 'GenericStatement',
      returnType: selectedExternalDefinition.returnType,
      parameters: [
        { id: 'element_name', type: 'string', name: 'Element Name', value: selectedExternalDefinition.value },
        {
          id: 'externalCqlReference',
          type: 'reference',
          name: 'reference',
          value: { id: `${selectedExternalDefinition.value} from ${this.state.selectedExternalLibrary.name}` },
          static: true
        },
        { id: 'comment', type: 'textarea', name: 'Comment', value: '' }
      ]
    };

    this.onSuggestionSelected(suggestion);
  }

  onNoAuthElementSelected = (element) => {
    const suggestion = this.state.categories
      .find(cat => cat.name === element.type)
      .entries.find(entry => entry.id === element.value);

    if (suggestion.type === 'externalCqlElement') {
      this.setState({ selectedExternalLibrary: suggestion, selectedExternalDefinition: null });
    } else {
      this.onSuggestionSelected(suggestion);
    }
  }

  onElementSelected = (selectedElement) => {
    this.setState({ selectedElement, selectedExternalLibrary: null, selectedExternalDefinition: null });
  }

  render() {
    const { selectedElement, selectedExternalLibrary, selectedExternalDefinition } = this.state;
    const placeholderText = 'Choose element type';
    const elementOptionsToDisplay = _.cloneDeep(elementOptions).filter((e) => {
      e.disabled = this.props.disableElement || false;
      if (!this.props.inBaseElements) {
        return e.value !== 'listOperations';
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
          const uniqueId = type === 'baseElement' ? parameters[1].value.id : '';
          return ({ value: id, label, type: selectedElement.label, uniqueId });
        });
      if (selectedElement.value === 'baseElement') {
        noAuthElementOptions = noAuthElementOptions.filter(element => element.uniqueId !== this.props.elementUniqueId);
      }
    }
    const selectedElementValue = selectedElement && selectedElement.value;
    let noAuthPlaceholder = '';
    if (selectedElement) {
      if (selectedElement.value === 'baseElement') {
        noAuthPlaceholder = `Select ${pluralize.singular(selectedElement.label)}`;
      } else {
        noAuthPlaceholder = `Select ${selectedElement.label} element`;
      }
    }
    const externalLibraryPlaceholder = 'Choose definition or parameter';
    const selectedExternalLibraryName = selectedExternalLibrary && selectedExternalLibrary.name;
    let selectedExternalLibraryOptions;
    if (selectedExternalLibrary) {
      selectedExternalLibraryOptions = selectedExternalLibrary.definitions.map((definition) => {
        const name = definition.name;
        const returnType = definition.calculatedReturnType;
        const displayReturnType = definition.displayReturnType
          ? definition.displayReturnType
          : _.startCase(definition.calculatedReturnType);
        return ({
          value: name,
          label: name,
          type: 'externalCqlElement',
          uniqueId: _.uniqueId(),
          returnType,
          displayReturnType
        });
      });
    }
    const selectedExternalDefinitionValue = selectedExternalDefinition && selectedExternalDefinition.value;

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
            value={selectedElementValue}
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
              value={selectedExternalLibraryName}
              placeholder={noAuthPlaceholder}
              aria-label={noAuthPlaceholder}
              clearable={false}
              options={noAuthElementOptions}
              onChange={this.onNoAuthElementSelected}
              optionRenderer={optionRenderer}
              />
          }
        </div>

          {selectedElement && !selectedElement.vsacAuthRequired && selectedExternalLibrary &&
            <Select
              className="element-select__element-field"
              value={selectedExternalDefinitionValue}
              placeholder={externalLibraryPlaceholder}
              aria-label={externalLibraryPlaceholder}
              options={selectedExternalLibraryOptions}
              onChange={this.onExternalDefinitionSelected}
              optionRenderer={optionRenderer}
              />
          }

        {selectedElement && selectedElement.vsacAuthRequired && this.renderVSACLogin()}
      </div>
    );
  }
}

ElementSelect.propTypes = {
  artifactId: PropTypes.string.isRequired,
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
  searchVSACByKeyword: PropTypes.func.isRequired,
  isSearchingVSAC: PropTypes.bool.isRequired,
  vsacSearchResults: PropTypes.array.isRequired,
  vsacSearchCount: PropTypes.number.isRequired,
  getVSDetails: PropTypes.func.isRequired,
  isRetrievingDetails: PropTypes.bool.isRequired,
  vsacDetailsCodes: PropTypes.array.isRequired,
  vsacDetailsCodesError: PropTypes.string.isRequired,
  isValidatingCode: PropTypes.bool.isRequired,
  isValidCode: PropTypes.bool,
  codeData: PropTypes.object,
  validateCode: PropTypes.func.isRequired,
  resetCodeValidation: PropTypes.func.isRequired,
  baseElements: PropTypes.array.isRequired,
  inBaseElements: PropTypes.bool.isRequired,
  elementUniqueId: PropTypes.string,
  disableElement: PropTypes.bool,
  externalCqlList: PropTypes.array.isRequired,
  loadExternalCqlList: PropTypes.func.isRequired
};
