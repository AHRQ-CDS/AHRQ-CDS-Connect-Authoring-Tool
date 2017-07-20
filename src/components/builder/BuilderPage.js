import React, { Component, PropTypes } from 'react';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import axios from 'axios';
import FileSaver from 'file-saver';
import _ from 'lodash';
import moment from 'moment';

import ConjunctionGroup from './ConjunctionGroup';
import Recommendations from './Recommendations';
import Subpopulations from './Subpopulations';
import Config from '../../../config'
import { createTemplateInstance } from './TemplateInstance';

// Suppress is a flag that is specific to an element. It should not be inherited by children
const ELEMENT_SPECIFIC_FIELDS = ['suppress'];
const API_BASE = Config.api.baseUrl;

const showPresets = mongoId => axios.get(`${API_BASE}/expressions/group/${mongoId}`);

const getValueAtPath = (obj, path) => {
  if (typeof path === 'string') {
    path = path.split('.');
  }

  if (path.length > 1) {
    if (!path[0].length) {
      path.shift();
      return getValueAtPath(obj, path);
    }
    const e = path.shift();
    if (Object.prototype.toString.call(obj[e]) === '[object Object]'
          || Object.prototype.toString.call(obj[e]) === '[object Array]') {
      return getValueAtPath(obj[e], path);
    }
    return getValueAtPath({}, path);
  }
      // Probably at the root
  if (obj[path[0]] === undefined || obj[path[0]].length === 0) {
    return obj;
  }
  return obj[path[0]];
};

class BuilderPage extends Component {
  static contextTypes = {
    router: PropTypes.object
  };

  constructor(props) {
    super(props);

    this.state = {
      expTreeInclude: {},
      expTreeExclude: {},
      recommendations: [],
      subpopulations: [],
      name: 'Untitled Artifact',
      id: null,
      version: null,
      categories: [],
      statusMessage: null,
      activeTabIndex: 0
    };
  }

