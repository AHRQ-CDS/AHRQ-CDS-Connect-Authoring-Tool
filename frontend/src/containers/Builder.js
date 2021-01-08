import React, { Component } from 'react';
import PropTypes from 'prop-types';
import withGracefulUnmount from 'react-graceful-unmount';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBook } from '@fortawesome/free-solid-svg-icons';
import { Button, IconButton, Menu, MenuItem } from '@material-ui/core';
import {
  Edit as EditIcon,
  GetApp as GetAppIcon,
  Publish as PublishIcon,
  Save as SaveIcon
} from '@material-ui/icons';
import _ from 'lodash';

import loadTemplates from 'actions/templates';
import { loadConversionFunctions } from 'actions/modifiers';
import {
  setStatusMessage, downloadArtifact, saveArtifact, loadArtifact, updateArtifact, initializeArtifact,
  updateAndSaveArtifact, publishArtifact, clearArtifactValidationWarnings
} from 'actions/artifacts';
import {
  loadExternalCqlList, loadExternalCqlLibraryDetails, addExternalLibrary, deleteExternalCqlLibrary,
  clearExternalCqlValidationWarnings, clearAddLibraryErrorsAndMessages
} from 'actions/external_cql';

import { ELMErrorModal } from 'components/modals';
import BaseElements from 'components/builder/BaseElements';
import ConjunctionGroup from 'components/builder/ConjunctionGroup';
import ArtifactModal from 'components/artifact/ArtifactModal';

import ErrorStatement from 'components/builder/ErrorStatement';
import ExternalCQL from 'components/builder/ExternalCQL';
import Parameters from 'components/builder/Parameters';
import Recommendations from 'components/builder/Recommendations';
import RepoUploadModal from 'components/builder/RepoUploadModal';
import Subpopulations from 'components/builder/Subpopulations';

import isBlankArtifact from 'utils/artifacts/isBlankArtifact';
import { findValueAtPath } from 'utils/find';

import artifactProps from 'prop-types/artifact';

// TODO: This is needed because the tree on this.state is not updated in time. Figure out a better way to handle this
let localTree;

export class Builder extends Component {
  constructor(props) {
    super(props);

    this.state = {
      showArtifactModal: false,
      showPublishModal: false,
      showELMErrorModal: false,
      showMenu: false,
      activeTabIndex: 0,
      uniqueIdCounter: 0,
      downloadMenuAnchorElement: null
    };
  }

  componentDidMount() {
    this.props.loadTemplates().then((result) => {
      // if there is a current artifact, load it, otherwise initialize new artifact
      if (this.props.match.params.id) {
        this.props.loadArtifact(this.props.match.params.id);
      } else {
        const operations = result.templates.find(template => template.name === 'Operations');
        const andTemplate = operations.entries.find(entry => entry.name === 'And');
        const orTemplate = operations.entries.find(entry => entry.name === 'Or');
        this.props.initializeArtifact(andTemplate, orTemplate);
      }
    });
    this.props.loadConversionFunctions();
  }

  componentWillUnmount() {
    const { artifact, isLoggingOut } = this.props;

    if (!isBlankArtifact(artifact) && !isLoggingOut) {
      this.handleSaveArtifact(artifact);
    }
  }

  UNSAFE_componentWillReceiveProps(newProps) { // eslint-disable-line camelcase
    this.setState({ showELMErrorModal: newProps.downloadedArtifact.elmErrors.length > 0 });
  }

  // ----------------------- TABS ------------------------------------------ //

  setActiveTab = (activeTabIndex) => {
    this.setState({ activeTabIndex });
  }

  scrollToElement = (elementId, referenceType, tabIndex = null) => {
    const baseElementTabIndex = 3;
    const parameterTabIndex = 5;

    let activeTabIndex = 0;
    if (referenceType === 'baseElementReference') activeTabIndex = baseElementTabIndex;
    if (referenceType === 'parameterReference') activeTabIndex = parameterTabIndex;
    if (referenceType === 'baseElementUse') activeTabIndex = tabIndex;

    if (activeTabIndex == null) return;

    this.setState({ activeTabIndex }, () => {
      const elementToScrollTo = document.getElementById(elementId);
      if (elementToScrollTo) elementToScrollTo.scrollIntoView();
    });
  }

