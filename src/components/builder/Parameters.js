import React, {Component} from 'react';
import Select from 'react-select';
import Parameter from './Parameter';
import _ from 'lodash';




class Parameters extends Component {
  constructor(props) {
    super(props);
    this.state = {
      booleanParameters: this.props.booleanParameters || [],
    }
  }

  
  addParameter = () => {
    const newParameter = ({name: null, value: null});
    const booleanParameters = _.clone(this.state.booleanParameters);
    booleanParameters.push(newParameter);
    this.setState({booleanParameters: booleanParameters})
    this.props.updateParameters(booleanParameters)
  }
  
  updateInstanceOfParameter = (booleanParameter , index) => {
    const booleanParameters = _.clone(this.state.booleanParameters);
    booleanParameters[index] = booleanParameter ;
    this.setState({booleanParameters: booleanParameters})
    this.props.updateParameters(booleanParameters)
  }

  render() {
    return (
      <div>
        <button className="button new-subpopulation" onClick={ this.addParameter }>
          New parameter
        </button>
          { this.state.booleanParameters.map((booleanParameter, i) => {
            return (
              <Parameter
                key={`param-${i}`}
                index={i}
                param={booleanParameter.name}
                value={booleanParameter.value}
                updateInstanceOfParameter={this.updateInstanceOfParameter}
              />
            );
          })
        }

      </div>
    )
  }  
  
};

export default Parameters;