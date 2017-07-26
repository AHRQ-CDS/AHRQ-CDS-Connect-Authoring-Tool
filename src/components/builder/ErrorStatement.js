import React, {Component} from 'react';
import Select from 'react-select';
import FontAwesome from 'react-fontawesome';
import _ from 'lodash';


class ErrorStatement extends Component {
  constructor(props) {
    super(props)
    this.state ={
    }
  }

  options = () => {
    let dropdown = [{label: 'Recommendations is null', value:'"Recommendations" is null'}];
    let params = this.props.booleanParameters.map(p => {return({label: p.name, value: p.value})});
    return dropdown.concat(params);
  }


  nestIf = () => {
    console.log("nesting the if")
  }

  addStatement = (parent) => {
    const newStatement = {
      parent: parent,
      condition: null,
      block: '',
      child: null
    };
    const newErrorStatement = _.cloneDeep(this.props.errorStatement);
    if (parent == null) {
      newErrorStatement.statements.push(newStatement)
    };
    this.props.updateParentState({errorStatement: newErrorStatement})
  }

  setStatement = (value, parent, index, type) => {
    const newErrorStatement = _.cloneDeep(this.props.errorStatement);
    if (parent == null) {
      newErrorStatement.statements[index][type] = value;
    }
    this.props.updateParentState({errorStatement: newErrorStatement})
  }

  renderCondition = (statement, index) => {
    const parent = statement.parent;
    const level = parent ? parent : -1
    return (<Select
      key={`condition-${level}-${index}`}
      index={index}
      value={statement.condition}
      options={this.options()}
      onChange={ e => this.setStatement(e, parent, index, 'condition')}
    />)
  }

  renderBlock = (statement, index) => {
    return (
      <div className="field">
        <div className="control">
          <textarea 
            className="textarea"
            name="text"
            aria-label="Block"
            placeholder='Describe your error'
            value={statement.block}
            onChange={e => this.setStatement(e.target.value, statement.parent, index, 'block')} />
        </div>
      </div>
    )
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
        { this.props.errorStatement && this.props.errorStatement.statements.map((statement, i) => {
          let ifLabel = i ? 'Else if' : 'If';
          return (
            <div key={i}>
              {ifLabel}: {this.renderCondition(statement, i)}
              Block: {this.renderBlock(statement, i)}
            </div>)
        })}
        <div className="control recommendation__remove">
          <button className="button" aria-label="remove recommendation"  onClick={this.nestIf}> Nest 'If' </button>
        </div>
        
        <div className="control recommendation__remove">
          <button 
            className="button"
            aria-label="remove recommendation" 
            onClick={e => this.addStatement(null)}> Add 'If' </button>
        </div>
      </section>
    )
  }

}

export default ErrorStatement;
