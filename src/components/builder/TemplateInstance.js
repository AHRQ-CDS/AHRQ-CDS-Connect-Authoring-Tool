import React, { Component, PropTypes } from 'react';
import axios from 'axios';
import FontAwesome from 'react-fontawesome';
import _ from 'lodash';
import update from 'immutability-helper';
import Config from '../../../config';

// Try to keep these ordered same as in folder (i.e. alphabetically)
import NumberParameter from './parameters/NumberParameter';
import StaticParameter from './parameters/StaticParameter';
import StringParameter from './parameters/StringParameter';
import ValueSetParameter from './parameters/ValueSetParameter';

import Modifiers from '../../data/modifiers.js';
import BooleanComparison from './modifiers/BooleanComparison';
import CheckExistence from './modifiers/CheckExistence';
import LabelModifier from './modifiers/LabelModifier';
import LookBack from './modifiers/LookBack';
import ValueComparison from './modifiers/ValueComparison';
import ValueComparisonObservation from './modifiers/ValueComparisonObservation';
import WithUnit from './modifiers/WithUnit';

const API_BASE = Config.api.baseUrl;

function getInstanceName(instance) {
  return (instance.parameters.find(p => p.id === 'element_name') || {}).value;
}

function renderPreset(preset, stateIndex) {
  let name = 'untitled';
  const params = preset.parameters;
  const index = params.findIndex(item => item.id === 'element_name');
  if (index > -1) {
    name = params[index];
  }
  return (
    <option key={stateIndex} value={stateIndex}>
      {name.value}
    </option>
  );
}

class TemplateInstance extends Component {
  static propTypes = {
    getPath: PropTypes.func.isRequired,
    treeName: PropTypes.string.isRequired,
    templateInstance: PropTypes.object.isRequired,
    otherInstances: PropTypes.array.isRequired,
    editInstance: PropTypes.func.isRequired,
    updateInstanceModifiers: PropTypes.func.isRequired,
    deleteInstance: PropTypes.func.isRequired,
    saveInstance: PropTypes.func.isRequired,
    showPresets: PropTypes.func.isRequired
  }

  constructor(props) {
    super(props);


    this.modifierMap = _.keyBy(Modifiers, 'id');
    this.modifersByInputType = {}
    Modifiers.forEach((modifier) => {
      modifier.inputTypes.forEach((inputType) => {
        this.modifersByInputType[inputType] = (this.modifersByInputType[inputType] || []).concat(modifier)
      });
    });

    this.state = {
      resources: {},
      presets: [],
      showElement: true,
      showPresets: false,
      relevantModifiers: (this.modifersByInputType[this.props.templateInstance.returnType] || []),
      appliedModifiers: [], // these get set in component did mount
      showModifiers: false
    };

    this.updateInstance = this.updateInstance.bind(this);
    this.selectTemplate = this.selectTemplate.bind(this);
    this.notThisInstance = this.notThisInstance.bind(this);

    // TODO: all this modifier stuff should probably be pulled out into another component
    this.renderAppliedModifiers = this.renderAppliedModifiers.bind(this);
    this.renderAppliedModifier = this.renderAppliedModifier.bind(this);
    this.renderModifierSelect = this.renderModifierSelect.bind(this);
    this.removeLastModifier = this.removeLastModifier.bind(this);
    this.updateAppliedModifier = this.updateAppliedModifier.bind(this);
    this.handleModifierSelected = this.handleModifierSelected.bind(this);
    this.filterRelevantModifiers = this.filterRelevantModifiers.bind(this);
  }

  componentWillMount() {
    this.props.templateInstance.parameters.forEach((param) => {
      this.setState({ [param.id]: param.value });
    });

    const otherInstances = this.getOtherInstances(this.props);
    this.setState({ otherInstances });

    this.setState({returnType: this.props.templateInstance.returnType});
    axios.get(`${API_BASE}/config/resources`)
      .then((result) => {
        this.setState({ resources: result.data });
      });
  }

  componentDidMount() {
    this.setAppliedModifiers(this.props.templateInstance.modifiers || []);
  }

  componentWillReceiveProps(nextProps) {
    const otherInstances = this.getOtherInstances(nextProps);
    this.setState({ otherInstances });
  }

  // Props will either be this.props or nextProps coming from componentWillReceiveProps
  getOtherInstances(props) {
    const otherInstances = props.otherInstances.filter(this.notThisInstance)
      .map(instance => ({
        name: getInstanceName(instance),
        id: instance.id,
        returnType: (_.isEmpty(instance.modifiers) ? instance.returnType : _.last(instance.modifiers).returnType) }));
    return otherInstances;
  }

