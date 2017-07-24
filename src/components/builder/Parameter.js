import React, {Component} from 'react';
import Select from 'react-select';
import StringParameter from './parameters/StringParameter';
import _ from 'lodash';

class Parameter extends Component {
  constructor(props) {
    super(props);
    const values = [{ value: 'true', label: 'True' },
                    { value: 'false', label: 'False' }];
    this.state = {
      name: this.props.param,
      value: this.props.value
    }
  }

  updateParameter = (object) => {
    this.props.updateInstanceOfParameter(object, this.props.index);
  }

  render(){
    let val = null;
    return (
      <div className="parameter__header">
          <div className="form__group">
            <div key={"index"}>
              <div className="parameter__content">
                <label htmlFor={`parameter-${this.props.index}`}>
                  <StringParameter
                    id={ "param-name" }
                    name={ "Parameter Name" }
                    value={ this.state.name }
                    updateInstance={ (v) => {
                      this.setState({name: v["param-name"]})
                      this.updateParameter({name: v["param-name"], value: this.state.value})
                    }
                    }
                  />
                  <Select
                    autofocus
                    options={[{ value: 'true', label: 'True' },
                              { value: 'false', label: 'False' }]}
                    value={this.state.value}
                    onChange={(v) => {
                      this.setState({value: v.value})
                      this.updateParameter({name: this.state.name, value: v.value})
                    }}/>
                </label>
              </div>
            </div>
          </div>
      </div>
    );
  };
}

export default Parameter;
