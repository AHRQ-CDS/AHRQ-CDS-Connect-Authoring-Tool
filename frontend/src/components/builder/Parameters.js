import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import Parameter from './Parameter';

export default class Parameters extends Component {
  static propTypes = {
    booleanParameters: PropTypes.array.isRequired,
    updateParameters: PropTypes.func.isRequired
  };

  addParameter = () => {
    const newParameter = { name: null, value: null };
    const booleanParameters = _.clone(this.props.booleanParameters);
    booleanParameters.push(newParameter);
    this.props.updateParameters(booleanParameters);
  }

  deleteBooleanParam = (index) => {
    const booleanParameters = _.cloneDeep(this.props.booleanParameters);
    booleanParameters.splice(index, 1);
    this.props.updateParameters(booleanParameters);
  }

  updateInstanceOfParameter = (booleanParameter, index) => {
    const booleanParameters = _.clone(this.props.booleanParameters);
    booleanParameters[index] = booleanParameter;
    this.props.updateParameters(booleanParameters);
  }

  render() {
    return (
      <div>
          { this.props.booleanParameters.map((booleanParameter, i) => (
              <Parameter
                key={`param-${i}`}
                index={i}
                name={booleanParameter.name}
                value={booleanParameter.value}
                updateInstanceOfParameter={this.updateInstanceOfParameter}
                deleteBooleanParam={this.deleteBooleanParam}
              />
            ))
        }
        <button className="button primary-button new-parameter" onClick={this.addParameter}>
          New parameter
        </button>
      </div>
    );
  }
}