  notThisInstance(instance) {
    // Look up by uniqueId to correctly identify the current instance
    // For example, "and" elements have access to all other "and" elements besides itself
    // They have different uniqueId's but the id's of all "and" elements is "And"
    return this.props.templateInstance.uniqueId !== instance.uniqueId;
  }

  updateInstance(newState) {
    this.setState(newState);
    this.props.editInstance(this.props.treeName, newState, this.getPath(), false);
  }


  renderAppliedModifier(modifier, index) {
    const modifierForm = ((modifier) => {
      switch (modifier.type || modifier.id) {
        case 'ValueComparison':
          return (
            <ValueComparison
              key={index}
              index={index}
              min={modifier.values.min}
              minInclusive={modifier.values.minInclusive}
              max={modifier.values.max}
              maxInclusive={modifier.values.maxInclusive}
              updateAppliedModifier={this.updateAppliedModifier}/>
          );
        case 'ValueComparisonObservation':
          return (
            <ValueComparisonObservation
              key={index}
              index={index}
              minOperator={modifier.values.minOperator}
              minValue={modifier.values.minValue}
              maxOperator={modifier.values.maxOperator}
              maxValue={modifier.values.maxValue}
              updateAppliedModifier={this.updateAppliedModifier}/>
          );
        case 'LookBack':
          return (
            <LookBack
              key={index}
              index={index}
              value={modifier.values.value}
              unit={modifier.values.unit}
              updateAppliedModifier={this.updateAppliedModifier}/>
          );
        case 'WithUnit':
          return (
            <WithUnit
              key={index}
              index={index}
              unit={modifier.values.unit}
              updateAppliedModifier={this.updateAppliedModifier}/>
          );
        case 'BooleanComparison':
          return (
            <BooleanComparison
              key={index}
              index={index}
              value={modifier.values.value}
              updateAppliedModifier={this.updateAppliedModifier}/>
          );
          case 'CheckExistence':
            return (
              <CheckExistence
                key={index}
                index={index}
                value={modifier.values.value}
                updateAppliedModifier={this.updateAppliedModifier}/>
            );
        default:
          return (<LabelModifier key={index} name={modifier.name} id={modifier.id}/>);
      }
    })(modifier);

    return (
      <div key={index} className="modifier">
        {modifierForm}
        { (index + 1 === this.state.appliedModifiers.length)
          ? <button
            onClick={this.removeLastModifier}
            className="modifier__deletebutton"
            aria-label={'remove last expression'}>
              <FontAwesome fixedWidth name='close'/>
            </button>
          : null
        }
      </div>
    );

  }

  renderAppliedModifiers() {
    return (
      <div className="modifier__list">
        {this.state.appliedModifiers.map((modifier, index) =>
          this.renderAppliedModifier(modifier, index)
        )}
      </div>
    );
  }

  filterRelevantModifiers(returnType) {
    if (_.isUndefined(returnType)) {
      returnType = (_.last(this.state.appliedModifiers) || this.props.templateInstance).returnType;
    }
    if (!this.props.templateInstance.checkInclusionInVS) {
      _.remove(this.modifersByInputType[returnType], modifier => modifier.id === "CheckInclusionInVS");
    }
    let relevantModifiers = this.modifersByInputType[returnType] || [];
    if (_.has(this.props.templateInstance, 'supressedModifiers')) {
      this.props.templateInstance.supressedModifiers.forEach(surpressedModifier =>
        _.remove(relevantModifiers, relevantModifier => relevantModifier.id === surpressedModifier)
      )
    }
    this.setState({returnType: returnType});
    this.setState({relevantModifiers: relevantModifiers});
  }

  handleModifierSelected(event) {
    let selectedModifier = this.modifierMap[event.target.value]
    this.setAppliedModifiers(this.state.appliedModifiers.concat([selectedModifier]));
    this.setState({ showModifiers: false });
  }

  updateAppliedModifier(index, value) {
    this.setAppliedModifiers(update(this.state.appliedModifiers, {[index]: {values: {$merge: value}} }));
  }
  setAppliedModifiers(appliedModifiers) {
    this.setState({appliedModifiers: appliedModifiers}, this.filterRelevantModifiers);
    this.props.updateInstanceModifiers(this.props.treeName, appliedModifiers, this.getPath(), this.props.subpopulationIndex);
  }

  removeLastModifier() {
    let newAppliedModifiers = this.state.appliedModifiers.slice();
    newAppliedModifiers.pop();
    this.setState({returnType: _.isEmpty(newAppliedModifiers) ? this.props.templateInstance.returnType : _.last(newAppliedModifiers).returnType});
    this.setAppliedModifiers(newAppliedModifiers)
  }

