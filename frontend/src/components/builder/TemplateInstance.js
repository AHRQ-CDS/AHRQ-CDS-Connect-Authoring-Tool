import React, { Component } from 'react';
import PropTypes from 'prop-types';
import FontAwesome from 'react-fontawesome';
import { UncontrolledTooltip } from 'reactstrap';
import classNames from 'classnames';
import _ from 'lodash';

import VSACAuthenticationModal from './VSACAuthenticationModal';
import ElementModal from './ElementModal';
import CodeSelectModal from './CodeSelectModal';

// Try to keep these ordered same as in folder (i.e. alphabetically)
import NumberParameter from './parameters/types/NumberParameter';
import StaticParameter from './parameters/types/StaticParameter';
import StringParameter from './parameters/types/StringParameter';
import TextAreaParameter from './parameters/types/TextAreaParameter';
import ValueSetParameter from './parameters/types/ValueSetParameter';

import ValueSetTemplate from './templates/ValueSetTemplate';

import Modifiers from '../../data/modifiers';
import BooleanComparison from './modifiers/BooleanComparison';
import CheckExistence from './modifiers/CheckExistence';
import ExpressionPhrase from './modifiers/ExpressionPhrase';
import LabelModifier from './modifiers/LabelModifier';
import LookBack from './modifiers/LookBack';
import SelectModifier from './modifiers/SelectModifier';
import StringModifier from './modifiers/StringModifier';
import NumberModifier from './modifiers/NumberModifier';
import QuantityModifier from './modifiers/QuantityModifier';
import DateTimeModifier from './modifiers/DateTimeModifier';
import DateTimePrecisionModifier from './modifiers/DateTimePrecisionModifier';
import TimePrecisionModifier from './modifiers/TimePrecisionModifier';
import ValueComparisonNumber from './modifiers/ValueComparisonNumber';
import ValueComparisonObservation from './modifiers/ValueComparisonObservation';
import WithUnit from './modifiers/WithUnit';
import Qualifier from './modifiers/Qualifier';

import { hasDuplicateName, doesBaseElementUseNeedWarning, doesBaseElementInstanceNeedWarning,
  doesParameterUseNeedWarning, validateElement, hasGroupNestedWarning } from '../../utils/warnings';
import { getOriginalBaseElement } from '../../utils/baseElements';
import { getReturnType, validateModifier, allModifiersValid } from '../../utils/instances';

function getInstanceName(instance) {
  return (instance.parameters.find(p => p.id === 'element_name') || {}).value;
}

export default class TemplateInstance extends Component {
  constructor(props) {
    super(props);

    this.modifierMap = _.keyBy(Modifiers, 'id');
    this.modifersByInputType = {};

    Modifiers.forEach((modifier) => {
      modifier.inputTypes.forEach((inputType) => {
        this.modifersByInputType[inputType] = (this.modifersByInputType[inputType] || []).concat(modifier);
      });
    });

    this.state = {
      showElement: true,
      relevantModifiers: (this.modifersByInputType[props.templateInstance.returnType] || []),
      showModifiers: false,
      otherInstances: this.getOtherInstances(props),
      returnType: props.templateInstance.returnType
    };
  }

  componentWillMount() {
    this.props.templateInstance.parameters.forEach((param) => {
      this.setState({ [param.id]: param.value });
    });
  }

  componentDidMount() {
    this.setAppliedModifiers(this.props.templateInstance.modifiers || []);
  }

  componentWillReceiveProps(nextProps) {
    const otherInstances = this.getOtherInstances(nextProps);
    this.setState({ otherInstances });

    if (this.props.templateInstance.modifiers !== nextProps.templateInstance.modifiers) {
      let returnType = nextProps.templateInstance.returnType;
      if (!(_.isEmpty(nextProps.templateInstance.modifiers))) {
        returnType = getReturnType(nextProps.templateInstance.returnType, nextProps.templateInstance.modifiers);
      }
      this.setState({ returnType });
    }
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
    const baseElementIsInUse = this.isBaseElementUsed() || this.props.disableElement;
    if (!baseElementIsInUse) {
      this.props.deleteInstance(this.props.treeName, this.getPath());
    }
  }

