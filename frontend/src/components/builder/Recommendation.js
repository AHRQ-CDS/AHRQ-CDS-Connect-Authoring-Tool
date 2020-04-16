import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import FontAwesome from 'react-fontawesome';
import update from 'immutability-helper';

import StyledSelect from '../elements/StyledSelect';

import createTemplateInstance from '../../utils/templates';

/* eslint-disable jsx-a11y/label-has-for */
/* eslint-disable jsx-a11y/anchor-is-valid */

const subpopTabIndex = 2;

export default class Recommendation extends Component {
  constructor(props) {
    super(props);

    this.state = {
      uid: props.rec.uid,
      grade: props.rec.grade,
      text: props.rec.text,
      rationale: props.rec.rationale,
      comment: props.rec.comment,
      showSubpopulations: !!((props.rec.subpopulations && props.rec.subpopulations.length)),
      showRationale: !!props.rec.rationale.length,
      showComment: !!((props.rec.comment && props.rec.comment.length)),
      showReordering: (props.rec.length > 1),
    };
  }

  addBlankSubpopulation = (event) => {
    event.preventDefault();

    const operations = this.props.templates.find(template => template.name === 'Operations');
    const andTemplate = operations.entries.find(entry => entry.name === 'And');
    const newSubpopulation = createTemplateInstance(andTemplate);

    newSubpopulation.name = '';
    newSubpopulation.path = '';

    const numOfSpecialSubpopulations = this.props.artifact.subpopulations.filter(sp => sp.special).length;
    const subPopNumber = (this.props.artifact.subpopulations.length + 1) - numOfSpecialSubpopulations;
    newSubpopulation.subpopulationName = `Subpopulation ${subPopNumber}`;
    newSubpopulation.expanded = true;
    const newSubpopulations = this.props.artifact.subpopulations.concat([newSubpopulation]);

    this.props.updateSubpopulations(newSubpopulations);
    this.props.setActiveTab(subpopTabIndex);
  }

  revealSubpopulations = () => {
    this.setState({ showSubpopulations: true });
  }

  applySubpopulation = (subpop) => {
    const refSubpop = {
      uniqueId: subpop.uniqueId,
      subpopulationName: subpop.subpopulationName
    };

    if (subpop.special) {
      refSubpop.special = subpop.special;
      refSubpop.special_subpopulationName = subpop.special_subpopulationName;
    }

    const index = this.props.artifact.recommendations.findIndex(rec => rec.uid === this.state.uid);
    const newRecs = update(this.props.artifact.recommendations, {
      [index]: {
        subpopulations: { $push: [refSubpop] }
      }
    });

    this.props.updateRecommendations(newRecs);
  }

  removeSubpopulation = (i) => {
    const recIndex = this.props.artifact.recommendations.findIndex(rec => rec.uid === this.state.uid);
    const newRecs = update(this.props.artifact.recommendations, {
      [recIndex]: {
        subpopulations: { $splice: [[i, 1]] }
      }
    });

    this.props.updateRecommendations(newRecs);
  }

  getRelevantSubpopulations = () => this.props.artifact.subpopulations.filter((sp) => {
    let match = false;

    _.each(this.props.rec.subpopulations, (appliedSp) => {
      if (sp.uniqueId === appliedSp.uniqueId) {
        match = true;
      }
    });

    return !match;
  })

  handleChange = (event) => {
    const newValues = { [event.target.name]: event.target.value };
    this.props.onUpdate(this.state.uid, newValues);
    const newState = update(this.state, {
      $merge: newValues
    });

    this.setState(newState);
  }

  handleShowRationale = () => {
    this.setState({ showRationale: !this.state.showRationale });
  }

  handleShowComment = () => {
    this.setState({ showComment: !this.state.showComment });
  }

  shouldShowSubpopulations = () => this.state.showSubpopulations || this.props.rec.subpopulations.length;

  shouldShowReorderingButtons = () => this.props.artifact.recommendations.length > 1;

  renderSubpopulations = () => (
    <div className="recommendation__subpopulations">
      {/* TODO: The following should have options: any/all */}
      <div className="card-element__label">If all of the following apply...</div>

      <div className="recommendation__subpopulation-pills">
        {this.props.rec.subpopulations.map((subpop, i) => (
          <div key={subpop.uniqueId} className="recommendation__subpopulation-pill">
            {subpop.subpopulationName}

            <button
              className="transparent-button"
              aria-label={`Remove ${subpop.subpopulationName}`}
              onClick={() => this.removeSubpopulation(i)}>
              <FontAwesome fixedWidth name='times'/>
            </button>
          </div>
        ))}
      </div>

      <div className="recommendation__add-subpopulation">
        <StyledSelect
          className="recommendation__subpopulation-select"
          classNamePrefix="subpopulation-select"
          name="recommendation__subpopulation-select"
          value="start"
          placeholder="Add a subpopulation"
          aria-label="Add a subpopulation"
          options={this.getRelevantSubpopulations()}
          onChange={this.applySubpopulation}
          getOptionValue={({ subpopulationName }) => subpopulationName}
          getOptionLabel={({ subpopulationName }) => subpopulationName}
        />

        <a
          className="recommendation__new-subpopulation"
          aria-label="New subpopulation"
          tabIndex="0"
          role="button"
          onClick={this.addBlankSubpopulation}
          onKeyPress={(e) => {
            e.which = e.which || e.keyCode;
            if (e.which === 13) this.addBlankSubpopulation(e);
          }}
        >
          New subpopulation
        </a>
      </div>
    </div>
  );

