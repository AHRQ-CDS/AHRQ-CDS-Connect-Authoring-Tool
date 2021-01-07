import React, { Component } from 'react';
import _ from 'lodash';

import { Dropdown } from 'components/elements';

class SelectModifier extends Component {
  handleChange = (event, selectOptions) => {
    const { index, updateAppliedModifier } = this.props;
    const selectedOption = selectOptions.find(option => option.value === event.target.value);
    const value = selectedOption ? selectedOption.value : '';
    const description = selectedOption ? selectedOption.label : '';
    updateAppliedModifier(index, { value, templateName: value, description });
  }

  render() {
    const { name, options, value } = this.props;
    const selectId = _.uniqueId('select-');
    const selectOptions = options.map(option => ({ value: option.name, label: option.description }));

    return (
      <div className="modifier">
        <Dropdown
          className="field-input field-input-xl"
          id={selectId}
          label={name}
          onChange={event => this.handleChange(event, selectOptions)}
          options={selectOptions}
          value={value}
        />
      </div>
    );
  }
}

export default SelectModifier;
