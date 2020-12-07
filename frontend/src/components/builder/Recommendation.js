import React, { Component } from 'react';
import PropTypes from 'prop-types';
import update from 'immutability-helper';
import { Button, IconButton, TextField } from '@material-ui/core';
import {
  ArrowDropDown as ArrowDropDownIcon,
  ArrowDropUp as ArrowDropUpIcon,
  Close as CloseIcon
} from '@material-ui/icons';
import _ from 'lodash';

import { Dropdown } from 'components/elements';
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
      showReordering: (props.rec.length > 1)
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

  applySubpopulation = (event, subpopulationOptions) => {
    const subpop = subpopulationOptions.find(option => option.uniqueId === event.target.value);
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

    if(this.props.rec.subpopulations.length === 1){
      this.setState({showSubpopulations:false});
    }
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

  removeRationale = () => {
    this.handleChange({"target":{"name":"rationale","value":""}});
    this.handleShowRationale();
  }

  removeComment = () => {
    this.handleChange({"target":{"name":"comment","value":""}});
    this.handleShowComment();
  }

  handleShowComment = () => {
    this.setState({ showComment: !this.state.showComment });
  }

  shouldShowSubpopulations = () => Boolean(this.state.showSubpopulations || this.props.rec.subpopulations.length);

  shouldShowReorderingButtons = () => this.props.artifact.recommendations.length > 1;

  renderSubpopulations = () => {
    const subpopulationOptions = this.getRelevantSubpopulations();

    return (
      <div className="recommendation__subpopulations">
        {/* TODO: The following should have options: any/all */}
        <div className="card-element__label">If all of the following apply...</div>

        <div className="recommendation__subpopulation-pills">
          {this.props.rec.subpopulations.map((subpop, i) => (
            <div key={subpop.uniqueId} className="recommendation__subpopulation-pill">
              {subpop.subpopulationName}

              <IconButton
                aria-label={`remove ${subpop.subpopulationName}`}
                color="primary"
                onClick={() => this.removeSubpopulation(i)}
              >
                <CloseIcon fontSize="small" />
              </IconButton>
            </div>
          ))}
        </div>

        <div className="recommendation__add-subpopulation">
          <div className="recommendation__subpopulation-select">
            <Dropdown
              id="subpopulation-select"
              label="Add a subpopulation"
              onChange={event => this.applySubpopulation(event, subpopulationOptions)}
              options={subpopulationOptions}
              value=""
              valueKey="uniqueId"
              labelKey="subpopulationName"
            />
          </div>

          <Button
            color="primary"
            onClick={this.addBlankSubpopulation}
            variant="contained"
          >
            New subpopulation
          </Button>
        </div>
      </div>
    );
  }

  render() {
    return (
      <div className="recommendation card-group card-group__top">
        <div className="card-element">
          <div className="recommendation__title">
            <div className="card-element__label"></div>
            <div>
              {this.shouldShowReorderingButtons() &&
                <span>
                  <IconButton
                    aria-label="move up recommendation"
                    color="primary"
                    onClick={() => this.props.onMoveRecUp(this.props.rec.uid)}
                  >
                    <ArrowDropUpIcon fontSize="small" />
                  </IconButton>

                  <IconButton
                    aria-label="move down recommendation"
                    color="primary"
                    onClick={() => this.props.onMoveRecDown(this.props.rec.uid)}
                  >
                    <ArrowDropDownIcon fontSize="small" />
                  </IconButton>
                </span>
              }

              <IconButton
                aria-label="remove recommendation"
                color="primary"
                onClick={() => this.props.onRemove(this.props.rec.uid)}
              >
                <CloseIcon fontSize="small" />
              </IconButton>
            </div>
          </div>

          {this.shouldShowSubpopulations() && this.renderSubpopulations()}

          <div className="recommendation__title">
            <div className="card-element__label">Recommend...</div>
          </div>

          <TextField
            className="recommendation-input"
            fullWidth
            label={null}
            multiline
            onChange={this.handleChange}
            placeholder="Describe your recommendation"
            value={this.state.text}
            variant="outlined"
          />

          {this.state.showRationale &&
            <div className="recommendation__rationale">
              <div className="card-element__label">Rationale...
                <IconButton
                  aria-label="remove rationale"
                  color="primary"
                  onClick={() => this.removeRationale()}
                >
                  <CloseIcon fontSize="small" />
                </IconButton>
              </div>

              <TextField
                className="recommendation-input"
                fullWidth
                label={null}
                multiline
                onChange={this.handleChange}
                placeholder="Describe the rationale for your recommendation"
                value={this.state.rationale}
                variant="outlined"
              />
            </div>
          }

          {this.state.showComment &&
            <div className="recommendation__comment">
              <div className="card-element__label">Comment...
                <IconButton
                  aria-label="remove comment"
                  color="primary"
                  onClick={() => this.removeComment()}
                >
                  <CloseIcon fontSize="small" />
                </IconButton>
              </div>

              <TextField
                className="recommendation-input"
                fullWidth
                label={null}
                multiline
                onChange={this.handleChange}
                placeholder="Add an optional comment"
                value={this.state.comment}
                variant="outlined"
              />
            </div>
          }

          <div className="recommendation__buttons">
            {!this.state.showRationale &&
              <Button
                color="primary"
                onClick={this.handleShowRationale}
                variant="contained"
              >
                Add rationale
              </Button>
            }

            {!this.shouldShowSubpopulations() &&
              <Button
                color="primary"
                onClick={this.revealSubpopulations}
                variant="contained"
              >
                Add subpopulation
              </Button>
            }

            {!this.state.showComment &&
              <Button
                color="primary"
                onClick={this.handleShowComment}
                variant="contained"
              >
                Add comments
              </Button>
            }
          </div>
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
