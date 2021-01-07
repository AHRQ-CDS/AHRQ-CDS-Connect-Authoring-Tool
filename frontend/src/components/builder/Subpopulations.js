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
    this.baseTemplate = (andTemplate);

    this.state = {
      subpopulations: this.props.artifact[this.props.name].filter(sp => !sp.special), // Don't want to allow user interaction with the two default subpopulations added by the system
      baseElements: this.props.artifact[this.props.name].filter(sp => !sp.special),
      numOfSpecialSubpopulations: this.props.artifact[this.props.name].filter(sp => sp.special).length
    };
  }

  UNSAFE_componentWillReceiveProps(nextProps) { // eslint-disable-line camelcase
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
    newSubpopulation.subpopulationName = `${_.capitalize(pluralize.singular(this.props.name))} ${this.state[this.props.name].length+1}`;
    newSubpopulation.expanded = true;
    const newSubpopulations = this.props.artifact[this.props.name].concat([newSubpopulation]);
    this.props.updateSubpopulations(newSubpopulations, this.props.name);
  }

  deleteSubpopulation = (uniqueId) => {
    const subpopExists = this.props.checkSubpopulationUsage(uniqueId);
    if (subpopExists) {
      // eslint-disable-next-line no-alert
      alert('Subpopulation in use');
    } else {
      const newSubpopulations = _.cloneDeep(this.props.artifact[this.props.name]);
      const subpopulationIndex = this.props.artifact[this.props.name].findIndex(sp => sp.uniqueId === uniqueId);
      newSubpopulations.splice(subpopulationIndex, 1);

      this.props.updateSubpopulations(newSubpopulations, this.props.name);
    }
  }

  setSubpopulationName = (name, uniqueId) => {
    const newSubpopulations = _.cloneDeep(this.props.artifact[this.props.name]);
    const subpopulationIndex = this.props.artifact[this.props.name].findIndex(sp => sp.uniqueId === uniqueId);
    newSubpopulations[subpopulationIndex].subpopulationName = name;

    this.props.updateSubpopulations(newSubpopulations, this.props.name);
    this.props.updateRecsSubpop(name, uniqueId);
  }

  render() {
    const newButtonLabel = `New ${pluralize.singular(this.props.name)}`;

    return (
      <div className="subpopulations">
        {this.state.subpopulations.map((subpop, i) => (
          <Subpopulation
            key={subpop.uniqueId}
            treeName={this.props.name}
            subpopulation={subpop}
            subpopulationIndex={i + this.state.numOfSpecialSubpopulations} // System needs to know true index out of all subpopulations
            setSubpopulationName={this.setSubpopulationName}
            deleteSubpopulation={this.deleteSubpopulation}
            parameters={this.props.parameters}
            baseElements={this.props.baseElements}
            externalCqlList={this.props.externalCqlList}
            loadExternalCqlList={this.props.loadExternalCqlList}
            addInstance={this.props.addInstance}
            editInstance={this.props.editInstance}
            updateInstanceModifiers={this.props.updateInstanceModifiers}
            deleteInstance={this.props.deleteInstance}
            getAllInstances={this.props.getAllInstances}
            getAllInstancesInAllTrees={this.props.getAllInstancesInAllTrees}
            templates={this.props.templates}
            artifact={this.props.artifact}
            modifierMap={this.props.modifierMap}
            modifiersByInputType={this.props.modifiersByInputType}
            isLoadingModifiers={this.props.isLoadingModifiers}
            conversionFunctions={this.props.conversionFunctions}
            instanceNames={this.props.instanceNames}
            scrollToElement={this.props.scrollToElement}
            loginVSACUser={this.props.loginVSACUser}
            setVSACAuthStatus={this.props.setVSACAuthStatus}
            vsacStatus={this.props.vsacStatus}
            vsacStatusText={this.props.vsacStatusText}
            searchVSACByKeyword={this.props.searchVSACByKeyword}
            isSearchingVSAC={this.props.isSearchingVSAC}
            vsacSearchResults={this.props.vsacSearchResults}
            vsacSearchCount={this.props.vsacSearchCount}
            getVSDetails={this.props.getVSDetails}
            isRetrievingDetails={this.props.isRetrievingDetails}
            vsacDetailsCodes={this.props.vsacDetailsCodes}
            vsacDetailsCodesError={this.props.vsacDetailsCodesError}
            vsacApiKey={this.props.vsacApiKey}
            validateReturnType={this.props.validateReturnType}
            isValidatingCode={this.props.isValidatingCode}
            isValidCode={this.props.isValidCode}
            codeData={this.props.codeData}
            validateCode={this.props.validateCode}
            resetCodeValidation={this.props.resetCodeValidation}
            vsacIsAuthenticating={this.props.vsacIsAuthenticating}
          />
        ))}

        <Button
          color="primary"
          onClick={this.addSubpopulation}
          variant="contained"
        >
          {newButtonLabel}
        </Button>
      </div>
    );
  }
}

Subpopulations.propTypes = {
  artifact: PropTypes.object.isRequired,
  updateSubpopulations: PropTypes.func.isRequired,
  templates: PropTypes.array.isRequired,
  addInstance: PropTypes.func.isRequired,
  editInstance: PropTypes.func.isRequired,
  updateInstanceModifiers: PropTypes.func.isRequired,
  deleteInstance: PropTypes.func.isRequired,
  getAllInstances: PropTypes.func.isRequired,
  getAllInstancesInAllTrees: PropTypes.func.isRequired,
  instanceNames: PropTypes.array.isRequired,
  updateRecsSubpop: PropTypes.func.isRequired,
  checkSubpopulationUsage: PropTypes.func.isRequired,
  parameters: PropTypes.array.isRequired,
  externalCqlList: PropTypes.array.isRequired,
  loadExternalCqlList: PropTypes.func.isRequired,
  name: PropTypes.string.isRequired,
  modifierMap: PropTypes.object.isRequired,
  modifiersByInputType: PropTypes.object.isRequired,
  isLoadingModifiers: PropTypes.bool,
  conversionFunctions: PropTypes.array,
  scrollToElement: PropTypes.func,
  loginVSACUser: PropTypes.func.isRequired,
  setVSACAuthStatus: PropTypes.func.isRequired,
  vsacStatus: PropTypes.string,
  vsacStatusText: PropTypes.string,
  searchVSACByKeyword: PropTypes.func.isRequired,
  isSearchingVSAC: PropTypes.bool.isRequired,
  vsacSearchResults: PropTypes.array.isRequired,
  vsacSearchCount: PropTypes.number.isRequired,
  getVSDetails: PropTypes.func.isRequired,
  isRetrievingDetails: PropTypes.bool.isRequired,
  vsacDetailsCodes: PropTypes.array.isRequired,
  vsacDetailsCodesError: PropTypes.string.isRequired,
  validateReturnType: PropTypes.bool,
  vsacIsAuthenticating: PropTypes.bool.isRequired
};
