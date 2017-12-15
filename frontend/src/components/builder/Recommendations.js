import React, { Component } from 'react';
import PropTypes from 'prop-types';
import update from 'immutability-helper';
import Recommendation from './Recommendation';

let uniqueIdCounter = 0;

export default class Recommendations extends Component {
  static propTypes = {
    artifact: PropTypes.object.isRequired,
    templates: PropTypes.array.isRequired,
    updateRecommendations: PropTypes.func.isRequired,
    updateSubpopulations: PropTypes.func.isRequired,
    setActiveTab: PropTypes.func.isRequired
  }

  constructor(props) {
    super(props);

    this.state = {
      mode: 'every',
    };
  }

  componentDidMount() {
    if (this.props.artifact.recommendations.length === 0) {
      this.addRecommendation();
    }
  }

  handleModeChange = (event) => {
    this.setState({ mode: event.target.value });
  }

  addRecommendation = () => {
    const newRec = {
      uid: `rec-${++uniqueIdCounter}`, // eslint-disable-line no-plusplus
      grade: 'A',
      subpopulations: [],
      text: '',
      rationale: ''
    };
    const newRecs = this.props.artifact.recommendations.concat([newRec]);
    this.props.updateRecommendations(newRecs);
  }

  updateRecommendation = (uid, newValues) => {
    const index = this.props.artifact.recommendations.findIndex(rec => rec.uid === uid);
    const newRecs = update(this.props.artifact.recommendations, {
      [index]: { $merge: newValues }
    });
    this.props.updateRecommendations(newRecs);
  }

  removeRecommendation = (uid) => {
    const index = this.props.artifact.recommendations.findIndex(rec => rec.uid === uid);
    const newRecs = update(this.props.artifact.recommendations, {
      $splice: [[index, 1]]
    });
    this.props.updateRecommendations(newRecs);
  }

  render() {
    return (
      <div className="recommendations">
        {
          // TODO: Leaving this commented out for now in case we decide to go back to it
          /* {(this.props.artifact.recommendations && this.props.artifact.recommendations.length > 1)
          ? <p className="title is-5">
              Deliver
              <span className="field recommendations__mode">
               <span className="control">
                 <span className="select">
                   <select value={this.state.mode} onChange={this.handleModeChange} title="Recommendation mode"
                           aria-label="Recommendation mode">
                     <option value='every'>every</option>
                     <option value='first'>first</option>
                   </select>
                 </span>
               </span>
              </span>
              recommendation
            </p>
          : null
        } */}

        {
          (this.props.artifact.recommendations && this.props.artifact.recommendations.length > 1)
          ? <p className="title is-5">Deliver first recommendation</p>
          : null
        }

        {this.props.artifact.recommendations && this.props.artifact.recommendations.map(rec => (
            <Recommendation
              key={rec.uid}
              artifact={this.props.artifact}
              templates={this.props.templates}
              rec={rec}
              onUpdate={this.updateRecommendation}
              onRemove={this.removeRecommendation}
              updateRecommendations={this.props.updateRecommendations}
              updateSubpopulations={this.props.updateSubpopulations}
              setActiveTab={this.props.setActiveTab} />
          ))}
        <button className="button primary-button" onClick={this.addRecommendation}>
          New recommendation
        </button>
      </div>
    );
  }
}
