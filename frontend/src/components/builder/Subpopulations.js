import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';

import Subpopulation from './Subpopulation';
import createTemplateInstance from '../../utils/templates';

export default class Subpopulations extends Component {
  static propTypes = {
    artifact: PropTypes.object.isRequired,
    resources: PropTypes.object,
    valueSets: PropTypes.array,
    loadValueSets: PropTypes.func.isRequired,
    updateSubpopulations: PropTypes.func.isRequired,
    templates: PropTypes.array.isRequired,
    addInstance: PropTypes.func.isRequired,
    editInstance: PropTypes.func.isRequired,
    updateInstanceModifiers: PropTypes.func.isRequired,
    deleteInstance: PropTypes.func.isRequired,
    getAllInstances: PropTypes.func.isRequired,
    updateRecsSubpop: PropTypes.func.isRequired,
    checkSubpopulationUsage: PropTypes.func.isRequired,
    parameters: PropTypes.array.isRequired,
    name: PropTypes.string.isRequired,
    loginVSACUser: PropTypes.func.isRequired,
    setVSACAuthStatus: PropTypes.func.isRequired,
    vsacStatus: PropTypes.string,
    vsacStatusText: PropTypes.string,
    timeLastAuthenticated: PropTypes.instanceOf(Date),
    searchVSACByKeyword: PropTypes.func.isRequired,
    isSearchingVSAC: PropTypes.bool.isRequired,
    vsacSearchResults: PropTypes.array.isRequired,
    vsacSearchCount: PropTypes.number.isRequired,
    getVSDetails: PropTypes.func.isRequired,
    isRetrievingDetails: PropTypes.bool.isRequired,
    vsacDetailsCodes: PropTypes.array.isRequired
  };

  constructor(props) {
    super(props);

    const operations = this.props.templates.find(g => g.name === 'Operations');
    const andTemplate = operations.entries.find(e => e.name === 'And');
    this.baseTemplate = (andTemplate);

    this.state = {
      subpopulations: this.props.artifact.subpopulations.filter(sp => !sp.special), // Don't want to allow user interaction with the two default subpopulations added by the system
      numOfSpecialSubpopulations: this.props.artifact.subpopulations.filter(sp => sp.special).length
    };
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      subpopulations: nextProps.artifact.subpopulations.filter(sp => !sp.special),
      numOfSpecialSubpopulations: nextProps.artifact.subpopulations.filter(sp => sp.special).length
    });
  }

  addSubpopulation = () => {
    const newSubpopulation = createTemplateInstance(this.baseTemplate);
    newSubpopulation.name = '';
    newSubpopulation.path = '';
    newSubpopulation.subpopulationName = `Subpopulation ${this.state.subpopulations.length + 1}`;
    newSubpopulation.expanded = true;
    const newSubpopulations = this.props.artifact.subpopulations.concat([newSubpopulation]);

    this.props.updateSubpopulations(newSubpopulations);
  }

  deleteSubpopulation = (uniqueId) => {
    const subpopExists = this.props.checkSubpopulationUsage(uniqueId);
    if (subpopExists) {
      // eslint-disable-next-line no-alert
      alert('Subpopulation in use');
    } else {
      const newSubpopulations = _.cloneDeep(this.props.artifact.subpopulations);
      const subpopulationIndex = this.props.artifact.subpopulations.findIndex(sp => sp.uniqueId === uniqueId);
      newSubpopulations.splice(subpopulationIndex, 1);

      this.props.updateSubpopulations(newSubpopulations);
    }
  }

  setSubpopulationName = (name, uniqueId) => {
    const newSubpopulations = _.cloneDeep(this.props.artifact.subpopulations);
    const subpopulationIndex = this.props.artifact.subpopulations.findIndex(sp => sp.uniqueId === uniqueId);
    newSubpopulations[subpopulationIndex].subpopulationName = name;

    this.props.updateSubpopulations(newSubpopulations);
    this.props.updateRecsSubpop(name, uniqueId);
  }

  render() {
    return (
      <div className="subpopulations">
        { this.state.subpopulations.map((subpop, i) => (
            <Subpopulation
              key={ subpop.uniqueId }
              treeName={ this.props.name }
              resources={this.props.resources}
              valueSets={this.props.valueSets}
              loadValueSets={this.props.loadValueSets}
              subpopulation={ subpop }
              subpopulationIndex={ i + this.state.numOfSpecialSubpopulations } // System needs to know true index out of all subpopulations
              setSubpopulationName={ this.setSubpopulationName }
              deleteSubpopulation={ this.deleteSubpopulation }
              parameters={ this.props.parameters }
              addInstance={ this.props.addInstance }
              editInstance={ this.props.editInstance }
              updateInstanceModifiers={ this.props.updateInstanceModifiers }
              deleteInstance={ this.props.deleteInstance }
              getAllInstances={ this.props.getAllInstances }
              templates={ this.props.templates }
              artifact={this.props.artifact}
              loginVSACUser={this.props.loginVSACUser}
              setVSACAuthStatus={this.props.setVSACAuthStatus}
              vsacStatus={this.props.vsacStatus}
              vsacStatusText={this.props.vsacStatusText}
              timeLastAuthenticated={this.props.timeLastAuthenticated}
              searchVSACByKeyword={this.props.searchVSACByKeyword}
              isSearchingVSAC={this.props.isSearchingVSAC}
              vsacSearchResults={this.props.vsacSearchResults}
              vsacSearchCount={this.props.vsacSearchCount}
              getVSDetails={this.props.getVSDetails}
              isRetrievingDetails={this.props.isRetrievingDetails}
              vsacDetailsCodes={this.props.vsacDetailsCodes} />
          ))}
        <button className="button primary-button" onClick={ this.addSubpopulation }>
          New subpopulation
        </button>
      </div>
    );
  }
}
