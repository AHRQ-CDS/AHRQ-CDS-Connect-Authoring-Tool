import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import _ from 'lodash';

import StyledSelect from '../../elements/StyledSelect';

const options = [{ value: 'true', label: 'True' }, { value: 'false', label: 'False' }];

export default class BooleanEditor extends Component {
  render() {
    const {
      id,
      name,
      type,
      label,
      value,
      updateInstance,
      condenseUI,
    } = this.props;
    const formId = _.uniqueId("editor-");

    return (
      <div className="editor boolean-editor">
        <div className="form__group">
          <label
            className={classnames("editor-container", { condense: condenseUI })}
            htmlFor={formId}
          >
            <div className="editor-label label">{label}</div>

            <div className="editor-input-group">
              <div className="editor-input">
                <StyledSelect
                  className="Select"
                  id={id}
                  aria-label="Select True or False"
                  inputProps={{ title: 'Select True or False', id: formId }}
                  options={options}
                  value={options.find(option => option.value === value)}
                  onChange={ (e) => { updateInstance({ name, type, label, value: _.get(e, 'value', null) }); }}
                />
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
  condenseUI: PropTypes.bool,
};
