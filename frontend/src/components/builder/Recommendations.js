import React, { Component } from 'react';
import PropTypes from 'prop-types';
import update from 'immutability-helper';
import { Button } from '@material-ui/core';

import Recommendation from './Recommendation';
import { DeleteConfirmationModal } from 'components/modals';

const UP = -1;
const DOWN = 1;

export default class Recommendations extends Component {
  constructor(props) {
    super(props);

    this.state = {
      mode: 'every',
      showConfirmDeleteModal: false
    };
  }

  handleModeChange = event => {
    this.setState({ mode: event.target.value });
  };

  handleMove = (uid, direction) => {
    const { recommendations } = this.props.artifact;
    const position = recommendations.findIndex(index => index.uid === uid);
    if (position < 0) {
      throw new Error('Given recommendation not found.');
    } else if (
      (direction === UP && position === 0) ||
      (direction === DOWN && position === recommendations.length - 1)
    ) {
      return; // canot move outside of array
    }

    const recommendation = recommendations[position]; // save recommendation for later
    const newRecommendations = recommendations.filter(rec => rec.uid !== uid); // remove recommendation from array
    newRecommendations.splice(position + direction, 0, recommendation);

    this.props.updateRecommendations(newRecommendations);

    // will run after updated recommendatons rerender
    setTimeout(() => {
      document.getElementById(uid).scrollIntoView({ behavior: 'smooth' });
    });
  };

  addRecommendation = () => {
    const newRec = {
      uid: `rec-${+new Date()}`, // eslint-disable-line no-plusplus
      grade: 'A',
      subpopulations: [],
      text: '',
      rationale: '',
      comment: '',
      links: []
    };
    const newRecs = this.props.artifact.recommendations.concat([newRec]);

    this.props.updateRecommendations(newRecs);
  };

  updateRecommendation = (uid, newValues) => {
    const index = this.props.artifact.recommendations.findIndex(rec => rec.uid === uid);
    const newRecs = update(this.props.artifact.recommendations, {
      [index]: { $merge: newValues }
    });
    this.props.updateRecommendations(newRecs);
  };

  removeRecommendation = uid => {
    const index = this.props.artifact.recommendations.findIndex(rec => rec.uid === uid);
    const newRecs = update(this.props.artifact.recommendations, {
      $splice: [[index, 1]]
    });
    this.props.updateRecommendations(newRecs);
  };

  openConfirmDeleteModal = uid => {
    this.setState({ showConfirmDeleteModal: true, recommendationToDelete: uid });
  };

  closeConfirmDeleteModal = () => {
    this.setState({ showConfirmDeleteModal: false });
  };

  handleDeleteRecommendation = uid => {
    this.removeRecommendation(this.state.recommendationToDelete);
    this.closeConfirmDeleteModal();
  };

  render() {
    const { artifact, setActiveTab, templates, updateRecommendations, updateSubpopulations } = this.props;
    const { showConfirmDeleteModal } = this.state;

    return (
      <div className="recommendations">
        {artifact.recommendations && artifact.recommendations.length > 1 && (
          <div className="recommendations__deliver-text">Deliver first recommendation</div>
        )}

        {artifact.recommendations &&
          artifact.recommendations.map(rec => (
            <div id={rec.uid} key={rec.uid}>
              <Recommendation
                key={rec.uid}
                artifact={artifact}
                templates={templates}
                rec={rec}
                onUpdate={this.updateRecommendation}
                onRemove={() => this.openConfirmDeleteModal(rec.uid)}
                onMoveRecUp={() => this.handleMove(rec.uid, UP)}
                onMoveRecDown={() => this.handleMove(rec.uid, DOWN)}
                updateRecommendations={updateRecommendations}
                updateSubpopulations={updateSubpopulations}
                setActiveTab={setActiveTab}
              />
            </div>
          ))}

        <Button color="primary" onClick={this.addRecommendation} variant="contained">
          New recommendation
        </Button>

        {showConfirmDeleteModal && (
          <DeleteConfirmationModal
            deleteType="Recommendation"
            handleCloseModal={this.closeConfirmDeleteModal}
            handleDelete={this.handleDeleteRecommendation}
          />
        )}
      </div>
    );
  }
}

Recommendations.propTypes = {
  artifact: PropTypes.object.isRequired,
  setActiveTab: PropTypes.func.isRequired,
  templates: PropTypes.array.isRequired,
  updateRecommendations: PropTypes.func.isRequired,
  updateSubpopulations: PropTypes.func.isRequired
};
