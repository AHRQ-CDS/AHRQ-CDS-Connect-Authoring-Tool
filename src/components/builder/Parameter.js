import React, {Component} from 'react';
import Select from 'react-select';
import FontAwesome from 'react-fontawesome';
import StringParameter from './parameters/StringParameter';
import _ from 'lodash';

class Parameter extends Component {

  updateParameter = (object) => {
    this.props.updateInstanceOfParameter(object, this.props.index);
  }

  render() {
    return (
      <div className="parameter__header">
          <div className="form__group">
            <div key={"index"}>
              <div className="parameter__content">
                <button aria-label="Delete Parameter" className="button is-pulled-right" onClick={ () => { this.props.deleteBooleanParam(this.props.index) } }><FontAwesome fixedWidth name='times'/></button>
                <StringParameter
                  id={`param-name-${this.props.index}`}
                  name={"Parameter Name"}
                  value={this.props.name}
                  updateInstance={ e => this.updateParameter({name: e[`param-name-${this.props.index}`], value: this.props.value}) }/>
                <Select
                  aria-label={'Select True or False'}
                  clearable={false}
                  options={[{ value: 'true', label: 'True' },
                            { value: 'false', label: 'False' }]}
                  value={this.props.value}
                  onChange={ e => this.updateParameter({name: this.props.name, value: e.value}) }/>
              </div>
            </div>
          </div>
      </div>
    );
  };
}

export default Parameter;
