import React, { Component } from 'react';
import PropTypes from 'prop-types';
import update from 'immutability-helper';

import Recommendation from './Recommendation';

export default class Recommendations extends Component {
  constructor(props) {
    super(props);

    this.state = {
      mode: 'every',
      //refsCollection: {},
      moved: '',
    };
    //this.refsCollection = {};
    this.refList = {};

  }

  componentDidMount() {
    if (this.props.artifact.recommendations.length === 0) {
      this.addRecommendation();
    }
  }

  componentDidUpdate() {
    if (this.props.artifact.recommendations.length > 0) {
      console.log("COMPONENT DID UPDATE!1!");
      console.log(this.state.moved);
      //this.refList[this.state.moved].focus(); //this blows up, as focus isn't a method of a ref
      document.getElementById(this.state.moved).focus(); //this gets the element. yay!  but it doesn't actually work
    }
  }

  handleModeChange = (event) => {
    this.setState({ mode: event.target.value });
  }

  addRecommendation = () => {
    const newRec = {
      uid: `rec-${+new Date()}`, // eslint-disable-line no-plusplus
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

  moveRecommendationUp = (uid) => {
    const index = this.props.artifact.recommendations.findIndex(rec=> rec.uid === uid);
    if(index > 0){
      const prev = index - 1;
      const first = this.props.artifact.recommendations[prev];
      const second = this.props.artifact.recommendations[index];
      //const newRecs = this.props.artifact.recommendations.slice(0,index);
      const newRecs = update(this.props.artifact.recommendations, {
        $splice: [[prev, 2,second,first]]
      });
      this.props.updateRecommendations(newRecs);
      var n = document.getElementById(uid);
      console.log(n.id);
    }
    //console.log("move up event fired: caught in Recommendations");
  }

  moveRecommendationDown = (uid) => {
    const index = this.props.artifact.recommendations.findIndex(rec=> rec.uid === uid);
    if(index < this.props.artifact.recommendations.length-1) {
      const next = index + 1;
      const first = this.props.artifact.recommendations[index];
      const second = this.props.artifact.recommendations[next];
      const newRecs = update(this.props.artifact.recommendations, {
        $splice: [[index, 2,second,first]]
      });
      this.setState({'moved':uid});
      this.props.updateRecommendations(newRecs);
      //const n = document.getElementById(uid);
      //const n2 = this.refList[uid].ref;
      //n.focus();
      //n2.focus();
      //console.log(n.id);
      //console.log(n2)
    }
    //console.log("move down even fired: Caught in Recommendations");
  }
  render() {
    return (
      <div className="recommendations">
        {/*
          // TODO: Leaving this commented out for now in case we decide to go back to it
          (this.props.artifact.recommendations && this.props.artifact.recommendations.length > 1) &&
          <div className="recommendations__deliver-text">
            Deliver
            <span className="field recommendations__mode">
              <span className="control">
                <span className="select">
                  <select
                    value={this.state.mode}
                    onBlur={this.handleModeChange}
                    title="Recommendation mode"
                    aria-label="Recommendation mode">
                    <option value='every'>every</option>
                    <option value='first'>first</option>
                  </select>
                </span>
              </span>
            </span>
            recommendation
          </div>
        */}

        {this.props.artifact.recommendations && this.props.artifact.recommendations.length > 1 &&
          <div className="recommendations__deliver-text">Deliver first recommendation</div>
        }

        {this.props.artifact.recommendations && this.props.artifact.recommendations.map((rec,i) => (
          <div id={rec.uid}>
            <Recommendation
              key={rec.uid}
              artifact={this.props.artifact}
              templates={this.props.templates}
              rec={rec}
              onUpdate={this.updateRecommendation}
              onRemove={this.removeRecommendation}
              onMoveRecUp={this.moveRecommendationUp}
              onMoveRecDown={this.moveRecommendationDown}
              updateRecommendations={this.props.updateRecommendations}
              updateSubpopulations={this.props.updateSubpopulations}
              setActiveTab={this.props.setActiveTab}
              ref={(el) => {this.refList[rec.uid] = el}}
            />
          </div>
        ))}

        <button
          className="button primary-button"
          aria-label="New recommendation"
          onClick={this.addRecommendation}
        >
          New recommendation
        </button>
      </div>
    );
  }
}

Recommendations.propTypes = {
  artifact: PropTypes.object.isRequired,
  templates: PropTypes.array.isRequired,
  updateRecommendations: PropTypes.func.isRequired,
  updateSubpopulations: PropTypes.func.isRequired,
  setActiveTab: PropTypes.func.isRequired
};