  renderModifierSelect() {
    // filter modifiers?
    return (
      <div>
        { (!this.props.templateInstance.cannotHaveModifiers && (this.state.relevantModifiers.length > 0 || this.state.appliedModifiers.length === 0))
          ?
            <div className="modifier__selection">
              <button
                onClick={() => this.setState({ showModifiers: !this.state.showModifiers })}
                className="modifier__addbutton"
                aria-label={'add expression'}>
                Add Expression</button>
              { (this.state.showModifiers)
                ? this.state.relevantModifiers.map((modifier) =>
                    <button key={modifier.id}
                      value={modifier.id}
                      onClick={this.handleModifierSelected} className="modifier__button">{modifier.name}</button>
                  )
                : null
              }
            </div>
          : null
        }
      </div>
    );
  }

  selectTemplate(param) {
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
      case 'valueset':
        return (
          <ValueSetParameter
            key={param.id}
            param={param}
            valueset={this.state.resources}
            updateInstance={this.updateInstance} />
        );
      default:
        return undefined;
    }
  }

  showPresets(id) {
    this.setState({ showPresets: !this.state.showPresets });
    this.props.showPresets(id)
      .then((result) => {
        this.setState({ presets: result.data });
      })
      .catch((error) => {
        console.log(error);
        this.setState({ presets: [] });
      });
  }

  setPreset(stateIndex) {
    if (!this.state.presets || _.isNaN(_.toNumber(stateIndex))) return;
    const uniqueId = this.props.templateInstance.uniqueId;
    const preset = this.state.presets[stateIndex];
    preset.uniqueId = uniqueId;
    this.props.setPreset(this.props.treeName, preset, this.getPath());
    this.setState({ showPresets: !this.state.showPresets })
  }

  showHideElementBody() {
    this.setState({ showElement: !this.state.showElement });
  }

  getPath = () => this.props.getPath(this.props.templateInstance.uniqueId)

  renderBody() {
    return (
      <div className="element__body">
      <div>
        {this.props.templateInstance.parameters.map((param, index) =>
          // todo: each parameter type should probably have its own component
          this.selectTemplate(param)
        )}
        </div>
        {this.renderAppliedModifiers()}
        <div className='modifier__return__type'>
          Return Type: {_.startCase(this.state.returnType)}
        </div>
        {this.renderModifierSelect()}
      </div>);
  }

  render() {
    return (
      <div className="element element__expanded">
        <div className="element__header">
          <span className="element__heading">
            {this.props.templateInstance.name}
          </span>
          <div className="element__buttonbar">
            { this.props.renderIndentButtons(this.props.templateInstance) }
            {/* <button
              id={`presets-${this.props.templateInstance.uniqueId}`}
              aria-controls={`presets-list-${this.props.templateInstance.uniqueId}`}
              onClick={this.showPresets.bind(this, this.props.templateInstance.id)}
              className="element__presetbutton"
              aria-label={`show presets ${this.props.templateInstance.id}`}>
              <FontAwesome fixedWidth name='database'/>
            </button>
            <button
              onClick={() => this.props.saveInstance(this.props.treeName, this.getPath())}
              className="element__savebutton"
              aria-label={`save ${this.props.templateInstance.name}`}>
              <FontAwesome fixedWidth name='save'/>
            </button> */}
            <button
              onClick={this.showHideElementBody.bind(this)}
              className="element__hidebutton"
              aria-label={`hide ${this.props.templateInstance.name}`}>
              <FontAwesome fixedWidth name={this.state.showElement ? 'angle-double-down' : 'angle-double-right'}/>
            </button>
            <button
              onClick={() => this.props.deleteInstance(this.props.treeName, this.getPath())}
              className="element__deletebutton"
              aria-label={`remove ${this.props.templateInstance.name}`}>
              <FontAwesome fixedWidth name='close'/>
            </button>
            <div id={`presets-list-${this.props.templateInstance.uniqueId}`} role="region" aria-live="polite">
              { this.state.showPresets
                ? <select
                    onChange={event => this.setPreset(event.target.value)}
                    onBlur={event => this.setPreset(event.target.value)}
                    title={`show presets for ${this.props.templateInstance.id}`}
                    aria-labelledby={`presets-${this.props.templateInstance.uniqueId}`}>
                  <optgroup><option>Use a preset</option></optgroup>
                  {this.state.presets.map((preset, i) =>
                    renderPreset(preset, i)
                  )}
                </select>
                : null
              }
            </div>
          </div>
        </div>
        <div>
          { this.state.showElement ? this.renderBody() : null }
        </div>
      </div>
    );
  }
}

export default TemplateInstance;