  renderAppliedModifier = (modifier, index) => {
    // Reset values on modifiers that were not previously set or saved in the database
    if (!modifier.values && this.modifierMap[modifier.id].values) {
      modifier.values = this.modifierMap[modifier.id].values;
    }

    const validationWarning = validateModifier(modifier);

    const modifierForm = ((mod) => {
      switch (mod.type || mod.id) {
        case 'ValueComparisonNumber':
          return (
            <ValueComparisonNumber
              key={index}
              index={index}
              uniqueId={`${this.props.templateInstance.uniqueId}-comparison-${index}`}
              minOperator={mod.values.minOperator}
              minValue={mod.values.minValue}
              maxOperator={mod.values.maxOperator}
              maxValue={mod.values.maxValue}
              updateAppliedModifier={this.updateAppliedModifier}/>
          );
        case 'ValueComparisonObservation':
          return (
            <ValueComparisonObservation
              key={index}
              index={index}
              uniqueId={`${this.props.templateInstance.uniqueId}-comparison-${index}`}
              minOperator={mod.values.minOperator}
              minValue={mod.values.minValue}
              maxOperator={mod.values.maxOperator}
              maxValue={mod.values.maxValue}
              unit={mod.values.unit}
              updateAppliedModifier={this.updateAppliedModifier}/>
          );
        case 'LookBack':
          return (
            <LookBack
              key={index}
              index={index}
              value={mod.values.value}
              unit={mod.values.unit}
              updateAppliedModifier={this.updateAppliedModifier}/>
          );
        case 'WithUnit':
          return (
            <WithUnit
              key={index}
              index={index}
              uniqueId={`${this.props.templateInstance.uniqueId}-unit-${index}`}
              unit={mod.values.unit}
              updateAppliedModifier={this.updateAppliedModifier}/>
          );
        case 'BooleanComparison':
          return (
            <BooleanComparison
              key={index}
              index={index}
              value={mod.values.value}
              updateAppliedModifier={this.updateAppliedModifier}/>
          );
        case 'CheckExistence':
          return (
            <CheckExistence
              key={index}
              index={index}
              value={mod.values.value}
              updateAppliedModifier={this.updateAppliedModifier}/>
          );
        case 'ConvertObservation':
          return (
            <SelectModifier
              key={index}
              index={index}
              value={mod.values.value}
              name={mod.name}
              options={this.props.conversionFunctions}
              updateAppliedModifier={this.updateAppliedModifier}/>
          );
        case 'Qualifier':
          return (
            <Qualifier
              key={index}
              index={index}
              qualifier={mod.values.qualifier}
              updateAppliedModifier={this.updateAppliedModifier}
              updateInstance={this.updateInstance}
              searchVSACByKeyword={this.props.searchVSACByKeyword}
              isSearchingVSAC={this.props.isSearchingVSAC}
              vsacSearchResults={this.props.vsacSearchResults}
              vsacSearchCount={this.props.vsacSearchCount}
              template={this.props.templateInstance}
              getVSDetails={this.props.getVSDetails}
              isRetrievingDetails={this.props.isRetrievingDetails}
              vsacDetailsCodes={this.props.vsacDetailsCodes}
              vsacDetailsCodesError={this.props.vsacDetailsCodesError}
              loginVSACUser={this.props.loginVSACUser}
              setVSACAuthStatus={this.props.setVSACAuthStatus}
              vsacStatus={this.props.vsacStatus}
              vsacStatusText={this.props.vsacStatusText}
              vsacFHIRCredentials={this.props.vsacFHIRCredentials}
              isValidatingCode={this.props.isValidatingCode}
              isValidCode={this.props.isValidCode}
              codeData={this.props.codeData}
              validateCode={this.props.validateCode}
              resetCodeValidation={this.props.resetCodeValidation} />
          );
        case 'BeforeDateTimePrecise':
        case 'AfterDateTimePrecise':
          return (
            <DateTimePrecisionModifier
              key={index}
              index={index}
              name={mod.name}
              date={mod.values.date}
              time={mod.values.time}
              precision={mod.values.precision}
              updateAppliedModifier={this.updateAppliedModifier}/>
          );
        case 'BeforeTimePrecise':
        case 'AfterTimePrecise':
          return (
            <TimePrecisionModifier
              key={index}
              index={index}
              name={mod.name}
              time={mod.values.time}
              precision={mod.values.precision}
              updateAppliedModifier={this.updateAppliedModifier}/>
          );
        case 'ContainsQuantity':
        case 'BeforeQuantity':
        case 'AfterQuantity':
          return (
            <QuantityModifier
              key={index}
              index={index}
              name={mod.name}
              uniqueId={`${this.props.templateInstance.uniqueId}-quantity-${index}`}
              value={mod.values.value}
              unit={mod.values.unit}
              updateAppliedModifier={this.updateAppliedModifier}/>
          );
        case 'ContainsInteger':
        case 'BeforeInteger':
        case 'AfterInteger':
        case 'ContainsDecimal':
        case 'BeforeDecimal':
        case 'AfterDecimal':
          return (
            <NumberModifier
              key={index}
              index={index}
              name={mod.name}
              value={mod.values.value}
              updateAppliedModifier={this.updateAppliedModifier}/>
          );
        case 'ContainsDateTime':
        case 'BeforeDateTime':
        case 'AfterDateTime':
          return (
            <DateTimeModifier
              key={index}
              index={index}
              name={mod.name}
              date={mod.values.date}
              time={mod.values.time}
              updateAppliedModifier={this.updateAppliedModifier}/>
          );
        case 'EqualsString':
        case 'EndsWithString':
        case 'StartsWithString':
          return (
            <StringModifier
              key={index}
              index={index}
              name={mod.name}
              value={mod.values.value}
              updateAppliedModifier={this.updateAppliedModifier}/>
          );
        default:
          return (<LabelModifier key={index} name={mod.name} id={mod.id}/>);
      }
    })(modifier);

    const canModifierBeRemoved = this.canModifierBeRemoved();

    return (
      <div key={index} className={`modifier modifier-${modifier.type || modifier.id}`}>
        <div className="modifier__info">
          {modifierForm}

          {index + 1 === this.props.templateInstance.modifiers.length &&
            <span
              role="button"
              id={`modifier-delete-${this.props.templateInstance.uniqueId}`}
              className={`modifier__deletebutton secondary-button ${canModifierBeRemoved ? '' : 'disabled'}`}
              aria-label={'remove last expression'}
              onClick={() => this.removeLastModifier(canModifierBeRemoved)}
              tabIndex="0"
              onKeyPress={(e) => {
                e.which = e.which || e.keyCode;
                if (e.which === 13) this.removeLastModifier(canModifierBeRemoved);
              }}>

              <FontAwesome name="close" className="delete-valueset-button" />
              { !canModifierBeRemoved &&
                <UncontrolledTooltip
                  target={`modifier-delete-${this.props.templateInstance.uniqueId}`} placement="left">
                  Cannot remove modifier because return type cannot change while in use.
                </UncontrolledTooltip> }
            </span>
          }
        </div>

        {validationWarning && <div className="warning">{validationWarning}</div>}
      </div>
    );
  }

