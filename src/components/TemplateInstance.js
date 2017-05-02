import React, { Component, PropTypes } from 'react';
import axios from 'axios';
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
    updateSingleElement: PropTypes.func.isRequired
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
      <div className="element">
        <strong>{this.props.templateInstance.name}</strong>
        {this.props.templateInstance.parameters.map((param, index) =>
          // todo: each parameter type should probably have its own component
          this.selectTemplate(param)
        )}
      </div>
    );
  }
}

export default TemplateInstance;
