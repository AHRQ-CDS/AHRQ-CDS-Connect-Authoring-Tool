import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import withGracefulUnmount from 'react-graceful-unmount';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import axios from 'axios';
import FontAwesome from 'react-fontawesome';
import _ from 'lodash';

import {
  setStatusMessage, downloadArtifact, saveArtifact, editArtifact, loadArtifact, updateArtifact,
  initializeArtifact
} from '../actions/artifacts';
import loadTemplates from '../actions/templates';

import ConjunctionGroup from '../components/builder/ConjunctionGroup';
import ConjunctionGroupNew from '../components/builder/ConjunctionGroupNew';
// import ErrorStatement from '../components/builder/ErrorStatement';
// import Parameters from '../components/builder/Parameters';
// import Recommendations from '../components/builder/Recommendations';

// import Subpopulations from '../components/builder/Subpopulations';
// import RepoUploadModal from '../components/builder/RepoUploadModal';
import EditArtifactModal from '../components/artifact/EditArtifactModal';

import isBlankArtifact from '../utils/artifacts';
// import createTemplateInstance from '../utils/templates';
import { findValueAtPath } from '../utils/find';

import artifactProps from '../prop-types/artifact';

const API_BASE = process.env.REACT_APP_API_URL;

// TODO: This is needed because the tree on this.state is not updated in time. Figure out a better way to handle this
let localTree;

const showPresets = mongoId => axios.get(`${API_BASE}/expressions/group/${mongoId}`);

class Builder extends Component {
  constructor(props) {
    super(props);

    this.state = {
      publishEnabled: false,
      showEditArtifactModal: false,
      showPublishModal: false,
      activeTabIndex: 0,
      uniqueIdCounter: 0
    };
  }

  componentDidMount() {
    this.props.loadTemplates().then((result) => {
      // if there is a current artifact, load it, otherwise initialize new artifact
      if (this.props.match.params.id) {
        this.props.loadArtifact(this.props.match.params.id);
      } else {
        const operations = result.data.find(template => template.name === 'Operations');
        const andTemplate = operations.entries.find(entry => entry.name === 'And');
        this.props.initializeArtifact(andTemplate);
      }
    });
  }

  componentWillUnmount() {
    const artifact = this.props.artifact;

    if (!isBlankArtifact(artifact)) {
      this.handleSaveArtifact(artifact);
    }
  }

  // ----------------------- TABS ------------------------------------------ //

  setActiveTab = (tabIndex, callback) => {
    this.setState({ activeTabIndex: tabIndex });

    // This is a bit hacky I guess -- TODO: remove when redux conversion complete
    if (callback) {
      this[callback].call();
    }
  }

  // ----------------------- INSTANCES ------------------------------------- //

  //
  // CALLED: recursively, <ConjunctionGroup />, and <Subpopulations />
  getAllInstances = (treeName, node = null, uid = null) => {
    // if node is null, find and assign tree
    if (node == null) {
      node = this.findTree(treeName, uid).tree; // eslint-disable-line no-param-reassign
    }

    return _.flatten(node.childInstances.map((instance) => {
      if (instance.childInstances) {
        return _.flatten([instance, this.getAllInstances(treeName, instance)]);
      }
      return instance;
    }));
  }

  addInstance = (treeName, instance, parentPath, uid = null, currentIndex = undefined, incomingTree = undefined) => {
    const treeData = this.findTree(treeName, uid);
    const tree = incomingTree || treeData.tree;
    const target = findValueAtPath(tree, parentPath).childInstances;
    const index = currentIndex !== undefined ? currentIndex : target.length;
    target.splice(index, 0, instance); // Insert instance at specific instance - only used for indenting now
    localTree = tree;

    this.setTree(treeName, treeData, tree);
  }

  // Saves a particular expression to the backend
  saveInstance = (treeName, path, uid = null) => {
    const tree = this.findTree(treeName, uid).tree;
    const target = findValueAtPath(tree, path);

    if (target) {
      if (target._id) {
        axios.put(`${API_BASE}/expressions`, target)
          .then((result) => {
            console.log('Done');
          })
          .catch((error) => {
            console.log('Fail', error);
          });
      } else {
        axios.post(`${API_BASE}/expressions`, target)
          .then((result) => {
            console.log('Done');
          })
          .catch((error) => {
            console.log('Fail', error);
          });
      }
    }
  }