  // Loads templates and checks if existing artifact
  componentDidMount() {
    axios.get(`${API_BASE}/config/templates`)
      .then((result) => {
        this.setState({ categories: result.data });
        this.manageTemplateExtensions();

        const operations = result.data.find(g => g.name === 'Operations');
        const andTemplate = operations.entries.find(e => e.name === 'And');
        this.setState({ andTemplate: andTemplate });

        if (this.props.match.params.id) {
          this.loadExistingArtifact();
        } else {
          this.initializeExpTrees(andTemplate);
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

        if (!artifact.expTreeInclude || !artifact.expTreeExclude) {
          if (!artifact.expTreeInclude) {
            artifact.expTreeInclude = this.initializeExpTree('Includes', this.state.andTemplate);
          }
          if (!artifact.expTreeExclude) {
            artifact.expTreeExclude = this.initializeExpTree('Excludes', this.state.andTemplate);
          }
        }

        this.setState({ expTreeInclude: artifact.expTreeInclude });
        this.setState({ expTreeExclude: artifact.expTreeExclude });
        this.setState({ recommendations: artifact.recommendations });
        this.setState({ subpopulations: artifact.subpopulations });
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
    const parent = entryMap[entry.extends];
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

  // Prepares the artifact for saving/cql download
  prepareArtifact() {
    return {
      name: this.state.name,
      expTreeInclude: this.state.expTreeInclude,
      expTreeExclude: this.state.expTreeExclude,
      recommendations: this.state.recommendations,
      subpopulations: this.state.subpopulations
    };
  }

  // Downloads the cql by making an API call and passing artifact
  downloadCQL = () => {
    console.log(this.prepareArtifact())
    axios({
      method: 'post',
      url: `${API_BASE}/cql`,
      responseType: 'blob',
      data: this.prepareArtifact()
    })
      .then((result) => {
        FileSaver.saveAs(result.data, 'cql.zip');
      })
      .catch((error) => {
        console.error(error);
      });
  }

  // Saves artifact to the database
  saveArtifact = (exitPage) => {
    const artifact = this.prepareArtifact();
    if (this.state.id) { artifact._id = this.state.id; }

    const handleSave = (result) => {
        // TODO:
        // notification on save
      if (result.data._id) { this.setState({ id: result.data._id }); }

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

  // Saves a particular expression to the backend
  saveInstance = (treeName, path, uid=null) => {
    const tree = this.findTree(treeName, uid).tree;
    const target = getValueAtPath(tree, path);

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

  // Initialized and expression tree
  initializeExpTree = (name, template) => {
    const expression = createTemplateInstance(template);
    expression.name = '';
    expression.path = '';
    const nameParam = expression.parameters.find(param => param.id === 'element_name');
    nameParam.value = name;
    return expression;
  }

  // Initializes both includes and excludes
  initializeExpTrees = (template) => {
    const includeExpression = this.initializeExpTree('Inclusions', template);
    const excludeExpression = this.initializeExpTree('Exclusions', template);
    this.setState({ expTreeInclude: includeExpression });
    this.setState({ expTreeExclude: excludeExpression });
  }

  // Identifies tree to modify whether state tree or tree in an array.
  findTree = (treeName, uid) => {
    const clone = _.cloneDeep(this.state[treeName]);
    if (uid == null) {
      return { tree: clone };
    } else {
      const index = clone.findIndex(sub => sub.uniqueId === uid);
      return {
        array: clone,
        tree: clone[index],
        index: index
      };
    }
  }

  // Sets new tree based on if state tree or array tree
  setTree = (treeName, treeData, tree) => {
    if ('array' in treeData) {
      const index = treeData.index;
      treeData.array[index] = tree;
      this.setState({ [treeName]: treeData.array });
    } else {
      this.setState({ [treeName]: tree });
    }
  }

  addInstance = (treeName, instance, parentPath, uid=null) => {
    const treeData = this.findTree(treeName, uid);
    const tree = treeData.tree;
    const target = getValueAtPath(tree, parentPath).childInstances;
    target.push(instance);

    this.setTree(treeName, treeData, tree);
  }

  // subpop_index is an optional parameter, for determing which tree within subpop we are referring to
  updateInstanceModifiers = (treeName, modifiers, path, subpop_index) => {
    const tree = _.cloneDeep(this.state[treeName]);
    const valuePath = _.isNumber(subpop_index) ? tree[subpop_index] : tree;
    const target = getValueAtPath(valuePath, path);
    target.modifiers = modifiers;
    this.setState({ [treeName]: tree });
  }

  editInstance = (treeName, editedParams, path, editingConjunctionType=false, uid=null) => {
    const treeData = this.findTree(treeName, uid);
    const tree = treeData.tree;
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

    this.setTree(treeName, treeData, tree);
  }

  deleteInstance = (treeName, path, uid=null) => {
    const treeData = this.findTree(treeName, uid);
    const tree = treeData.tree;
    const index = path.slice(-1);
    path = path.slice(0, path.length - 2);
    const target = getValueAtPath(tree, path);
    target.splice(index, 1);

    this.setTree(treeName, treeData, tree);
  }

  updateRecommendations = (newState) => {
    this.setState(newState);
  }

  updateSubpopulations = (updatedSubpopulations) => {
    this.setState({ subpopulations: updatedSubpopulations });
  }

  updateStatusMessage = (statusType) => {
    // TODO: tie this to actual save/download events, consider showing errors
    const time = moment().format('dddd, MMMM Do YYYY, h:mm:ss a');
    switch (statusType) {
      case 'save':
        this.setState({
          statusMessage: `Saved ${time}.`
        });
        break;
      case 'download':
        this.setState({
          statusMessage: `Downloaded ${time}.`
        });
        break;
      case 'publish':
        this.setState({
          statusMessage: `Publishing not available. Saved ${time}.`
        });
        break;
      default:
        this.setState({
          statusMessage: null
        });
    }
  }

  checkSubpopulationUsage = (uid) => {
    for (let i = 0; i < this.state.recommendations.length; i++) {
      let subpops = this.state.recommendations[i].subpopulations;
      for (let j = 0; j < subpops.length; j++) {
        if (subpops[j].uniqueId === uid) {
          return true;
        }
      }
    }
    for (let i = 0; i < this.state.subpopulations.length; i++) {
      ;
    }
  }

  addBlankSubpopulation = () => {
    const newSubpopulation = createTemplateInstance(this.state.andTemplate);
    newSubpopulation.path = '';
    newSubpopulation.subpopulationName = `Subpopulation ${this.state.subpopulations.length + 1}`;
    newSubpopulation.expanded = true;
    const newSubpopulations = this.state.subpopulations.concat([ newSubpopulation ]);

    this.setState({ subpopulations: newSubpopulations })
  }

  setActiveTab = (tabIndex, callback) => {
    this.setState({ activeTabIndex: tabIndex });

    // This is a bit hacky I guess
    if (callback) {
      this[callback].call();
    }
  }

  renderConjunctionGroup = (treeName) => (
      this.state[treeName].childInstances ?
        <ConjunctionGroup
          root={ true }
          name={ treeName }
          instance={ this.state[treeName] }
          addInstance={ this.addInstance }
          editInstance={ this.editInstance }
          updateInstanceModifiers={ this.updateInstanceModifiers }
          deleteInstance={ this.deleteInstance }
          saveInstance={ this.saveInstance }
          showPresets={ showPresets }
          categories={ this.state.categories }
          inSubpopulations={ false }
        />
      :
        <p>Loading...</p>
    )

  render() {
    return (
      <div className="builder">
        <header className="builder__header">
          <h2 className="builder__heading">{ this.state.name }</h2>
          <div className="builder__buttonbar">
            <div className="field has-addons has-addons-right">
              <span className="control">
                <button onClick={ () => { this.updateStatusMessage('download'); this.downloadCQL(); } }
                  className="button builder__cqlbutton is-unsaved">
                  <span className="icon is-small">
                    <i className="fa fa-download"></i>
                  </span>
                  <span>Download CQL</span>
                </button>
              </span>
              <span className="control">
                <button onClick={ () => { this.updateStatusMessage('save'); this.saveArtifact(false); } }
                  className="button builder__savebutton is-unsaved">
                  <span className="icon is-small">
                    <i className="fa fa-save"></i>
                  </span>
                  <span>Save</span>
                </button>
              </span>
              <span className="control">
                <button onClick={ () => { this.updateStatusMessage('publish'); this.saveArtifact(false); } }
                  className="button builder__publishbutton">
                  <span className="icon is-small">
                    <i className="fa fa-align-right"></i>
                  </span>
                  <span>Publish</span>
                </button>
              </span>
            </div>
            <div role="status" aria-live="assertive">{this.state.statusMessage}</div>
          </div>
        </header>
        <section className="builder__canvas">
          <Tabs selectedIndex={this.state.activeTabIndex} onSelect={tabIndex => this.setActiveTab(tabIndex)}>
            <TabList>
              <Tab>Inclusions</Tab>
              <Tab>Exclusions</Tab>
              <Tab>Recommendations</Tab>
              <Tab>Subpopulations</Tab>
            </TabList>
            <TabPanel>
              { this.renderConjunctionGroup('expTreeInclude') }
            </TabPanel>
            <TabPanel>
              { this.renderConjunctionGroup('expTreeExclude') }
            </TabPanel>
            <TabPanel>
              <Recommendations
                updateRecommendations={ this.updateRecommendations }
                recommendations={ this.state.recommendations }
                subpopulations={ this.state.subpopulations }
                setActiveTab={ this.setActiveTab }
                />
            </TabPanel>
            <TabPanel>
              <Subpopulations
                name={ 'subpopulations' }
                subpopulations={ this.state.subpopulations }
                updateSubpopulations={ this.updateSubpopulations }
                addInstance={ this.addInstance }
                editInstance={ this.editInstance }
                updateInstanceModifiers={ this.updateInstanceModifiers }
                deleteInstance={ this.deleteInstance }
                saveInstance={ this.saveInstance }
                showPresets={ showPresets }
                categories={ this.state.categories }
                checkSubpopulationUsage={ this.checkSubpopulationUsage }
              />
            </TabPanel>
          </Tabs>
        </section>
      </div>
    );
  }
}

export default BuilderPage;
