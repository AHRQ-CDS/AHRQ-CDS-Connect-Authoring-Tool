import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';

import TestingParameter from './TestingParameter';

export default class TestingParameters extends Component {
  updateInstanceOfParameter = (parameter, index) => {
    const parameters = _.clone(this.props.parameters);
    parameters[index] = _.clone(parameter);
    delete parameters[index].label;
    this.props.updateParameters(parameters);
  }

  render() {
    return (
      <div className="parameters">
        {this.props.parameters.map((parameter, i) => (
          <TestingParameter
            key={`param-${i}`}
            index={i}
            name={parameter.name}
            id={parameter.uniqueId}
            type={parameter.type}
            value={parameter.value}
            updateInstanceOfParameter={this.updateInstanceOfParameter}
            vsacFHIRCredentials={this.props.vsacFHIRCredentials}
            loginVSACUser={this.props.loginVSACUser}
            setVSACAuthStatus={this.props.setVSACAuthStatus}
            vsacStatus={this.props.vsacStatus}
            vsacStatusText={this.props.vsacStatusText}
            isValidatingCode={this.props.isValidatingCode}
            isValidCode={this.props.isValidCode}
            codeData={this.props.codeData}
            validateCode={this.props.validateCode}
            resetCodeValidation={this.props.resetCodeValidation}
          />
        ))}
      </div>
    );
  }
}

TestingParameters.propTypes = {
  parameters: PropTypes.array.isRequired,
  updateParameters: PropTypes.func.isRequired,
  vsacFHIRCredentials: PropTypes.object,
  loginVSACUser: PropTypes.func.isRequired,
  setVSACAuthStatus: PropTypes.func.isRequired,
  vsacStatus: PropTypes.string,
  vsacStatusText: PropTypes.string,
  isValidatingCode: PropTypes.bool.isRequired,
  isValidCode: PropTypes.bool,
  codeData: PropTypes.object,
  validateCode: PropTypes.func.isRequired,
  resetCodeValidation: PropTypes.func.isRequired
};
