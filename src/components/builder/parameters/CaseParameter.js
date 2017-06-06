import React, { Component } from 'react';
import Select from 'react-select';
import _ from 'lodash';
import FontAwesome from 'react-fontawesome';


// Don't allow additional components to be added in for observation lists.
// NOTE - This may not be the functionality we want and may be changed in the future.
 // TODO: LVR is using 'number' now instead of 'observation' - this might be changed in the future with more comparison elements added in

// Checks if there is an existing returnType in any of the selects
function checkArrayType(array) {
  for (let i in array) {
    let caseItem = array[i].case;
    let result = array[i].result;
    if (caseItem !== undefined) {
      return true;
    } else if (result !== undefined) {
      return true;
    }
  }
  return false;
}

class CaseParameter extends Component {
  constructor(props) {
    super(props)
    this.state = {
      id : _.uniqueId('parameter-'),
      filteredOptions : {
        case : this.filterValues(undefined),
        result : this.filterValues(undefined)
      }
    }
  }

  // Filters dropdown based on other inputs
  filterValues(typeFilter) {
    if (typeFilter === undefined) {
      return this.props.values.filter(v => {return v.returnType !== undefined});
    } else {
      return this.props.values.filter(v => {return v.returnType === typeFilter});
    }
  }

  updateCase(value, index, option) {
    this.props.updateCase(this.props.param.id, value, index, option);
    console.log(value);
    if (value === null) {
      let newState = Object.assign({}, this.state.filteredOptions);
      newState[option] = this.filterValues(undefined);
      this.setState({ filteredOptions : newState});
    } else {
      console.log(this.props.value)
      let newState = Object.assign({}, this.state.filteredOptions);
      newState[option] = this.filterValues(value.returnType);
      this.setState({ filteredOptions : newState});
    }
  }
  renderSelect(index, val, option) {
    return(
      <Select key={index}
        labelKey={'name'}
        autofocus
        options={this.state.filteredOptions[option]}
        clearable={true}
        name={this.props.param.id}
        value={val.case}
        onChange={(value) => {this.updateCase(value, index, option)}}
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
            {this.props.param.value.map((v, index) =>
            <tr key={index}>
              {index > 0}
              <td width="50%">
                {this.renderSelect(index, v, 'case')}
              </td>
              <td width="50%">
                {this.renderSelect(index, v, 'result')}
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
              <td width="50%">
                <Select
                      labelKey={'name'}
                      autofocus
                      options={this.state.filteredOptions.results}
                      clearable={true}
                      name={this.props.param.id}
                      value={this.props.param.default}
                      onChange={(value) => {
                        this.props.updateDefault(this.props.param.id, value, 'default');
                      }}
                      searchable={true}/>
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
/*
export default (props) => {
  const id = _.uniqueId('parameter-');

  let filteredOptions = {
    cases : filterValues(undefined),
    results : filterValues(undefined)
  }

  function filterValues(typeFilter) {
    if (typeFilter === undefined) {
      return props.values.filter(v => {return v.returnType !== undefined});
    } else {
      return props.values.filter(v => {return v.returnType === typeFilter});
    }
  }

  function updateCase(value, index, option) {
    props.updateCase(props.param.id, value, index, option);
    console.log(value);
    if (value === null) {
      filteredOptions[option] = filterValues(undefined);
    } else {
      filteredOptions[option] = filterValues(value.returnType);
    }
  }

  return (
    <div className="form__group">
      <label htmlFor={id}>
        <table width="100%">
          <thead>
            <tr>
              <th>Case</th>
              <th>Result</th>
            </tr>
          </thead>
          <tbody>
            {props.param.value.map((v, index) =>
            <tr key={index}>
              {index > 0}
              <td width="50%">
                <Select key={index}
                      labelKey={'name'}
                      autofocus
                      options={filteredOptions.cases}
                      clearable={true}
                      name={props.param.id}
                      value={v.case}
                      onChange={(value) => {updateCase(value, index, 'case')}}
                      searchable={true}/>
              </td>
              <td width="50%">
                <Select key={-index}
                      labelKey={'name'}
                      autofocus
                      options={filteredOptions.results}
                      clearable={true}
                      name={props.param.id}
                      value={v.result}
                      onChange={(value) => {updateCase(value, index, 'result')}}
                      searchable={true}/>
              </td>
          
            </tr>
          )}
          </tbody>
        </table>
        { (props.param.subType !== 'number')
        ? <button
            onClick={() => { props.addComponent(props.param.id); }}
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
              <td width="50%">
                <Select
                      labelKey={'name'}
                      autofocus
                      options={filteredOptions.results}
                      clearable={true}
                      name={props.param.id}
                      value={props.param.default}
                      onChange={(value) => {
                        props.updateDefault(props.param.id, value, 'default');
                      }}
                      searchable={true}/>
              </td>
            </tr>
          </tbody>
        </table>
      </label>

    </div>
  );
};*/