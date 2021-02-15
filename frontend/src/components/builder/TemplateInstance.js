import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button, IconButton } from '@material-ui/core';
import {
  ChatBubble as ChatBubbleIcon,
  Check as CheckIcon,
  Close as CloseIcon,
  ExpandLess as ExpandLessIcon,
  ExpandMore as ExpandMoreIcon,
  Link as LinkIcon,
  List as ListIcon,
  LocalHospital as LocalHospitalIcon,
  Lock as LockIcon,
  MenuBook as MenuBookIcon,
  Sms as SmsIcon
} from '@material-ui/icons';
import clsx from 'clsx';
import classnames from 'classnames';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExclamationCircle} from '@fortawesome/free-solid-svg-icons';
import { UncontrolledTooltip } from 'reactstrap';
import _ from 'lodash';

import { DeleteConfirmationModal } from 'components/modals';
import { CodeSelectModal, ValueSetSelectModal, VSACAuthenticationModal } from 'components/modals';
import { NumberField, StaticField, StringField, TextAreaField, ValueSetField } from './fields';
import ValueSetTemplate from './templates/ValueSetTemplate';

import ExpressionPhrase from './ExpressionPhrase';
import {
  BooleanComparisonModifier,
  CheckExistenceModifier,
  DateTimeModifier,
  ExternalModifier,
  LabelModifier,
  LookBackModifier,
  NumberModifier,
  QualifierModifier,
  QuantityModifier,
  SelectModifier,
  StringModifier,
  ValueComparisonModifier,
  WithUnitModifier
} from './modifiers';
import { hasDuplicateName, doesBaseElementUseNeedWarning, doesBaseElementInstanceNeedWarning,
  doesParameterUseNeedWarning, validateElement, hasGroupNestedWarning } from 'utils/warnings';
import { getOriginalBaseElement } from 'utils/baseElements';
import { getReturnType, validateModifier, allModifiersValid, getFieldWithType, getFieldWithId }
  from 'utils/instances';

function getInstanceName(instance) {
  return (getFieldWithId(instance.fields, 'element_name') || {}).value;
}

export default class TemplateInstance extends Component {
  constructor(props) {
    super(props);

    this.state = {
      otherInstances: this.getOtherInstances(props),
      relevantModifiers: (props.modifiersByInputType[props.templateInstance.returnType] || []),
      returnType: props.templateInstance.returnType,
      showCodeSelectModal: false,
      showComment: false,
      showConfirmDeleteModal: false,
      showElement: true,
      showModifiers: false,
      showValueSetSelectModal: false,
      showVSACAuthenticationModal: false
    };
  }

  UNSAFE_componentWillMount() { // eslint-disable-line camelcase
    this.props.templateInstance.fields.forEach((field) => {
      this.setState({ [field.id]: field.value });
    });
  }

  componentDidMount() {
    this.setAppliedModifiers(this.props.templateInstance.modifiers || []);
  }

  UNSAFE_componentWillReceiveProps(nextProps) { // eslint-disable-line camelcase
    const otherInstances = this.getOtherInstances(nextProps);
    this.setState({ otherInstances });

    let returnType = nextProps.templateInstance.returnType;
    if (!(_.isEmpty(nextProps.templateInstance.modifiers))) {
      returnType = getReturnType(nextProps.templateInstance.returnType, nextProps.templateInstance.modifiers);
    }
    this.setState({ returnType });

    if (!nextProps.isLoadingModifiers) {
      this.setState({
        relevantModifiers: (nextProps.modifiersByInputType[returnType] || [])
      });
    }
  }

  openVSACAuthenticationModal = () => {
    this.setState({ showVSACAuthenticationModal: true });
  }

  closeVSACAuthenticationModal = () => {
    this.setState({ showVSACAuthenticationModal: false });
  }

  openValueSetSelectModal = () => {
    this.setState({ showValueSetSelectModal: true });
  }

  closeValueSetSelectModal = () => {
    this.setState({ showValueSetSelectModal: false });
  }

  openCodeSelectModal = () => {
    this.setState({ showCodeSelectModal: true });
  }

  closeCodeSelectModal = () => {
    this.setState({ showCodeSelectModal: false });
  }

  hasWarnings = () => {
    const {
      templateInstance,
      instanceNames,
      baseElements,
      parameters,
      allInstancesInAllTrees,
      validateReturnType
    } = this.props;

    // Use function for group warnings with a list of just this element to check for all types of warnings.
    const hasSomeWarning = hasGroupNestedWarning(
      [templateInstance],
      instanceNames,
      baseElements,
      parameters,
      allInstancesInAllTrees,
      validateReturnType
    );

    return hasSomeWarning;
  }

