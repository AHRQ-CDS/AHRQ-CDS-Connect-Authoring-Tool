import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { Dropdown } from 'components/elements';

const options = [
  { value: 'true', label: 'True' },
  { value: 'false', label: 'False' }
];

export default class BooleanEditor extends Component {
  handleChange = newValue => {
    const { name, type, label, updateInstance } = this.props;
    updateInstance({ name, type, label, value: newValue });
  };

  render() {
    const { label, value } = this.props;

    return (
      <div className="editor boolean-editor">
        <div className="editor-label">{label}</div>

        <div className="editor-inputs">
          <div className="field-input field-input-md">
            <Dropdown
              label={value ? 'Boolean value' : 'Select...'}
              onChange={event => this.handleChange(event.target.value)}
              options={options}
              value={value}
            />
          </div>
        </div>
      </div>
    );
  }
}

BooleanEditor.propTypes = {
  name: PropTypes.string,
  label: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
  value: PropTypes.string,
  updateInstance: PropTypes.func.isRequired
};
