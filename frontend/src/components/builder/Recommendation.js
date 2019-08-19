import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import FontAwesome from 'react-fontawesome';
import update from 'immutability-helper';
import Select from 'react-select';

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
      showSubpopulations: !!((props.rec.subpopulations && props.rec.subpopulations.length)),
      showRationale: !!props.rec.rationale.length,
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

  shouldShowSubpopulations = () => this.state.showSubpopulations || this.props.rec.subpopulations.length;

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
        <Select
          className="recommendation__subpopulation-select"
          name="recommendation__subpopulation-select"
          value="start"
          valueKey="subpopulationName"
          placeholder="Add a subpopulation"
          aria-label="Add a subpopulation"
          options={this.getRelevantSubpopulations()}
          labelKey='subpopulationName'
          onChange={this.applySubpopulation}
        />

        <a className="recommendation__new-subpopulation"
           tabIndex="0"
           role="button"
           onClick={this.addBlankSubpopulation}
           onKeyPress={(e) => {
             e.which = e.which || e.keyCode;
             if (e.which === 13) this.addBlankSubpopulation(e);
           }}>
           New subpopulation
        </a>
      </div>
    </div>
  );

  render() {
    return (
      <div className="recommendation card-group card-group__top">
        <div className="card-element">
          {this.shouldShowSubpopulations() ? this.renderSubpopulations() : null}

          <div className="recommendation__title">
            <div className="card-element__label">Recommend...</div>

            {/* <Select
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
              labelKey='recommendationGrade'
            /> */}

            {/* <button className="button" aria-label="copy recommendation">
              <FontAwesome fixedWidth name='copy' />
            </button> */}

            <button
              className="recommendation__remove transparent-button"
              aria-label="remove recommendation"
              onClick={() => this.props.onRemove(this.props.rec.uid)}>
              <FontAwesome fixedWidth name='times' />
            </button>
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
          :
            <button
              className="button primary-button recommendation__add-rationale"
              onClick={() => this.setState({ showRationale: !this.state.showRationale })}>
              Add rationale
            </button>
          }

          {this.shouldShowSubpopulations() ? null :
            <button
              className="button primary-button pull-right"
              name="subpopulation"
              onClick={this.revealSubpopulations}>
              Add subpopulation
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