  // Props will either be this.props or nextProps coming from componentWillReceiveProps
  getOtherInstances(props) {
    const otherInstances = props.otherInstances.filter(this.notThisInstance)
      .map(instance => ({
        name: getInstanceName(instance),
        id: instance.id,
        returnType: (_.isEmpty(instance.modifiers) ? instance.returnType : _.last(instance.modifiers).returnType)
      }));
    return otherInstances;
  }

  notThisInstance = instance => (
    // Look up by uniqueId to correctly identify the current instance
    // For example, "and" elements have access to all other "and" elements besides itself
    // They have different uniqueId's but the id's of all "and" elements is "And"
    this.props.templateInstance.uniqueId !== instance.uniqueId
  )

  isBaseElementUsed = () => (
    this.props.templateInstance.usedBy ? this.props.templateInstance.usedBy.length !== 0 : false);

  updateInstance = (newState) => {
    this.setState(newState);
    this.props.editInstance(this.props.treeName, newState, this.getPath(), false);
  }

  deleteInstance = () => {
    this.props.deleteInstance(this.props.treeName, this.getPath());
  }

  openConfirmDeleteModal = () => {
    const baseElementIsInUse = this.isBaseElementUsed() || this.props.disableAddElement;
    if (!baseElementIsInUse) {
      this.setState({ showConfirmDeleteModal: true });
    }
  }

  closeConfirmDeleteModal = () => {
    this.setState({ showConfirmDeleteModal: false });
  }

  handleDeleteInstance = () => {
    this.deleteInstance();
    this.closeConfirmDeleteModal();
  }

  toggleComment = () => {
    this.setState({ showComment: !this.state.showComment });
  }

  renderAppliedModifier = (modifier, index) => {
    const { modifierMap } = this.props;
    // Reset values on modifiers that were not previously set or saved in the database
    if (!modifier.values && modifierMap[modifier.id] && modifierMap[modifier.id].values) {
      modifier.values = modifierMap[modifier.id].values;
    }

    const validationWarning = validateModifier(modifier);

    const modifierForm = (() => {
      switch (modifier.type || modifier.id) {
        case 'ValueComparisonNumber':
          return (
            <ValueComparisonModifier
              handleUpdateModifier={values => this.handleUpdateModifier(index, values)}
              values={{
                maxOperator: modifier.values?.maxOperator || '',
                maxValue: modifier.values?.maxValue || '',
                minOperator: modifier.values?.minOperator || '',
                minValue: modifier.values?.minValue || ''
              }}
            />
          );
        case 'ValueComparisonObservation':
          return (
            <ValueComparisonModifier
              handleUpdateModifier={values => this.handleUpdateModifier(index, values)}
              values={{
                maxOperator: modifier.values?.maxOperator || '',
                maxValue: modifier.values?.maxValue || '',
                minOperator: modifier.values?.minOperator || '',
                minValue: modifier.values?.minValue || '',
                unit: modifier.values?.unit || ''
              }}
            />
          );
        case 'LookBack':
          return (
            <LookBackModifier
              handleUpdateModifier={value => this.handleUpdateModifier(index, value)}
              unit={modifier.values?.unit}
              value={modifier.values?.value}
            />
          );
        case 'WithUnit':
          return (
            <WithUnitModifier
              handleUpdateModifier={value => this.handleUpdateModifier(index, value)}
              unit={modifier.values?.unit}
            />
          );
        case 'BooleanComparison':
          return (
            <BooleanComparisonModifier
              handleUpdateModifier={value => this.handleUpdateModifier(index, value)}
              value={modifier.values?.value}
            />
          );
        case 'CheckExistence':
          return (
            <CheckExistenceModifier
              handleUpdateModifier={value => this.handleUpdateModifier(index, value)}
              value={modifier.values?.value}
            />
          );
        case 'ConvertObservation':
          return (
            <SelectModifier
              handleUpdateModifier={value => this.handleUpdateModifier(index, value)}
              name={modifier.name}
              value={modifier.values?.value}
            />
          );
        case 'Qualifier':
          return (
            <QualifierModifier
              handleUpdateModifier={value => this.handleUpdateModifier(index, value)}
              qualifier={modifier.values?.qualifier}
              template={this.props.templateInstance}
            />
          );
        case 'BeforeDateTimePrecise':
        case 'AfterDateTimePrecise':
          return (
            <DateTimeModifier
              handleUpdateModifier={value => this.handleUpdateModifier(index, value)}
              name={modifier.name}
              values={{
                date: modifier.values?.date || '',
                time: modifier.values?.time || '',
                precision: modifier.values?.precision || ''
              }}
            />
          );
        case 'BeforeTimePrecise':
        case 'AfterTimePrecise':
          return (
            <DateTimeModifier
              handleUpdateModifier={value => this.handleUpdateModifier(index, value)}
              name={modifier.name}
              values={{
                time: modifier.values?.time || '',
                precision: modifier.values?.precision || ''
              }}
            />
          );
        case 'ContainsQuantity':
        case 'BeforeQuantity':
        case 'AfterQuantity':
          return (
            <QuantityModifier
              handleUpdateModifier={value => this.handleUpdateModifier(index, value)}
              name={modifier.name}
              unit={modifier.values?.unit}
              value={modifier.values?.value}
            />
          );
        case 'ContainsInteger':
        case 'BeforeInteger':
        case 'AfterInteger':
        case 'ContainsDecimal':
        case 'BeforeDecimal':
        case 'AfterDecimal':
          return (
            <NumberModifier
              handleUpdateModifier={value => this.handleUpdateModifier(index, value)}
              name={modifier.name}
              value={modifier.values?.value}
            />
          );
        case 'ContainsDateTime':
        case 'BeforeDateTime':
        case 'AfterDateTime':
          return (
            <DateTimeModifier
              handleUpdateModifier={value => this.handleUpdateModifier(index, value)}
              name={modifier.name}
              values={{ date: modifier.values?.date || '', time: modifier.values?.time || '' }}
            />
          );
        case 'EqualsString':
        case 'EndsWithString':
        case 'StartsWithString':
          return (
            <StringModifier
              handleUpdateModifier={value => this.handleUpdateModifier(index, value)}
              name={modifier.name}
              value={modifier.values?.value}
            />
          );
        case 'ExternalModifier':
          return (
            <ExternalModifier
              argumentTypes={modifier.argumentTypes}
              handleUpdateModifier={value => this.handleUpdateModifier(index, value)}
              modifierArguments={modifier.arguments}
              name={modifier.name}
              value={modifier.values?.value}
            />
          );
        default:
          return <LabelModifier name={modifier.name} />;
      }
    })();

    const canModifierBeRemoved = this.canModifierBeRemoved();

    return (
      <div
        key={index}
        className={clsx('element-field-details', `modifier-${modifier.type || modifier.id}`)}
      >
        <div className="element-field-display-group">
          {modifierForm}
          {validationWarning && <div className="warning">{validationWarning}</div>}
        </div>

        {index + 1 === this.props.templateInstance.modifiers.length &&
          <div className="element-field-buttons">
            <span id={`modifier-delete-${this.props.templateInstance.uniqueId}`}>
              <IconButton
                aria-label="remove last expression"
                color="primary"
                disabled={!canModifierBeRemoved}
                onClick={() => this.removeLastModifier(canModifierBeRemoved)}
              >
                <CloseIcon fontSize="small" />
              </IconButton>
            </span>

            {!canModifierBeRemoved &&
              <UncontrolledTooltip
                target={`modifier-delete-${this.props.templateInstance.uniqueId}`}
                placement="left"
              >
                Cannot remove modifier because return type cannot change while in use.
              </UncontrolledTooltip>
            }
          </div>
        }
      </div>
    );
  }

