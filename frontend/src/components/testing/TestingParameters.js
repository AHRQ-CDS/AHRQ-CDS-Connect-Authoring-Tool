import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';

import TestingParameter from './TestingParameter';

export default class TestingParameters extends Component {
  updateInstanceOfParameter = (newValue, index) => {
    const parameters = _.clone(this.props.parameters);
    parameters[index] = _.clone(newValue);
    delete parameters[index].label;
    this.props.updateParameters(parameters);
  }

  render() {
    return (
      <div className="parameters">
        {this.props.parameters.length > 0 ? <br /> : '' }
        {this.props.parameters.map((parameter, i) => (
          <TestingParameter
            key={`param-${i}`}
            id={parameter.uniqueId}
            index={i}
            name={parameter.name}
            type={parameter.type}
            updateInstanceOfParameter={newValue => this.updateInstanceOfParameter(newValue, i)}
            value={parameter.value}
            vsacApiKey={this.props.vsacApiKey}
          />
        ))}
      </div>
    );
  }
}

TestingParameters.propTypes = {
  parameters: PropTypes.array.isRequired,
  updateParameters: PropTypes.func.isRequired,
  vsacApiKey: PropTypes.string
};
