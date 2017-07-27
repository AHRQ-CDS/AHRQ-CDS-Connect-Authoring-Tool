import React, { Component, PropTypes } from 'react';
import _ from 'lodash';
import FontAwesome from 'react-fontawesome';

import ConjunctionGroup from './ConjunctionGroup';

class Subpopulation extends Component {
  static propTypes = {
    updateInstanceModifiers: PropTypes.func.isRequired,
  }
  constructor(props) {
    super(props);

    this.state = {
      isExpanded: this.props.subpopulation.expanded || false
    };
  }

  expand = () => {
    this.setState({ isExpanded: true });
  }

  collapse = () => {
    this.setState({ isExpanded: false });
  }

  addInstance = (name, template, path) => {
    this.props.addInstance(name, template, path, this.props.subpopulation.uniqueId)
  }

  getAllInstances = (name) => {
    return this.props.getAllInstances(name, null, this.props.subpopulation.uniqueId);
  }

  editInstance = (treeName, params, path, editingConjunction) => {
    this.props.editInstance(treeName, params, path, editingConjunction, this.props.subpopulation.uniqueId);
  }

  deleteInstance = (treeName, path, toAdd) => {
    this.props.deleteInstance(treeName, path, toAdd, this.props.subpopulation.uniqueId);
  }

  saveInstance = (treeName, path) => {
    this.props.saveInstance(treeName, path, this.props.subpopulation.uniqueId);
  }

  render() {
    return (
      <div className="subpopulation">
        <div className="subpopulation__header" onClick={ this.state.isExpanded ? this.collapse : this.expand }>
          { this.state.isExpanded ?
            <div className="subpopulation__title">
              <FontAwesome fixedWidth name='angle-double-down'/>
              <input
                type="text"
                className="subpopulation__name-input"
                aria-label="Subpopulation Title"
                value={ this.props.subpopulation.subpopulationName }
                onClick={ event => event.stopPropagation() }
                onChange={ event => { this.props.setSubpopulationName(event.target.value, this.props.subpopulation.uniqueId) } }
              />
            </div>
          :
            <div className="subpopulation__title">
              <FontAwesome fixedWidth name='angle-double-right'/>
              <h3>{ this.props.subpopulation.subpopulationName }</h3>
            </div>
          }
          <div className="button-bar">
            <button onClick={ this.state.isExpanded ? this.collapse : this.expand }>
              { this.state.isExpanded ? 'Done' : 'Edit' }
            </button>
            <button aria-label="Remove subpopulation" onClick={ () => this.props.deleteSubpopulation(this.props.subpopulation.uniqueId) }><FontAwesome fixedWidth name='times'/></button>
          </div>
        </div>
        { this.state.isExpanded ?
          <div className="subpopulation__logic">
            <ConjunctionGroup
              root={ true }
              name={ this.props.treeName }
              instance={ this.props.subpopulation }
              booleanParameters={ this.props.booleanParameters }
              createTemplateInstance={ this.props.createTemplateInstance }
              addInstance={ this.addInstance }
              editInstance={ this.editInstance }
              updateInstanceModifiers={ this.props.updateInstanceModifiers }
              deleteInstance={ this.deleteInstance }
              saveInstance={ this.saveInstance }
              getAllInstances={ this.getAllInstances }
              showPresets={ this.props.showPresets }
              categories={ this.props.categories }
              subPopulationIndex={ this.props.subpopulationIndex }
            />
          </div>
          :
          null
        }
      </div>
    )
  }
}

export default Subpopulation;
