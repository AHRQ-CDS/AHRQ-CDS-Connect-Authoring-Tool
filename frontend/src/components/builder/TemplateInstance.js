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

import {
  CodeSelectModal,
  DeleteConfirmationModal,
  ValueSetSelectModal,
  VSACAuthenticationModal
} from 'components/modals';
import { StringField, TextAreaField } from './fields';
import {
  CodeListTemplate,
  FieldsTemplate,
  ModifiersTemplate,
  ReturnTypeTemplate,
  ValueSetListTemplate
} from './templates';
import ExpressionPhrase from './ExpressionPhrase';
import { hasDuplicateName, doesBaseElementUseNeedWarning, doesBaseElementInstanceNeedWarning,
  doesParameterUseNeedWarning, validateElement, hasGroupNestedWarning } from 'utils/warnings';
import { getOriginalBaseElement } from 'utils/baseElements';
import { getReturnType, allModifiersValid, getFieldWithType, getFieldWithId }
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

  handleRemoveLastModifier = (canRemove) => {
    if (!canRemove) return;
    const modifiers = _.initial(this.props.templateInstance.modifiers);
    this.setAppliedModifiers(modifiers);
  }

  handleUpdateModifier = (index, values) => {
    const modifiers = this.props.templateInstance.modifiers;
    _.assign(modifiers[index].values, values);
    this.setAppliedModifiers(modifiers);
  }

  handleSelectCode = codeData => {
    const selectedTemplate = _.cloneDeep(this.props.templateInstance);
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

  handleSelectValueSet = valueSet => {
    const selectedTemplate = _.cloneDeep(this.props.templateInstance);
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

  handleDeleteCode = codeToDelete => {
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

  handleDeleteValueSet = valueSetToDelete => {
    const templateInstanceClone = _.cloneDeep(this.props.templateInstance);
    const templateInstanceVsacField = getFieldWithType(templateInstanceClone.fields, '_vsac');
    if (templateInstanceVsacField && templateInstanceVsacField.valueSets) {
      const updatedValueSets = templateInstanceVsacField.valueSets;
      const indexOfVSToRemove = updatedValueSets.findIndex(
        vs => vs.name === valueSetToDelete.name && vs.oid === valueSetToDelete.oid
      );
      updatedValueSets.splice(indexOfVSToRemove, 1);
      const arrayToUpdate = [{ [templateInstanceVsacField.id]: updatedValueSets, attributeToEdit: 'valueSets' }];
      this.updateInstance(arrayToUpdate);
    }
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

  renderVSACOptions = () => {
    const { vsacApiKey } = this.props;
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
            handleSelectValueSet={valueSet => this.handleSelectValueSet(valueSet)}
          />
        )}

        {showCodeSelectModal && (
          <CodeSelectModal
            handleCloseModal={this.closeCodeSelectModal}
            handleSelectCode={codeData => this.handleSelectCode(codeData)}
          />
        )}
      </div>
    );
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
    const { disableAddElement, templateInstance, validateReturnType } = this.props;
    const { returnType } = this.state;
    const fieldsToRender = ['number', 'string', 'textarea', 'valueset'];
    const baseElementIsUsed = this.isBaseElementUsed() || disableAddElement;
    const vsacField = getFieldWithType(this.props.templateInstance.fields, '_vsac');
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

        {templateInstance.fields?.length > 2 &&
          <FieldsTemplate
            fields={templateInstance.fields.filter(field =>
              fieldsToRender.includes(field.type) && field.id !== 'comment' && field.id !== 'element_name')}
            handleUpdateField={this.updateInstance}
          />
        }

        {templateInstance.id?.includes('_vsac') && templateInstance.fields.length > 1 &&
          <>
            <ValueSetListTemplate
              handleDeleteValueSet={this.handleDeleteValueSet}
              valueSets={vsacField?.valueSets || []}
            />

            <CodeListTemplate handleDeleteCode={this.handleDeleteCode} codes={vsacField?.codes || []} />
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

        {templateInstance.modifiers?.length > 0 &&
          <ModifiersTemplate
            baseElementIsUsed={baseElementIsUsed}
            elementInstance={templateInstance}
            handleRemoveLastModifier={this.handleRemoveLastModifier}
            handleSelectValueSet={this.handleSelectValueSet}
            handleUpdateModifier={this.handleUpdateModifier}
          />
        }

        <ReturnTypeTemplate
          returnType={_.startCase(returnType)}
          shouldValidateReturnType={validateReturnType !== false}
        />
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
          <div className="card-field">
            <div className="card-label">{elementType}:</div>

            <div className="card-input">
              <StringField
                field={{ ...elementNameField, name: elementType }}
                handleUpdateField={this.updateInstance}
              />
            </div>
          </div>

          {commentField && showComment &&
            <div className="card-field">
              <div className="card-label">Comment:</div>

              <div className="card-input">
                <TextAreaField field={commentField} handleUpdateField={this.updateInstance} />
              </div>
            </div>
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
