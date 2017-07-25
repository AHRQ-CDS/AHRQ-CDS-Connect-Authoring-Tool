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
  
  deleteBooleanParam = (index) => {
    let booleanParameters = _.cloneDeep(this.props.booleanParameters);
    booleanParameters.splice(index, 1);
    this.props.updateParameters(booleanParameters);
    this.setState({booleanParameters: booleanParameters})
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
                name={booleanParameter.name}
                value={booleanParameter.value}
                updateInstanceOfParameter={this.updateInstanceOfParameter}
                deleteBooleanParam={this.deleteBooleanParam}
              />
            );
          })
        }
      </div>
    )
  }  
  
};

export default Parameters;