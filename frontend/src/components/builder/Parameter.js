import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Select from 'react-select';
import FontAwesome from 'react-fontawesome';
import _ from 'lodash';

import StringParameter from './parameters/types/StringParameter';
import BooleanEditor from './parameters/editors/BooleanEditor';
import CodeEditor from './parameters/editors/CodeEditor';
import IntegerEditor from './parameters/editors/IntegerEditor';
import DateTimeEditor from './parameters/editors/DateTimeEditor';
import DecimalEditor from './parameters/editors/DecimalEditor';
import QuantityEditor from './parameters/editors/QuantityEditor';
import StringEditor from './parameters/editors/StringEditor';
import TimeEditor from './parameters/editors/TimeEditor';
import IntervalOfIntegerEditor from './parameters/editors/IntervalOfIntegerEditor';
import IntervalOfDateTimeEditor from './parameters/editors/IntervalOfDateTimeEditor';
import IntervalOfDecimalEditor from './parameters/editors/IntervalOfDecimalEditor';
import IntervalOfQuantityEditor from './parameters/editors/IntervalOfQuantityEditor';

export default class Parameter extends Component {
  componentDidMount = () => {
    const { id, type, name, value } = this.props;
    if (_.isUndefined(id)) {
      this.updateParameter({
        name,
        uniqueId: _.uniqueId('parameter-'),
        type,
        value
      });
    }
  }

  updateParameter = (object) => {
    this.props.updateInstanceOfParameter(object, this.props.index);
  }

  renderParameter() {
    const parameterProps = {
      id: `param-name-${this.props.index}`,
      name: this.props.name,
      type: this.props.type != null ? this.props.type : null,
      value: this.props.value,
      updateInstance: e => this.updateParameter({
        name: this.props.name,
        uniqueId: this.props.id,
        type: this.props.type,
        value: (e != null ? e.value : null)
      })
    };

    const codeEditorProps = {
      timeLastAuthenticated: this.props.timeLastAuthenticated,
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
      case 'Boolean':
        return <BooleanEditor {...parameterProps} />;
      case 'Code':
        return <CodeEditor {...parameterProps} {...codeEditorProps} />;
      case 'Concept':
        return <CodeEditor {...parameterProps} {...codeEditorProps} isConcept={true} />;
      case 'Integer':
        return <IntegerEditor {...parameterProps} />;
      case 'DateTime':
        return <DateTimeEditor {...parameterProps} />;
      case 'Decimal':
        return <DecimalEditor {...parameterProps} />;
      case 'Quantity':
        return <QuantityEditor {...parameterProps} />;
      case 'String':
        return <StringEditor {...parameterProps} />;
      case 'Time':
        return <TimeEditor {...parameterProps} />;
      case 'Interval<Integer>':
        return <IntervalOfIntegerEditor {...parameterProps} />;
      case 'Interval<DateTime>':
        return <IntervalOfDateTimeEditor {...parameterProps} />;
      case 'Interval<Decimal>':
        return <IntervalOfDecimalEditor {...parameterProps} />;
      case 'Interval<Quantity>':
        return <IntervalOfQuantityEditor {...parameterProps} />;
      default:
        return null;
    }
  }

  render() {
    const { index, name, id, type, value, deleteParameter } = this.props;
    const typeOptions = [
      { value: 'Boolean', label: 'Boolean' },
      { value: 'Code', label: 'Code' },
      { value: 'Concept', label: 'Concept' },
      { value: 'Integer', label: 'Integer' },
      { value: 'DateTime', label: 'DateTime' },
      { value: 'Decimal', label: 'Decimal' },
      { value: 'Quantity', label: 'Quantity' },
      { value: 'String', label: 'String' },
      { value: 'Time', label: 'Time' },
      { value: 'Interval<Integer>', label: 'Interval<Integer>' },
      { value: 'Interval<DateTime>', label: 'Interval<DateTime>' },
      { value: 'Interval<Decimal>', label: 'Interval<Decimal>' },
      { value: 'Interval<Quantity>', label: 'Interval<Quantity>' }
    ];

    const duplicateNameIndex = this.props.instanceNames.findIndex(n => n.id !== id && n.name === name);

    return (
      <div className="parameter card-group card-group__top">
        <div className="card-element">
          <div className="card-element__header">
            <StringParameter
              id={`param-name-${index}`}
              name={'Parameter Name'}
              value={name}
              updateInstance={e => (this.updateParameter({
                name: e[`param-name-${index}`],
                uniqueId: this.props.id,
                type,
                value
              }))}
            />
            {duplicateNameIndex !== -1
              && <div className="warning">Warning: Name already in use. Choose another name.</div>}

            <button
              aria-label="Delete Parameter"
              className="button transparent-button delete-button"
              onClick={() => { deleteParameter(index); }}>
              <FontAwesome fixedWidth name='times' />
            </button>
          </div>

          <div className="card-element__body">
            <div className="parameter__item row">
              <div className="col-3 bold align-right">
                <label htmlFor={`parameter-${index}`}>Parameter Type:</label>
              </div>

              <div className="col-9">
                <Select
                  aria-label={'Select Parameter Type'}
                  inputProps={{ title: 'Select Parameter Type', id: `parameter-${index}` }}
                  clearable={false}
                  options={typeOptions}
                  value={type}
                  onChange={e => this.updateParameter({
                    name,
                    uniqueId: this.props.id,
                    type: e.value,
                    value: null
                  })}
                />
              </div>
            </div>

            {this.renderParameter()}
          </div>
        </div>
      </div>
    );
  }
}

Parameter.propTypes = {
  index: PropTypes.number.isRequired,
  name: PropTypes.string,
  type: PropTypes.string,
  id: PropTypes.string,
  updateInstanceOfParameter: PropTypes.func.isRequired,
  deleteParameter: PropTypes.func.isRequired,
  timeLastAuthenticated: PropTypes.instanceOf(Date),
  vsacFHIRCredentials: PropTypes.object,
  setVSACAuthStatus: PropTypes.func.isRequired,
  vsacStatus: PropTypes.string,
  vsacStatusText: PropTypes.string,
  isValidatingCode: PropTypes.bool.isRequired,
  isValidCode: PropTypes.bool,
  codeData: PropTypes.object,
  validateCode: PropTypes.func.isRequired,
  resetCodeValidation: PropTypes.func.isRequired
};