  // ----------------------- INSTANCES ------------------------------------- //

  getAllInstancesInAllTrees = () => {
    const { artifact } = this.props;
    let allInstancesInAllTrees = this.getAllInstances('expTreeInclude');
    allInstancesInAllTrees = allInstancesInAllTrees.concat(this.getAllInstances('expTreeExclude'));
    artifact.subpopulations.forEach((s) => {
      if (!s.special) {
        allInstancesInAllTrees =
          allInstancesInAllTrees.concat(this.getAllInstances('subpopulations', null, s.uniqueId));
      }
    });
    artifact.baseElements.forEach((baseElement) => {
      allInstancesInAllTrees =
        allInstancesInAllTrees.concat(this.getAllInstances('baseElements', null, baseElement.uniqueId));
    });

    return allInstancesInAllTrees;
  }

  getAllInstances = (treeName, treeInstance = null, uid = null) => {
    // if treeInstance is null, find and assign tree (only used recursively)
    if (treeInstance == null) {
      treeInstance = this.findTree(treeName, uid).tree; // eslint-disable-line no-param-reassign
    }

    // If the tree has no child instances, it is a single element. Only occurs for individual base elements.
    if (!treeInstance.childInstances) {
      treeInstance.tab = treeName;
      return [treeInstance];
    }

    const result = _.flatten((treeInstance.childInstances || []).map((instance) => {
      if (instance.childInstances) {
        return _.flatten([instance, this.getAllInstances(treeName, instance)]);
      }
      instance.tab = treeName;
      return instance;
    }));

    return result;
  }

  addInstance = (treeName, instance, parentPath, uid = null, currentIndex, incomingTree, updatedReturnType = null) => {
    const treeData = this.findTree(treeName, uid);
    const tree = incomingTree || treeData.tree;
    const target = findValueAtPath(tree, parentPath).childInstances;
    const index = currentIndex !== undefined ? currentIndex : target.length;
    target.splice(index, 0, instance); // Insert instance at specific instance - only used for indenting now

    if (updatedReturnType) {
      tree.returnType = updatedReturnType;
    }

    localTree = tree;
    this.setTree(treeName, treeData, tree);
  }

  addBaseElement = (instance, uid = null, incomingTree) => {
    const treeData = this.findTree('baseElements', uid);
    const tree = incomingTree || treeData.tree;
    tree.push(instance);
    this.setTree('baseElements', treeData, tree);
  }

  editInstance = (treeName, editedFields, path, editingConjunctionType = false, uid = null) => {
    const treeData = this.findTree(treeName, uid);
    const tree = treeData.tree;
    const target = findValueAtPath(tree, path);

    if (editingConjunctionType) {
      target.id = editedFields.id;
      target.name = editedFields.name;
    } else {
      // If only one field is being updated, it comes in as a single object. Put it into an array of objects.
      if (!Array.isArray(editedFields)) {
        editedFields = [editedFields]; // eslint-disable-line no-param-reassign
      }
      // Update each field attribute that needs updating. Then updated the full tree with changes.
      editedFields.forEach((editedField) => {
        // function to retrieve relevant field
        const fieldIndex = target.fields.findIndex(field =>
          Object.prototype.hasOwnProperty.call(editedField, field.id));

        // If an attribute was specified, update that one. Otherwise update the value attribute.
        if (editedField.attributeToEdit) {
          target.fields[fieldIndex][editedField.attributeToEdit] = editedField[target.fields[fieldIndex].id];
        } else {
          target.fields[fieldIndex].value = editedField[target.fields[fieldIndex].id];
        }
      });
    }

    this.setTree(treeName, treeData, tree);
  }

  deleteInstance = (treeName, path, elementsToAdd, uid = null, updatedReturnType = null) => {
    const treeData = this.findTree(treeName, uid);
    const tree = treeData.tree;
    const index = path.slice(-1);
    const target = findValueAtPath(tree, path.slice(0, path.length - 2));
    target.splice(index, 1); // remove item at index position

    if (updatedReturnType) {
      tree.returnType = updatedReturnType;
    }

    this.setTree(treeName, treeData, tree);
    localTree = tree;

    // elementsToAdd is an array of elements to be readded when indenting or outdenting
    if (elementsToAdd) {
      elementsToAdd.forEach((element) => {
        this.addInstance(treeName, element.instance, element.path, uid, element.index, localTree);
      });
    }
  }

