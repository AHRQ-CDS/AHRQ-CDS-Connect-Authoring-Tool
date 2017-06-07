import React, { Component } from 'react';
import Select from 'react-select';
import _ from 'lodash';
import FontAwesome from 'react-fontawesome';

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
      }
    }
  }

  // Checks if there is an existing returnType in any of the select options
  checkArrayTypeExists(option) {
    const cases = this.props.value.cases;
    for (let i in cases) {
      let item = cases[i][option];
      if (item != null && item.returnType != null) {
        return false;
      }
    }
    if (option === 'result' && this.props.param.value.default != null) {
      return false;
    } else if (option === 'case' && this.props.param.value.variable != null) {
      return false;
    } else {
      return true;
    }
  }

  // Update available options if necessary
  updateOptions(value, option) {
    if (value == null && this.checkArrayTypeExists(option)) {
      let newState = Object.assign({}, this.state.filteredOptions);
      newState[option] = this.state.defaultOptions;
      this.setState({filteredOptions : newState});
    } else if (value != null && !this.checkArrayTypeExists(option)) {
      let newState = Object.assign({}, this.state.filteredOptions);
      newState[option] = this.props.values.filter(v => v.returnType === value.returnType);
      this.setState({filteredOptions : newState});
    }
  }

  // Updates the state to limit drowdown options
  updateCase(value, index, option) {
    this.props.updateCase(this.props.param.id, value, index, option);
    this.updateOptions(value, option);
  }

  // Updates single selects
  updateSelect(value, option) {
    this.props.param.value[option] = value;
    this.props.updateInstance(this.props.param.id, value, option);
    this.updateOptions(value, option === 'default' ? 'result' : 'case');
  }

  // Renders selects for case and result
  renderCaseResult(index, val, option) {
    let placeholder = option === 'case' ? 'Select...' : 'Null';
    return(
      <Select key={index}
        labelKey={'name'}
        autofocus
        options={this.state.filteredOptions[option]}
        clearable={true}
        placeholder={placeholder}
        name={this.props.param.id}
        value={val[option]}
        onChange={(value) => {this.updateCase(value, index, option)}}
        searchable={true}/>
    );
  }

  // Renders single selects for default and variable
  renderSingleSelect(name, option) {
    let filter = option === 'default' ? 'result' : 'case';
    return (
      <table width="100%">
        <thead>
          <tr>
            <th>{name}</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
              <Select
                labelKey={'name'}
                autofocus
                options={this.state.filteredOptions[filter]}
                clearable={true}
                placeholder={'Null'}
                name={this.props.param.id}
                value={this.props.param.value[option]}
                onChange={(value) => {this.updateSelect(value, option)}}
                searchable={true}/>
            </td>
          </tr>
        </tbody>
      </table>
    );
  }

  render() {
    return (
    <div className="form__group">
      <label htmlFor={this.state.id}>
        {this.renderSingleSelect('Variable', 'variable')}
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
        {this.renderSingleSelect('Default', 'default')}
      </label>

    </div>
    );
  }
}

export default CaseParameter;