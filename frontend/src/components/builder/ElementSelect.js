import React, { Fragment, Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import FontAwesome from 'react-fontawesome';
import pluralize from 'pluralize';
import { components as SelectComponents } from 'react-select';

import ElementModal from './ElementModal';
import VSACAuthenticationModal from './VSACAuthenticationModal';
import CodeSelectModal from './CodeSelectModal';
import StyledSelect from '../elements/StyledSelect';

import changeToCase from '../../utils/strings';
import filterUnsuppressed from '../../utils/filter';
import { sortAlphabeticallyByKey } from '../../utils/sort';
import { getFieldWithId, getFieldWithType } from '../../utils/instances';

const getAllElements = categories => _.flatten(categories.map(cat => (
  cat.entries.map(e => ({
    category: cat.name.replace(/s\s*$/, ''),
    ...e
  }))
)));

const ElementMenuList = ({ children, ...props }) => {
  const { options } = props;
  const isDisabled = options.some(({ isDisabled }) => isDisabled);

  const optionStyle = {
    padding: '8px 12px'
  };

  return (
    <SelectComponents.MenuList {...props}>
      {isDisabled ? (
        <div style={{ ...optionStyle, color: '#ccc' }}>
          <FontAwesome name="ban" /> Cannot add element when Base Element List in use
        </div>
      ) : (
        <Fragment>
          {children}
          <div style={{borderTop: '1px solid #eee', color: '#ccc'}}>
            <div style={optionStyle}>
              <FontAwesome name="key" /> VSAC authentication required
            </div>
          </div>
        </Fragment>
      )}
    </SelectComponents.MenuList>
  );
};

const ElementOption = ({ children, ...props }) => (
  <SelectComponents.Option {...props}>
    <span className="element-select__option-value">{children}</span>
    {(props.data.vsacAuthRequired || props.isDisabled) && (
      <FontAwesome name="key" className={`element-select__option-category ${props.isDisabled ? 'is-disabled' : ''}`} />
    )}
    {props.data.displayReturnType && (
      <span className="element-select__option-value">{` (${props.data.displayReturnType})`}</span>
    )}
  </SelectComponents.Option>
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

  UNSAFE_componentWillMount() { // eslint-disable-line camelcase
    const { artifactId, loadExternalCqlList } = this.props;
    loadExternalCqlList(artifactId);
    this.setState({ selectedCategory: this.state.categories.find(g => g.name === 'All') });
    this.elementInputId = _.uniqueId('element-select__element-input-');
    this.categoryInputId = _.uniqueId('element-select__category-input-');
  }

  // Needed to correctly update this.props.categories after fields were merged in Builder
  UNSAFE_componentWillReceiveProps(nextProps) { // eslint-disable-line camelcase
    // Updates the categories and their entries to have correct fields
    this.internalCategories = this.generateInternalCategories(nextProps);
    this.setState({
      categories: this.internalCategories.sort(sortAlphabeticallyByKey('name'))
    });

    // Keep the category that is selected the same
    const updatedCategory = this.state.categories.find(g =>
      g.name === this.state.selectedCategory.name);
    this.onSelectedCategoryChange(updatedCategory);

    if (nextProps.artifactId !== this.props.artifactId) {
      this.props.loadExternalCqlList(nextProps.artifactId);
    }
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
        const commentField = getFieldWithId(e.fields, 'comment');
        const commentDefaultValue = commentField ? commentField.value : '';
        const type = e.type === 'parameter' ? e.type : e.name;
        const value = getFieldWithId(e.fields, 'element_name').value;
        return ({
          id: _.uniqueId(e.id),
          name: 'Base Element',
          type: 'baseElement',
          template: 'GenericStatement',
          returnType,
          fields: [
            { id: 'element_name', type: 'string', name: 'Element Name', value },
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
          fields: [
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
        <button className="disabled-button" disabled={true} aria-label={"VSAC Authenticated"}>
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
      fields: [
        { id: 'element_name', type: 'string', name: 'Element Name', value: selectedExternalDefinition.value },
        {
          id: 'externalCqlReference',
          type: 'reference',
          name: 'reference',
          value: {
            id: `${selectedExternalDefinition.value} from ${this.state.selectedExternalLibrary.name}`,
            element: selectedExternalDefinition.value,
            library: this.state.selectedExternalLibrary.name
          },
          static: true
        },
        { id: 'comment', type: 'textarea', name: 'Comment', value: '' }
      ]
    };

    this.onSuggestionSelected(suggestion);
  }

  onNoAuthElementSelected = (element) => {
    if (!element) {
      this.setState({ selectedExternalLibrary: null, selectedExternalDefinition: null });
    } else {
      const suggestion = this.state.categories
        .find(cat => cat.name === element.type)
        .entries.find(entry => entry.id === element.value);

      if (suggestion.type === 'externalCqlElement') {
        this.setState({ selectedExternalLibrary: suggestion, selectedExternalDefinition: null });
      } else {
        this.onSuggestionSelected(suggestion);
      }
    }
  }

  onElementSelected = (selectedElement) => {
    this.setState({ selectedElement, selectedExternalLibrary: null, selectedExternalDefinition: null });
  }

  render() {
    const { inBaseElements, disableElement, elementUniqueId } = this.props;
    const { selectedElement, selectedExternalLibrary, selectedExternalDefinition } = this.state;
    const placeholderText = 'Choose element type';
    const elementOptionsToDisplay =
      elementOptions
        .filter(({ value }) => inBaseElements ? true : value !== 'listOperations')
        .map(option => ({ ...option, isDisabled: disableElement }));

    let noAuthElementOptions;
    if (selectedElement && !selectedElement.vsacAuthRequired) {
      noAuthElementOptions = this.state.categories
        .find(cat => cat.name === selectedElement.label)
        .entries.map(({ id, name, type, fields }) => {
          // Base elements display the field element_name entered by user, not the generic 'Base Element'.
          const label = type === 'baseElement' ? getFieldWithId(fields, 'element_name').value : name;
          const uniqueId = type === 'baseElement' ? getFieldWithType(fields, 'reference').value.id : '';
          return ({ value: id, label, type: selectedElement.label, uniqueId });
        });
      if (selectedElement.value === 'baseElement') {
        noAuthElementOptions = noAuthElementOptions.filter(element => element.uniqueId !== elementUniqueId);
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

    return (
      <div className="element-select form__group">
        <div className="element-select__add-element">
          <div className="element-select__label">
            <FontAwesome name="plus" />
            Add element
          </div>

          <StyledSelect
            className="Select element-select__element-field"
            classNamePrefix="element-select"
            maxMenuHeight="none"
            name="element-select__element-field"
            value={
              selectedElementValue
                ? elementOptionsToDisplay.find(({ value }) => value === selectedElementValue.value)
                : null
            }
            placeholder={placeholderText}
            aria-label={placeholderText}
            options={elementOptionsToDisplay}
            onChange={this.onElementSelected}
            components={{ MenuList: ElementMenuList, Option: ElementOption }}
            isClearable
          />

          {selectedElement && !selectedElement.vsacAuthRequired &&
            <StyledSelect
              className="Select element-select__element-field"
              classNamePrefix="internal-select"
              value={noAuthElementOptions.find(({ value }) => value === selectedExternalLibraryName)}
              placeholder={noAuthPlaceholder}
              aria-label={noAuthPlaceholder}
              options={noAuthElementOptions}
              onChange={this.onNoAuthElementSelected}
              components={{ Option: ElementOption }}
            />
          }
        </div>

        {selectedElement && !selectedElement.vsacAuthRequired && selectedExternalLibrary &&
          <StyledSelect
            className="Select element-select__external-cql-field"
            value={
              selectedExternalDefinition
                ? selectedExternalLibraryOptions.find(({ value }) => value === selectedExternalDefinition.value)
                : null
            }
            placeholder={externalLibraryPlaceholder}
            aria-label={externalLibraryPlaceholder}
            options={selectedExternalLibraryOptions}
            onChange={this.onExternalDefinitionSelected}
            components={{ Option: ElementOption }}
          />
        }

        {selectedElement && selectedElement.vsacAuthRequired && this.renderVSACLogin()}
      </div>
    );
  }
}

ElementSelect.propTypes = {
  artifactId: PropTypes.string,
  categories: PropTypes.array.isRequired,
  onSuggestionSelected: PropTypes.func.isRequired,
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
