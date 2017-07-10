import React, { Component } from 'react';
import Select from 'react-select';
import _ from 'lodash';
import FontAwesome from 'react-fontawesome';

class CaseParameter extends Component {
  constructor(props) {
    super(props);

    this.state = {
      id: _.uniqueId('parameter-'),
      case: null,
      result: null
    };
  }

  filterOptions(v, option) {
    let type;
    if (option === 'case') {
      type = this.state.case;
    } else {
      type = this.state.result;
    }

    if (v.returnType == null) {
      return false;
    } else if (type != null && type !== v.returnType) {
      return false;
    }
    return true;
  }

  // Checks if there is an existing returnType in any of the select options
  checkArrayType(option) {
    const cases = this.props.value.cases;
    for (let i = 0; i < cases.length; i++) {
      const item = cases[i][option];
      if (item != null && item.returnType != null) {
        return item.returnType;
      }
    }
    if (option === 'result' && this.props.param.value.default != null) {
      return this.props.param.value.default.returnType;
    } else if (option === 'case' && this.props.param.value.variable != null) {
      return this.props.param.value.variable.returnType;
    }
    return null;
  }

  // Update available options if necessary
  updateOptions(value, option) {
    if (value == null && this.checkArrayType(option) == null) {
      this.setState({ [option]: null });
    } else if (value != null && this.checkArrayType(option) != null) {
      this.setState({ [option]: value.returnType });
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
    const placeholder = option === 'case' ? 'Select...' : 'Null';
    return (
      <Select key={index}
        labelKey={'name'}
        autofocus
        options={this.props.values.filter(v => this.filterOptions(v, option))}
        clearable={true}
        placeholder={placeholder}
        name={this.props.param.id}
        value={val[option]}
        onChange={(value) => { this.updateCase(value, index, option); }}
        searchable={true}/>
    );
  }

  // Renders single selects for default and variable
  renderSingleSelect(name, option) {
    const filter = option === 'default' ? 'result' : 'case';
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
                options={this.props.values.filter(v => this.filterOptions(v, filter))}
                clearable={true}
                placeholder={'Null'}
                name={this.props.param.id}
                value={this.props.param.value[option]}
                onChange={(value) => { this.updateSelect(value, option); }}
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
