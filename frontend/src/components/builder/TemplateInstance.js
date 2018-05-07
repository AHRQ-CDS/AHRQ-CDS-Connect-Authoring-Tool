import React, { Component } from 'react';
import PropTypes from 'prop-types';
import FontAwesome from 'react-fontawesome';
import _ from 'lodash';

import VSACAuthenticationModal from './VSACAuthenticationModal';
import ElementModal from './ElementModal';
import CodeSelectModal from './CodeSelectModal';

// Try to keep these ordered same as in folder (i.e. alphabetically)
import NumberParameter from './parameters/types/NumberParameter';
import StaticParameter from './parameters/types/StaticParameter';
import StringParameter from './parameters/types/StringParameter';
import ValueSetParameter from './parameters/types/ValueSetParameter';

import ValueSetTemplate from './templates/ValueSetTemplate';

import Modifiers from '../../data/modifiers';
import BooleanComparison from './modifiers/BooleanComparison';
import CheckExistence from './modifiers/CheckExistence';
import LabelModifier from './modifiers/LabelModifier';
import LookBack from './modifiers/LookBack';
import SelectModifier from './modifiers/SelectModifier';
import ValueComparison from './modifiers/ValueComparison';
import ValueComparisonObservation from './modifiers/ValueComparisonObservation';
import WithUnit from './modifiers/WithUnit';
import Qualifier from './modifiers/Qualifier';

