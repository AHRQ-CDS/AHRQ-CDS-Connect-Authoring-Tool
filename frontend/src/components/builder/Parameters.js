import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button } from '@material-ui/core';
import _ from 'lodash';

import Parameter from './Parameter';

export default class Parameters extends Component {
  addParameter = () => {
    const newParameter = {
      name: null,
      type: 'boolean',
      value: null,
      uniqueId: _.uniqueId('parameter-'),
      comment: null
    };

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
            comment={parameter.comment}
            instanceNames={this.props.instanceNames}
            updateInstanceOfParameter={this.updateInstanceOfParameter}
            deleteParameter={this.deleteParameter}
            vsacApiKey={this.props.vsacApiKey}
            loginVSACUser={this.props.loginVSACUser}
            setVSACAuthStatus={this.props.setVSACAuthStatus}
            vsacStatus={this.props.vsacStatus}
            vsacStatusText={this.props.vsacStatusText}
            isValidatingCode={this.props.isValidatingCode}
            isValidCode={this.props.isValidCode}
            codeData={this.props.codeData}
            validateCode={this.props.validateCode}
            resetCodeValidation={this.props.resetCodeValidation}
            getAllInstancesInAllTrees={this.props.getAllInstancesInAllTrees}
          />
        ))}

        <Button color="primary" onClick={this.addParameter} variant="contained">
          New parameter
        </Button>
      </div>
    );
  }
}

Parameters.propTypes = {
  parameters: PropTypes.array.isRequired,
  updateParameters: PropTypes.func.isRequired,
  instanceNames: PropTypes.array.isRequired,
  vsacApiKey: PropTypes.string,
  loginVSACUser: PropTypes.func.isRequired,
  setVSACAuthStatus: PropTypes.func.isRequired,
  vsacStatus: PropTypes.string,
  vsacStatusText: PropTypes.string,
  getAllInstancesInAllTrees: PropTypes.func.isRequired
};
