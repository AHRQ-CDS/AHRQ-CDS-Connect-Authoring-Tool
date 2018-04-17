import React, { Component } from 'react';
import Select from 'react-select';
import FontAwesome from 'react-fontawesome';
import StringParameter from './parameters/StringParameter';
import ParameterEditor from './ParameterEditor';

class Parameter extends Component {
  updateParameter = (object) => {
    this.props.updateInstanceOfParameter(object, this.props.index);
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
              <button aria-label="Delete Parameter" className="button pull-right secondary-button"
                onClick={ () => { this.props.deleteParameter(this.props.index); } }>
                <FontAwesome fixedWidth name='times'/>
              </button>

              <StringParameter
                id={`param-name-${this.props.index}`}
                name={'Parameter Name'}
                value={this.props.name}
                updateInstance={ e => (
                  this.updateParameter({ name: e[`param-name-${this.props.index}`],
                    type: this.props.type,
value: this.props.value }))} />

              <div className="form__group">
                <label>
                  Parameter Type:
                  <Select
                    aria-label={'Select Parameter Type'}
                    inputProps={{ title: 'Select Parameter Type' }}
                    clearable={false}
                    options={typeOptions}
                    value={this.props.type}
                    onChange={ e => this.updateParameter({ name: this.props.name,
                      type: e.value,
                      value: null }) }/>
                </label>
              </div>

              <ParameterEditor
                id={`param-name-${this.props.index}`}
                name={this.props.name}
                type={this.props.type != null ? this.props.type : null}
                value={this.props.value}
                updateInstance={ e =>
                  (this.updateParameter({ name: this.props.name,
                    type: this.props.type,
                    value: (e != null ? e.value : null) })) }/>

            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Parameter;