  renderAppliedModifiers = () => (
    <div className="applied-modifiers">
      <div className="applied-modifiers__info">
        <div className="applied-modifiers__info-expressions">
          {this.props.templateInstance.modifiers && this.props.templateInstance.modifiers.length > 0 &&
            <div className="bold align-right applied-modifiers__label">Expressions:</div>
          }

          <div className="modifier__list" aria-label="Expression List">
            {(this.props.templateInstance.modifiers || []).map((modifier, index) =>
              this.renderAppliedModifier(modifier, index))}
          </div>
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
    const relevantModifiers = this.modifersByInputType[this.state.returnType] || [];
    if (!this.props.templateInstance.checkInclusionInVS) { // Rather than suppressing `CheckInclusionInVS` in every element, assume it's suppressed unless explicity stated otherwise
      _.remove(relevantModifiers, modifier => modifier.id === 'CheckInclusionInVS');
    }
    if (_.has(this.props.templateInstance, 'suppressedModifiers')) {
      this.props.templateInstance.suppressedModifiers.forEach(suppressedModifier =>
        _.remove(relevantModifiers, relevantModifier => relevantModifier.id === suppressedModifier));
    }
    this.setState({ relevantModifiers });
  }

  handleModifierSelected = (event) => {
    const selectedModifier = _.cloneDeep(this.modifierMap[event.target.value]);
    const modifiers = (this.props.templateInstance.modifiers || []).concat(selectedModifier);
    this.setState({ showModifiers: false });
    this.setAppliedModifiers(modifiers);
  }

  removeLastModifier = (canRemove) => {
    if (!canRemove) return;
    const modifiers = _.initial(this.props.templateInstance.modifiers);
    this.setAppliedModifiers(modifiers);
  }

