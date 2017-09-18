import React, { Component, PropTypes } from 'react';
import update from 'immutability-helper';
import Recommendation from './Recommendation';

class Recommendations extends Component {
  static propTypes = {
    recommendations: PropTypes.array.isRequired,
    updateRecommendations: PropTypes.func.isRequired,
    subpopulations: PropTypes.array.isRequired,
    setActiveTab: PropTypes.func.isRequired
  }

  constructor(props) {
    super(props);

    this.state = {
      mode: 'every',
    };
  }

  componentDidMount() {
    if (this.props.recommendations.length === 0) {
      this.addRecommendation();
    }
  }

  handleModeChange = (event) => {
    this.setState({ mode: event.target.value });
  }

  addRecommendation = () => {
    const newRec = {
      uid: `rec-${this.props.uniqueIdCounter}`,
      grade: 'A',
      subpopulations: [],
      text: '',
      rationale: ''
    };
    this.props.incrementUniqueIdCounter();
    const newRecs = this.props.recommendations.concat([newRec]);
    this.props.updateRecommendations({ recommendations: newRecs });
  }

  updateRecommendation = (uid, newValues) => {
    const index = this.props.recommendations.findIndex(rec => rec.uid === uid);
    const newRecs = update(this.props.recommendations, {
      [index]: { $merge: newValues }
    });
    this.props.updateRecommendations({ recommendations: newRecs });
  }

  removeRecommendation = (uid) => {
    const index = this.props.recommendations.findIndex(rec => rec.uid === uid);
    const newRecs = update(this.props.recommendations, {
      $splice: [[index, 1]]
    });
    this.props.updateRecommendations({ recommendations: newRecs });
  }

  render() {
    return (
      <div className="recommendations">
        {
          // TODO: Leaving this commented out for now in case we decide to go back to it
          /* {(this.props.recommendations && this.props.recommendations.length > 1)
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
          (this.props.recommendations && this.props.recommendations.length > 1)
          ? <p className="title is-5">Deliver first recommendation</p>
          : null
        }

        {this.props.recommendations && this.props.recommendations.map(rec => (
            <Recommendation
              key={rec.uid}
              rec={rec}
              onUpdate={this.updateRecommendation}
              onRemove={this.removeRecommendation}
              recommendations={this.props.recommendations}
              updateRecommendations={this.props.updateRecommendations}
              subpopulations={this.props.subpopulations}
              setActiveTab={this.props.setActiveTab} />
          ))}
        <button className="button" onClick={this.addRecommendation}>
          New recommendation
        </button>
      </div>
    );
  }
}

export default Recommendations;
