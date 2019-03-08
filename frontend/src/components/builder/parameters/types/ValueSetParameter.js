import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Select from 'react-select';
import _ from 'lodash';

export default class ValueSetParameter extends Component {
  onFocus = () => {
    this.props.loadValueSets(this.props.param.select);
  }

  render() {
    const id = _.uniqueId('parameter-');
    return (
      <div className="value-set-parameter">
        <div className="form__group">
          <label htmlFor={id}>
            <div className="label">{this.props.param.name}:</div>

            <div className="input">
              <Select
                labelKey={'name'}
                placeholder={`Select ${this.props.param.name}`}
                options={this.props.valueSets}
                inputProps={{ id }}
                clearable={true}
                name={this.props.param.id}
                value={this.props.param.value}
                onChange={(value) => { this.props.updateInstance({ [this.props.param.id]: value }); }}
                onFocus={this.onFocus}
                searchable={true} />
              </div>
          </label>
        </div>
      </div>
    );
  }
}

ValueSetParameter.propTypes = {
  param: PropTypes.object,
  valueSets: PropTypes.array,
  loadValueSets: PropTypes.func.isRequired,
  updateInstance: PropTypes.func.isRequired
};