  editInstance = (treeName, editedParams, path, editingConjunctionType = false, uid = null) => {
    const treeData = this.findTree(treeName, uid);
    const tree = treeData.tree;
    const target = findValueAtPath(tree, path);

    if (editingConjunctionType) {
      target.id = editedParams.id;
      target.name = editedParams.name;
    } else {
      // function to retrieve relevant parameter
      const paramIndex = target.parameters.findIndex(param =>
        Object.prototype.hasOwnProperty.call(editedParams, param.id));

      target.parameters[paramIndex].value = editedParams[target.parameters[paramIndex].id];
    }

    this.setTree(treeName, treeData, tree);
  }

  deleteInstance = (treeName, path, elementsToAdd = undefined, uid = null) => {
    const treeData = this.findTree(treeName, uid);
    const tree = treeData.tree;
    const index = path.slice(-1);
    const target = findValueAtPath(tree, path.slice(0, path.length - 2));
    target.splice(index, 1); // remove item at index position

    this.setTree(treeName, treeData, tree);
    localTree = tree;

    // elementsToAdd is an array of elements to be readded when indenting or outdenting
    if (elementsToAdd) {
      elementsToAdd.forEach((element) => {
        this.addInstance(treeName, element.instance, element.path, uid, element.index, localTree);
      });
    }
  }

  // subpop_index is an optional parameter, for determing which tree within subpop we are referring to
  updateInstanceModifiers = (treeName, modifiers, path, subpopIndex) => {
    const tree = _.cloneDeep(this.props.artifact[treeName]);
    const valuePath = _.isNumber(subpopIndex) ? tree[subpopIndex] : tree;
    const target = findValueAtPath(valuePath, path);
    target.modifiers = modifiers;

    this.props.updateArtifact({ [treeName]: tree });
  }

  // ----------------------- ARTIFACTS ------------------------------------- //

  getArtifact() {
    return { name: this.state.name, version: this.state.version };
  }

  openEditArtifactModal = () => {
    this.setState({ showEditArtifactModal: true });
  }

  closeEditArtifactModal = () => {
    this.setState({ showEditArtifactModal: false });
  }

  handleSaveArtifact = (artifact) => {
    if (this.state.id) {
      this.props.editArtifact(artifact);
      this.closeEditArtifactModal(false);
    } else {
      this.props.saveArtifact(artifact);
    }
  }

  handleEditArtifact = (name, version) => {
    this.props.updateArtifact({ name, version });
    this.closeEditArtifactModal(false);
  }

  // ----------------------- TREES ----------------------------------------- //

  // Identifies tree to modify whether state tree or tree in an array.
  findTree = (treeName, uid) => {
    const clonedTree = _.cloneDeep(this.props.artifact[treeName]);
    if (uid == null) { return { tree: clonedTree }; }

    const index = clonedTree.findIndex(sub => sub.uniqueId === uid);
    return { array: clonedTree, tree: clonedTree[index], index };
  }

  // Sets new tree based on if state tree or array tree
  setTree = (treeName, treeData, tree) => {
    if ('array' in treeData) {
      const index = treeData.index;
      treeData.array[index] = tree;
      this.props.updateArtifact({ [treeName]: treeData.array });
    } else {
      this.props.updateArtifact({ [treeName]: tree });
    }
  }

  // ----------------------------------------------------------------------- //

  incrementUniqueIdCounter = () => {
    this.setState({ uniqueIdCounter: this.state.uniqueIdCounter + 1 });
  }

  updateRecsSubpop = (newName, uniqueId) => {
    const recs = _.cloneDeep(this.state.recommendations);
    for (let i = 0; i < recs.length; i++) {
      const subpops = recs[i].subpopulations;
      for (let j = 0; j < subpops.length; j++) {
        if (subpops[j].uniqueId === uniqueId) {
          subpops[j].subpopulationName = newName;
        }
      }
    }
    this.setState({ recommendations: recs });
  }

