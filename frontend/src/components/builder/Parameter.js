import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Select from 'react-select';
import FontAwesome from 'react-fontawesome';

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
        type: this.props.type,
        value: (e != null ? e.value : null)
      })
    };

    switch (this.props.type) {
      case 'Boolean':
        return <BooleanEditor {...parameterProps} />;
      case 'Code':
        return <CodeEditor {...parameterProps} />;
      case 'Concept':
        return <CodeEditor {...parameterProps} isConcept={true} />;
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

    return (
      <div className="parameter__header">
        <div className="form__group">
          <div key={'index'}>
            <div className="parameter__content">
              <button
                aria-label="Delete Parameter"
                className="button pull-right secondary-button"
                onClick={() => { this.props.deleteParameter(this.props.index); }}>
                <FontAwesome fixedWidth name='times' />
              </button>

              <StringParameter
                id={`param-name-${this.props.index}`}
                name={'Parameter Name'}
                value={this.props.name}
                updateInstance={e => (this.updateParameter({
                  name: e[`param-name-${this.props.index}`],
                  type: this.props.type,
                  value: this.props.value
                }))}
              />

              <div className="form__group">
                <label>
                  Parameter Type:
                  <Select
                    aria-label={'Select Parameter Type'}
                    inputProps={{ title: 'Select Parameter Type' }}
                    clearable={false}
                    options={typeOptions}
                    value={this.props.type}
                    onChange={e => this.updateParameter({
                      name: this.props.name,
                      type: e.value,
                      value: null
                    })}
                  />
                </label>
              </div>

              {this.renderParameter()}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

Parameter.propTypes = {
  index: PropTypes.number.isRequired,
  name: PropTypes.string,
  type: PropTypes.string.isRequired,
  updateInstanceOfParameter: PropTypes.func.isRequired,
  deleteParameter: PropTypes.func.isRequired
};
