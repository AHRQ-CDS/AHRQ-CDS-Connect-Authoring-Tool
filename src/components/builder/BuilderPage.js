import React, { Component, PropTypes } from 'react';
import axios from 'axios';
import FileSaver from 'file-saver';
import _ from 'lodash';

import ConjunctionGroup from './ConjunctionGroup';
import Config from '../../../config'
import { createTemplateInstance } from './TemplateInstance';

// Suppress is a flag that is specific to an element. It should not be inherited by children
const ELEMENT_SPECIFIC_FIELDS = ['suppress'];
const API_BASE = Config.api.baseUrl;

const showPresets = (mongoId) => {
  return axios.get(`${API_BASE}/expressions/group/${mongoId}`);
}

const getValueAtPath = (obj, path) => {
    if (typeof path === "string") {
      path = path.split(".");
    }

    if (path.length > 1) {
      if (!path[0].length) {
        path.shift();
        return getValueAtPath(obj, path);
      }
      var e = path.shift();
      if (Object.prototype.toString.call(obj[e]) === '[object Object]'
          || Object.prototype.toString.call(obj[e]) === '[object Array]') {
        return getValueAtPath(obj[e], path);
      } else {
        return getValueAtPath({}, path)
      }
    } else {
      // Probably at the root
      if (obj[path[0]] === undefined || obj[path[0]].length === 0) {
        return obj;
      }
      return obj[path[0]];
    }
}

class BuilderPage extends Component {
  static contextTypes = {
    router: PropTypes.object
  };

  constructor(props) {
    super(props);

    this.state = {
      instanceTree: {},
      name: 'Untitled Artifact',
      id: null,
      version: null,
      categories: []
    };
  }

  // Loads templates and checks if existing artifact
  componentDidMount() {
    axios.get(`${API_BASE}/config/templates`)
      .then((result) => {
        this.setState({categories : result.data});
        this.manageTemplateExtensions();
        if (this.props.match.params.id) {
          this.loadExistingArtifact();
        } else {
          const operations = result.data.find(g => g.name === 'Operations');
          const andTemplate = operations.entries.find(e => e.name === 'And');
          this.initializeInstanceTree(andTemplate);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }

  // Loads an existing artifact
  loadExistingArtifact = () => {
    // fetch the relevant artifact from the server.
    const id = this.props.match.params.id;
    axios.get(`${API_BASE}/artifacts/${id}`)
      .then((res) => {
        const artifact = res.data[0];
        this.setState({ id: artifact._id });
        this.setState({ name: artifact.name });
        this.setState({ version: artifact.version });
        this.setState({ instanceTree: artifact.instanceTree });
      });
  }

  manageTemplateExtensions = () => {
    const entryMap = {};
    this.state.categories.forEach((cat) => {
      cat.entries.forEach((entry) => {
        entryMap[entry.id] = entry;
      });
    });

    Object.keys(entryMap).forEach((key) => {
      const entry = entryMap[key];
      if (entry.extends) {
        this.mergeInParentTemplate(entry, entryMap);
      }
    });

    // This is needed to update the state because the functions above are manually updating
    // this.state.groups without using React's this.setState
    this.setState({ groups: this.state.groups });
  }

  mergeInParentTemplate = (entry, entryMap) => {
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
      const matchingParameter = _.find(parent.parameters, { id: parameter.id });
      _.merge(parameter, matchingParameter);
    });
    const missing = _.differenceBy(parent.parameters, entry.parameters, 'id');
    entry.parameters = missing.concat(entry.parameters); // eslint-disable-line no-param-reassign
  }

  downloadCQL = () => {
    const artifact = {
      name: this.state.name,
      instanceTree: this.state.instanceTree
    };
    axios({
      method: 'post',
      url: `${API_BASE}/cql`,
      responseType: 'blob',
      data: artifact
    })
      .then((result) => {
        FileSaver.saveAs(result.data, 'cql.zip');
      })
      .catch((error) => {
        console.error(error);
      });
  }

  saveArtifact = (exitPage) => {
    const artifact = { name: this.state.name, instanceTree: this.state.instanceTree };
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

  saveInstance = (path) => {
    const target = getValueAtPath(path);

    if (target) {
      axios.post(`${API_BASE}/expressions`, target)
        .then((result) => {
          console.log('Done');
        })
        .catch((error) => {
          console.log('Fail');
        });
    }
  }

  initializeInstanceTree = (template) => {
    const instance = createTemplateInstance(template);
    const nameParam = instance.parameters.find(param => param.id === 'element_name');
    instance.name = '';
    instance.path = '';
    nameParam.value = 'Includes';

    this.setState({ instanceTree: instance });
  }

  addInstance = (instance, parentPath) => {
    const tree = _.cloneDeep(this.state.instanceTree);
    const target = getValueAtPath(tree, parentPath).childInstances;
    const index = target.length;
    instance.path = parentPath + '.childInstances.' + index;
    target.push(instance);

    this.setState({ instanceTree: tree });
  }

  editInstance = (editedParams, path, editingConjunctionType = false) => {
    const tree = _.cloneDeep(this.state.instanceTree);
    const target = getValueAtPath(tree, path);

    if (editingConjunctionType) {
      target.id = editedParams.id;
      target.name = editedParams.name;
    } else {
      // function to retrieve relevant parameter
      const paramIndex = target.parameters.findIndex(
        param => Object.prototype.hasOwnProperty.call(editedParams, param.id));

      target.parameters[paramIndex].value = editedParams[target.parameters[paramIndex].id];
    }

    this.setState({ instanceTree: tree });
  }

  deleteInstance = (path) => {
    const tree = _.cloneDeep(this.state.instanceTree);
    const index = path.slice(-1);
    path = path.slice(0, path.length - 2);
    const target = getValueAtPath(tree, path);
    target.splice(index, 1);

    this.setState({ instanceTree: tree});
  }

  getAllInstances = (node = this.state.instanceTree) => {
    return _.flatten(node.childInstances.map(instance => {
      if (instance.childInstances) {
        return _.flatten([instance, this.getAllInstances(instance)]);
      }
      return instance;
    }));
  }

  render() {
    return (
      <div className="builder">
        <header className="builder__header">
          <h2 className="builder__heading">{ this.state.name }</h2>
          <div className="builder__buttonbar">
            <button onClick={ () => this.saveArtifact(false) }
              className="builder__savebutton is-unsaved">
              Save and Continue
            </button>
            <button onClick={ this.downloadCQL }
              className="builder__cqlbutton is-unsaved">
              Download CQL
            </button>
            <button onClick={ () => this.saveArtifact(true) }
              className="builder__deletebutton">
              Save and Close
            </button>
          </div>
        </header>
        <section className="builder__canvas">
          {
            this.state.instanceTree.childInstances ?
              <ConjunctionGroup
                root={ true }
                instance={ this.state.instanceTree }
                addInstance={ this.addInstance }
                editInstance={ this.editInstance }
                deleteInstance={ this.deleteInstance }
                saveInstance={ this.saveInstance }
                getAllInstances={ this.getAllInstances }
                showPresets={ showPresets }
                categories={ this.state.categories }
              />
            :
              <p>Loading...</p>
          }
        </section>
      </div>
    );
  }
}

export default BuilderPage;
