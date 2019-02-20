import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';

import Parameter from './Parameter';

export default class Parameters extends Component {
  addParameter = () => {
    const newParameter = { name: null, type: null, value: null, uniqueId: _.uniqueId('parameter-') };
    const parameters = _.clone(this.props.parameters);
    parameters.push(newParameter);
    this.props.updateParameters(parameters);
  }

  deleteParameter = (index) => {
    const parameters = _.cloneDeep(this.props.parameters);
    parameters.splice(index, 1);
    this.props.updateParameters(parameters);
  }

  updateInstanceOfParameter = (parameter, index) => {
    const parameters = _.clone(this.props.parameters);
    parameters[index] = parameter;
    this.props.updateParameters(parameters);
  }

  render() {
    return (
      <div className="parameters">
        {this.props.parameters.map((parameter, i) => (
          <Parameter
            key={`param-${i}`}
            index={i}
            name={parameter.name}
            id={parameter.uniqueId}
            type={parameter.type}
            value={parameter.value}
            usedBy={parameter.usedBy}
            instanceNames={this.props.instanceNames}
            updateInstanceOfParameter={this.updateInstanceOfParameter}
            deleteParameter={this.deleteParameter}
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

        <button className="button primary-button new-parameter" onClick={this.addParameter}>
          New parameter
        </button>
      </div>
    );
  }
}

Parameters.propTypes = {
  parameters: PropTypes.array.isRequired,
  updateParameters: PropTypes.func.isRequired,
  instanceNames: PropTypes.array.isRequired,
  vsacFHIRCredentials: PropTypes.object,
  loginVSACUser: PropTypes.func.isRequired,
  setVSACAuthStatus: PropTypes.func.isRequired,
  vsacStatus: PropTypes.string,
  vsacStatusText: PropTypes.string
};
