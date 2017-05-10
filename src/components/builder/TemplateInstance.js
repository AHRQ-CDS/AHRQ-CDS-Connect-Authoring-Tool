import React, { Component, PropTypes } from 'react';
import axios from 'axios';
import FontAwesome from 'react-fontawesome';
import IntegerParameter from './parameters/IntegerParameter';
import StringParameter from './parameters/StringParameter';
import ObservationParameter from './parameters/ObservationParameter';
import ValueSetParameter from './parameters/ValueSetParameter';
import ListParameter from './parameters/ListParameter'
import _ from 'lodash';

function validateOneWord(value) {
  if (value.includes(' ')) {
    return false;
  }
  return true;
}

class TemplateInstance extends Component {
  static propTypes = {
    templateInstance: PropTypes.object.isRequired,
    otherInstances: PropTypes.array.isRequired,
    updateSingleElement: PropTypes.func.isRequired,
    deleteInstance: PropTypes.func.isRequired
  }

  constructor(props) {
    super(props);

    this.state = { resources: {} };
    this.updateInstance = this.updateInstance.bind(this);
    this.updateList = this.updateList.bind(this);
    this.selectTemplate = this.selectTemplate.bind(this);
    this.notThisInstance = this.notThisInstance.bind(this);
    this.addComponent = this.addComponent.bind(this);
  }

  componentWillMount() {
    this.props.templateInstance.parameters.forEach((param) => {
      this.setState({ [param.id]: param.value });
    });

    let otherInstances = this.props.otherInstances.filter(this.notThisInstance).map((instance) => {
        return {name: this.getInstanceName(instance),
                id: instance.id}
      });
    this.setState({ otherInstances: otherInstances });

    axios.get('http://localhost:3001/api/resources')
      .then((result) => {
        this.setState({ resources: result.data });
      });
  }

  notThisInstance(instance) {
    return this.props.templateInstance.id != instance.id;
  }

  getInstanceName(instance) {
    return (instance.parameters.find(function(p) {return p.id == 'element_name'}) || {}).value;
  }

  updateInstance(newState) {
    this.setState(newState);
    this.props.updateSingleElement(this.props.templateInstance.uniqueId, newState);
  }

  updateList(id, value, index) {
    let newState = {}
    let arrayvar = this.state[id].slice();
    arrayvar[index] = value;
    newState[id] = arrayvar;
    this.updateInstance(newState);
  }

  addComponent(listParameter) {
    let arrayvar = this.state[listParameter].slice()
    arrayvar.push(undefined)
    let newState = { [listParameter]: arrayvar } 
    this.setState(newState)
    this.props.updateSingleElement(this.props.templateInstance.uniqueId, newState);
  }

  selectTemplate(param) {
    switch (param.type) {
      case 'integer':
        return (
          <IntegerParameter
            key={param.id}
            param={param}
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
      case 'string':
        return (
          <StringParameter
            key={param.id}
            {...param}
            updateInstance={this.updateInstance}
            validation={validateOneWord} />
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
            addComponent={this.addComponent}
            updateList={this.updateList} />
        );
      default:
        return undefined;
    }
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
              onClick={this.props.deleteInstance.bind(this, this.props.templateInstance.uniqueId)}
              className="element__deletebutton"
              aria-label={`remove ${this.props.templateInstance.name}`}>
              <FontAwesome fixedWidth name='close'/>
            </button>
          </div>
        </div>
        <div className="element__body">
        {this.props.templateInstance.parameters.map((param, index) =>
          // todo: each parameter type should probably have its own component
          this.selectTemplate(param)
        )}
        </div>
      </div>
    );
  }
}

export default TemplateInstance;
