import React, { Component } from 'react';
import _ from 'lodash';
import update from 'immutability-helper';
import Recommendation from './Recommendation';

class Recommendations extends Component {
  constructor(props) {
    super(props);

    this.state = {
      mode: 'every',
      recommendations: []
    };
  }

  componentDidMount() {
    // TODO: Get the current recommendations of this artifact.
    // Use those to populate the initial state.
    this.addRecommendation(); // add initial rec
  }

  handleModeChange = (event) => {
    this.setState({ mode: event.target.value })
  }

  addRecommendation = () => {
    const newRec = {
      uid: _.uniqueId("rec-"),
      grade: 'A',
      subpopulations: [],
      text: ''
    }

    let newRecs = update(this.state.recommendations, {
      $push: [newRec]
    });
    this.setState({ recommendations: newRecs });
  }

  updateRecommendation = (uid, newValues) => {
    const index = this.state.recommendations.findIndex((rec) => rec.uid == uid);
    let newRecs = update(this.state.recommendations, {
      [index]: { $merge: newValues }
    });
    this.setState({ recommendations: newRecs });
  }

  removeRecommendation = (uid) => {
    const index = this.state.recommendations.findIndex((rec) => rec.uid == uid);
    let newRecs = update(this.state.recommendations, {
      $splice: [[index, 1]]
    });
    this.setState({ recommendations: newRecs });
  }

  render() {
    return (
      <div className="recommendations">
        {(this.state.recommendations.length > 1)
          ? <p className="title is-5">
              Deliver
              <span className="field recommendations__mode">
               <span className="control">
                 <span className="select">
                   <select value={this.state.mode} onChange={this.handleModeChange} aria-label="Recommendation mode">
                     <option value='every'>every</option>
                     <option value='first'>first</option>
                   </select>
                 </span>
               </span>
              </span>
              recommendation
            </p>
          : null
        }

        {this.state.recommendations && this.state.recommendations.map((rec) => {
          return (
            <Recommendation
              key={rec.uid}
              id={rec.uid}
              rec={rec}
              categories={this.props.categories}
              onUpdate={this.updateRecommendation}
              onRemove={this.removeRecommendation} />
          );
        })}
        <button className="button" onClick={this.addRecommendation}>
          Add new recommendation
        </button>
      </div>
    );
  }
}

export default Recommendations;
