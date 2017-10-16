import React, { Component } from 'react';
import _ from 'lodash';
import Parameter from './Parameter';

class Parameters extends Component {
  constructor(props) {
    super(props);
    this.state = {
      booleanParameters: this.props.booleanParameters || [],
    };
  }

  addParameter = () => {
    const newParameter = ({ name: null, value: null });
    const booleanParameters = _.clone(this.state.booleanParameters);
    booleanParameters.push(newParameter);
    this.setState({ booleanParameters });
    this.props.updateParameters(booleanParameters);
  }

  deleteBooleanParam = (index) => {
    const booleanParameters = _.cloneDeep(this.props.booleanParameters);
    booleanParameters.splice(index, 1);
    this.props.updateParameters(booleanParameters);
    this.setState({ booleanParameters });
  }

  updateInstanceOfParameter = (booleanParameter, index) => {
    const booleanParameters = _.clone(this.state.booleanParameters);
    booleanParameters[index] = booleanParameter;
    this.setState({ booleanParameters });
    this.props.updateParameters(booleanParameters);
  }

  render() {
    return (
      <div>
          { this.state.booleanParameters.map((booleanParameter, i) => (
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
        <button className="button secondary-button new-parameter" onClick={ this.addParameter }>
          New parameter
        </button>
      </div>
    );
  }
}

export default Parameters;
