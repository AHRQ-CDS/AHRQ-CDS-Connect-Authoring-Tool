import React, { Component, PropTypes } from 'react';
import _ from 'lodash';

import { createTemplateInstance } from './TemplateInstance';
import Subpopulation from './Subpopulation';

class Subpopulations extends Component {
  static propTypes = {
    subpopulations: PropTypes.array.isRequired,
    updateSubpopulations: PropTypes.func.isRequired,
    categories: PropTypes.array.isRequired
  };

  constructor(props) {
    super(props);

    const operations = this.props.categories.find(g => g.name === 'Operations');
    const andTemplate = operations.entries.find(e => e.name === 'And');
    this.baseTemplate = (andTemplate);
  }

  addSubpopulation = () => {
    const newSubpopulation = createTemplateInstance(this.baseTemplate);
    newSubpopulation.path = '';
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
          Add new subpopulation
        </button>
        { this.props.subpopulations && this.props.subpopulations.map((subpop, i) => {
          return (
            <Subpopulation
              key={ subpop.uniqueId }
              id={ subpop.uniqueId }
              subpopulation={ subpop }
              subpopulationIndex={
                // TODO: Can remove this if we get a better default name for new subpops
                i
              }
              deleteSubpopulation={ this.deleteSubpopulation }
              addInstance={ this.props.addInstance }
              editInstance={ this.props.editInstance }
              deleteInstance={ this.props.deleteInstance }
              saveInstance={ this.props.saveInstance }
              getAllInstances={ this.props.getAllInstances }
              showPresets={ this.props.showPresets }
              categories={ this.props.categories } />
          );
        })}
      </div>
    );
  }
}

export default Subpopulations;
