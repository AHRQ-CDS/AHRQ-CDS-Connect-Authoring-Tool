import React, { Component, PropTypes } from 'react';
import axios from 'axios';
import FontAwesome from 'react-fontawesome';
import _ from 'lodash';
import IntegerParameter from './parameters/IntegerParameter';
import StringParameter from './parameters/StringParameter';
import ObservationParameter from './parameters/ObservationParameter';
import ValueSetParameter from './parameters/ValueSetParameter';
import ListParameter from './parameters/ListParameter';
import CaseParameter from './parameters/CaseParameter';
import StaticParameter from './parameters/StaticParameter';
import IfParameter from './parameters/IfParameter';
import BooleanParameter from './parameters/BooleanParameter';
import Config from '../../../config'
const API_BASE = Config.api.baseUrl;

export function createTemplateInstance(template) {
  /*
    TODO: clone is required because we are setting value on the parameter.
    This may not be the best approach
  */
  const instance = _.cloneDeep(template);
  instance.uniqueId = _.uniqueId(instance.id);

  return instance;
}

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
    templateInstance: PropTypes.object.isRequired,
    otherInstances: PropTypes.array.isRequired,
    updateSingleElement: PropTypes.func.isRequired,
    deleteInstance: PropTypes.func.isRequired,
    saveInstance: PropTypes.func.isRequired,
    showPresets: PropTypes.func.isRequired
  }

  constructor(props) {
    super(props);

    this.state = {
      resources: {},
      presets: [],
      showElement: true,
      showPresets: false
    };
    this.updateInstance = this.updateInstance.bind(this);
    this.updateNestedInstance = this.updateNestedInstance.bind(this);
    this.updateList = this.updateList.bind(this);
    this.updateCase = this.updateCase.bind(this);
    this.updateIf = this.updateIf.bind(this);
    this.selectTemplate = this.selectTemplate.bind(this);
    this.notThisInstance = this.notThisInstance.bind(this);
    this.addComponent = this.addComponent.bind(this);
    this.addCaseComponent = this.addCaseComponent.bind(this);
    this.addIfComponent = this.addIfComponent.bind(this);
  }

  componentWillMount() {
    this.props.templateInstance.parameters.forEach((param) => {
      this.setState({ [param.id]: param.value });
    });

    const otherInstances = this.getOtherInstances(this.props);
    this.setState({ otherInstances });

    axios.get(`${API_BASE}/resources`)
      .then((result) => {
        this.setState({ resources: result.data });
      });
  }

  componentWillReceiveProps(nextProps) {
    const otherInstances = this.getOtherInstances(nextProps);
    this.setState({ otherInstances });
  }

  // Props will either be this.props or nextProps coming from componentWillReceiveProps
  getOtherInstances(props) {
    const otherInstances = props.otherInstances.filter(this.notThisInstance).map(
      instance => ({ name: getInstanceName(instance),
        id: instance.id,
        returnType: instance.returnType }));
    return otherInstances;
  }

  notThisInstance(instance) {
    // Look up by uniqueId to correctly identify the current instance
    // For example, "and" elements have access to all other "and" elements besides itself
    // They have different uniqueId's but the id's of all "and" elements is "And"
    return this.props.templateInstance.uniqueId !== instance.uniqueId;
  }

  // getInstanceName(instance) {
  //   return (instance.parameters.find(p => p.id === 'element_name') || {}).value;
  // }

  updateInstance(newState) {
    this.setState(newState);
    this.props.updateSingleElement(this.props.templateInstance.uniqueId, newState);
  }

  // Used to update value states that are nested objects
  updateNestedInstance(id, value, element) {
    let newState = {};
    newState[id] = Object.assign({}, this.state[id]);
    newState[id][element] = value;
    this.updateInstance(newState);
  }

  updateList(id, value, index) {
    const newState = {};
    const arrayvar = this.state[id].slice();
    arrayvar[index] = value;
    newState[id] = arrayvar;
    this.updateInstance(newState);
  }

  addComponent(listParameter) {
    const arrayvar = this.state[listParameter].slice();
    arrayvar.push(undefined);
    const newState = { [listParameter]: arrayvar };
    this.updateInstance(newState);
  }

  // Updates a case statement based on case or result
  updateCase(id, value, index, option) {
    const array = this.state[id].cases.slice();
    array[index][option] = value;
    this.updateNestedInstance(id, array, 'cases');
  }

  // Adds a new row of case statements
  addCaseComponent(id) {
    const array = this.state[id].cases.slice();
    array.push({case : null, result : null});
    this.updateNestedInstance(id, array, 'cases');
  }
  
  // Updates an if statemement with selected value
  updateIf(paramId, value, index, place) {
    const valueArray = this.state[paramId].slice();
    // Mongoose stops empty objects from being saved, so this will be null if it wasn't set yet
    if(_.isNil(valueArray[index])) {
      valueArray[index] = {};
    }
    valueArray[index][place] = value;
    const newState = {};
    newState[paramId] = valueArray;
    this.updateInstance(newState);
  }
  
  // Adds new Condition/Block for If statements
  addIfComponent(paramId) {
    const currentParamValue =  this.state[paramId].slice();
    currentParamValue.splice(currentParamValue.length-1, 0, {});
    const newState = {};
    newState[paramId] = currentParamValue;
    this.updateInstance(newState);
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
      case 'integer':
        return (
          <IntegerParameter
            key={param.id}
            param={param}
            value={this.state[param.id]}
            updateInstance={this.updateInstance} />
        );
      case 'observation':
        return (
          <ObservationParameter
            key={param.id}
            param={param}
            resources={this.state.resources}
            updateInstance={this.updateInstance} />
        );
      case 'boolean':
        return (
          <BooleanParameter
            key={param.id}
            param={param}
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
      case 'list':
        return (
          <ListParameter
            key={param.id}
            param={param}
            value={this.state[param.id]}
            values={this.state.otherInstances}
            joinOperator={this.props.templateInstance.name}
            addComponent={this.addComponent}
            updateList={this.updateList} />
        );
      case 'if':
        return (
          <IfParameter
            key={param.id}
            values={this.state.otherInstances}
            param={param}
            updateIfStatement={this.updateIf}
            addIfComponent={this.addIfComponent}
            value={this.state[param.id]} />
        );
      case 'case':
        return (
          <CaseParameter
            key={param.id}
            param={param}
            value={this.state[param.id]}
            values={this.state.otherInstances}
            addComponent={this.addCaseComponent}
            updateCase={this.updateCase}
            updateInstance={this.updateNestedInstance} />
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
    this.props.templateInstance.parameters = this.state.presets[stateIndex].parameters;
    for (let i = 0; i < this.state.presets[stateIndex].parameters.length; i++) {
      const param = this.state.presets[stateIndex].parameters[i];
      const newState = {};
      newState[param.id] = param.value;
      this.updateInstance(newState);
    }
  }

  showHideElementBody() {
    this.setState({ showElement: !this.state.showElement });
  }

  renderBody() {
    return (
      <div className="element__body">
        {this.props.templateInstance.parameters.map((param, index) =>
          // todo: each parameter type should probably have its own component
          this.selectTemplate(param)
        )}
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
            <button
              id={`presets-${this.props.templateInstance.id}`}
              aria-controls={`presets-list-${this.props.templateInstance.id}`}
              onClick={this.showPresets.bind(this, this.props.templateInstance.id)}
              className="element__presetbutton"
              aria-label={`show presets ${this.props.templateInstance.id}`}>
              <FontAwesome fixedWidth name='database'/>
            </button>
            <button
              onClick={this.props.saveInstance.bind(this, this.props.templateInstance.uniqueId)}
              className="element__savebutton"
              aria-label={`save ${this.props.templateInstance.name}`}>
              <FontAwesome fixedWidth name='save'/>
            </button>
            <button
              onClick={this.showHideElementBody.bind(this)}
              className="element__hidebutton"
              aria-label={`hide ${this.props.templateInstance.name}`}>
              <FontAwesome fixedWidth name={this.state.showElement ? 'angle-double-down' : 'angle-double-right'}/>
            </button>
            <button
              onClick={this.props.deleteInstance.bind(this, this.props.templateInstance.uniqueId)}
              className="element__deletebutton"
              aria-label={`remove ${this.props.templateInstance.name}`}>
              <FontAwesome fixedWidth name='close'/>
            </button>
            <div id={`presets-list-${this.props.templateInstance.id}`} role="region" aria-live="polite">
              { this.state.showPresets
                ? <select
                    onChange={event => this.setPreset(event.target.value)}
                    onBlur={event => this.setPreset(event.target.value)}
                    aria-labelledby={`presets-${this.props.templateInstance.id}`}>
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