import Validators from '../../utils/validators';

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
      relevantModifiers: (this.modifersByInputType[this.props.templateInstance.returnType] || []),
      showModifiers: false
    };
  }

  componentWillMount() {
    this.props.templateInstance.parameters.forEach((param) => {
      this.setState({ [param.id]: param.value });
    });

    const otherInstances = this.getOtherInstances(this.props);
    this.setState({ otherInstances });

    this.setState({ returnType: this.props.templateInstance.returnType });
  }

  componentDidMount() {
    this.setAppliedModifiers(this.props.templateInstance.modifiers || []);
  }

  componentWillReceiveProps(nextProps) {
    const otherInstances = this.getOtherInstances(nextProps);
    let returnType;
    if (!(_.isEmpty(nextProps.templateInstance.modifiers))) {
      returnType = _.last(nextProps.templateInstance.modifiers).returnType;
    } else {
      returnType = this.props.templateInstance.returnType;
    }
    this.setState({
      otherInstances,
      returnType
    });
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

  updateInstance = (newState) => {
    this.setState(newState);
    this.props.editInstance(this.props.treeName, newState, this.getPath(), false);
  }

  renderAppliedModifier = (modifier, index) => {
    // Reset values on modifiers that were not previously set or saved in the database
    if (!modifier.values && this.modifierMap[modifier.id].values) {
      modifier.values = this.modifierMap[modifier.id].values;
    }

    let validationWarning = null;
    if (modifier.validator) {
      const validator = Validators[modifier.validator.type];
      const values = modifier.validator.fields.map(v => modifier.values[v]);
      const args = modifier.validator.args ? modifier.validator.args.map(v => modifier.values[v]) : [];
      if (!validator.check(values, args)) {
        validationWarning = validator.warning(modifier.validator.fields, modifier.validator.args);
      }
    }

    const modifierForm = ((mod) => {
      switch (mod.type || mod.id) {
        case 'ValueComparison':
          return (
            <ValueComparison
              key={index}
              index={index}
              min={mod.values.min}
              minInclusive={mod.values.minInclusive}
              max={mod.values.max}
              maxInclusive={mod.values.maxInclusive}
              updateAppliedModifier={this.updateAppliedModifier}/>
          );
        case 'ValueComparisonObservation':
          return (
            <ValueComparisonObservation
              key={index}
              index={index}
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
              timeLastAuthenticated={this.props.timeLastAuthenticated}
              loginVSACUser={this.props.loginVSACUser}
              setVSACAuthStatus={this.props.setVSACAuthStatus}
              vsacStatus={this.props.vsacStatus}
              vsacStatusText={this.props.vsacStatusText}
              vsacFHIRCredentials={this.props.vsacFHIRCredentials}/>
          );
        default:
          return (<LabelModifier key={index} name={mod.name} id={mod.id}/>);
      }
    })(modifier);

    return (
      <div key={index} className={`modifier modifier-${modifier.type || modifier.id}`}>
        <div className="modifier__info">
          {modifierForm}

          {index + 1 === this.props.templateInstance.modifiers.length &&
            <span
              role="button"
              className="modifier__deletebutton secondary-button"
              aria-label={'remove last expression'}
              onClick={this.removeLastModifier}
              tabIndex="0"
              onKeyPress={(e) => {
                e.which = e.which || e.keyCode;
                if (e.which === 13) this.removeLastModifier();
              }}>

              <FontAwesome name="close" className="delete-valueset-button" />
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
        <div className="applied-modifiers__info-expressions row">
          {this.props.templateInstance.modifiers && this.props.templateInstance.modifiers.length > 0 &&
            <div className="col-3 bold align-right applied-modifiers__label">Expressions:</div>
          }

          <div className="modifier__list col-9" aria-label="Expression List">
            {(this.props.templateInstance.modifiers || []).map((modifier, index) =>
              this.renderAppliedModifier(modifier, index))}
          </div>
        </div>
      </div>
    </div>
  )

  setAppliedModifiers = (modifiers) => {
    const returnType = _.isEmpty(modifiers) ? this.props.templateInstance.returnType : _.last(modifiers).returnType;
    this.setState({ returnType }, this.filterRelevantModifiers);
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

  removeLastModifier = () => {
    const modifiers = _.initial(this.props.templateInstance.modifiers);
    this.setAppliedModifiers(modifiers);
  }

  updateAppliedModifier = (index, value) => {
    const modifiers = this.props.templateInstance.modifiers;
    _.assign(modifiers[index].values, value);
    this.setAppliedModifiers(modifiers);
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
        && (this.state.relevantModifiers.length > 0 || this.props.templateInstance.modifiers.length === 0)) {
      return (
        <div className="modifier-select">
          <div className="modifier__selection">
            <button
              onClick={() => this.setState({ showModifiers: !this.state.showModifiers })}
              className="modifier__addbutton secondary-button"
              aria-label={'add expression'}>
              Add Expression
            </button>

            {this.state.showModifiers &&
              this.state.relevantModifiers.map(modifier =>
                <button key={modifier.id}
                  value={modifier.id}
                  onClick={this.handleModifierSelected} className="modifier__button secondary-button">
                  {modifier.name}
                </button>)
            }
          </div>
        </div>
      );
    }

    return null;
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
                  vsacDetailsCodes={this.props.vsacDetailsCodes} />
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
              <div key={`selected-code-${i}`} className="row code-info">
                <div className="col-3 bold align-right code-info__label">
                  Code{vsacParameter.codes.length > 1 ? ` ${i + 1}` : ''}:
                </div>

                {/* Code name will come with validation */}
                <div className="col-9 row code-info__info">
                  <div className="col-10">{`${code.codeSystem.name} (${code.code})
                   ${code.display === '' ? '' : ` - ${code.display}`}`}</div>

                  <div className="col-2 code-info__buttons align-right">
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
    if (this.props.timeLastAuthenticated < new Date() - 27000000 || this.props.vsacFHIRCredentials.username == null) {
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
          vsacFHIRCredentials={this.props.vsacFHIRCredentials}
        />

          <CodeSelectModal
            className="element-select__modal"
            updateElement={this.updateInstance}
            template={this.props.templateInstance}
            vsacFHIRCredentials={this.props.vsacFHIRCredentials}
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
            valueset={this.props.resources}
            valueSets={this.props.valueSets}
            loadValueSets={this.props.loadValueSets}
            updateInstance={this.updateInstance} />
        );
      default:
        return undefined;
    }
  }

  showHideElementBody = () => {
    this.setState({ showElement: !this.state.showElement });
  }

  getPath = () => this.props.getPath(this.props.templateInstance.uniqueId)

  validateElement = () => {
    if (this.props.templateInstance.validator) {
      const validator = Validators[this.props.templateInstance.validator.type];
      const fields = this.props.templateInstance.validator.fields;
      const args = this.props.templateInstance.validator.args;
      const values = fields.map(f => this.state[f]);
      const names = fields.map(f => this.props.templateInstance.parameters.find(el => el.id === f).name);
      if (!validator.check(values, args)) {
        return validator.warning(names, args);
      }
    }
    return null;
  }

  renderBody() {
    const validationError = this.validateElement();
    const returnError = (!(this.props.validateReturnType !== false) || this.state.returnType === 'boolean') ? null
      : "Element must have return type 'boolean'.  Add expression(s) to change the return type.";

    return (
      <div className="card-element__body">
        {validationError && <div className="warning">{validationError}</div>}
        {returnError && <div className="warning">{returnError}</div>}
        {this.props.templateInstance.parameters.map((param, index) => {
          // todo: each parameter type should probably have its own component
          if (param.id !== 'element_name') {
            return this.selectTemplate(param);
          }
          return null;
        })}

        {this.props.templateInstance.id && this.props.templateInstance.id.includes('_vsac') &&
          <div className="vsac-info">
            {this.renderVSInfo()}
            {this.renderCodeInfo()}
          </div>
        }

        {this.renderAppliedModifiers()}

        <div className="modifier__return__type">
          <div className="return-type row">
            <div className="col-3 bold align-right return-type__label">Return Type:</div>
            <div className="col-7 return-type__value">
              { (this.props.validateReturnType === false
                || _.startCase(this.state.returnType) === 'Boolean')
                && <FontAwesome name="check" className="check" />}
              {_.startCase(this.state.returnType)}
            </div>
          </div>
        </div>
      </div>
    );
  }

  renderFooter() {
    return (
      <div className="card-element__footer">
        {this.renderModifierSelect()}

        {this.props.templateInstance.id && this.props.templateInstance.id.includes('_vsac') &&
          <div className="vsac-controls">
            {this.renderVSACOptions()}
          </div>
        }
      </div>
    );
  }

  renderHeader = () => {
    const elementNameParameter = this.props.templateInstance.parameters.find(param => param.id === 'element_name');
    const duplicateNameIndex = this.props.instanceNames.findIndex(name =>
      name.id !== this.props.templateInstance.uniqueId && name.name === elementNameParameter.value);

    if (elementNameParameter) {
      if (this.props.templateInstance.type === 'parameter') {
        if (elementNameParameter.value) {
          return (<span className="label">{elementNameParameter.value}</span>);
        }
        return null;
      }

      return (
        <div>
          <StringParameter
            key={elementNameParameter.id}
            {...elementNameParameter}
            updateInstance={this.updateInstance}
            name={this.props.templateInstance.name}/>
          {duplicateNameIndex !== -1 && <div className="warning">Warning: Name already in use. Choose another name.</div>}
        </div>
      );
    }

    // Handles the case for old parameters, which did not have an 'element_name' parameter.
    return (<span className="label">{this.props.templateInstance.name}</span>);
  }

  render() {
    return (
      <div className="card-element element__expanded">
        <div className="card-element__header">
          <span className="card-element__heading">
            {this.renderHeader()}
          </span>

          <div className="card-element__buttons">
            {this.props.renderIndentButtons(this.props.templateInstance)}

            <button
              onClick={this.showHideElementBody}
              className="element__hidebutton secondary-button"
              aria-label={`hide ${this.props.templateInstance.name}`}>
              <FontAwesome name={this.state.showElement ? 'angle-double-down' : 'angle-double-right'}/>
            </button>

            <button
              onClick={() => this.props.deleteInstance(this.props.treeName, this.getPath())}
              className="element__deletebutton secondary-button"
              aria-label={`remove ${this.props.templateInstance.name}`}>
              <FontAwesome name='close'/>
            </button>
          </div>
        </div>

        {this.state.showElement ? this.renderBody() : null}
        {this.state.showElement ? this.renderFooter() : null}
      </div>
    );
  }
}

TemplateInstance.propTypes = {
  resources: PropTypes.object.isRequired,
  valueSets: PropTypes.array,
  loadValueSets: PropTypes.func.isRequired,
  getPath: PropTypes.func.isRequired,
  treeName: PropTypes.string.isRequired,
  templateInstance: PropTypes.object.isRequired,
  otherInstances: PropTypes.array.isRequired,
  editInstance: PropTypes.func.isRequired,
  updateInstanceModifiers: PropTypes.func.isRequired,
  deleteInstance: PropTypes.func.isRequired,
  subpopulationIndex: PropTypes.number,
  renderIndentButtons: PropTypes.func.isRequired,
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
  validateReturnType: PropTypes.bool
};
