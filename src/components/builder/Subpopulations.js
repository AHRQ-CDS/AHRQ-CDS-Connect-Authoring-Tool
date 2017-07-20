import React, { Component, PropTypes } from 'react';
import _ from 'lodash';

import { createTemplateInstance } from './TemplateInstance';
import Subpopulation from './Subpopulation';

class Subpopulations extends Component {
  static propTypes = {
    subpopulations: PropTypes.array.isRequired,
    updateSubpopulations: PropTypes.func.isRequired,
    categories: PropTypes.array.isRequired,
    updateInstanceModifiers: PropTypes.func.isRequired
  };

  constructor(props) {
    super(props);

    const operations = this.props.categories.find(g => g.name === 'Operations');
    const andTemplate = operations.entries.find(e => e.name === 'And');
    this.baseTemplate = (andTemplate);
  }

  componentWillMount() {
    if (!this.props.subpopulations.length) {
      this.addSubpopulation();
    }
  }

  getSubpopulationName = (subpopulationId) => {
    return this.props.subpopulations[subpopulationId].subpopulationName;
  }

  setSubpopulationName = (event, subpopulationId) => {
    this.props.subpopulations[subpopulationId].subpopulationName = event.target.value;
    this.props.updateSubpopulations(this.props.subpopulations); // calls setState to get re-render, and updates `subpopulationName` key
  }

  addSubpopulation = () => {
    const newSubpopulation = createTemplateInstance(this.baseTemplate);
    newSubpopulation.path = '';
    newSubpopulation.subpopulationName = `Subpopulation ${this.props.subpopulations.length + 1}`;
    newSubpopulation.expanded = true;
    const newSubpopulations = this.props.subpopulations.concat([ newSubpopulation ]);

    this.props.updateSubpopulations(newSubpopulations);
  }

  deleteSubpopulation = (uniqueId) => {
    const newSubpopulations = _.cloneDeep(this.props.subpopulations);
    const subpopulationIndex = this.props.subpopulations.findIndex(sp => sp.uniqueId === uniqueId);
    newSubpopulations.splice(subpopulationIndex, 1);

    this.props.updateSubpopulations(newSubpopulations);
  }

  render() {
    return (
      <div className="subpopulations">
        <button className="button new-subpopulation" onClick={ this.addSubpopulation }>
          New subpopulation
        </button>
        { this.props.subpopulations && this.props.subpopulations.map((subpop, i) => {
          return (
            <Subpopulation
              key={ subpop.uniqueId }
              treeName={ this.props.name }
              subpopulation={ subpop }
              subpopulations={ this.props.subpopulations }
              subpopulationIndex={
                // TODO: Can remove this if we get a better default name for new subpops
                i
              }
              deleteSubpopulation={ this.deleteSubpopulation }
              addInstance={ this.props.addInstance }
              editInstance={ this.props.editInstance }
              updateInstanceModifiers={ this.props.updateInstanceModifiers }
              deleteInstance={ this.props.deleteInstance }
              saveInstance={ this.props.saveInstance }
              showPresets={ this.props.showPresets }
              getSubpopulationName={ this.getSubpopulationName }
              setSubpopulationName={ this.setSubpopulationName }
              categories={ this.props.categories } />
          );
        })}
      </div>
    );
  }
}

export default Subpopulations;
