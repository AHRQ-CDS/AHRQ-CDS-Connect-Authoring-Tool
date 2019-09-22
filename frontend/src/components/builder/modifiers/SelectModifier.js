import React, { Component } from 'react';
import _ from 'lodash';

import StyledSelect from '../../elements/StyledSelect';

class SelectModifier extends Component {
  handleChange = (selectedOption) => {
    const value = selectedOption ? selectedOption.value : '';
    const description = selectedOption ? selectedOption.label : '';
    this.props.updateAppliedModifier(this.props.index, { value, templateName: value, description });
  }

  render() {
    const selectId = _.uniqueId('select-');
    const options = this.props.options.map(option => ({ value: option.name, label: option.description }));

    return (
      <div>
        <label htmlFor={selectId}>
          <StyledSelect
            className="Select"
            classNamePrefix="select-modifier-select"
            name={this.props.name}
            aria-label={this.props.name}
            id={selectId}
            value={options.find(({ value }) => value === this.props.value)}
            placeholder={this.props.name}
            onChange={this.handleChange}
            options={options}
          />
        </label>
      </div>
    );
  }
}

export default SelectModifier;
