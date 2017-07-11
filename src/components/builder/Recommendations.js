import React, { Component } from 'react';
import Select from 'react-select';
import FontAwesome from 'react-fontawesome';
import _ from 'lodash';

class Recommendation extends Component {
  constructor(props) {
    super(props);

    this.state = {
      grade: 'A',
      subpopulation: false,
      text: null
    }
  }

  render() {
    return (
      <section className="section is-clearfix">
        <div className="field is-horizontal">
          <div className="field-label is-large">
            <label className="label has-text-left">Recommend...</label>
          </div>
          <div className="field-body">
            <div className="field is-grouped is-grouped-right">
              <div className="control">
                <span className="select">
                  <select value={this.state.grade}>
                    <option value='A'>Grade A</option>
                    <option value='B'>Grade B</option>
                    <option value='C'>Grade C</option>
                  </select>
                </span>
              </div>
              <div className="control">
                <button className="button"><FontAwesome fixedWidth name='copy' /></button>
              </div>
              <div className="control">
                <button className="button"><FontAwesome fixedWidth name='times' /></button>
              </div>
            </div>
          </div>
        </div>
        <div className="field">
          <div className="control">
            <textarea className="textarea" placeholder="Textarea" value={this.state.text}></textarea>
          </div>
        </div>
        <button className="button is-pulled-right">Add sub-population</button>
      </section>
    )
  }
}


class Recommendations extends Component {
  constructor(props) {
    super(props);

    this.state = {
      recommendations: []
    };
  }

  addRecommendation() {
    const newRec = {
      grade: 'A',
      subpopulation: false,
      text: null
    }

    this.setState({
      recommendations: this.state.recommendations.concat(newRec)
    })
  }

  render() {
    return (
      <div>
        <h2 className="title is-2">
          Deliver
          <span className="field">
            <span className="control">
              <span className="select">
                <select>
                  <option>every</option>
                  <option>first</option>
                </select>
              </span>
            </span>
          </span>
          recommendation
        </h2>
        {this.state.recommendations && this.state.recommendations.map((rec, index) => {
          return <Recommendation key={index} rec={rec}/>
        })}
        <button className="button" onClick={() => this.addRecommendation()}>Add Recommendation</button>
      </div>
    );
  }
}

export default Recommendations;