  renderAppliedModifiers = () => (
    <div id="applied-modifiers">
      <div className="element-field">
        {this.props.templateInstance.modifiers?.length > 0 &&
          <div className="element-field-label">Expressions:</div>
        }

        <div className="element-field-details-group" aria-label="Expression List">
          {(this.props.templateInstance.modifiers || []).map((modifier, index) =>
            this.renderAppliedModifier(modifier, index))}
        </div>
      </div>
    </div>
  );

  setAppliedModifiers = (modifiers) => {
    this.setState({
      returnType: getReturnType(this.props.templateInstance.returnType, modifiers)
    }, this.filterRelevantModifiers);
    this.props.updateInstanceModifiers(this.props.treeName, modifiers, this.getPath(), this.props.subpopulationIndex);
  }

  filterRelevantModifiers = () => {
    const relevantModifiers = (this.props.modifiersByInputType[this.state.returnType] || []).slice();
    if (!this.props.templateInstance.checkInclusionInVS) { // Rather than suppressing `CheckInclusionInVS` in every element, assume it's suppressed unless explicity stated otherwise
      _.remove(relevantModifiers, modifier => modifier.id === 'CheckInclusionInVS');
    }
    if (_.has(this.props.templateInstance, 'suppressedModifiers')) {
      this.props.templateInstance.suppressedModifiers.forEach(suppressedModifier =>
        _.remove(relevantModifiers, relevantModifier => relevantModifier.id === suppressedModifier));
    }
    this.setState({ relevantModifiers });
  }

