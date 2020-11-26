import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import _ from 'lodash';

import { Dropdown } from 'components/elements';

const options = [
  { value: 'true', label: 'True' },
  { value: 'false', label: 'False' }
];

export default class BooleanEditor extends Component {
  handleChange = event => {
    const { name, type, label, updateInstance } = this.props;
    updateInstance({ name, type, label, value: event.target.value });
  };

  render() {
    const { id, label, value, condenseUI } = this.props;
    const formId = _.uniqueId('editor-');

    return (
      <div className="editor boolean-editor">
        <div className="form__group">
          <label className={classnames('editor-container', { condense: condenseUI })} htmlFor={formId}>
            <div className="editor-label label">{label}</div>

            <div className="editor-input-group">
              <div className="editor-input">
                <div className="modifier-dropdown">
                  <Dropdown
                    id={id}
                    label={value ? 'Boolean value' : 'Select...'}
                    onChange={this.handleChange}
                    options={options}
                    value={value}
                  />
                </div>
              </div>
            </div>
          </label>
        </div>
      </div>
    );
  }
}

BooleanEditor.propTypes = {
  id: PropTypes.string.isRequired,
  name: PropTypes.string,
  label: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
  value: PropTypes.string,
  updateInstance: PropTypes.func.isRequired,
  condenseUI: PropTypes.bool
};