  // subpop_index is an optional parameter, for determining which tree within subpop we are referring to
  updateInstanceModifiers = (treeName, modifiers, path, subpopIndex, updatedReturnType = null) => {
    const tree = _.cloneDeep(this.props.artifact[treeName]);
    const valuePath = _.isNumber(subpopIndex) ? tree[subpopIndex] : tree;
    const target = findValueAtPath(valuePath, path);
    target.modifiers = modifiers;

    if (updatedReturnType) {
      valuePath.returnType = updatedReturnType;
    }

    this.props.updateArtifact(this.props.artifact, { [treeName]: tree });
  }


  showELMErrorModal = () => {
    this.setState({ showELMErrorModal: true });
  }

  closeELMErrorModal = () => {
    this.setState({ showELMErrorModal: false });
    this.props.clearArtifactValidationWarnings();
  }

  // ----------------------- ARTIFACTS ------------------------------------- //

  openArtifactModal = () => {
    this.setState({ showArtifactModal: true });
  }

  closeArtifactModal = () => {
    this.setState({ showArtifactModal: false });
  }


  handleSaveArtifact = (artifactPropsChanged) => {
    this.props.updateAndSaveArtifact(this.props.artifact, artifactPropsChanged);
    this.closeArtifactModal(false);
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
      this.props.updateArtifact(this.props.artifact, { [treeName]: treeData.array });
    } else {
      this.props.updateArtifact(this.props.artifact, { [treeName]: tree });
    }
  }

  // ----------------------------------------------------------------------- //

  incrementUniqueIdCounter = () => {
    this.setState({ uniqueIdCounter: this.state.uniqueIdCounter + 1 });
  }

  updateRecsSubpop = (newName, uniqueId) => {
    const recs = _.cloneDeep(this.props.artifact.recommendations);
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

  updateSubpopulations = (subpopulations, target = 'subpopulations') => {
    this.props.updateArtifact(this.props.artifact, { [target]: subpopulations });
  }

  updateRecommendations = (recommendations) => {
    this.props.updateArtifact(this.props.artifact, { recommendations });
  }

  updateParameters = (parameters) => {
    this.props.updateArtifact(this.props.artifact, { parameters });
  }

  updateErrorStatement = (errorStatement) => {
    this.props.updateArtifact(this.props.artifact, { errorStatement });
  }

  checkSubpopulationUsage = (uniqueId) => {
    for (let i = 0; i < this.props.artifact.recommendations.length; i++) {
      const subpops = this.props.artifact.recommendations[i].subpopulations;
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

  handleClickDownloadMenu = event => {
    this.setState({ downloadMenuAnchorElement: event.currentTarget });
  };

  handleCloseDownloadMenu = () => {
    this.setState({ downloadMenuAnchorElement: null });
  };

  downloadOptionSelected = (disabled, version) => {
    const { artifact } = this.props;
    if (!disabled) this.props.downloadArtifact(artifact, { name: 'FHIR', version });
    this.handleCloseDownloadMenu();
  }

  // ----------------------- RENDER ---------------------------------------- //

  renderConjunctionGroup = (treeName) => {
    const {
      artifact,
      conversionFunctions,
      isLoadingModifiers,
      modifierMap,
      modifiersByInputType,
      templates
    } = this.props;
    const namedParameters = _.filter(artifact.parameters, p => (!_.isNull(p.name) && p.name.length));

    if (artifact && artifact[treeName].childInstances) {
      return (
        <ConjunctionGroup
          addInstance={this.addInstance}
          artifact={artifact}
          baseElements={artifact.baseElements}
          conversionFunctions={conversionFunctions}
          deleteInstance={this.deleteInstance}
          editInstance={this.editInstance}
          externalCqlList={this.props.externalCqlList}
          getAllInstances={this.getAllInstances}
          getAllInstancesInAllTrees={this.getAllInstancesInAllTrees}
          instance={artifact[treeName]}
          instanceNames={this.props.names}
          isLoadingModifiers={isLoadingModifiers}
          loadExternalCqlList={this.props.loadExternalCqlList}
          modifierMap={modifierMap}
          modifiersByInputType={modifiersByInputType}
          parameters={namedParameters}
          root={true}
          scrollToElement={this.scrollToElement}
          templates={templates}
          treeName={treeName}
          updateInstanceModifiers={this.updateInstanceModifiers}
          vsacApiKey={this.props.vsacApiKey}
        />
      );
    }

    return <div>Loading...</div>;
  }

  renderHeader() {
    const { statusMessage, artifact, publishEnabled } = this.props;
    const { downloadMenuAnchorElement } = this.state;
    const artifactName = artifact ? artifact.name : null;
    let disableDSTU2 = false;
    let disableSTU3 = false;
    let disableR4 = false;

    const artifactFHIRVersion = artifact.fhirVersion;
    if (artifactFHIRVersion === '1.0.2') {
      disableSTU3 = true;
      disableR4 = true;
    }
    if (artifactFHIRVersion === '3.0.0') {
      disableDSTU2 = true;
      disableR4 = true;
    }
    if (artifactFHIRVersion === '4.0.0') {
      disableDSTU2 = true;
      disableSTU3 = true;
    }

    return (
      <header className="builder__header" aria-label="Workspace Header">
        <h2 className="builder__heading">
          <IconButton aria-label="edit" onClick={this.openArtifactModal}>
            <EditIcon />
          </IconButton>

          {artifactName}
        </h2>

        <div className="builder__buttonbar">
          <div className="builder__buttonbar-menu" aria-label="Workspace Menu">
            <Button
              aria-controls="download-menu"
              aria-haspopup="true"
              onClick={this.handleClickDownloadMenu}
              startIcon={<GetAppIcon />}
              variant="contained"
            >
              Download CQL
            </Button>

            <Menu
              anchorEl={downloadMenuAnchorElement}
              id="download-menu"
              keepMounted
              onClose={this.handleCloseDownloadMenu}
              open={Boolean(downloadMenuAnchorElement)}
            >
              <MenuItem disabled={disableDSTU2} onClick={() => this.downloadOptionSelected(disableDSTU2, '1.0.2')}>
                FHIR<sup>®</sup> DSTU2
              </MenuItem>

              <MenuItem disabled={disableSTU3} onClick={() => this.downloadOptionSelected(disableSTU3, '3.0.0')}>
                FHIR<sup>®</sup> STU3
              </MenuItem>

              <MenuItem disabled={disableR4} onClick={() => this.downloadOptionSelected(disableR4, '4.0.0')}>
                FHIR<sup>®</sup> R4
              </MenuItem>
            </Menu>

            <Button
              onClick={() => this.handleSaveArtifact(artifact)}
              startIcon={<SaveIcon />}
              variant="contained"
            >
              Save
            </Button>

            {publishEnabled &&
              <Button
                onClick={() => { this.handleSaveArtifact(artifact); this.togglePublishModal(); }}
                startIcon={<PublishIcon />}
                variant="contained"
              >
                Publish
              </Button>
            }
          </div>

          <div role="status" aria-live="assertive">{statusMessage}</div>
        </div>
      </header>
    );
  }

  render() {
    const {
      addExternalLibrary,
      addExternalCqlLibraryError,
      addExternalCqlLibraryErrorMessage,
      artifact,
      clearAddLibraryErrorsAndMessages,
      clearExternalCqlValidationWarnings,
      conversionFunctions,
      deleteExternalCqlLibrary,
      downloadedArtifact,
      externalCqlErrors,
      externalCqlFhirVersion,
      externalCqlLibrary,
      externalCqlLibraryDetails,
      externalCQLLibraryParents,
      externalCqlList,
      isLoadingExternalCqlDetails,
      isAddingExternalCqlLibrary,
      isLoadingModifiers,
      librariesInUse,
      loadExternalCqlLibraryDetails,
      loadExternalCqlList,
      modifierMap,
      modifiersByInputType,
      names,
      templates,
      vsacApiKey
    } = this.props;
    const { activeTabIndex, showArtifactModal, showELMErrorModal, showPublishModal, uniqueIdCounter } = this.state;

    let namedParameters = [];
    if (artifact) {
      namedParameters = _.filter(artifact.parameters, p => (!_.isNull(p.name) && p.name.length));
    }

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
            <Tabs selectedIndex={activeTabIndex} onSelect={tabIndex => this.setActiveTab(tabIndex)}>
              <TabList aria-label="Workspace Tabs">
                <Tab>Inclusions</Tab>
                <Tab>Exclusions</Tab>
                <Tab>Subpopulations</Tab>
                <Tab>Base Elements</Tab>
                <Tab>Recommendations</Tab>
                <Tab>Parameters</Tab>
                <Tab>Handle Errors</Tab>
                <Tab>
                  <FontAwesomeIcon icon={faBook} /> External CQL
                </Tab>
              </TabList>

              <div className="tab-panel-container">
                <TabPanel>
                  <div className="workspace-blurb">
                    Specify criteria to identify a target population that should receive a recommendation from this
                    artifact. Examples might include an age range, gender, presence of a certain condition, or lab
                    results within a specific range.
                  </div>
                  {this.renderConjunctionGroup('expTreeInclude')}
                </TabPanel>

                <TabPanel>
                  <div className="workspace-blurb">
                    Specify criteria to identify patients that should be excluded from the target population and,
                    therefore, from receiving a recommendation from this artifact. Examples might include pregnancy
                    status, out of bound lab results, or evidence that the recommended therapy is already being used
                    by the patient.
                  </div>
                  {this.renderConjunctionGroup('expTreeExclude')}
                </TabPanel>

                <TabPanel>
                  <div className="workspace-blurb">
                    Specify criteria that further segments the target population into subpopulations that should
                    receive more specific recommendations. An example might be splitting the population by risk score
                    so that higher risk patients receive a stronger recommendation than lower risk patients.
                  </div>

                  <Subpopulations
                    addInstance={this.addInstance}
                    artifact={artifact}
                    baseElements={artifact.baseElements}
                    checkSubpopulationUsage={this.checkSubpopulationUsage}
                    conversionFunctions={conversionFunctions}
                    deleteInstance={this.deleteInstance}
                    editInstance={this.editInstance}
                    externalCqlList={externalCqlList}
                    getAllInstances={this.getAllInstances}
                    getAllInstancesInAllTrees={this.getAllInstancesInAllTrees}
                    instanceNames={names}
                    isLoadingModifiers={isLoadingModifiers}
                    loadExternalCqlList={loadExternalCqlList}
                    modifierMap={modifierMap}
                    modifiersByInputType={modifiersByInputType}
                    name={'subpopulations'}
                    parameters={namedParameters}
                    scrollToElement={this.scrollToElement}
                    templates={templates}
                    updateInstanceModifiers={this.updateInstanceModifiers}
                    updateRecsSubpop={this.updateRecsSubpop}
                    updateSubpopulations={this.updateSubpopulations}
                    vsacApiKey={vsacApiKey}
                  />
                </TabPanel>

                <TabPanel>
                  <div className="workspace-blurb">
                    Specify individual elements that can be re-used in the Inclusions, Exclusions, and Subpopulations,
                    or should standalone as independent expressions in the resulting artifact. An example might be a lab
                    result value that is referenced multiple times throughout the artifact.
                  </div>

                  <BaseElements
                    addBaseElement={this.addBaseElement}
                    addInstance={this.addInstance}
                    baseElements={artifact.baseElements}
                    conversionFunctions={conversionFunctions}
                    deleteInstance={this.deleteInstance}
                    editInstance={this.editInstance}
                    externalCqlList={externalCqlList}
                    getAllInstances={this.getAllInstances}
                    getAllInstancesInAllTrees={this.getAllInstancesInAllTrees}
                    instance={artifact}
                    instanceNames={names}
                    isLoadingModifiers={isLoadingModifiers}
                    loadExternalCqlList={loadExternalCqlList}
                    modifierMap={modifierMap}
                    modifiersByInputType={modifiersByInputType}
                    parameters={namedParameters}
                    scrollToElement={this.scrollToElement}
                    templates={templates}
                    treeName='baseElements'
                    updateBaseElementLists={this.updateSubpopulations}
                    updateInstanceModifiers={this.updateInstanceModifiers}
                    validateReturnType={false}
                    vsacApiKey={vsacApiKey}
                  />
                </TabPanel>

                <TabPanel>
                  <div className="workspace-blurb">
                    Specify the text-based recommendations that should be delivered to the clinician when a patient
                    meets the eligible criteria as defined in the artifact. Examples might include recommendations to
                    order a medication, perform a test, or provide the patient educational materials.
                  </div>

                  <Recommendations
                    artifact={artifact}
                    templates={templates}
                    updateRecommendations={this.updateRecommendations}
                    updateSubpopulations={this.updateSubpopulations}
                    setActiveTab={this.setActiveTab}
                    uniqueIdCounter={uniqueIdCounter}
                    incrementUniqueIdCounter={this.incrementUniqueIdCounter}
                  />
                </TabPanel>

                <TabPanel>
                  <div className="workspace-blurb">
                    Specify named parameters that allow individual implementers to control pre-determined aspects of the
                    artifact in their own environment. Examples might include the option to allow lower grade evidence,
                    thresholds at which recommendations should be provided, or customized age ranges.
                  </div>

                  <Parameters
                    getAllInstancesInAllTrees={this.getAllInstancesInAllTrees}
                    instanceNames={names}
                    parameters={artifact.parameters}
                    updateParameters={this.updateParameters}
                    vsacApiKey={vsacApiKey}
                  />
                </TabPanel>

                <TabPanel>
                  <div className="workspace-blurb">
                    Specify error messages that should be delivered under certain exceptional circumstances when the CDS
                    artifact is executed. An example might be to deliver an error message if the patient would normally
                    receive the recommendation but has been excluded.
                  </div>

                  <ErrorStatement
                    parameters={namedParameters}
                    subpopulations={artifact.subpopulations}
                    errorStatement={artifact.errorStatement}
                    updateErrorStatement={this.updateErrorStatement}
                  />
                </TabPanel>

                <TabPanel>
                  <div className="workspace-blurb">
                    Reference external CQL libraries that can be used in Inclusions, Exclusions, and Subpopulations.
                  </div>

                  <ExternalCQL
                    artifact={artifact}
                    externalCqlList={externalCqlList}
                    externalCqlLibrary={externalCqlLibrary}
                    externalCQLLibraryParents={externalCQLLibraryParents}
                    externalCqlLibraryDetails={externalCqlLibraryDetails}
                    externalCqlFhirVersion={externalCqlFhirVersion}
                    externalCqlErrors={externalCqlErrors}
                    isAddingExternalCqlLibrary={isAddingExternalCqlLibrary}
                    deleteExternalCqlLibrary={deleteExternalCqlLibrary}
                    addExternalLibrary={addExternalLibrary}
                    loadExternalCqlList={loadExternalCqlList}
                    clearExternalCqlValidationWarnings={clearExternalCqlValidationWarnings}
                    clearAddLibraryErrorsAndMessages={clearAddLibraryErrorsAndMessages}
                    loadExternalCqlLibraryDetails={loadExternalCqlLibraryDetails}
                    isLoadingExternalCqlDetails={isLoadingExternalCqlDetails}
                    addExternalCqlLibraryError={addExternalCqlLibraryError}
                    addExternalCqlLibraryErrorMessage={addExternalCqlLibraryErrorMessage}
                    librariesInUse={librariesInUse}
                  />
                </TabPanel>
              </div>
            </Tabs>
          </section>
        </div>

        <RepoUploadModal
          artifact={artifact}
          closeModal={this.togglePublishModal}
          hasCancelButton
          showModal={showPublishModal}
          version={artifact.version}
        />

        <ArtifactModal
          artifactEditing={artifact}
          closeModal={this.closeArtifactModal}
          showModal={showArtifactModal}
        />

        {showELMErrorModal &&
          <ELMErrorModal handleCloseModal={this.closeELMErrorModal} errors={downloadedArtifact.elmErrors} />
        }
      </div>
    );
  }
}

Builder.propTypes = {
  addExternalCqlLibraryError: PropTypes.number,
  addExternalCqlLibraryErrorMessage: PropTypes.string,
  addExternalLibrary: PropTypes.func.isRequired,
  artifact: artifactProps,
  conversionFunctions: PropTypes.array,
  deleteExternalCqlLibrary: PropTypes.func.isRequired,
  downloadArtifact: PropTypes.func.isRequired,
  externalCqlErrors: PropTypes.array,
  externalCqlFhirVersion: PropTypes.string,
  externalCqlLibrary: PropTypes.object,
  externalCqlLibraryDetails: PropTypes.object,
  externalCQLLibraryParents: PropTypes.object.isRequired,
  externalCqlList: PropTypes.array,
  initializeArtifact: PropTypes.func.isRequired,
  isAddingExternalCqlLibrary: PropTypes.bool.isRequired,
  isLoadingExternalCqlDetails: PropTypes.bool.isRequired,
  isLoadingModifiers: PropTypes.bool,
  librariesInUse: PropTypes.array.isRequired,
  loadArtifact: PropTypes.func.isRequired,
  loadExternalCqlLibraryDetails: PropTypes.func.isRequired,
  loadExternalCqlList: PropTypes.func.isRequired,
  loadTemplates: PropTypes.func.isRequired,
  modifierMap: PropTypes.object.isRequired,
  modifiersByInputType: PropTypes.object.isRequired,
  names: PropTypes.array.isRequired,
  saveArtifact: PropTypes.func.isRequired,
  setStatusMessage: PropTypes.func.isRequired,
  statusMessage: PropTypes.string,
  templates: PropTypes.array,
  updateAndSaveArtifact: PropTypes.func.isRequired,
  updateArtifact: PropTypes.func.isRequired,
  vsacApiKey: PropTypes.string
};

// these props are used for dispatching actions
function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    addExternalLibrary,
    clearAddLibraryErrorsAndMessages,
    clearArtifactValidationWarnings,
    clearExternalCqlValidationWarnings,
    deleteExternalCqlLibrary,
    downloadArtifact,
    initializeArtifact,
    loadArtifact,
    loadConversionFunctions,
    loadExternalCqlLibraryDetails,
    loadExternalCqlList,
    loadTemplates,
    publishArtifact,
    saveArtifact,
    setStatusMessage,
    updateAndSaveArtifact,
    updateArtifact
  }, dispatch);
}

