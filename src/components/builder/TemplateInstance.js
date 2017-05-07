import React, { Component, PropTypes } from 'react';
import axios from 'axios';
import FontAwesome from 'react-fontawesome';
import IntegerParameter from './parameters/IntegerParameter';
import StringParameter from './parameters/StringParameter';
import ObservationParameter from './parameters/ObservationParameter';

function validateOneWord(value) {
  if (value.includes(' ')) {
    return false;
  }
  return true;
}

class TemplateInstance extends Component {
  static propTypes = {
    templateInstance: PropTypes.object.isRequired,
    updateSingleElement: PropTypes.func.isRequired,
    deleteInstance: PropTypes.func.isRequired,
    saveInstance: PropTypes.func.isRequired,
    showPresets: PropTypes.func.isRequired
  }

  constructor(props) {
    super(props);

    this.state = { resources: {} };
    this.updateInstance = this.updateInstance.bind(this);
    this.selectTemplate = this.selectTemplate.bind(this);
  }

  componentWillMount() {
    this.props.templateInstance.parameters.forEach((param) => {
      this.setState({ [param.id]: param.value });
    });

    axios.get('http://localhost:3001/api/resources')
      .then((result) => {
        this.setState({ resources: result.data });
      });
  }

  updateInstance(newState) {
    this.setState(newState);
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
      default:
        return;
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
              onClick={this.props.showPresets.bind(this, this.props.templateInstance.id)}
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
