import React, { Component, PropTypes } from 'react';
import _ from 'lodash';
import FontAwesome from 'react-fontawesome';
import update from 'immutability-helper';
import Select from 'react-select';

const subpopTabIndex = 3;

class Recommendation extends Component {
  static propTypes = {
    rec: PropTypes.object.isRequired,
    onUpdate: PropTypes.func.isRequired,
    onRemove: PropTypes.func.isRequired,
    recommendations: PropTypes.array.isRequired,
    updateRecommendations: PropTypes.func.isRequired,
    subpopulations: PropTypes.array.isRequired,
    setActiveTab: PropTypes.func.isRequired
  };

  constructor(props) {
    super(props);

    this.state = {
      uid: props.rec.uid,
      grade: props.rec.grade,
      text: props.rec.text,
      rationale: props.rec.rationale,
      showSubpopulations: (props.rec.subpopulations && props.rec.subpopulations.length) ? true : false,
      showRationale: props.rec.rationale.length ? true : false,
    }
  }

  revealSubpopulations = () => {
    this.setState({ showSubpopulations: true });
  }

  applySubpopulation = (subpop) => {
    let refSubpop = {
      uniqueId: subpop.uniqueId,
      subpopulationName: subpop.subpopulationName
    }
    if (subpop.special) {
      refSubpop.special = subpop.special;
      refSubpop.special_subpopulationName = subpop.special_subpopulationName;
    }
    const index = this.props.recommendations.findIndex(rec => rec.uid === this.state.uid);
    let newRecs = update(this.props.recommendations, {
      [index]: {
        subpopulations: { $push: [refSubpop] }
      }
    });

    this.props.updateRecommendations({ recommendations: newRecs });
  }

  removeSubpopulation = (i) => {
    const recIndex = this.props.recommendations.findIndex(rec => rec.uid === this.state.uid);
    let newRecs = update(this.props.recommendations, {
      [recIndex]: {
        subpopulations: { $splice: [[i, 1]] }
      }
    });

    this.props.updateRecommendations({ recommendations: newRecs });
  }

  getRelevantSubpopulations = () => {
    return this.props.subpopulations.filter(sp => {
      let match = false;
      _.each(this.props.rec.subpopulations, appliedSp => {
        if (sp.uniqueId === appliedSp.uniqueId) {
          match = true;
        }
      });
      return !match;
    });
  }

  handleChange = (event) => {
    const newValues = { [event.target.name]: event.target.value };
    this.props.onUpdate(this.state.uid, newValues);
    const newState = update(this.state, {
      $merge: newValues
    });
    this.setState(newState);
  }

  shouldShowSubpopulations = () => {
    return this.state.showSubpopulations || this.props.rec.subpopulations.length;
  }

  renderSubpopulations = () => {
    if (this.shouldShowSubpopulations()) {
      return (
        <div className="recommendation__subpopulations">
          <div className="field is-horizontal">
            <div className="field-label is-large">
              {
                // TODO: The following should to be options between somethign like
                //       'all' of the following and 'any' of the following
              }
              <label className="label has-text-left">If all of the following apply...</label>
            </div>
          </div>
          <div className="recommendation__subpopulation-pills">
            { this.props.rec.subpopulations.map((subpop, i) => {
              return (
                <div
                  key={subpop.uniqueId}
                  className="recommendation__subpopulation-pill">
                  { subpop.subpopulationName }
                  <button aria-label={`Remove ${subpop.subpopulationName}`} onClick={ () => this.removeSubpopulation(i) }><FontAwesome fixedWidth name='times'/></button>
                </div>
              );
            }) }
          </div>
          <div className="recommendation__add-subpopulation">
            <Select
              className="recommendation__subpopulation-select"
              name="recommendation__subpopulation-select"
              value="start"
              placeholder={ 'Add a subpopulation' }
              aria-label={ 'Add a subpopulation' }
              clearable={ false }
              options={ this.getRelevantSubpopulations() }
              labelKey='subpopulationName'
              onChange={ this.applySubpopulation }
            />
            {
              // TODO: This should link to the subpopulations tab
            }
            <a className="recommendation__new-subpopulation"
               onClick={() => this.props.setActiveTab(subpopTabIndex, 'addBlankSubpopulation')}>
               New subpopulation
            </a>
          </div>
        </div>
      );
    } else {
      return null;
    }
  }

  render() {
    return (
      <section className="section is-clearfix recommendation">
        { this.renderSubpopulations() }
        <div className="field is-horizontal">
          <div className="field-label is-large">
            <label className="label has-text-left">Recommend...</label>
          </div>
          <div className="field-body">
            <div className="field is-grouped is-grouped-right">
              {/* <div className="control">
                <span className="select">
                  <select name="grade" aria-label="Recommendation grade" title="Recommendation grade" value={this.state.grade} onChange={this.handleChange}>
                    <option value='A'>Grade A</option>
                    <option value='B'>Grade B</option>
                    <option value='C'>Grade C</option>
                  </select>
                </span>
              </div>
              <div className="control">
                <button className="button" aria-label="copy recommendation"><FontAwesome fixedWidth name='copy' /></button>
              </div> */}
              <div className="control recommendation__remove">
                <button className="button" aria-label="remove recommendation"  onClick={() => this.props.onRemove(this.props.id)}><FontAwesome fixedWidth name='times' /></button>
              </div>
            </div>
          </div>
        </div>
        <div className="field">
          <div className="control">
            <textarea className="textarea" name="text" aria-label="Recommendation" title="Recommendation text"
            placeholder='Describe your recommendation' value={this.state.text} onChange={this.handleChange} />
          </div>
        </div>
        {
          this.state.showRationale ?
            <div className="field">
              <div className="field-label is-large">
                <label className="label has-text-left">Rationale...</label>
              </div>
              <div className="control">
                <textarea className="textarea" name="rationale" aria-label="Rationale" title="Rationale text"
                placeholder='Describe the rationale for your recommendation' value={this.state.rationale} onChange={this.handleChange} />
              </div>
            </div>
          :
            <button className="button" onClick={() => this.setState({ showRationale: !this.state.showRationale })}>Add rationale</button>
        }
        { this.shouldShowSubpopulations() ? null : <button className="button is-pulled-right" name="subpopulation" onClick={this.revealSubpopulations}>Add subpopulation</button> }
      </section>
    )
  }
}

export default Recommendation;
