import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';

import StyledSelect from '../../elements/StyledSelect';

const options = [{ value: 'true', label: 'True' }, { value: 'false', label: 'False' }];

export default class BooleanEditor extends Component {
  render() {
    const { id, name, type, label, value, updateInstance } = this.props;
    const formId = _.uniqueId('parameter-');

    return (
      <div className="boolean-editor">
        <div className="parameter__item row">
          <div className="col-3 bold align-right">
            <label htmlFor={formId}>{label}</label>
          </div>

          <div className="col-9">
            <StyledSelect
              id={id}
              aria-label={'Select True or False'}
              inputProps={{ title: 'Select True or False', id: formId }}
              options={options}
              value={options.find(option => option.value === value)}
              onChange={ (e) => { updateInstance({ name, type, label, value: _.get(e, 'value', null) }); }}
            />
          </div>
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
  updateInstance: PropTypes.func.isRequired
};
