import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button } from '@material-ui/core';
import pluralize from 'pluralize';
import _ from 'lodash';

import Subpopulation from './Subpopulation';
import createTemplateInstance from 'utils/templates';

export default class Subpopulations extends Component {
  constructor(props) {
    super(props);

    const operations = this.props.templates.find(g => g.name === 'Operations');
    const andTemplate = operations.entries.find(e => e.name === 'And');
    this.baseTemplate = andTemplate;

    this.state = {
      subpopulations: this.props.artifact[this.props.name].filter(sp => !sp.special), // Don't want to allow user interaction with the two default subpopulations added by the system
      baseElements: this.props.artifact[this.props.name].filter(sp => !sp.special),
      numOfSpecialSubpopulations: this.props.artifact[this.props.name].filter(sp => sp.special).length
    };
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    // eslint-disable-line camelcase
    this.setState({
      subpopulations: nextProps.artifact[this.props.name].filter(sp => !sp.special),
      baseElements: nextProps.artifact[this.props.name],
      numOfSpecialSubpopulations: nextProps.artifact[this.props.name].filter(sp => sp.special).length
    });
  }

  addSubpopulation = () => {
    const newSubpopulation = createTemplateInstance(this.baseTemplate);
    newSubpopulation.name = '';
    newSubpopulation.path = '';
    // eslint-disable-next-line
    newSubpopulation.subpopulationName = `${_.capitalize(pluralize.singular(this.props.name))} ${
      this.state[this.props.name].length + 1
    }`;
    newSubpopulation.expanded = true;
    const newSubpopulations = this.props.artifact[this.props.name].concat([newSubpopulation]);
    this.props.updateSubpopulations(newSubpopulations, this.props.name);
  };

  setSubpopulationName = (name, uniqueId) => {
    const newSubpopulations = _.cloneDeep(this.props.artifact[this.props.name]);
    const subpopulationIndex = this.props.artifact[this.props.name].findIndex(sp => sp.uniqueId === uniqueId);
    newSubpopulations[subpopulationIndex].subpopulationName = name;

    this.props.updateSubpopulations(newSubpopulations, this.props.name);
    this.props.updateRecsSubpop(name, uniqueId);
  };

  render() {
    const newButtonLabel = `New ${pluralize.singular(this.props.name)}`;

    return (
      <div className="subpopulations">
        {this.state.subpopulations.map((subpop, i) => (
          <Subpopulation
            key={subpop.uniqueId}
            addInstance={this.props.addInstance}
            artifact={this.props.artifact}
            baseElements={this.props.baseElements}
            checkSubpopulationUsage={this.props.checkSubpopulationUsage}
            conversionFunctions={this.props.conversionFunctions}
            deleteInstance={this.props.deleteInstance}
            editInstance={this.props.editInstance}
            getAllInstances={this.props.getAllInstances}
            getAllInstancesInAllTrees={this.props.getAllInstancesInAllTrees}
            instanceNames={this.props.instanceNames}
            isLoadingModifiers={this.props.isLoadingModifiers}
            modifierMap={this.props.modifierMap}
            modifiersByInputType={this.props.modifiersByInputType}
            name={this.props.name}
            parameters={this.props.parameters}
            setSubpopulationName={this.setSubpopulationName}
            subpopulation={subpop}
            subpopulationIndex={i + this.state.numOfSpecialSubpopulations} // System needs to know true index out of all subpopulations
            templates={this.props.templates}
            treeName={this.props.name}
            updateInstanceModifiers={this.props.updateInstanceModifiers}
            updateSubpopulations={this.props.updateSubpopulations}
            validateReturnType={this.props.validateReturnType}
            vsacApiKey={this.props.vsacApiKey}
          />
        ))}

        <Button color="primary" onClick={this.addSubpopulation} variant="contained">
          {newButtonLabel}
        </Button>
      </div>
    );
  }
}

Subpopulations.propTypes = {
  addInstance: PropTypes.func.isRequired,
  artifact: PropTypes.object.isRequired,
  baseElements: PropTypes.array.isRequired,
  checkSubpopulationUsage: PropTypes.func.isRequired,
  conversionFunctions: PropTypes.array,
  deleteInstance: PropTypes.func.isRequired,
  editInstance: PropTypes.func.isRequired,
  getAllInstances: PropTypes.func.isRequired,
  getAllInstancesInAllTrees: PropTypes.func.isRequired,
  instanceNames: PropTypes.array.isRequired,
  isLoadingModifiers: PropTypes.bool,
  modifierMap: PropTypes.object.isRequired,
  modifiersByInputType: PropTypes.object.isRequired,
  name: PropTypes.string.isRequired,
  parameters: PropTypes.array.isRequired,
  templates: PropTypes.array.isRequired,
  updateInstanceModifiers: PropTypes.func.isRequired,
  updateRecsSubpop: PropTypes.func.isRequired,
  updateSubpopulations: PropTypes.func.isRequired,
  validateReturnType: PropTypes.bool,
  vsacApiKey: PropTypes.string
};