  setPreset = (treeName, preset, path, uid = null) => {
    const treeData = this.findTree(treeName, uid);
    const tree = treeData.tree;
    const target = findValueAtPath(tree, path);

    Object.assign(target, preset);
    this.setTree(treeName, treeData, tree);
  }

  updateState = (newState) => {
    this.setState(newState);
  }

  updateSubpopulations = (updatedSubpopulations) => {
    this.setState({ subpopulations: updatedSubpopulations });
  }

  checkSubpopulationUsage = (uniqueId) => {
    for (let i = 0; i < this.state.recommendations.length; i++) {
      const subpops = this.state.recommendations[i].subpopulations;
      for (let j = 0; j < subpops.length; j++) {
        if (subpops[j].uniqueId === uniqueId) {
          return true;
        }
      }
    }
    return false;
  }

  togglePublishModal = () => {
    this.setState({ showPublishModal: !this.state.showPublishModal });
  }

  updateParameters = (BooleanParameter) => {
    this.setState({ booleanParameters: BooleanParameter });
  }

  // ----------------------- RENDER ---------------------------------------- //

  renderConjunctionGroup = (treeName) => {
    const { artifact } = this.props;
    const namedBooleanParameters = _.filter(this.state.booleanParameters, p => (!_.isNull(p.name) && p.name.length));

    if (artifact && artifact[treeName].childInstances) {
      return (
        <ConjunctionGroup
          root={ true }
          name={ treeName }
          instance={ this.state[treeName] }
          booleanParameters={ namedBooleanParameters }
          addInstance={ this.addInstance }
          editInstance={ this.editInstance }
          updateInstanceModifiers={ this.updateInstanceModifiers }
          deleteInstance={ this.deleteInstance }
          saveInstance={ this.saveInstance }
          getAllInstances={ this.getAllInstances }
          showPresets={ showPresets }
          setPreset={ this.setPreset }
          categories={ this.props.templates } />
      );
    }

    return <div>Loading...</div>;
  }

  renderConjunctionGroupNew = (treeName) => {
    const { artifact, templates } = this.props;
    const namedBooleanParameters = _.filter(artifact.booleanParameters, p => (!_.isNull(p.name) && p.name.length));

    if (artifact && artifact[treeName].childInstances) {
      return (
        <ConjunctionGroupNew
          root={true}
          treeName={treeName}
          artifact={artifact}
          templates={templates}
          instance={artifact[treeName]}
          editInstance={this.editInstance}
          deleteInstance={this.deleteInstance}
          getAllInstances={this.getAllInstances}
          updateInstanceModifiers={this.updateInstanceModifiers}
          booleanParameters={namedBooleanParameters}
          showPresets={showPresets}
          setPreset={this.setPreset} />
      );
    }

    return <div>Loading...</div>;
  }

  renderHeader() {
    const { publishEnabled } = this.state;
    const { statusMessage, artifact } = this.props;
    const artifactName = artifact ? artifact.name : null;

    return (
      <header className="builder__header" aria-label="Workspace Header">
        <h2 className="builder__heading">
          <button aria-label="Edit" className="secondary-button" onClick={this.openEditArtifactModal}>
            <FontAwesome name="pencil" />
          </button>

          {artifactName}
        </h2>

        <div className="builder__buttonbar">
          <div className="builder__buttonbar-menu" aria-label="Workspace Menu">
            <button onClick={() => this.props.downloadArtifact(artifact)} className="secondary-button">
              <FontAwesome name="download" className="icon" />Download CQL
            </button>

            <button onClick={() => this.handleSaveArtifact(artifact)} className="secondary-button">
              <FontAwesome name="save" className="icon" />Save
            </button>

            { publishEnabled ?
              <button
                onClick={() => { this.handleSaveArtifact(artifact); this.togglePublishModal(); }}
                className="secondary-button">
                <FontAwesome name="align-right" className="icon" />Publish
              </button>
              : ''
            }
          </div>

          <div role="status" aria-live="assertive">{statusMessage}</div>
        </div>
      </header>
    );
  }

