import React, { Component } from 'react';
import Select from 'react-select';
import _ from 'lodash';
import FontAwesome from 'react-fontawesome';

// Checks if there is an existing returnType in any of the select options
function checkArrayTypeExists(array, option) {
  for (let i in array) {
    let item = array[i][option];
    if (item != null && item.returnType != null) {
      return false;
    }
  }
  return true;
}

class CaseParameter extends Component {
  constructor(props) {
    super(props)

    const defaultOptions = this.props.values.filter(v => v.returnType != null);
    this.state = {
      id : _.uniqueId('parameter-'),
      defaultOptions : defaultOptions,
      filteredOptions : {
        case : defaultOptions,
        result : defaultOptions
      },
      default : this.props.param.value.default
    }
  }

  updateOptions(value, option) {
    const cases = this.props.value.cases;
    if (value == null && checkArrayTypeExists(cases, option)) {
      let newState = Object.assign({}, this.state.filteredOptions);
      newState[option] = this.state.defaultOptions;
      this.setState({ filteredOptions : newState});
    } else if (value != null && !checkArrayTypeExists(cases, option)) {
      let newState = Object.assign({}, this.state.filteredOptions);
      newState[option] = this.props.values.filter(v => v.returnType === value.returnType);
      this.setState({ filteredOptions : newState});
    }
  }

  // Updates the state to limit drowdown options
  updateCase(value, index, option) {
    this.props.updateCase(this.props.param.id, value, index, option);
    this.updateOptions(value, option);
  }

  // Updates single selects
  updateSelect(value, option) {
    this.props.updateInstance(this.props.param.id, value, option);
    let newOption = option === 'default' ? 'result' : 'case';
    this.updateOptions(value, newOption);
  }

  renderCaseResult(index, val, option) {
    return(
      <Select key={index}
        labelKey={'name'}
        autofocus
        options={this.state.filteredOptions[option]}
        clearable={true}
        name={this.props.param.id}
        value={val[option]}
        onChange={(value) => {this.updateCase(value, index, option)}}
        searchable={true}/>
    );
  }

  renderDefault(option) {
    return(
      <Select
        labelKey={'name'}
        autofocus
        options={this.state.filteredOptions.result}
        clearable={true}
        placeholder={'Null'}
        name={this.props.param.id}
        value={this.props.param.value.default}
        onChange={(value) => {this.updateSelect(value, 'default')}}
        searchable={true}/>
    );
  }

  render() {
    return (
    <div className="form__group">
      <label htmlFor={this.state.id}>
        <table width="100%">
          <thead>
            <tr>
              <th>Case</th>
              <th>Result</th>
            </tr>
          </thead>
          <tbody>
            {this.props.param.value.cases.map((v, index) =>
            <tr key={index}>
              {index > 0}
              <td width="50%">
                {this.renderCaseResult(index, v, 'case')}
              </td>
              <td width="50%">
                {this.renderCaseResult(index, v, 'result')}
              </td>
          
            </tr>
          )}
          </tbody>
        </table>
        { (this.props.param.subType !== 'number')
        ? <button
            onClick={() => { this.props.addComponent(this.props.param.id); }}
            aria-label={'Add component'}>
            <FontAwesome fixedWidth name='plus'/>
          </button>
        : null }
        <table width="100%">
          <thead>
            <tr>
              <th>Default</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                {this.renderDefault('default')}
              </td>
            </tr>
          </tbody>
        </table>
      </label>

    </div>
    );
  }
}

export default CaseParameter;