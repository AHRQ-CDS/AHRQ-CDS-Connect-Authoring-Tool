import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { EditorsTemplate } from 'components/builder/templates';

export default class TestingParameter extends Component {
  render() {
    const { comment, id, name, type, updateInstanceOfParameter, value } = this.props;

    return (
      <div className="parameter card-group card-group__top" id={id}>
        <div className="card-element">
          <div className="card-element__header">
            {name}
          </div>

          <div className="card-element__body">
            <EditorsTemplate
              handleUpdateEditor={
                newValue => updateInstanceOfParameter({ name, uniqueId: id, type, comment, value: newValue })
              }
              label="Value"
              isNested
              type={type}
              value={value}
            />
          </div>
        </div>
      </div>
    );
  }
}

TestingParameter.propTypes = {
  id: PropTypes.string.isRequired,
  name: PropTypes.string,
  type: PropTypes.string,
  updateInstanceOfParameter: PropTypes.func.isRequired,
  vsacApiKey: PropTypes.string
};
