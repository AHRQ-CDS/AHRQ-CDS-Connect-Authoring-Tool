import React, { Component, PropTypes } from 'react';
import _ from 'lodash';

import Subpopulation from './Subpopulation';

class Subpopulations extends Component {
  static propTypes = {
    subpopulations: PropTypes.array.isRequired,
    updateSubpopulations: PropTypes.func.isRequired,
    categories: PropTypes.array.isRequired,
    addInstance: PropTypes.func.isRequired,
    editInstance: PropTypes.func.isRequired,
    updateInstanceModifiers: PropTypes.func.isRequired,
    deleteInstance: PropTypes.func.isRequired,
    saveInstance: PropTypes.func.isRequired,
    getAllInstances: PropTypes.func.isRequired,
    updateRecsSubpop: PropTypes.func.isRequired,
    createTemplateInstance: PropTypes.func.isRequired,
    checkSubpopulationUsage: PropTypes.func.isRequired,
    booleanParameters: PropTypes.array.isRequired,
    name: PropTypes.string.isRequired,
    showPresets: PropTypes.func.isRequired
  };

  constructor(props) {
    super(props);

    const operations = this.props.categories.find(g => g.name === 'Operations');
    const andTemplate = operations.entries.find(e => e.name === 'And');
    this.baseTemplate = (andTemplate);

    this.state = {
      subpopulations: this.props.subpopulations.filter(sp => !sp.special), // Don't want to allow user interaction with the two default subpopulations added by the system
      numOfSpecialSubpopulations: this.props.subpopulations.filter(sp => sp.special).length
    };
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      subpopulations: nextProps.subpopulations.filter(sp => !sp.special),
      numOfSpecialSubpopulations: nextProps.subpopulations.filter(sp => sp.special).length
    });
  }

  addSubpopulation = () => {
    const newSubpopulation = this.props.createTemplateInstance(this.baseTemplate);
    newSubpopulation.name = '';
    newSubpopulation.path = '';
    newSubpopulation.subpopulationName = `Subpopulation ${this.state.subpopulations.length + 1}`;
    newSubpopulation.expanded = true;
    const newSubpopulations = this.props.subpopulations.concat([newSubpopulation]);

    this.props.updateSubpopulations(newSubpopulations);
  }

  deleteSubpopulation = (uniqueId) => {
    const subpopExists = this.props.checkSubpopulationUsage(uniqueId);
    if (subpopExists) {
      alert('Subpopulation in use');
    } else {
      const newSubpopulations = _.cloneDeep(this.props.subpopulations);
      const subpopulationIndex = this.props.subpopulations.findIndex(sp => sp.uniqueId === uniqueId);
      newSubpopulations.splice(subpopulationIndex, 1);

      this.props.updateSubpopulations(newSubpopulations);
    }
  }

  setSubpopulationName = (name, uniqueId) => {
    const newSubpopulations = _.cloneDeep(this.props.subpopulations);
    const subpopulationIndex = this.props.subpopulations.findIndex(sp => sp.uniqueId === uniqueId);
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
              subpopulation={ subpop }
              subpopulationIndex={ i + this.state.numOfSpecialSubpopulations } // System needs to know true index out of all subpopulations
              setSubpopulationName={ this.setSubpopulationName }
              deleteSubpopulation={ this.deleteSubpopulation }
              booleanParameters={ this.props.booleanParameters }
              createTemplateInstance={ this.props.createTemplateInstance }
              addInstance={ this.props.addInstance }
              editInstance={ this.props.editInstance }
              updateInstanceModifiers={ this.props.updateInstanceModifiers }
              deleteInstance={ this.props.deleteInstance }
              saveInstance={ this.props.saveInstance }
              getAllInstances={ this.props.getAllInstances }
              showPresets={ this.props.showPresets }
              setPreset={ this.props.setPreset }
              categories={ this.props.categories } />
          ))}
        <button className="button" onClick={ this.addSubpopulation }>
          New subpopulation
        </button>
      </div>
    );
  }
}

export default Subpopulations;
