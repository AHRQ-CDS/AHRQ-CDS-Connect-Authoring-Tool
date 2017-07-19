import React, { Component } from 'react';
import _ from 'lodash';
import FontAwesome from 'react-fontawesome';

import ConjunctionGroup from './ConjunctionGroup';

class Subpopulation extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isExpanded: false
    };
  }

  expand = () => {
    this.setState({ isExpanded: true });
  }

  collapse = () => {
    this.setState({ isExpanded: false });
  }

  addInstance = (name, template, path) => {
    this.props.addInstance(name, template, path, this.props.id)
  }

  getAllInstances = (name) => {
    return this.props.getAllInstances(name, null, this.props.id);
  }

  editInstance = (treeName, params, path, editingConjunction) => {
    this.props.editInstance(treeName, params, path, editingConjunction, this.props.id);
  }

  deleteInstance = (treeName, path) => {
    this.props.deleteInstance(treeName, path, this.props.id);
  }

  saveInstance = (treeName, path) => {
    this.props.saveInstance(treeName, path, this.props.id);
  }

  render() {
    return (
      <div className="subpopulation">
        <div className="subpopulation__header">
          { this.state.isExpanded ?
            <div className="subpopulation__title">
              <FontAwesome fixedWidth name='angle-double-down'/>
              <input
                type="text"
                value={ this.props.getSubpopulationName(this.props.subpopulationIndex) }
                onChange={ event => { this.props.setSubpopulationName(event, this.props.subpopulationIndex) } }
              />
            </div>
          :
            <div className="subpopulation__title">
              <FontAwesome fixedWidth name='angle-double-right'/>
              <h3>{ this.props.getSubpopulationName(this.props.subpopulationIndex) }</h3>
            </div>
          }
          <div className="button-bar">
            <button onClick={ this.state.isExpanded ? this.collapse : this.expand }>
              { this.state.isExpanded ? 'Done' : 'Edit' }
            </button>
            <button onClick={ () => this.props.deleteSubpopulation(this.props.subpopulation.uniqueId) }><FontAwesome fixedWidth name='times'/></button>
          </div>
        </div>
        { this.state.isExpanded ?
          <div className="subpopulation__logic">
            <ConjunctionGroup
              root={ true }
              name={ this.props.treeName }
              instance={
                // TODO: None of the following instance-modifying functions are going to work cause of ^ above
                this.props.subpopulation
              }
              addInstance={ this.addInstance }
              editInstance={ this.editInstance }
              deleteInstance={ this.deleteInstance }
              saveInstance={ this.saveInstance }
              getAllInstances={ this.getAllInstances }
              showPresets={ this.props.showPresets }
              categories={ this.props.categories }
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
