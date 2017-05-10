import React, { Component, PropTypes } from 'react';
import axios from 'axios';
import FontAwesome from 'react-fontawesome';
import IntegerParameter from './parameters/IntegerParameter';
import StringParameter from './parameters/StringParameter';
import ObservationParameter from './parameters/ObservationParameter';
import Dropdown, {DropdownTrigger, DropdownContent} from 'react-simple-dropdown';
import ValueSetParameter from './parameters/ValueSetParameter';

function validateOneWord(value) {
  if (value.includes(' ')) {
    return false;
  }
  return true;
}

class TemplateInstance extends Component {
  static propTypes = {
    templateInstance: PropTypes.object.isRequired,
    updateSingleElement: PropTypes.func.isRequired,
    deleteInstance: PropTypes.func.isRequired,
    saveInstance: PropTypes.func.isRequired,
    showPresets: PropTypes.func.isRequired
  }

  constructor(props) {
    super(props);

    this.state = { 
      resources: {}, 
      presets : [],
      showElement : true
    };
    this.updateInstance = this.updateInstance.bind(this);
    this.selectTemplate = this.selectTemplate.bind(this);
  }

  componentWillMount() {
    this.props.templateInstance.parameters.forEach((param) => {
      this.setState({ [param.id]: param.value });
    });

    axios.get('http://localhost:3001/api/resources')
      .then((result) => {
        this.setState({ resources: result.data });
      });
  }

  updateInstance(newState) {
    this.setState(newState);
    this.props.updateSingleElement(this.props.templateInstance.uniqueId, newState);
  }

  selectTemplate(param) {
    switch (param.type) {
      case 'integer':
        return (
          <IntegerParameter
            key={param.id}
            param={param}
            value={this.state[param.id]}
            updateInstance={this.updateInstance} />
        );
      case 'observation':
        return (
          <ObservationParameter
            key={param.id}
            param={param}
            resources={this.state.resources}
            updateInstance={this.updateInstance} />
        );
      case 'string':
        return (
          <StringParameter
            key={param.id}
            {...param}
            updateInstance={this.updateInstance}
            validation={validateOneWord} />
        );
      case "valueset":
        return (
          <ValueSetParameter
            key={param.id}
            param={param}
            valueset={this.state.resources}
            updateInstance={this.updateInstance} />
        );
      default:
        return null;
    }
  }

  showPresets(id) {
    this.props.showPresets(id)
      .then((result) => {
        this.setState({presets : result.data})
      })
      .catch((error) => {
        console.log(error);
        this.setState({presets : []})
      })
  }

  setPreset(stateIndex) {
    console.log(this.state.presets[stateIndex])
    this.props.templateInstance.parameters = this.state.presets[stateIndex].parameters;
    for (var i in this.state.presets[stateIndex].parameters) {
      let param = this.state.presets[stateIndex].parameters[i];
      let newState = {};
      newState[param.id] = param.value;
      this.updateInstance(newState);
    }
  }

  renderPreset(preset, stateIndex) {
    let name = 'untitled';
    const params = preset.parameters;
    const index = params.findIndex((item) => {
      return item.id === 'element_name';
    });
    if (index > -1) {
      name = params[index];
    }
    return (
      <tr key={stateIndex}>
        <td
          onClick={this.setPreset.bind(this, stateIndex)}>
          {name.value}
        </td>
      </tr>
    )
  }

  showHideElementBody() {
    this.setState({ showElement : !this.state.showElement});
  }

  renderBody() {
    return (
      <div className="element__body">
        {this.props.templateInstance.parameters.map((param, index) =>
          // todo: each parameter type should probably have its own component
          this.selectTemplate(param)
        )}
      </div>)
  }

  render() {
    return (
      <div className="element element__expanded">
        <div className="element__header">
          <span className="element__heading">
            {this.props.templateInstance.name}
          </span>
          <div className="element__buttonbar">
            <Dropdown>
              <DropdownTrigger>
                <button
                  onClick={this.showPresets.bind(this, this.props.templateInstance.id)}
                  className="element__presetbutton"
                  aria-label={`show presets ${this.props.templateInstance.id}`}>
                  <FontAwesome fixedWidth name='database'/>
                </button>
              </DropdownTrigger>
              <DropdownContent>
                <table>
                  <tbody>
                    {this.state.presets.map((preset, i) => 
                      this.renderPreset(preset, i)
                    )}
                  </tbody>
                </table>
              </DropdownContent>
            </Dropdown>
            <button
              onClick={this.props.saveInstance.bind(this, this.props.templateInstance.uniqueId)}
              className="element__savebutton"
              aria-label={`save ${this.props.templateInstance.name}`}>
              <FontAwesome fixedWidth name='save'/>
            </button>
            <button
              onClick={this.showHideElementBody.bind(this)}
              className="element__hidebutton"
              aria-label={`hide ${this.props.templateInstance.name}`}>
              <FontAwesome fixedWidth name={this.state.showElement ? 'angle-double-down': 'angle-double-right'}/>
            </button>
            <button
              onClick={this.props.deleteInstance.bind(this, this.props.templateInstance.uniqueId)}
              className="element__deletebutton"
              aria-label={`remove ${this.props.templateInstance.name}`}>
              <FontAwesome fixedWidth name='close'/>
            </button>
          </div>
        </div>
        <div>
          { this.state.showElement ? this.renderBody() : null }
        </div>
      </div>
    );
  }
}

export default TemplateInstance;
