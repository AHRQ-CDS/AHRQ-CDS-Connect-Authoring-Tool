import React, { Component, PropTypes } from 'react';
import IntegerParameter from './parameters/IntegerParameter';
import StringParameter from './parameters/StringParameter';

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

    this.state = {};
    this.updateInstance = this.updateInstance.bind(this);
  }

  componentWillMount() {
    this.props.templateInstance.parameters.forEach((param) => {
      this.setState({ [param.id]: param.value });
    });
  }

  updateInstance(newState) {
    this.setState(newState);
    this.props.updateSingleElement(this.props.templateInstance.uniqueId, newState);
  }

  render() {
    return (
      <div className="element">
        <strong>{this.props.templateInstance.name}</strong>
        {this.props.templateInstance.parameters.map((param, index) => {
          // todo: each parameter type should probably have its own component
          if (param.type === 'integer') {
            return (
              <IntegerParameter
                key={param.id}
                {...param}
                updateInstance={this.updateInstance}
              />
            );
          } else if (param.type === 'string') {
            return (
              <StringParameter
                key={param.id}
                {...param}
                updateInstance={this.updateInstance}
                validation={validateOneWord}
              />
            );
          }
          return null;
        })}
      </div>
    );
  }
}

export default TemplateInstance;