  handleModifierSelected = modifierId => {
    const selectedModifier = _.cloneDeep(this.props.modifierMap[modifierId]);
    const modifiers = (this.props.templateInstance.modifiers || []).concat(selectedModifier);
    this.setState({ showModifiers: false });
    this.setAppliedModifiers(modifiers);
  }

  removeLastModifier = (canRemove) => {
    if (!canRemove) return;
    const modifiers = _.initial(this.props.templateInstance.modifiers);
    this.setAppliedModifiers(modifiers);
  }

  handleUpdateModifier = (index, values) => {
    const modifiers = this.props.templateInstance.modifiers;
    _.assign(modifiers[index].values, values);
    this.setAppliedModifiers(modifiers);
  }

  canModifierBeRemoved = () => {
    const baseElementIsInUse = this.isBaseElementUsed() || this.props.disableAddElement;

    if (baseElementIsInUse) {
      // If a base element is in use, need to make sure the modifiers removed don't change the return type.
      const length = this.props.templateInstance.modifiers.length;
      let nextReturnType = this.props.templateInstance.returnType; // Defaults to the element's return type.
      if (length > 1) {
        // If there is another modifier applied after the last one is removed, use that modifier type.
        nextReturnType = this.props.templateInstance.modifiers[length - 2].returnType;
      }

      // If a base element is being used, but the next return type is the same as the current, modifier can be removed.
      return nextReturnType === this.state.returnType;
    }

    // If not a base element being used elsewhere, modifiers can be removed.
    return true;
  }

  deleteCode = (codeToDelete) => {
    const templateInstanceClone = _.cloneDeep(this.props.templateInstance);
    const vsacField = getFieldWithType(templateInstanceClone.fields, '_vsac');
    if (vsacField && vsacField.codes) {
      const updatedCodes = [...vsacField.codes];
      const indexOfCodeToRemove = updatedCodes.findIndex(code =>
        (code.code === codeToDelete.code && _.isEqual(code.codeSystem, codeToDelete.codeSystem)));
      updatedCodes.splice(indexOfCodeToRemove, 1);
      const arrayToUpdate = [
        { [vsacField.id]: updatedCodes, attributeToEdit: 'codes' }
      ];
      this.updateInstance(arrayToUpdate);
    }
  }

  handleSelectValueSet = (template, valueSet) => {
    const selectedTemplate = _.cloneDeep(template);
    const vsacField = getFieldWithType(selectedTemplate.fields, '_vsac');
    const nameField = getFieldWithId(selectedTemplate.fields, 'element_name');
    const valueSetsToAdd = vsacField?.valueSets || [];
    valueSetsToAdd.push(valueSet);

    // Create array of which field to update, the new value to set, and the attribute to update (value is default)
    const arrayToUpdate = [
      { [vsacField.id]: valueSetsToAdd, attributeToEdit: 'valueSets' },
      { [vsacField.id]: true, attributeToEdit: 'static' }
    ];

    // Only set name of element if there isn't one already
    if (!nameField.value) arrayToUpdate.push({ [nameField.id]: valueSet.name });
    this.updateInstance(arrayToUpdate);
  }

  handleSelectCode = (template, codeData) => {
    const selectedTemplate = _.cloneDeep(template);
    const vsacField = getFieldWithType(selectedTemplate.fields, '_vsac');
    const nameField = getFieldWithId(selectedTemplate.fields, 'element_name');
    const codesToAdd = vsacField?.codes || [];
    codesToAdd.push(codeData);

    // Create array of which field to update, the new value to set, and the attribute to update (value is default)
    const arrayToUpdate = [
      { [vsacField.id]: codesToAdd, attributeToEdit: 'codes' },
      { [vsacField.id]: true, attributeToEdit: 'static' }
    ];

    if (!nameField.value || nameField.value === '') {
      const newName =
        codeData.display?.length < 60 ? codeData.display : `${codeData.codeSystem.name} ${codeData.code}`;
      arrayToUpdate.push({ [nameField.id]: newName });
    }

    this.updateInstance(arrayToUpdate);
  }

  renderModifierSelect = () => {
    if (this.props.templateInstance.cannotHaveModifiers) return null;
    if (this.props.isLoadingModifiers) return (<div>Loading modifiers...</div>);

    if (this.state.relevantModifiers.length > 0 || (this.props.templateInstance.modifiers || []).length === 0) {
      const baseElementIsInUse = this.isBaseElementUsed() || this.props.disableAddElement;

      return (
        <div className="modifier-select">
          <div className="modifier__selection">
            <Button
              color="primary"
              disabled={!allModifiersValid(this.props.templateInstance.modifiers)}
              onClick={() => this.setState({ showModifiers: !this.state.showModifiers })}
              variant="contained"
            >
              Add expression
            </Button>

            {this.state.showModifiers &&
              this.state.relevantModifiers
                .filter(modifier => !baseElementIsInUse || modifier.returnType === this.state.returnType)
                .map(modifier =>
                  <Button
                    className="modifier-select-button"
                    key={modifier.id}
                    onClick={() => this.handleModifierSelected(modifier.id)}
                    variant="contained"
                  >
                    {modifier.type === 'ExternalModifier' && <MenuBookIcon fontSize="small" />} {modifier.name}
                  </Button>
                )
            }
          </div>

          {this.state.showModifiers && baseElementIsInUse &&
            <div className="notification">
              <FontAwesomeIcon icon={faExclamationCircle} />
              Limited expressions displayed because return type cannot change while in use.
            </div>
          }
        </div>
      );
    }

    return null;
  }