  updateAppliedModifier = (index, value) => {
    const modifiers = this.props.templateInstance.modifiers;
    _.assign(modifiers[index].values, value);
    this.setAppliedModifiers(modifiers);
  }

  canModifierBeRemoved = () => {
    const baseElementIsInUse = this.isBaseElementUsed() || this.props.disableElement;

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
    if (templateInstanceClone.parameters[1] && templateInstanceClone.parameters[1].codes) {
      const updatedCodes = templateInstanceClone.parameters[1].codes;
      const indexOfCodeToRemove = updatedCodes.findIndex(code =>
        (code.code === codeToDelete.code && _.isEqual(code.codeSystem, codeToDelete.codeSystem)));
      updatedCodes.splice(indexOfCodeToRemove, 1);
      const arrayToUpdate = [
        { [templateInstanceClone.parameters[1].id]: updatedCodes, attributeToEdit: 'codes' }
      ];
      this.updateInstance(arrayToUpdate);
    }
  }

  renderModifierSelect = () => {
    if (!this.props.templateInstance.cannotHaveModifiers
      && (this.state.relevantModifiers.length > 0 || (this.props.templateInstance.modifiers || []).length === 0)) {
      const baseElementIsInUse = this.isBaseElementUsed() || this.props.disableElement;

      return (
        <div className="modifier-select">
          <div className="modifier__selection">
            <button
              onClick={() => this.setState({ showModifiers: !this.state.showModifiers })}
              className="modifier__addbutton secondary-button"
              aria-label={'add expression'}
              disabled={!allModifiersValid(this.props.templateInstance.modifiers)}>
              Add Expression
            </button>

            {this.state.showModifiers &&
              this.state.relevantModifiers
                .filter(modifier => !baseElementIsInUse || modifier.returnType === this.state.returnType)
                .map(modifier =>
                  <button key={modifier.id}
                    value={modifier.id}
                    onClick={this.handleModifierSelected} className="modifier__button secondary-button">
                    {modifier.name}
                  </button>)
            }
          </div>

          {this.state.showModifiers && baseElementIsInUse &&
            <div className="notification">
              <FontAwesome name="exclamation-circle" />
              Limited expressions displayed because return type cannot change while in use.
            </div>
          }
        </div>
      );
    }

    return null;
  }

