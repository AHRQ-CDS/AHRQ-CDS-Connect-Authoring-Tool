import React, { Component } from 'react';
import PropTypes from 'prop-types';

import BooleanEditor from '../builder/parameters/BooleanEditor';
import CodeEditor from '../builder/parameters/CodeEditor';
import IntegerEditor from '../builder/parameters/IntegerEditor';
import DateTimeEditor from '../builder/parameters/DateTimeEditor';
import DecimalEditor from '../builder/parameters/DecimalEditor';
import QuantityEditor from '../builder/parameters/QuantityEditor';
import StringEditor from '../builder/parameters/StringEditor';
import TimeEditor from '../builder/parameters/TimeEditor';
import IntervalOfIntegerEditor from '../builder/parameters/IntervalOfIntegerEditor';
import IntervalOfDateTimeEditor from '../builder/parameters/IntervalOfDateTimeEditor';
import IntervalOfDecimalEditor from '../builder/parameters/IntervalOfDecimalEditor';
import IntervalOfQuantityEditor from '../builder/parameters/IntervalOfQuantityEditor';

export default class TestingParameter extends Component {
  updateParameter = (object) => {
    this.props.updateInstanceOfParameter(object, this.props.index);
  }

  renderParameter() {
    const parameterProps = {
      id: `param-name-${this.props.index}`,
      name: this.props.name,
      type: this.props.type != null ? this.props.type : null,
      label: 'Value:',
      value: this.props.value,
      updateInstance: e => this.updateParameter({
        name: this.props.name,
        uniqueId: this.props.id,
        type: this.props.type,
        comment: this.props.comment,
        value: (e != null ? e.value : null)
      })
    };

    const codeEditorProps = {
      vsacFHIRCredentials: this.props.vsacFHIRCredentials,
      loginVSACUser: this.props.loginVSACUser,
      setVSACAuthStatus: this.props.setVSACAuthStatus,
      vsacStatus: this.props.vsacStatus,
      vsacStatusText: this.props.vsacStatusText,
      isValidatingCode: this.props.isValidatingCode,
      isValidCode: this.props.isValidCode,
      codeData: this.props.codeData,
      validateCode: this.props.validateCode,
      resetCodeValidation: this.props.resetCodeValidation
    };

    switch (this.props.type) {
      case 'boolean':
        return <BooleanEditor {...parameterProps} />;
      case 'system_code':
        return <CodeEditor {...parameterProps} {...codeEditorProps} />;
      case 'system_concept':
        return <CodeEditor {...parameterProps} {...codeEditorProps} isConcept={true} />;
      case 'integer':
        return <IntegerEditor {...parameterProps} />;
      case 'datetime':
        return <DateTimeEditor {...parameterProps} />;
      case 'decimal':
        return <DecimalEditor {...parameterProps} />;
      case 'system_quantity':
        return <QuantityEditor {...parameterProps} />;
      case 'string':
        return <StringEditor {...parameterProps} />;
      case 'time':
        return <TimeEditor {...parameterProps} />;
      case 'interval_of_integer':
        return <IntervalOfIntegerEditor {...parameterProps} />;
      case 'interval_of_datetime':
        return <IntervalOfDateTimeEditor {...parameterProps} />;
      case 'interval_of_decimal':
        return <IntervalOfDecimalEditor {...parameterProps} />;
      case 'interval_of_quantity':
        return <IntervalOfQuantityEditor {...parameterProps} />;
      default:
        return null;
    }
  }

  render() {
    return (
      <div className="parameter card-group card-group__top" id={this.props.id}>
        <div className="card-element">
          <div className="card-element__header">
            {this.props.name}
          </div>
          <div className="card-element__body">
            {this.renderParameter()}
          </div>
        </div>
      </div>
    );
  }
}

TestingParameter.propTypes = {
  index: PropTypes.number.isRequired,
  name: PropTypes.string,
  type: PropTypes.string,
  updateInstanceOfParameter: PropTypes.func.isRequired,
  vsacFHIRCredentials: PropTypes.object,
  loginVSACUser: PropTypes.func.isRequired,
  setVSACAuthStatus: PropTypes.func.isRequired,
  vsacStatus: PropTypes.string,
  vsacStatusText: PropTypes.string,
  isValidatingCode: PropTypes.bool.isRequired,
  isValidCode: PropTypes.bool,
  codeData: PropTypes.object,
  validateCode: PropTypes.func.isRequired,
  resetCodeValidation: PropTypes.func.isRequired
};
