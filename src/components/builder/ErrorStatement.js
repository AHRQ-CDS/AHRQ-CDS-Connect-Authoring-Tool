import React, {Component} from 'react';
import Select from 'react-select';
import FontAwesome from 'react-fontawesome';
import _ from 'lodash';


class ErrorStatement extends Component {
  constructor(props) {
    super(props)
    this.state ={
      options: this.props.booleanParameters.map(bp => {return({label: bp.name, value: bp.value})}),
      value: this.props.value || null,
    }
  }


  nestIf = () => {
    console.log("nesting the if")
  }

  addIf = () => {
    console.log("Adding another if")
  }

  render() {
    return (
      <section className="section is-clearfix recommendation">
        <div className="field is-horizontal">
          <div className="field-label is-large">
            <label className="label has-text-left">Errors</label>
          </div>
          <div className="field-body">
            <div className="field is-grouped is-grouped-right">
              <div className="control recommendation__remove">
                <button className="button" aria-label="remove recommendation"  onClick={() => {}}><FontAwesome fixedWidth name='times' /></button>
              </div>
            </div>
          </div>
        </div>
        If
        <Select
          value={this.state.value}
          options={this.state.options}
          onChange={ e => this.setState({value: e.value })}
        />
        <div className="control recommendation__remove">
          <button className="button" aria-label="remove recommendation"  onClick={this.nestIf}> Nest 'If' </button>
        </div>
        <div className="field">
          <div className="control">
            <textarea className= "textarea" name="text" aria-label="Recommendation"
            placeholder='Describe your recommendation' value={this.state.text} onChange={this.handleChange} />
          </div>
        </div>
        <div className="control recommendation__remove">
          <button className="button" aria-label="remove recommendation"  onClick={this.addIf}> Add 'If' </button>
        </div>
      </section>
    )
  }

}

export default ErrorStatement;
