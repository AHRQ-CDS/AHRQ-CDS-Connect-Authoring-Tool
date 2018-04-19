import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Select from 'react-select';
import _ from 'lodash';

export default class ValueSetParameter extends Component {
  componentWillMount() {
    this.props.loadValueSets(this.props.param.select);
  }

  render() {
    const id = _.uniqueId('parameter-');
    return (
      <div className="value-set-parameter form__group">
        <label htmlFor={id} className="row">
          <span className="label col-3">{this.props.param.name}:</span>

          <Select
            labelKey={'name'}
            className="col-7"
            placeholder={`Select ${this.props.param.name}`}
            options={this.props.valueSets}
            inputProps={{ id }}
            clearable={true}
            name={this.props.param.id}
            value={this.props.param.value}
            onChange={(value) => { this.props.updateInstance({ [this.props.param.id]: value }); }}
            searchable={true} />
        </label>
      </div>
    );
  }
}

ValueSetParameter.propTypes = {
  param: PropTypes.object,
  valueset: PropTypes.object,
  valueSets: PropTypes.array,
  loadValueSets: PropTypes.func.isRequired,
  updateInstance: PropTypes.func.isRequired
};
