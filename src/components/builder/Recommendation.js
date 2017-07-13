import React, { Component } from 'react';
import _ from 'lodash';
import FontAwesome from 'react-fontawesome';
import update from 'immutability-helper';
import ElementSelect from './ElementSelect';
import createTemplateInstance from './TemplateInstance';

class Recommendation extends Component {
  constructor(props) {
    super(props);

    this.state = {
      uid: props.rec.uid,
      grade: props.rec.grade,
      subpopulations: props.rec.subpopulations,
      text: props.rec.text
    }
  }

  addSubPopulation = () => {
    const newSubPop = {
      uid: _.uniqueId("sub-population-"),
      something: "else"
    }

    let newSubPops = update(this.state.subpopulations, {
      $push: [newSubPop]
    });
    this.setState({ subpopulations: newSubPops });
  }

  addSubPopElement = (template) => {
    let instance = createTemplateInstance(template);
    this.props.addInstance(this.props.name, instance, this.getPath());
  }

  handleChange = (event) => {
    const newValues = { [event.target.name]: event.target.value };
    this.props.onUpdate(this.state.uid, newValues);
    const newState = update(this.state, {
      $merge: newValues
    });
    this.setState(newState);
  }

  render() {
    return (
      <section className="section is-clearfix recommendation">
        <div className="field is-horizontal">
          <div className="field-label is-large">
            <label className="label has-text-left">Recommend...</label>
          </div>
          <div className="field-body">
            <div className="field is-grouped is-grouped-right">
              <div className="control">
                <span className="select">
                  <select name="grade" aria-label="Recommendation grade" value={this.state.grade} onChange={this.handleChange}>
                    <option value='A'>Grade A</option>
                    <option value='B'>Grade B</option>
                    <option value='C'>Grade C</option>
                  </select>
                </span>
              </div>
              <div className="control">
                <button className="button" aria-label="copy recommendation"><FontAwesome fixedWidth name='copy' /></button>
              </div>
              <div className="control recommendation__remove">
                <button className="button" aria-label="remove recommendation"  onClick={() => this.props.onRemove(this.props.id)}><FontAwesome fixedWidth name='times' /></button>
              </div>
            </div>
          </div>
        </div>
        {this.state.subpopulations && this.state.subpopulations.map((subpop) => {
          return (
            <div key={subpop.uid} className="field">
              <ElementSelect
                 categories={this.props.categories}
                 onSuggestionSelected={this.addSubPopElement}
                 />
            </div>
          );
        })}
        <div className="field">
          <div className="control">
            <textarea className="textarea" name="text" aria-label="Recommendation"
            placeholder='Describe your recommendation' value={this.state.text} onChange={this.handleChange} />
          </div>
        </div>
        <button className="button is-pulled-right" name="subpopulation" onClick={this.addSubPopulation}>Add sub-population</button>
      </section>
    )
  }
}

export default Recommendation;
