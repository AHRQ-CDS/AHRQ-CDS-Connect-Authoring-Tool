import React, {Component} from 'react';
import Select from 'react-select';
import FontAwesome from 'react-fontawesome';
import StringParameter from './parameters/StringParameter';
import _ from 'lodash';

class Parameter extends Component {
  constructor(props) {
    super(props);
    const values = [{ value: 'true', label: 'True' },
                    { value: 'false', label: 'False' }];
  }

  updateParameter = (object) => {
    this.props.updateInstanceOfParameter(object, this.props.index);
  }

  render() {
    return (
      <div className="parameter__header">
          <div className="form__group">
            <div key={"index"}>
              <div className="parameter__content">
                <label htmlFor={`parameter-${this.props.index}`}>
                  <StringParameter
                    id={"param-name"}
                    name={"Parameter Name"}
                    value={this.props.name}
                    updateInstance={ e => this.updateParameter({name: e["param-name"], value: this.props.value}) }/>
                  <button onClick={ () => { this.props.deleteBooleanParam(this.props.index) } }><FontAwesome fixedWidth name='times'/></button>
                  <Select
                    autofocus
                    options={[{ value: 'true', label: 'True' },
                              { value: 'false', label: 'False' }]}
                    value={this.props.value}
                    onChange={ e => this.updateParameter({name: this.props.name, value: e.value}) }/>
                </label>
              </div>
            </div>
          </div>
      </div>
    );
  };
}

export default Parameter;
