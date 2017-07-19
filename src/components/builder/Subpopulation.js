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

  getSubpopulationName = () => {
    return this.props.subpopulation.parameters[0].value || `Subpopulation ${this.props.subpopulationIndex + 1}`;
  }

  handleNameChange = (event) => {
    // TODO: Update name parameter for this subpopulation
  }

  expand = () => {
    this.setState({ isExpanded: true });
  }

  collapse = () => {
    this.setState({ isExpanded: false });
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
                value={ this.getSubpopulationName() }
                onChange={ this.handleNameChange }
              />
            </div>
          :
            <div className="subpopulation__title">
              <FontAwesome fixedWidth name='angle-double-right'/>
              <h3>{ this.getSubpopulationName() }</h3>
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
              name={
                // TODO: Updating a tree will be a bit different here since it will be a member of the
                      // subpopulations array on BuilderPage's state.
                      // Should maybe rely on UID lookup in the array rather than treename for this case,
                      // but perhaps there's a way to adapt the add/edit/delete instance
                      // functions in BuilderPage to accomdate both scenarios easily
                'TODO'
              }
              instance={
                // TODO: None of the following instance-modifying functions are going to work cause of ^ above
                this.props.subpopulation
              }
              addInstance={ this.props.addInstance }
              editInstance={ this.props.editInstance }
              deleteInstance={ this.props.deleteInstance }
              saveInstance={ this.props.saveInstance }
              getAllInstances={ this.props.getAllInstances }
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