  render() {
    return (
      <div className="recommendation card-group card-group__top">
        <div className="card-element">
          <div className="recommendation__title">
            <div className="card-element__label"></div>
            <div>
              {this.shouldShowReorderingButtons() ?
                <span>
                <button
                  className="recommendation__move transparent-button"
                  aria-label="Move Recommendation Up"
                  title="Move Recommendation Up"
                  onClick={() => this.props.onMoveRecUp(this.props.rec.uid)}>
                  <FontAwesome fixedWidth name='caret-up'/>
                </button>
                <button
                  className="recommendation__move transparent-button"
                  aria-label="Move Recommendation Down"
                  title="Move Recommendation Down"
                  onClick={() => this.props.onMoveRecDown(this.props.rec.uid)}>
                  <FontAwesome fixedWidth name='caret-down'/>
                </button>
                </span>
              :null}
              <button
                className="recommendation__remove transparent-button"
                aria-label="remove recommendation"
                title="Remove Recommendation"
                onClick={() => this.props.onRemove(this.props.rec.uid)}>
                <FontAwesome fixedWidth name='times' />
              </button>
            </div>
          </div>
          {this.shouldShowSubpopulations() ? this.renderSubpopulations() : null}

          <div className="recommendation__title">
            <div className="card-element__label">Recommend...</div>

            {/* <StyledSelect
              className="recommendation__grade"
              name="recommendation__grade"
              aria-label="Recommendation Grade"
              title="Recommendation Grade"
              placeholder="Choose grade"
              value={this.state.grade}
              onChange={this.handleChange}
              options={[
                { value: 'A', label: 'Grade A' },
                { value: 'B', label: 'Grade B' },
                { value: 'C', label: 'Grade C' }
              ]}
              getOptionLabel={({recommendationGrade}) => recommendationGrade}
            /> */}

            {/* <button className="button" aria-label="copy recommendation">
              <FontAwesome fixedWidth name='copy' />
            </button> */}

          </div>

          <textarea
            className="card-element__textarea"
            name="text"
            aria-label="Recommendation"
            title="Recommendation text"
            placeholder='Describe your recommendation'
            value={this.state.text}
            onChange={this.handleChange}
          />

          {this.state.showRationale ?
            <div className="recommendation__rationale">
              <div className="card-element__label">Rationale...</div>

              <textarea
                className="card-element__textarea"
                name="rationale"
                aria-label="Rationale"
                title="Rationale text"
                placeholder='Describe the rationale for your recommendation'
                value={this.state.rationale}
                onChange={this.handleChange}
              />
            </div>
          :null}

          {this.state.showComment ?
            <div className="recommendation__comment">
              <div className="card-element__label">Comment...</div>
                <textarea
                  className="card-element__textarea"
                  name="comment"
                  aria-label="Comment"
                  title="Comment text"
                  placeholder="Add an optional comment"
                  value={this.state.comment}
                  onChange={this.handleChange}
                />
            </div>
          : null}

          {!this.state.showRationale &&
            <button
              className="button primary-button recommendation__add-rationale"
              aria-label="Add rationale"
              onClick={this.handleShowRationale}>
              Add rationale
            </button>
          }

          {!this.shouldShowSubpopulations() &&
            <button
              className="button primary-button"
              aria-label="Add subpopulation"
              name="subpopulation"
              onClick={this.revealSubpopulations}>
              Add subpopulation
            </button>
          }

          {!this.state.showComment &&
            <button
              className="button primary-button"
              aria-label="Add Comments"
              name="comments"
              onClick={this.handleShowComment}>
              Add Comments
            </button>
          }

        </div>
      </div>
    );
  }
}

Recommendation.propTypes = {
  artifact: PropTypes.object.isRequired,
  templates: PropTypes.array.isRequired,
  rec: PropTypes.object.isRequired,
  onUpdate: PropTypes.func.isRequired,
  onRemove: PropTypes.func.isRequired,
  updateRecommendations: PropTypes.func.isRequired,
  setActiveTab: PropTypes.func.isRequired
};