  renderBaseElementOrParameterInfo = (referenceParameter) => {
    let referenceName;
    if (referenceParameter) {
      const elementToReference = this.props.instanceNames.find(name => name.id === referenceParameter.value.id);
      if (elementToReference) {
        referenceName = elementToReference.name;
      }
    }

    const scrollElementId = referenceParameter.value.id;
    const scrollReferenceType = referenceParameter.id;

    let baseUseTab;
    if (referenceParameter.id === 'baseElementUse') {
      const { allInstancesInAllTrees } = this.props;
      baseUseTab = allInstancesInAllTrees.filter(instance => instance.uniqueId === referenceParameter.value.id)[0].tab;
    }

    let tabIndex;
    if (baseUseTab === 'expTreeInclude') tabIndex = 0;
    if (baseUseTab === 'expTreeExclude') tabIndex = 1;
    if (baseUseTab === 'subpopulations') tabIndex = 2;

    let label = 'Element:';
    if (referenceParameter.id === 'baseElementReference') label = 'Base Element:';
    if (referenceParameter.id === 'parameterReference') label = 'Parameter:';
    if (referenceParameter.id === 'baseElementUse') label = 'Element Use:';

    let tabLabel = '';
    if (baseUseTab === 'expTreeInclude') tabLabel = 'Inclusions';
    if (baseUseTab === 'expTreeExclude') tabLabel = 'Exclusions';
    if (baseUseTab === 'subpopulations') tabLabel = 'Subpopulations';

    return (
      <div className="modifier__return__type" id="base-element-list" key={referenceParameter.value.id}>
        <div className="code-info">
          <div className="bold align-right code-info__label">{label}</div>
          <div className="code-info__info">
            <div className="code-info__text">
              <span>{referenceName}</span>
              {referenceParameter.id === 'baseElementUse' && <span> &#8594; {tabLabel}</span>}
              </div>
            <div className="code-info__buttons align-right">
              <span
                role="button"
                id={`definition-${this.props.templateInstance.uniqueId}`}
                className={'element__linkbutton'}
                aria-label={'see element definition'}
                onClick={() => this.props.scrollToElement(scrollElementId, scrollReferenceType, tabIndex) }
                tabIndex="0"
                onKeyPress={(e) => {
                  e.which = e.which || e.keyCode;
                  if (e.which === 13) this.props.scrollToElement(scrollElementId, scrollReferenceType, tabIndex);
                }}>

                <FontAwesome name="link" className="delete-valueset-button" />
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  renderVSInfo = () => {
    if (this.props.templateInstance.parameters.length > 1) {
      // All generic VSAC elements save the VS information on this parameter on the valueSets property.
      const vsacParameter = this.props.templateInstance.parameters[1];
      if (vsacParameter.valueSets) {
        return (
          <div className="modifier__return__type" id="valueset-list">
            {vsacParameter.valueSets.map((vs, i) => (
              <div key={`selected-valueset-${i}`}>
                <ValueSetTemplate
                  index={i}
                  vsacParameter={vsacParameter}
                  valueSet={vs}
                  updateInstance={this.updateInstance}
                  searchVSACByKeyword={this.props.searchVSACByKeyword}
                  isSearchingVSAC={this.props.isSearchingVSAC}
                  vsacSearchResults={this.props.vsacSearchResults}
                  vsacSearchCount={this.props.vsacSearchCount}
                  templateInstance={this.props.templateInstance}
                  getVSDetails={this.props.getVSDetails}
                  isRetrievingDetails={this.props.isRetrievingDetails}
                  vsacDetailsCodes={this.props.vsacDetailsCodes}
                  vsacDetailsCodesError={this.props.vsacDetailsCodesError}
                  vsacFHIRCredentials={this.props.vsacFHIRCredentials} />
              </div>
            ))}
          </div>
        );
      }
    }
    return null;
  }

  renderCodeInfo = () => {
    if (this.props.templateInstance.parameters.length > 1) {
      // All generic VSAC elements save the VS information on this parameter on the codes property.
      const vsacParameter = this.props.templateInstance.parameters[1];
      if (vsacParameter.codes) {
        return (
          <div className="modifier__return__type" id="code-list">
            {vsacParameter.codes.map((code, i) => (
              <div key={`selected-code-${i}`} className="code-info">
                <div className="bold align-right code-info__label">
                  Code{vsacParameter.codes.length > 1 ? ` ${i + 1}` : ''}:
                </div>

                {/* Code name will come with validation */}
                <div className="code-info__info">
                  <div className="code-info__text">{`${code.codeSystem.name} (${code.code})
                   ${code.display === '' ? '' : ` - ${code.display}`}`}</div>

                  <div className="code-info__buttons align-right">
                    <span
                      role="button"
                      id="delete-code"
                      tabIndex="0"
                      onClick={() => this.deleteCode(code)}
                      onKeyPress={(e) => {
                        e.which = e.which || e.keyCode;
                        if (e.which === 13) this.deleteCode(code);
                      }}>

                      <FontAwesome name="close" className="delete-code-button" />
                    </span>
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
    // If last time authenticated was less than 7.5 hours ago, force user to log in again.
    if (this.props.vsacFHIRCredentials.username == null) {
      return (
        <div id="vsac-controls">
          <VSACAuthenticationModal
            loginVSACUser={this.props.loginVSACUser}
            setVSACAuthStatus={this.props.setVSACAuthStatus}
            vsacStatus={this.props.vsacStatus}
            vsacStatusText={this.props.vsacStatusText}
          />
        </div>
      );
    }

    return (
      <div id="vsac-controls">
        <button className="disabled-button" disabled={true}>
          <FontAwesome name="check" /> VSAC Authenticated
        </button>

        <ElementModal
          className="element-select__modal"
          updateElement={this.updateInstance}
          searchVSACByKeyword={this.props.searchVSACByKeyword}
          isSearchingVSAC={this.props.isSearchingVSAC}
          vsacSearchResults={this.props.vsacSearchResults}
          vsacSearchCount={this.props.vsacSearchCount}
          template={this.props.templateInstance}
          getVSDetails={this.props.getVSDetails}
          isRetrievingDetails={this.props.isRetrievingDetails}
          vsacDetailsCodes={this.props.vsacDetailsCodes}
          vsacDetailsCodesError={this.props.vsacDetailsCodesError}
          vsacFHIRCredentials={this.props.vsacFHIRCredentials}
        />

        <CodeSelectModal
          className="element-select__modal"
          updateElement={this.updateInstance}
          template={this.props.templateInstance}
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

  selectTemplate = (param) => {
    if (param.static) {
      return (
        <StaticParameter
          key={param.id}
          param={param}
          updateInstance={this.updateInstance} />
      );
    }

    switch (param.type) {
      case 'number':
        return (
          <NumberParameter
            key={param.id}
            param={param}
            value={this.state[param.id]}
            typeOfNumber={param.typeOfNumber}
            updateInstance={this.updateInstance} />
        );
      case 'string':
        return (
          <StringParameter
            key={param.id}
            {...param}
            updateInstance={this.updateInstance} />
        );
      case 'textarea':
        return (
          <TextAreaParameter
            key={param.id}
            {...param}
            updateInstance={this.updateInstance} />
        );
      case 'observation_vsac':
      case 'condition_vsac':
      case 'medicationStatement_vsac':
      case 'medicationOrder_vsac':
      case 'procedure_vsac':
      case 'encounter_vsac':
      case 'allergyIntolerance_vsac':
        return (
          <StringParameter
            key={param.id}
            {...param}
            updateInstance={this.updateInstance} />
        );
      case 'valueset':
        return (
          <ValueSetParameter
            key={param.id}
            param={param}
            valueSets={this.props.valueSets}
            loadValueSets={this.props.loadValueSets}
            updateInstance={this.updateInstance}/>
        );
      default:
        return undefined;
    }
  }

  showHideElementBody = () => {
    this.setState({ showElement: !this.state.showElement });
  }

  getPath = () => this.props.getPath(this.props.templateInstance.uniqueId)

  hasBaseElementLinks = () => {
    const { templateInstance } = this.props;
    const thisBaseElement = this.props.baseElements.filter(baseElement => baseElement.id === templateInstance.id);
    if (thisBaseElement.length === 0) return false;
    const thisBaseElementUsedBy = thisBaseElement[0].usedBy;
    if (thisBaseElementUsedBy.length === 0) return false;
    return true;
  }

  renderBody() {
    const { templateInstance, validateReturnType } = this.props;
    const { returnType } = this.state;
    const referenceParameter = templateInstance.parameters.find(param => param.type === 'reference');
    const validationError = validateElement(this.props.templateInstance, this.state);
    const returnError = (!(validateReturnType !== false) || returnType === 'boolean') ? null
      : "Element must have return type 'boolean'. Add expression(s) to change the return type.";
    const commentParameter = templateInstance.parameters.find(param => param.id === 'comment');

    return (
      <div className="card-element__body">
        {validationError && <div className="warning">{validationError}</div>}
        {returnError && <div className="warning">{returnError}</div>}

        <ExpressionPhrase
          class="expression"
          instance={templateInstance}
          baseElements={this.props.baseElements}
        />

        {commentParameter &&
          <TextAreaParameter
            key={commentParameter.id}
            {...commentParameter}
            updateInstance={this.updateInstance} />
        }

        {templateInstance.parameters.map((param, index) => {
          // TODO: each parameter type should probably have its own component
          if (param.id !== 'element_name' && param.id !== 'comment') {
            return this.selectTemplate(param);
          }
          return null;
        })}

        {templateInstance.id && templateInstance.id.includes('_vsac') &&
          <div className="vsac-info">
            {this.renderVSInfo()}
            {this.renderCodeInfo()}
          </div>
        }

        {referenceParameter &&
          <div className="vsac-info">
            {this.renderBaseElementOrParameterInfo(referenceParameter)}
          </div>
        }

        {this.hasBaseElementLinks() &&
          <div className="base-element-links">
            {this.props.baseElements.filter(baseElement => baseElement.id === templateInstance.id)[0]
              .usedBy.map((link) => {
                const reference = { id: 'baseElementUse', value: { id: link } };
                return this.renderBaseElementOrParameterInfo(reference);
              })
            }
          </div>
        }

        {this.renderAppliedModifiers()}

        <div className="modifier__return__type">
          <div className="return-type">
            <div className="bold align-right return-type__label">Return Type:</div>
            <div className="return-type__value">
              { (validateReturnType === false || _.startCase(returnType) === 'Boolean') &&
                <FontAwesome name="check" className="check" />}
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

  renderHeading = (elementNameParameter) => {
    const { templateInstance, instanceNames, baseElements, parameters, allInstancesInAllTrees } = this.props;

    if (elementNameParameter) {
      let elementType = (templateInstance.type === 'parameter') ? 'Parameter' : templateInstance.name;


      const referenceParameter = templateInstance.parameters.find(param => param.type === 'reference');

      if (referenceParameter && (referenceParameter.id === 'baseElementReference')) {
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
        <div className="card-element__heading">
          <StringParameter
            key={elementNameParameter.id}
            {...elementNameParameter}
            updateInstance={this.updateInstance}
            name={elementType}
            uniqueId={templateInstance.uniqueId}
          />
          {doesHaveDuplicateName &&
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
      );
    }

    // Handles the case for old parameters, which did not have an 'element_name' parameter.
    return <span className="label">{templateInstance.name}</span>;
  }

  renderHeader = () => {
    const { templateInstance, renderIndentButtons } = this.props;
    const { showElement } = this.state;
    const elementNameParameter = templateInstance.parameters.find(param => param.id === 'element_name');
    const headerClass = classNames('card-element__header', { collapsed: !showElement });
    const headerTopClass = classNames('card-element__header-top', { collapsed: !showElement });

    const baseElementUsed = this.isBaseElementUsed();
    const baseElementInUsedList = this.props.disableElement;
    const disabledClass = (baseElementUsed || baseElementInUsedList) ? 'disabled' : '';

    return (
      <div className={headerClass}>
        <div className={headerTopClass}>
          <div className="card-element__heading">
            {showElement ?
              this.renderHeading(elementNameParameter)
            :
              <div className="heading-name">
                {elementNameParameter.value}: {this.hasWarnings() &&
                  <div className="warning"><FontAwesome name="exclamation-circle" /> Has warnings</div>
                }
              </div>
            }
          </div>
          <div className="card-element__buttons">
            {showElement && !this.props.disableIndent && renderIndentButtons(templateInstance)}

            <button
              onClick={this.showHideElementBody}
              className="element__hidebutton transparent-button"
              aria-label={`hide ${templateInstance.name}`}>
              <FontAwesome name={showElement ? 'angle-double-down' : 'angle-double-right'} />
            </button>

            <button
              id={`deletebutton-${templateInstance.uniqueId}`}
              onClick={this.deleteInstance}
              className={`element__deletebutton transparent-button ${disabledClass}`}
              aria-label={`remove ${templateInstance.name}`}>
              <FontAwesome name="close" />
            </button>
            { baseElementUsed &&
              <UncontrolledTooltip
                target={`deletebutton-${templateInstance.uniqueId}`} placement="left">
                  To delete this Base Element, remove all references to it.
              </UncontrolledTooltip> }
            { baseElementInUsedList &&
              <UncontrolledTooltip
                target={`deletebutton-${templateInstance.uniqueId}`} placement="left">
                To delete this element, remove all references to the Base Element List.
              </UncontrolledTooltip> }
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
    const { showElement } = this.state;
    const { templateInstance } = this.props;
    const baseElementClass = templateInstance.type === 'baseElement' ? 'base-element' : '';

    return (
      <div className={`card-element element__expanded ${baseElementClass}`}>
        {this.renderHeader()}
        {showElement && this.renderBody()}
        {showElement && this.renderFooter()}
      </div>
    );
  }
}

TemplateInstance.propTypes = {
  valueSets: PropTypes.array,
  loadValueSets: PropTypes.func.isRequired,
  getPath: PropTypes.func.isRequired,
  treeName: PropTypes.string.isRequired,
  templateInstance: PropTypes.object.isRequired,
  otherInstances: PropTypes.array.isRequired,
  allInstancesInAllTrees: PropTypes.array.isRequired,
  editInstance: PropTypes.func.isRequired,
  updateInstanceModifiers: PropTypes.func.isRequired,
  deleteInstance: PropTypes.func.isRequired,
  instanceNames: PropTypes.array.isRequired,
  subpopulationIndex: PropTypes.number,
  renderIndentButtons: PropTypes.func.isRequired,
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
  validateReturnType: PropTypes.bool,
  isValidatingCode: PropTypes.bool.isRequired,
  isValidCode: PropTypes.bool,
  codeData: PropTypes.object,
  validateCode: PropTypes.func.isRequired,
  resetCodeValidation: PropTypes.func.isRequired,
  disableElement: PropTypes.bool,
  disableIndent: PropTypes.bool,
  scrollToElement: PropTypes.func.isRequired,
  baseElements: PropTypes.array.isRequired,
  parameters: PropTypes.array.isRequired
};
