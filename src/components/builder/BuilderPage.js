import React, { Component, PropTypes } from 'react';
import HTML5Backend from 'react-dnd-html5-backend';
import { DragDropContext } from 'react-dnd';
import axios from 'axios';
import update from 'immutability-helper';
import _ from 'lodash';

import BuilderSubPalette from './BuilderSubPalette';
import BuilderPalette from './BuilderPalette';
import BuilderTarget from './BuilderTarget';
import groups from '../../data/templates';
import Config from '../../../config'

const CORE_TEMPLATE_FIELDS = ['id', 'name', 'parameters', 'extends', 'suppress'];
const API_BASE = Config.api.baseUrl;

class BuilderPage extends Component {
  static contextTypes = {
    router: PropTypes.object
  };

  constructor(props) {
    super(props);

    this.state = {
      selectedGroup: null,
      templateInstances: [],
      name: 'Untitled Artifact',
      id: null,
      version: null
    };

    this.setTemplateInstances = this.setTemplateInstances.bind(this);
    this.saveArtifact = this.saveArtifact.bind(this);
    this.downloadCQL = this.downloadCQL.bind(this);
    this.updateSingleElement = this.updateSingleElement.bind(this);
    this.manageTemplateExtensions = this.manageTemplateExtensions.bind(this);
    this.manageTemplateExtensions();
  }

  componentDidMount() {
    if (this.props.match) {
      this.setSelectedGroup(this.props.match.params.group);
      if (this.props.match.params.id) {
        // fetch the relevant artifact from the server.
        const id = this.props.match.params.id;
        axios.get(`${API_BASE}/artifacts/${id}`)
          .then((res) => {
            const artifact = res.data[0];
            this.setState({ id: artifact._id });
            this.setState({ name: artifact.name });
            this.setState({ version: artifact.version });
            this.setState({ templateInstances: artifact.templateInstances });
          });
      }
    }
  }

  manageTemplateExtensions() {
    const entryMap = {};
    groups.forEach((group) => {
      group.entries.forEach((entry) => {
        entryMap[entry.id] = entry;
      })
    })
    Object.values(entryMap).forEach((entry) => {
      if (entry.extends) {
        this.mergeInParentTemplate(entry, entryMap);
      }
    })
  }
  mergeInParentTemplate(entry, entryMap) {
    let extendWithEntry = entryMap[entry.extends]
    if (extendWithEntry.extends) {
      // handle transitive
      this.mergeInParentTemplate(extendWithEntry, entryMap);
    }
    // merge entry fields with parent but remove core fields like ID
    _.mergeWith(entry, _.omit(extendWithEntry, CORE_TEMPLATE_FIELDS), (objectVal, sourceVal, key, object) => {
      // TODO: This is to handle child extensions setting their own returnTypes - there might be a better way to do this
      if(key === 'returnType' && objectVal !== undefined) {
        return object[key] = objectVal;
      }
    });

    // merge parameters
    entry.parameters.forEach((parameter) => {
      let matchingParameter = _.find(extendWithEntry.parameters, { 'id': parameter.id});
      _.merge(parameter, matchingParameter);

    });
    let missing = _.differenceBy(extendWithEntry.parameters, entry.parameters, 'id');
    entry.parameters = missing.concat(entry.parameters);
  }

  downloadCQL() {
    const artifact = {
      name: this.state.name,
      templateInstances: this.state.templateInstances
    };

    axios.post(`${API_BASE}/cql`, artifact)
      .then((result) => {
        const cqlData = result.data;
        const saveElement = document.createElement('a');
        saveElement.href = `data:${cqlData.type},${encodeURIComponent(cqlData.text)}`;
        saveElement.download = `${cqlData.filename}.cql`;
        // Open in a new tab rather than download - convenient for testing
        //saveElement.target = '_blank';
        saveElement.click();
      })
      .catch((error) => {
        console.error(error);
      });
  }

  saveArtifact(exitPage) {
    const artifact = { name: this.state.name, templateInstances: this.state.templateInstances };
    if (this.state.id) artifact._id = this.state.id;

    const handleSave = (result) => {
        // TODO:
        // notification on save
      if (result.data._id) this.setState({ id: result.data._id });

      if (exitPage) {
          // Redirect the page to the artifact list after saving if click "Close" button
        this.context.router.history.push('/artifacts');
      }
    };

    if (this.state.id) {
      axios.put(`${API_BASE}/artifacts`, artifact)
        .then(handleSave)
        .catch((error) => {
          console.error(error);
        });
    } else {
      axios.post(`${API_BASE}/artifacts`, artifact)
        .then(handleSave)
        .catch((error) => {
          console.error(error);
        });
    }
  }

  componentWillReceiveProps(nextProps) {
    if (!nextProps.match) { return; }
    if (this.props.match.params.group !== nextProps.match.params.group) {
      this.setSelectedGroup(nextProps.match.params.group);
    }
  }

  setSelectedGroup(groupId) {
    const group = groups.find(g => parseInt(g.id, 10) === parseInt(groupId, 10));
    if (group) {
      this.setState({ selectedGroup: group });
    } else {
      this.setState({ selectedGroup: null });
    }
  }

  setTemplateInstances(elements) {
    this.setState({ templateInstances: elements });
  }

  updateSingleElement(instanceId, state) {
    const elements = this.state.templateInstances;
    const elementIndex = elements.findIndex(element =>
      // get relevant element
       element.uniqueId === instanceId);

    if (elementIndex !== undefined) {
      // get relevant parameter
      const paramIndex = elements[elementIndex].parameters.findIndex(
        param => Object.prototype.hasOwnProperty.call(state, param.id));

      // edit element with new value using immutability-helper
      const editedElements = update(elements, {
        [elementIndex]: {
          parameters: {
            [paramIndex]: {
              value: { $set: state[elements[elementIndex].parameters[paramIndex].id] }
            }
          }
        }
      });

      // merge back into templateInstances
      this.setState({ templateInstances: editedElements });
    }
  }

  renderSidebar() {
    if (this.state.selectedGroup) {
      return <BuilderSubPalette
        selectedGroup={this.state.selectedGroup}
        updateTemplateInstances={this.setTemplateInstances}
        templateInstances={this.state.templateInstances} />;
    }
    return null;
  }

  render() {
    return (
      <div className="builder">
        <header className="builder__header">
          <h2 className="builder__heading">{this.state.name}</h2>
          <div className="builder__buttonbar">
            <button onClick={() => this.saveArtifact(false)}
              className="builder__savebutton is-unsaved">
              Save and Continue
            </button>
            <button onClick={this.downloadCQL}
              className="builder__cqlbutton is-unsaved">
              CQL
            </button>
            <button onClick={() => this.saveArtifact(true)}
              className="builder__deletebutton">
              Save and Close
            </button>
          </div>
        </header>
        <div className="builder__sidebar">
          <BuilderPalette selectedGroup={this.state.selectedGroup} />
          {this.renderSidebar()}
        </div>
        <BuilderTarget
          updateTemplateInstances={this.setTemplateInstances}
          updateSingleElement={this.updateSingleElement}
          templateInstances={this.state.templateInstances} />
      </div>
    );
  }
}

export default DragDropContext(HTML5Backend)(BuilderPage);
