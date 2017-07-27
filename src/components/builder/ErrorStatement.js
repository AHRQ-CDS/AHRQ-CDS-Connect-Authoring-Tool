import React, {Component} from 'react';
import Select from 'react-select';
import FontAwesome from 'react-fontawesome';
import _ from 'lodash';


class ErrorStatement extends Component {
  constructor(props) {
    super(props)
  }

  // Ensures there is at least one statement to start
  componentWillMount = () => {
    const statements = this.props.errorStatement.statements;
    if (statements.length < 1) {
      this.addStatement(null);
    }
  }

  // Prepopulates dropdown with recommendation is null and then adds bool params
  options = () => {
    const dropdown = [{label: 'Recommendations is null', value:'"Recommendations" is null'}];
    const params = this.props.booleanParameters.map(p => {return({label: p.name, value: p.value})});
    const subpops = this.props.subpopulations.map(s => {return({label: s.subpopulationName, value: s.subpopulationName})});
    return dropdown.concat(params).concat(subpops);
  }

  // Generic statement used to handle if then
  baseStatement = (parent) => {
    return {
      parent: parent,
      condition: null,
      thenClause: '',
      child: null,
      useThenClause: true
    };
  }

  // Child object when doing single layer nesting
  baseChild = (parent) => {
    return {
      statements: [
        {
          parent: parent,
          condition: null,
          thenClause: '',
          child: null,
          useThenClause: true
        }
      ],
      elseClause: 'null'
    }
  }

  addStatement = (parent) => {
    const newStatement = this.baseStatement(parent)
    const newErrorStatement = _.cloneDeep(this.props.errorStatement);
    const statements = newErrorStatement.statements;
    if (parent == null) {
      statements.push(newStatement);
    } else {
      statements[parent].child.statements.push(newStatement);
    }
    this.props.updateParentState({errorStatement: newErrorStatement});
  }

  setStatement = (value, parent, index, type) => {
    const newErrorStatement = _.cloneDeep(this.props.errorStatement);
    const statements = newErrorStatement.statements;
    if (parent == null) {
      statements[index][type] = value;
    } else {
      statements[parent].child.statements[index][type] = value;
    }
    this.props.updateParentState({errorStatement: newErrorStatement});
  }

  setElse = (value, parent) => {
    const newErrorStatement = _.cloneDeep(this.props.errorStatement);
    if (parent == null) {
      newErrorStatement.elseClause = value;
    } else {
      newErrorStatement.statements[parent].child.elseClause = value
    }
    this.props.updateParentState({errorStatement: newErrorStatement});
  }

  renderCondition = (statement, index) => {
    return (<Select
      key={`condition-${statement.parent ? statement.parent : -1}-${index}`}
      index={index}
      value={statement.condition}
      options={this.options()}
      onChange={ e => this.setStatement(e, statement.parent, index, 'condition')}
    />)
  }

  renderThen = (statement, index) => {
    return (
      <div className="field">
        <div className="control">
          Then:
          <textarea 
            className="textarea"
            name="text"
            aria-label="ThenClause"
            placeholder='Describe your error'
            value={statement.thenClause}
            onChange={e => this.setStatement(e.target.value, statement.parent, index, 'thenClause')} />
        </div>
      </div>
    )
  }

  renderChildren = (statement, parent) => {
    return (
      <div>
        { statement.child && statement.child.statements.map((cStatement, i) => {
          let ifLabel = i ? 'Else if' : 'If';
          return (
            <div key={i}>
              {ifLabel}: {this.renderCondition(cStatement, i)}
              {this.renderThen(cStatement, i)}
            </div>)
        })}
        { this.renderAddIfButton(parent) }
        Else:
        { this.renderElse(parent) }
      </div>
    )
  }

  handleUseThenClause = (parent) => {
    const newErrorStatement = _.cloneDeep(this.props.errorStatement);
    const statement = newErrorStatement.statements[parent];
    if (statement.child == null) {
      const newChild = this.baseChild(parent);
      statement.child = newChild;
    }
    statement.useThenClause = !statement.useThenClause;
    this.props.updateParentState({errorStatement: newErrorStatement});
  }

  renderNestingButton = (statement, index) => {
    return (
      <div className="control recommendation__remove">
        <button 
          className="button"
          aria-label="remove recommendation"
          onClick={e => this.handleUseThenClause(index)}>
          {this.props.errorStatement.statements[index].useThenClause ? 'Use Nested If' : 'No Nested If'}
        </button>
      </div>)
  }

  renderAddIfButton = (parent) => {
    return (
      <div className="control recommendation__remove">
        <button 
          className="button"
          aria-label="remove recommendation" 
          onClick={e => this.addStatement(parent)}> Add If Clause </button>
      </div>
    )
  }

  renderElse = (parent) => {
    let elseText = '';
    if (parent == null) {
      elseText = this.props.errorStatement.elseClause;
    } else {
      elseText = this.props.errorStatement.statements[parent].child.elseClause;
    }
    return (
      <div className="field">
        <div className="control">
          <textarea 
            className="textarea"
            name="text"
            aria-label="Else"
            placeholder='If none of the conditions hold...'
            value={elseText}
            onChange={e => this.setElse(e.target.value, parent)} />
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
              {this.renderNestingButton(statement, i)}
              {statement.useThenClause
              ? this.renderThen(statement, i)
              : this.renderChildren(statement, i)}
            </div>)
        })}        
        { this.renderAddIfButton(null) }
        Else:
        { this.renderElse(null) }
      </section>
    )
  }

}

export default ErrorStatement;