  render() {
    const { artifact } = this.props;

    if (artifact == null) {
      return (
        <div className="builder" id="maincontent">
          <div className="builder-wrapper">
            <em>Loading...</em>
          </div>
        </div>
      );
    }

    return (
      <div className="builder" id="maincontent">
        <div className="builder-wrapper">
          {this.renderHeader()}

          <section className="builder__canvas">
            <Tabs selectedIndex={this.state.activeTabIndex} onSelect={tabIndex => this.setActiveTab(tabIndex)}>
              <TabList aria-label="Workspace Tabs">
                <Tab>Inclusions</Tab>
                <Tab>Exclusions</Tab>
                <Tab>Subpopulations</Tab>
                <Tab>Recommendations</Tab>
                <Tab>Parameters</Tab>
                <Tab>Handle Errors</Tab>
              </TabList>

              <div className="tab-panel-container">
                <TabPanel>
                  {this.renderConjunctionGroupNew('expTreeInclude')}
                </TabPanel>

                <TabPanel>
                  {/* { this.renderConjunctionGroup('expTreeExclude', namedBooleanParameters) } */}
                </TabPanel>

                <TabPanel>
                  {/* <Subpopulations
                    name={ 'subpopulations' }
                    subpopulations={ this.state.subpopulations }
                    updateSubpopulations={ this.updateSubpopulations }
                    booleanParameters={ namedBooleanParameters }
                    addInstance={ this.addInstance }
                    editInstance={ this.editInstance }
                    updateInstanceModifiers={ this.updateInstanceModifiers }
                    deleteInstance={ this.deleteInstance }
                    saveInstance={ this.saveInstance }
                    getAllInstances={ this.getAllInstances }
                    showPresets={ showPresets }
                    setPreset={ this.setPreset }
                    categories={ this.props.templates }
                    checkSubpopulationUsage={ this.checkSubpopulationUsage }
                    updateRecsSubpop={ this.updateRecsSubpop } /> */}
                </TabPanel>

                <TabPanel>
                  {/* <Recommendations
                    updateRecommendations={ this.updateState }
                    recommendations={ this.state.recommendations }
                    subpopulations={ this.state.subpopulations }
                    setActiveTab={ this.setActiveTab }
                    uniqueIdCounter={ this.state.uniqueIdCounter }
                    incrementUniqueIdCounter={ this.incrementUniqueIdCounter } /> */}
                </TabPanel>

                <TabPanel>
                  {/* <Parameters
                    booleanParameters={ this.state.booleanParameters }
                    updateParameters={ this.updateParameters } /> */}
                </TabPanel>

                <TabPanel>
                  {/* <ErrorStatement
                    booleanParameters={ namedBooleanParameters }
                    subpopulations={ this.state.subpopulations }
                    errorStatement={ this.state.errorStatement }
                    updateParentState={ this.updateState } /> */}
                </TabPanel>
              </div>
            </Tabs>
          </section>
        </div>

        {/* <RepoUploadModal
            showModal={this.state.showPublishModal}
            closeModal={this.togglePublishModal}
            prepareArtifact={this.prepareArtifact}
            version={this.state.version} /> */}

        <EditArtifactModal
          artifactEditing={artifact}
          showModal={this.state.showEditArtifactModal}
          closeModal={this.closeEditArtifactModal}
          saveModal={this.handleEditArtifact} />
      </div>
    );
  }
}

Builder.propTypes = {
  artifact: artifactProps,
  statusMessage: PropTypes.string,
  templates: PropTypes.array,
  loadTemplates: PropTypes.func.isRequired,
  loadArtifact: PropTypes.func.isRequired,
  initializeArtifact: PropTypes.func.isRequired,
  updateArtifact: PropTypes.func.isRequired,
  setStatusMessage: PropTypes.func.isRequired,
  downloadArtifact: PropTypes.func.isRequired,
  saveArtifact: PropTypes.func.isRequired,
  editArtifact: PropTypes.func.isRequired
};

// these props are used for dispatching actions
function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    loadTemplates,
    loadArtifact,
    initializeArtifact,
    updateArtifact,
    setStatusMessage,
    downloadArtifact,
    saveArtifact,
    editArtifact
  }, dispatch);
}

// these props come from the application's state when it is started
function mapStateToProps(state) {
  return {
    artifact: state.artifacts.artifact,
    statusMessage: state.artifacts.statusMessage,
    templates: state.templates.templates
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(withGracefulUnmount(Builder));
