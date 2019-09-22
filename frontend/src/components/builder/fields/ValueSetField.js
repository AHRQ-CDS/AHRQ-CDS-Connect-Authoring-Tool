import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';

import StyledSelect from '../../elements/StyledSelect';

export default class ValueSetField extends Component {
  onFocus = () => {
    this.props.loadValueSets(this.props.field.select);
  }

  render() {
    const id = _.uniqueId('field-');
    return (
      <div className="value-set-field">
        <div className="form__group">
          <label htmlFor={id}>
            <div className="label">{this.props.field.name}:</div>

            <div className="input">
              <StyledSelect
                className="Select"
                classNamePrefix="value-set-field-select"
                getOptionLabel={({ name }) => name}
                placeholder={`Select ${this.props.field.name}`}
                options={this.props.valueSets}
                inputProps={{ id }}
                name={this.props.field.id}
                value={this.props.field.value}
                onChange={(value) => { this.props.updateInstance({ [this.props.field.id]: value }); }}
                onFocus={this.onFocus}
                isSearchable={true} />
              </div>
          </label>
        </div>
      </div>
    );
  }
}

ValueSetField.propTypes = {
  field: PropTypes.object,
  valueSets: PropTypes.array,
  loadValueSets: PropTypes.func.isRequired,
  updateInstance: PropTypes.func.isRequired
};
