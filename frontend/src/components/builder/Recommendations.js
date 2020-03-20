import React, { Component } from 'react';
import PropTypes from 'prop-types';
import update from 'immutability-helper';

import Recommendation from './Recommendation';
import Modal from "../elements/Modal";

const UP = -1;
const DOWN = 1;

export default class Recommendations extends Component {
  constructor(props) {
    super(props);

    this.state = {mode: 'every'};
  }

  componentDidMount() {
    if (this.props.artifact.recommendations.length === 0) {
      this.addRecommendation();
    }
  }

  handleModeChange = (event) => {
    this.setState({ mode: event.target.value });
  }

  handleMove = (uid, direction) => {
    const { recommendations } = this.props.artifact;
    const position = recommendations.findIndex(index => index.uid === uid);
    if (position < 0) {
      throw new Error("Given recommendation not found.");
    } else if (
      (direction === UP && position === 0)
      || (direction === DOWN && position === recommendations.length - 1)) {
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

        {this.props.artifact.recommendations && this.props.artifact.recommendations.map(rec => (
          <div id={rec.uid} key={rec.uid}>
            <Recommendation
              key={rec.uid}
              artifact={this.props.artifact}
              templates={this.props.templates}
              rec={rec}
              onUpdate={this.updateRecommendation}
              onRemove={() => this.openConfirmDeleteModal(rec.uid)}
              onMoveRecUp={() => this.handleMove(rec.uid, UP)}
              onMoveRecDown={() => this.handleMove(rec.uid, DOWN)}
              updateRecommendations={this.props.updateRecommendations}
              updateSubpopulations={this.props.updateSubpopulations}
              setActiveTab={this.props.setActiveTab}
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
      {this.renderConfirmDeleteModal()}
      </div>
    );
  }

  //DELETE MODAL
  openConfirmDeleteModal = (uid) => {
    this.setState({ showConfirmDeleteModal: true, reccomendationToDelete: uid });
  }

  closeConfirmDeleteModal = () => {
    this.setState({ showConfirmDeleteModal: false});
  }

  handleDeleteRecommendation = (uid) => {
    this.removeRecommendation(this.state.reccomendationToDelete);
    this.closeConfirmDeleteModal();
  }

  renderConfirmDeleteModal() {

    return (
      <Modal
        modalTitle="Delete Recommendation"
        modalId="confirm-delete-modal"
        modalTheme="light"
        modalSubmitButtonText="Delete"
        handleShowModal={this.state.showConfirmDeleteModal}
        handleCloseModal={this.closeConfirmDeleteModal}
        handleSaveModal={this.handleDeleteRecommendation}>

        <div className="delete-external-cql-library-confirmation-modal modal__content">
          <h5>Are you sure you want to permanently delete the Recommendation?</h5>
        </div>
    </Modal>
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
