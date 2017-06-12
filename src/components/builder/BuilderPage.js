import React, { Component, PropTypes } from 'react';
import axios from 'axios';
import update from 'immutability-helper';
import FileSaver from 'file-saver';
import _ from 'lodash';

import BuilderSubPalette from './BuilderSubPalette';
import BuilderPalette from './BuilderPalette';
import BuilderTarget from './BuilderTarget';
import groups from '../../data/templates';
import Config from '../../../config'

// Suppress is a flag that is specific to an element. It should not be inherited by children
const ELEMENT_SPECIFIC_FIELDS = ['suppress'];
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
      });
    });
    Object.keys(entryMap).forEach((key) => {
      let entry = entryMap[key];
      if (entry.extends) {
        this.mergeInParentTemplate(entry, entryMap);
      }
    });
  }
  mergeInParentTemplate(entry, entryMap) {
    let parent = entryMap[entry.extends]
    if (parent.extends) {
      // handle transitive
      this.mergeInParentTemplate(parent, entryMap);
    }
    
    /* Merge entry fields with parent but remove fields that are should not be inherited.
     * This merges the entry into the parent (minus non-inherited fields) so the entry updates the fields 
     * it sets itself so inheritance works correctly. Then merge that object back onto entry so that 
     * the entry object has the new updated values */
    _.merge(entry, _.merge(_.omit(_.cloneDeep(parent), ELEMENT_SPECIFIC_FIELDS), entry));

    // merge parameters
    entry.parameters.forEach((parameter) => {
      let matchingParameter = _.find(parent.parameters, { 'id': parameter.id});
      _.merge(parameter, matchingParameter);

    });
    let missing = _.differenceBy(parent.parameters, entry.parameters, 'id');
    entry.parameters = missing.concat(entry.parameters);
  }

  downloadCQL() {
    const artifact = {
      name: this.state.name,
      templateInstances: this.state.templateInstances
    };
    axios({
      method : 'post',
      url : `${API_BASE}/cql`,
      responseType : 'blob',
      data : artifact
    })
      .then((result) => {
        FileSaver.saveAs(result.data, 'cql.zip');
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
        <section className="builder__panel">
          <div className="builder__sidebar">
            <BuilderPalette
              selectedGroup={this.state.selectedGroup}
              templateInstances={this.state.templateInstances}
              updateTemplateInstances={this.setTemplateInstances} />
            {this.renderSidebar()}
          </div>
          <BuilderTarget
            updateTemplateInstances={this.setTemplateInstances}
            updateSingleElement={this.updateSingleElement}
            templateInstances={this.state.templateInstances} />
        </section>
      </div>
    );
  }
}

export default BuilderPage;