// these props come from the application's state when it is started
function mapStateToProps(state) {
  return {
    addExternalCqlLibraryError: state.externalCQL.addExternalCqlLibrary.error,
    addExternalCqlLibraryErrorMessage: state.externalCQL.addExternalCqlLibrary.message,
    artifact: state.artifacts.artifact,
    conversionFunctions: state.modifiers.conversionFunctions,
    downloadedArtifact: state.artifacts.downloadArtifact,
    externalCqlErrors: state.externalCQL.externalCqlErrors,
    externalCqlFhirVersion: state.externalCQL.fhirVersion,
    externalCqlLibrary: state.externalCQL.externalCqlLibrary,
    externalCqlLibraryDetails: state.externalCQL.externalCqlLibraryDetails,
    externalCQLLibraryParents: state.externalCQL.externalCQLLibraryParents,
    externalCqlList: state.externalCQL.externalCqlList,
    isAddingExternalCqlLibrary: state.externalCQL.addExternalCqlLibrary.isAdding,
    isLoadingExternalCqlDetails: state.externalCQL.loadExternalCqlLibraryDetails.isLoading,
    isLoadingModifiers: state.modifiers.loadModifiers.isLoadingModifiers,
    isLoggingOut: state.auth.isLoggingOut,
    librariesInUse: state.artifacts.librariesInUse,
    modifierMap: state.modifiers.modifierMap,
    modifiersByInputType: state.modifiers.modifiersByInputType,
    names: state.artifacts.names,
    publishEnabled: state.artifacts.publishEnabled,
    statusMessage: state.artifacts.statusMessage,
    templates: state.templates.templates,
    vsacApiKey: state.vsac.apiKey
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(withGracefulUnmount(Builder));
