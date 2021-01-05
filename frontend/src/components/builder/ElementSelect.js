import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button } from '@material-ui/core';
import { Check as CheckIcon } from '@material-ui/icons';
import pluralize from 'pluralize';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBan, faKey, faPlus } from '@fortawesome/free-solid-svg-icons';
import { IconButton } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import _ from 'lodash';

import ElementModal from './ElementModal';
import VSACAuthenticationModal from './VSACAuthenticationModal';
import CodeSelectModal from './CodeSelectModal';
import { Dropdown } from 'components/elements';

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

const ElementOption = ({ option }) => (
  <>
    <span className="element-select__option-value">{option.label}</span>

    {option.vsacAuthRequired &&
      <FontAwesomeIcon icon={faKey} className="element-select__option-category" />
    }

    {option.statementType === 'function' && (
      <span className="element-select__option-value">
        {` | Function(${option.arguments.length})`}
      </span>
    )}

    {option.displayReturnType && (
      <span className="element-select__option-value">
        {` | ${option.displayReturnType}`}
      </span>
    )}
  </>
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
  { value: 'device', label: 'Device', vsacAuthRequired: true, template: 'GenericDevice_vsac' },
  { value: 'encounter', label: 'Encounter', vsacAuthRequired: true, template: 'GenericEncounter_vsac' },
  { value: 'externalCqlElement', label: 'External CQL', vsacAuthRequired: false },
  { value: 'immunization', label: 'Immunization', vsacAuthRequired: true, template: 'GenericImmunization_vsac' },
  { value: 'listOperations', label: 'List Operations', vsacAuthRequired: false },
  {
    value: 'medicationStatement',
    label: 'Medication Statement',
    vsacAuthRequired: true,
    template: 'GenericMedicationStatement_vsac'
  },
  {
    value: 'medicationRequest',
    label: 'Medication Request',
    vsacAuthRequired: true,
    template: 'GenericMedicationRequest_vsac'
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

      categoriesCopy[externalCqlIndex].entries = props.externalCqlList.map(e => {
        // TODO: We don't yet support functions that have any arguments, so we only want to allow the functions
        // that have no arguments associated with them to be selected. This should be removed when we have support
        // for arbitrary numbers of arguments in functions.
        const functions = e.details.functions.filter(f => f.operand.length === 0);
        return {
          id: e.name,
          name: e.name,
          type: 'externalCqlElement',
          definitions: e.details.definitions.concat(e.details.parameters), // parameters behave like definitions
          functions
        };
      });
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
    if (!this.props.vsacApiKey) {
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
        <Button color="primary" disabled variant="contained" startIcon={<CheckIcon />}>
          VSAC Authenticated
        </Button>

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
          vsacApiKey={this.props.vsacApiKey}
          />

        <CodeSelectModal
          className="element-select__modal"
          onElementSelected={this.onSuggestionSelected}
          template={selectedTemplate}
          vsacApiKey={this.props.vsacApiKey}
          isValidatingCode={this.props.isValidatingCode}
          isValidCode={this.props.isValidCode}
          codeData={this.props.codeData}
          validateCode={this.props.validateCode}
          resetCodeValidation={this.props.resetCodeValidation}
        />
      </div>
    );
  }

  onExternalDefinitionSelected = (event, selectedExternalLibraryOptions) => {
    const selectedExternalDefinition =
      selectedExternalLibraryOptions.find(({ value }) => value === event.target.value);

    this.setState({ selectedExternalDefinition });
    const suggestion = {
      id: selectedExternalDefinition.uniqueId,
      name: 'External CQL Element',
      type: selectedExternalDefinition.type,
      template: selectedExternalDefinition.statementType === 'function' ? 'GenericFunction' : 'GenericStatement',
      returnType: selectedExternalDefinition.returnType,
      fields: [
        { id: 'element_name', type: 'string', name: 'Element Name', value: selectedExternalDefinition.value },
        {
          id: 'externalCqlReference',
          type: 'reference',
          name: 'reference',
          value: {
            id: `${selectedExternalDefinition.value}${
              selectedExternalDefinition.statementType === 'function'
              ? ' (Function)'
              : ''
            } from ${this.state.selectedExternalLibrary.name}`,
            element: selectedExternalDefinition.value,
            library: this.state.selectedExternalLibrary.name,
            arguments: selectedExternalDefinition.arguments // will only exist if the statement is a function
          },
          static: true
        },
        { id: 'comment', type: 'textarea', name: 'Comment', value: '' }
      ]
    };

    this.onSuggestionSelected(suggestion);
  }

  onNoAuthElementSelected = (event, noAuthElementOptions) => {
    const element = noAuthElementOptions.find(({ value }) => value === event.target.value);

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

  onElementSelected = event => {
    const selectedElement = event ? elementOptions.find(({ value }) => value === event.target.value) : null;

    this.setState({
      selectedElement,
      selectedExternalLibrary: null,
      selectedExternalDefinition: null
    });
  }

  disableElement = elementType => {
    const { categories } = this.state;
    const disableableElements = ['Base Elements', 'Parameters', 'External CQL'];
    const elementCategory = categories.find(category => category.name === elementType);

    if (!elementCategory || disableableElements.indexOf(elementType) === -1) return false;
    return elementCategory.entries.length === 0;
  }

  render() {
    const { inBaseElements, elementUniqueId, disableAddElement } = this.props;
    const { selectedElement, selectedExternalLibrary, selectedExternalDefinition } = this.state;

    const elementOptionsToDisplay =
      disableAddElement
        ? []
        : elementOptions
            .filter(({ value }) => inBaseElements ? true : value !== 'listOperations')
            .map(option => ({
              ...option,
              isDisabled: this.disableElement(option.label)
            }));

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
        noAuthPlaceholder = `${pluralize.singular(selectedElement.label)}`;
      } else {
        noAuthPlaceholder = `${selectedElement.label} element`;
      }
    }
    const selectedExternalLibraryName = selectedExternalLibrary && selectedExternalLibrary.name;
    const selectedExternalLibraryOptions = [];
    if (selectedExternalLibrary) {
      const statementMapper = (statement, statementType) => {
        const name = statement.name;
        const returnType = statement.calculatedReturnType;
        const displayReturnType = statement.displayReturnType
          ? statement.displayReturnType
          : _.startCase(statement.calculatedReturnType);
        return ({
          value: name,
          label: name,
          type: 'externalCqlElement',
          uniqueId: _.uniqueId(),
          returnType,
          displayReturnType,
          statementType,
          arguments: statement.operand // will only exist if the statement is a function
        });
      };

      selectedExternalLibrary.definitions.forEach((statement) => {
        selectedExternalLibraryOptions.push(statementMapper(statement, 'definition'));
      });
      selectedExternalLibrary.functions.forEach((statement) => {
        selectedExternalLibraryOptions.push(statementMapper(statement, 'function'));
      });
    }

    return (
      <div className="element-select form__group">
        <div className="element-select__add-element">
          <div className="element-select__label">
            <FontAwesomeIcon icon={faPlus} /> Add element
          </div>

          <div className="element-select__dropdown">
            <Dropdown
              id="element-select"
              label="Element type"
              onChange={this.onElementSelected}
              options={elementOptionsToDisplay}
              value={selectedElementValue}
              message={disableAddElement ? (
                <>
                  <FontAwesomeIcon icon={faBan} className="element-select__option-icon" />
                  Cannot add element when Base Element List in use
                </>
              ) : null}
              renderItem={option => <ElementOption option={option} />}
              Footer={
                <>
                  <FontAwesomeIcon icon={faKey} className="element-select__option-icon"/>
                  VSAC authentication required
                </>
              }
            />
          </div>

          {selectedElement && !selectedElement.vsacAuthRequired &&
            <div className="element-select__dropdown">
              <Dropdown
                id="internal-select"
                label={noAuthPlaceholder}
                onChange={event => this.onNoAuthElementSelected(event, noAuthElementOptions)}
                options={noAuthElementOptions}
                value={selectedExternalLibraryName}
                renderItem={option => <ElementOption option={option} />}
              />
            </div>
          }

          {selectedElementValue &&
            <IconButton onClick={() => this.onElementSelected(null)}>
              <CloseIcon />
            </IconButton>
          }
        </div>

        {selectedElement && !selectedElement.vsacAuthRequired && selectedExternalLibrary &&
          <div className="element-select__dropdown">
            <Dropdown
              id="external-cql-field"
              label="Definition, function, or parameter"
              onChange={event => this.onExternalDefinitionSelected(event, selectedExternalLibraryOptions)}
              options={selectedExternalLibraryOptions}
              value={selectedExternalDefinition}
              renderItem={option => <ElementOption option={option} />}
            />
          </div>
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
  disableAddElement: PropTypes.bool,
  externalCqlList: PropTypes.array.isRequired,
  loadExternalCqlList: PropTypes.func.isRequired
};
