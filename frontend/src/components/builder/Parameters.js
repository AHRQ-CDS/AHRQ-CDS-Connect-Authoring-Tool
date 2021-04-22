import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button } from '@material-ui/core';
import _ from 'lodash';

import Parameter from './Parameter';

export default class Parameters extends Component {
  addParameter = () => {
    const newIndex = this.props.parameters.length;

    const newParameter = {
      name: null,
      type: 'boolean',
      value: null,
      uniqueId: `parameter-${newIndex}`,
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
            comment={parameter.comment}
            deleteParameter={this.deleteParameter}
            getAllInstancesInAllTrees={this.props.getAllInstancesInAllTrees}
            id={parameter.uniqueId}
            index={i}
            instanceNames={this.props.instanceNames}
            name={parameter.name}
            scrollToElement={this.props.scrollToElement}
            type={parameter.type}
            updateInstanceOfParameter={this.updateInstanceOfParameter}
            usedBy={parameter.usedBy}
            value={parameter.value}
            vsacApiKey={this.props.vsacApiKey}
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
  getAllInstancesInAllTrees: PropTypes.func.isRequired,
  instanceNames: PropTypes.array.isRequired,
  parameters: PropTypes.array.isRequired,
  scrollToElement: PropTypes.func.isRequired,
  updateParameters: PropTypes.func.isRequired,
  vsacApiKey: PropTypes.string
};