  renderReferenceInfo = (referenceField) => {
    let referenceName;
    if (referenceField) {
      if (referenceField.id === 'externalCqlReference') {
        referenceName = referenceField.value.id;
      } else {
        const elementToReference = this.props.instanceNames.find(name => name.id === referenceField.value.id);
        if (elementToReference) {
          referenceName = elementToReference.name;
        }
      }
    }
    const scrollElementId = referenceField.value.id;
    const scrollReferenceType = referenceField.id;

    let baseUseTab;
    if (referenceField.id === 'baseElementUse') {
      const { allInstancesInAllTrees } = this.props;
      const element = allInstancesInAllTrees.filter(instance => instance.uniqueId === referenceField.value.id)[0];
      baseUseTab = element ? element.tab : null;
    }

    let tabIndex;
    if (baseUseTab === 'expTreeInclude') tabIndex = 0;
    if (baseUseTab === 'expTreeExclude') tabIndex = 1;
    if (baseUseTab === 'subpopulations') tabIndex = 2;
    if (baseUseTab === 'baseElements') tabIndex = 3;

    let label = 'Element:';
    if (referenceField.id === 'baseElementReference') label = 'Base Element:';
    if (referenceField.id === 'parameterReference') label = 'Parameter:';
    if (referenceField.id === 'externalCqlReference') label = 'External CQL Element:';
    if (referenceField.id === 'baseElementUse') label = 'Element Use:';

    let tabLabel = '';
    if (baseUseTab === 'expTreeInclude') tabLabel = 'Inclusions';
    if (baseUseTab === 'expTreeExclude') tabLabel = 'Exclusions';
    if (baseUseTab === 'subpopulations') tabLabel = 'Subpopulations';
    if (baseUseTab === 'baseElements') tabLabel = 'Base Element';

    return (
      <div id="base-element-list" key={referenceField.value.id}>
        <div className="element-field">
          <div className="element-field-label">{label}</div>

          <div className="element-field-details code-info__info">
            <div className="element-field-display code-info__text">
              <span>{referenceName}</span>
              {referenceField.id === 'baseElementUse' && <span> &#8594; {tabLabel}</span>}
            </div>

            {referenceField.id !== 'externalCqlReference' &&
              <div className="element-field-buttons code-info__buttons align-right">
                <span id={`definition-${this.props.templateInstance.uniqueId}`}>
                  <IconButton
                    aria-label="see element definition"
                    color="primary"
                    onClick={() => this.props.scrollToElement(scrollElementId, scrollReferenceType, tabIndex)}
                  >
                    <LinkIcon fontSize="small" />
                  </IconButton>
                </span>
              </div>
            }
          </div>
        </div>
      </div>
    );
  }

  renderVSInfo = () => {
    if (this.props.templateInstance.fields.length > 1) {
      // All generic VSAC elements save the VS information on this field on the valueSets property.
      const vsacField = getFieldWithType(this.props.templateInstance.fields, '_vsac');
      if (vsacField && vsacField.valueSets) {
        return (
          <div id="valueset-list">
            {vsacField.valueSets.map((vs, i) => (
              <ValueSetTemplate
                index={i}
                key={`selected-valueset-${i}`}
                templateInstance={this.props.templateInstance}
                updateInstance={this.updateInstance}
                valueSet={vs}
                vsacApiKey={this.props.vsacApiKey}
                vsacField={vsacField}
              />
            ))}
          </div>
        );
      }
    }

    return null;
  }

  renderCodeInfo = () => {
    if (this.props.templateInstance.fields.length > 1) {
      // All generic VSAC elements save the VS information on this field on the codes property.
      const vsacField = getFieldWithType(this.props.templateInstance.fields, '_vsac');
      if (vsacField && vsacField.codes) {
        return (
          <div id="code-list">
            {vsacField.codes.map((code, i) => (
              <div key={`selected-code-${i}`} className="element-field code-info">
                <div className="element-field-label">
                  Code{vsacField.codes.length > 1 ? ` ${i + 1}` : ''}:
                </div>

                {/* Code name will come with validation */}
                <div className="element-field-details code-info__info">
                  <div className="code-info__text element-field-display">
                    {`${code.codeSystem.name} (${code.code}) ${code.display === '' ? '' : ` - ${code.display}`}`}
                  </div>

                  <div className="code-info__buttons element-field-buttons">
                    <IconButton
                      aria-label={`delete code ${code.codeSystem.name} (${code.code})`}
                      color="primary"
                      onClick={() => this.deleteCode(code)}
                    >
                      <CloseIcon fontSize="small" />
                    </IconButton>
                  </div>
                </div>
              </div>
            ))}
          </div>
        );
      }
    }

    return null;
  }

  renderVSACOptions = () => {
    const { templateInstance, vsacApiKey } = this.props;
    const { showCodeSelectModal, showValueSetSelectModal, showVSACAuthenticationModal } = this.state;

    return (
      <div id="vsac-controls">
        <Button 
          color="primary"
          disabled={Boolean(vsacApiKey)}
          onClick={this.openVSACAuthenticationModal}
          variant="contained"
          startIcon={Boolean(vsacApiKey) ? <CheckIcon /> : <LockIcon />}
        >
          {Boolean(vsacApiKey) ? 'VSAC Authenticated' : 'Authenticate VSAC' }
        </Button>

        {Boolean(vsacApiKey) && (
          <>
            <Button
              color="primary"
              onClick={this.openValueSetSelectModal}
              startIcon={<ListIcon />}
              variant="contained"
            >
              Add Value Set
            </Button>

            <Button
              color="primary"
              onClick={this.openCodeSelectModal}
              startIcon={<LocalHospitalIcon />}
              variant="contained"
            >
              Add Code
            </Button>
          </>
        )}

        {showVSACAuthenticationModal && (
          <VSACAuthenticationModal handleCloseModal={this.closeVSACAuthenticationModal} />
        )}

        {showValueSetSelectModal && (
          <ValueSetSelectModal
            handleCloseModal={this.closeValueSetSelectModal}
            handleSelectValueSet={valueSet => this.handleSelectValueSet(templateInstance, valueSet)}
          />
        )}

        {showCodeSelectModal && (
          <CodeSelectModal
            handleCloseModal={this.closeCodeSelectModal}
            handleSelectCode={codeData => this.handleSelectCode(templateInstance, codeData)}
          />
        )}
      </div>
    );
  }

  selectTemplate = (field) => {
    if (field.static) {
      return (
        <StaticField
          key={field.id}
          updateInstance={this.updateInstance}
        />
      );
    }

    switch (field.type) {
      case 'number':
        return (
          <NumberField
            key={field.id}
            field={field}
            value={this.state[field.id] || ''}
            typeOfNumber={field.typeOfNumber}
            updateInstance={this.updateInstance}
          />
        );
      case 'string':
        return (
          <StringField
            key={field.id}
            {...field}
            updateInstance={this.updateInstance}
          />
        );
      case 'textarea':
        return (
          <TextAreaField
            key={field.id}
            {...field}
            updateInstance={this.updateInstance}
          />
        );
      case 'observation_vsac':
      case 'condition_vsac':
      case 'medicationStatement_vsac':
      case 'medicationRequest_vsac':
      case 'procedure_vsac':
      case 'encounter_vsac':
      case 'allergyIntolerance_vsac':
      case 'immunization_vsac':
      case 'device_vsac':
        return (
          <StringField
            key={field.id}
            {...field}
            updateInstance={this.updateInstance}
          />
        );
      case 'valueset':
        return (
          <ValueSetField
            key={field.id}
            field={field}
            updateInstance={this.updateInstance}
          />
        );
      default:
        return undefined;
    }
  }

  showHideElementBody = () => {
    this.setState({ showElement: !this.state.showElement });
  }

  getPath = () => this.props.getPath(this.props.templateInstance.uniqueId);

  hasBaseElementLinks = () => {
    const { baseElements, templateInstance } = this.props;
    const thisBaseElement = baseElements.find(baseElement => baseElement.uniqueId === templateInstance.uniqueId);
    if (!thisBaseElement) return false;
    const thisBaseElementUsedBy = thisBaseElement.usedBy;
    if (!thisBaseElementUsedBy || thisBaseElementUsedBy.length === 0) return false;
    return true;
  }

  renderBody() {
    const { templateInstance, validateReturnType } = this.props;
    const { returnType } = this.state;
    const referenceField = getFieldWithType(templateInstance.fields, 'reference');
    const validationError = validateElement(this.props.templateInstance, this.state);
    const returnError = (!(validateReturnType !== false) || returnType === 'boolean') ? null
      : "Element must have return type 'boolean'. Add expression(s) to change the return type.";

    return (
      <div className="card-element__body">
        {validationError && <div className="warning">{validationError}</div>}
        {returnError && <div className="warning">{returnError}</div>}

        <ExpressionPhrase
          class="expression"
          instance={templateInstance}
          baseElements={this.props.baseElements}
        />

        {templateInstance.fields.map((field, index) => {
          if (field.id !== 'element_name' && field.id !== 'comment') {
            return this.selectTemplate(field);
          }
          return null;
        })}

        {templateInstance.id && templateInstance.id.includes('_vsac') &&
          <>
            {this.renderVSInfo()}
            {this.renderCodeInfo()}
          </>
        }

        {referenceField && this.renderReferenceInfo(referenceField)}

        {this.hasBaseElementLinks() &&
          <div className="base-element-links">
            {this.props.baseElements.find(baseElement => baseElement.uniqueId === templateInstance.uniqueId)
              .usedBy.map((link) => {
                const reference = { id: 'baseElementUse', value: { id: link } };
                return this.renderReferenceInfo(reference);
              })
            }
          </div>
        }

        {this.renderAppliedModifiers()}

        <div className="element-field">
          <div className="element-field-label">Return Type:</div>

          <div className="element-field-details return-type">
            <div>
              {(validateReturnType === false || _.startCase(returnType) === 'Boolean') &&
                <CheckIcon fontSize="small" />
              }

              {_.startCase(returnType)}
            </div>
          </div>
        </div>
      </div>
    );
  }

  renderFooter() {
    const { templateInstance } = this.props;

    return (
      <div className="card-element__footer">
        {this.renderModifierSelect()}

        {/* Base element uses will have _vsac included in the id, but should not support additional VS and codes */}
        {templateInstance.id && templateInstance.id.includes('_vsac') && templateInstance.type !== 'baseElement' &&
          <div className="vsac-controls">
            {this.renderVSACOptions()}
          </div>
        }
      </div>
    );
  }

  renderHeading = (elementNameField) => {
    const { templateInstance, instanceNames, baseElements, parameters, allInstancesInAllTrees } = this.props;
    const { showComment } = this.state;
    const commentField = getFieldWithId(templateInstance.fields, 'comment');

    if (elementNameField) {
      let elementType = (templateInstance.type === 'parameter') ? 'Parameter' : templateInstance.name;
      const referenceField = getFieldWithType(templateInstance.fields, 'reference');

      if (referenceField && (referenceField.id === 'baseElementReference')) {
        // Element type to display in header will be the reference type for Base Elements.
        const originalBaseElement = getOriginalBaseElement(templateInstance, baseElements);
        elementType = (originalBaseElement.type === 'parameter') ? 'Parameter' : originalBaseElement.name;
      }

      const doesHaveDuplicateName =
        hasDuplicateName(templateInstance, instanceNames, baseElements, parameters, allInstancesInAllTrees);
      const doesHaveBaseElementUseWarning = doesBaseElementUseNeedWarning(templateInstance, baseElements);
      const doesHaveBaseElementInstanceWarning =
        doesBaseElementInstanceNeedWarning(templateInstance, allInstancesInAllTrees);
      const doesHaveParameterUseWarning = doesParameterUseNeedWarning(templateInstance, parameters);

      return (
        <>
          <StringField
            key={elementNameField.id}
            {...elementNameField}
            updateInstance={this.updateInstance}
            name={elementType}
            uniqueId={templateInstance.uniqueId}
          />

          {commentField && showComment &&
            <TextAreaField
              key={commentField.id}
              {...commentField}
              updateInstance={this.updateInstance}
            />
          }

          <div className="card-element__warnings">
            {
              doesHaveDuplicateName &&
              !doesHaveBaseElementUseWarning &&
              !doesHaveBaseElementInstanceWarning &&
              !doesHaveParameterUseWarning &&
              <div className="warning">Warning: Name already in use. Choose another name.</div>
            }

            {doesHaveBaseElementUseWarning &&
              <div className="warning">Warning: This use of the Base Element has changed. Choose another name.</div>
            }

            {doesHaveBaseElementInstanceWarning &&
              <div className="warning">
                Warning: One or more uses of this Base Element have changed. Choose another name.
              </div>
            }

            {doesHaveParameterUseWarning &&
              <div className="warning">Warning: This use of the Parameter has changed. Choose another name.</div>
            }
          </div>
        </>
      );
    }

    // Handles the case for old parameters, which did not have an 'element_name' field.
    return <span className="label">{templateInstance.name}</span>;
  }

  renderHeader = () => {
    const { templateInstance, renderIndentButtons } = this.props;
    const { showElement } = this.state;
    const elementNameField = getFieldWithId(templateInstance.fields, 'element_name');
    const headerClass = classnames('card-element__header', { collapsed: !showElement });
    const headerTopClass = classnames('card-element__header-top', { collapsed: !showElement });
    const baseElementUsed = this.isBaseElementUsed();
    const baseElementInUsedList = this.props.disableAddElement;
    const commentField = getFieldWithId(templateInstance.fields, 'comment');
    const hasComment = commentField && commentField.value && commentField.value !== '';

    return (
      <div className={headerClass}>
        <div className={headerTopClass}>
          <div className="card-element__heading">
            {showElement ?
              this.renderHeading(elementNameField)
            :
              <div className="heading-name">
                {elementNameField.value}: {this.hasWarnings() &&
                  <div className="warning"><FontAwesomeIcon icon={faExclamationCircle} /> Has warnings</div>
                }
              </div>
            }
          </div>

          <div className="card-element__buttons">
            {showElement && !this.props.disableIndent && renderIndentButtons(templateInstance)}

            {showElement &&
              <IconButton
                aria-label="show comment"
                className={clsx(hasComment && 'has-comment')}
                color="primary"
                onClick={this.toggleComment}
              >
                {hasComment ? <SmsIcon fontSize="small" /> : <ChatBubbleIcon fontSize="small" />}
              </IconButton>
            }

            <IconButton
              aria-label={`hide ${templateInstance.name}`}
              color="primary"
              onClick={this.showHideElementBody}
            >
              {showElement ? <ExpandLessIcon fontSize="small" /> : <ExpandMoreIcon fontSize="small" />}
            </IconButton>

            <span id={`deletebutton-${templateInstance.uniqueId}`}>
              <IconButton
                aria-label={`remove ${templateInstance.name}`}
                color="primary"
                disabled={baseElementUsed || baseElementInUsedList}
                onClick={this.openConfirmDeleteModal}
              >
                <CloseIcon fontSize="small" />
              </IconButton>
            </span>

            {baseElementUsed &&
              <UncontrolledTooltip
                target={`deletebutton-${templateInstance.uniqueId}`} placement="left">
                  To delete this Base Element, remove all references to it.
              </UncontrolledTooltip>
            }

            {baseElementInUsedList &&
              <UncontrolledTooltip
                target={`deletebutton-${templateInstance.uniqueId}`} placement="left">
                To delete this element, remove all references to the Base Element List.
              </UncontrolledTooltip>
            }
          </div>
        </div>

        {!showElement &&
          <div className="card-element__header-expression">
            <ExpressionPhrase
              class="expression expression-collapsed"
              instance={templateInstance}
              baseElements={this.props.baseElements}
            />
          </div>
        }
      </div>
    );
  }

  render() {
    const { templateInstance } = this.props;
    const { showConfirmDeleteModal, showElement } = this.state;
    const baseElementClass = templateInstance.type === 'baseElement' ? 'base-element' : '';
    const elementName = getFieldWithId(templateInstance.fields, 'element_name').value;

    return (
      <div className={`card-element element__expanded ${baseElementClass}`}>
        {this.renderHeader()}
        {showElement && this.renderBody()}
        {showElement && this.renderFooter()}

        {showConfirmDeleteModal &&
          <DeleteConfirmationModal
            deleteType="Element"
            handleCloseModal={this.closeConfirmDeleteModal}
            handleDelete={this.handleDeleteInstance}
          >
            <div>Element: {elementName ? elementName :'unnamed'}</div>
          </DeleteConfirmationModal>
        }
      </div>
    );
  }
}

TemplateInstance.propTypes = {
  allInstancesInAllTrees: PropTypes.array.isRequired,
  baseElements: PropTypes.array.isRequired,
  conversionFunctions: PropTypes.array,
  deleteInstance: PropTypes.func.isRequired,
  disableAddElement: PropTypes.bool,
  disableIndent: PropTypes.bool,
  editInstance: PropTypes.func.isRequired,
  getPath: PropTypes.func.isRequired,
  instanceNames: PropTypes.array.isRequired,
  isLoadingModifiers: PropTypes.bool,
  modifierMap: PropTypes.object.isRequired,
  modifiersByInputType: PropTypes.object.isRequired,
  otherInstances: PropTypes.array.isRequired,
  parameters: PropTypes.array,
  renderIndentButtons: PropTypes.func.isRequired,
  scrollToElement: PropTypes.func.isRequired,
  subpopulationIndex: PropTypes.number,
  templateInstance: PropTypes.object.isRequired,
  treeName: PropTypes.string.isRequired,
  updateInstanceModifiers: PropTypes.func.isRequired,
  validateReturnType: PropTypes.bool,
  vsacApiKey: PropTypes.string
};
