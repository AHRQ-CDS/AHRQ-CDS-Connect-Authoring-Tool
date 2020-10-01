import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import withGracefulUnmount from 'react-graceful-unmount';
import { Dropdown, DropdownToggle, DropdownMenu, DropdownItem, UncontrolledTooltip } from 'reactstrap';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPencilAlt, faDownload, faSave, faAlignRight, faBook } from '@fortawesome/free-solid-svg-icons';
import _ from 'lodash';

import loadTemplates from '../actions/templates';
import loadValueSets from '../actions/value_sets';
import { loadConversionFunctions } from '../actions/modifiers';
import {
  setStatusMessage, downloadArtifact, saveArtifact, loadArtifact, updateArtifact, initializeArtifact,
  updateAndSaveArtifact, publishArtifact, clearArtifactValidationWarnings
} from '../actions/artifacts';
import {
  loginVSACUser, setVSACAuthStatus, searchVSACByKeyword, getVSDetails, validateCode, resetCodeValidation
} from '../actions/vsac';
import {
  loadExternalCqlList, loadExternalCqlLibraryDetails, addExternalLibrary, deleteExternalCqlLibrary,
  clearExternalCqlValidationWarnings, clearAddLibraryErrorsAndMessages
} from '../actions/external_cql';

import BaseElements from '../components/builder/BaseElements';
import ConjunctionGroup from '../components/builder/ConjunctionGroup';
import ArtifactModal from '../components/artifact/ArtifactModal';

import ELMErrorModal from '../components/builder/ELMErrorModal';
import ErrorStatement from '../components/builder/ErrorStatement';
import ExternalCQL from '../components/builder/ExternalCQL';
import Parameters from '../components/builder/Parameters';
import Recommendations from '../components/builder/Recommendations';
import RepoUploadModal from '../components/builder/RepoUploadModal';
import Subpopulations from '../components/builder/Subpopulations';

import isBlankArtifact from '../utils/artifacts/isBlankArtifact';
import { findValueAtPath } from '../utils/find';

import artifactProps from '../prop-types/artifact';

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
      uniqueIdCounter: 0
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

  toggleMenu = () => {
    this.setState({ showMenu: !this.state.showMenu });
  }

  downloadOptionSelected = (disabled, version) => {
    const { artifact } = this.props;
    if (!disabled) this.props.downloadArtifact(artifact, { name: 'FHIR', version });
  }

  // ----------------------- RENDER ---------------------------------------- //

  renderConjunctionGroup = (treeName) => {
    const {
      artifact, templates, valueSets,
      vsacStatus, vsacStatusText,
      isRetrievingDetails, vsacDetailsCodes, vsacDetailsCodesError,
      modifierMap, modifiersByInputType, isLoadingModifiers, conversionFunctions,
      isValidatingCode, isValidCode, codeData
    } = this.props;
    const namedParameters = _.filter(artifact.parameters, p => (!_.isNull(p.name) && p.name.length));

    if (artifact && artifact[treeName].childInstances) {
      return (
        <ConjunctionGroup
          root={true}
          treeName={treeName}
          artifact={artifact}
          templates={templates}
          valueSets={valueSets}
          loadValueSets={this.props.loadValueSets}
          instance={artifact[treeName]}
          addInstance={this.addInstance}
          editInstance={this.editInstance}
          deleteInstance={this.deleteInstance}
          getAllInstances={this.getAllInstances}
          getAllInstancesInAllTrees={this.getAllInstancesInAllTrees}
          updateInstanceModifiers={this.updateInstanceModifiers}
          parameters={namedParameters}
          baseElements={artifact.baseElements}
          externalCqlList={this.props.externalCqlList}
          loadExternalCqlList={this.props.loadExternalCqlList}
          modifierMap={modifierMap}
          modifiersByInputType={modifiersByInputType}
          isLoadingModifiers={isLoadingModifiers}
          conversionFunctions={conversionFunctions}
          instanceNames={this.props.names}
          scrollToElement={this.scrollToElement}
          loginVSACUser={this.props.loginVSACUser}
          setVSACAuthStatus={this.props.setVSACAuthStatus}
          vsacStatus={vsacStatus}
          vsacStatusText={vsacStatusText}
          searchVSACByKeyword={this.props.searchVSACByKeyword}
          isSearchingVSAC={this.props.isSearchingVSAC}
          vsacSearchResults={this.props.vsacSearchResults}
          vsacSearchCount={this.props.vsacSearchCount}
          getVSDetails={this.props.getVSDetails}
          isRetrievingDetails={isRetrievingDetails}
          vsacDetailsCodes={vsacDetailsCodes}
          vsacDetailsCodesError={vsacDetailsCodesError}
          vsacFHIRCredentials={this.props.vsacFHIRCredentials}
          isValidatingCode={isValidatingCode}
          isValidCode={isValidCode}
          codeData={codeData}
          validateCode={this.props.validateCode}
          resetCodeValidation={this.props.resetCodeValidation}
        />
      );
    }

    return <div>Loading...</div>;
  }

  renderHeader() {
    const { statusMessage, artifact, publishEnabled } = this.props;
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
          <button aria-label="Edit" className="secondary-button" onClick={this.openArtifactModal}>
            <FontAwesomeIcon icon={faPencilAlt} />
          </button>

          {artifactName}
        </h2>

        <div className="builder__buttonbar">
          <div className="builder__buttonbar-menu" aria-label="Workspace Menu">
            <Dropdown isOpen={this.state.showMenu} toggle={this.toggleMenu} className="dropdown-button">
              <DropdownToggle caret>
                <FontAwesomeIcon icon={faDownload} className="icon" />Download CQL
              </DropdownToggle>

              <DropdownMenu>
                <DropdownItem
                  id='dstu2DownloadOption'
                  className={classnames(disableDSTU2 && 'disabled-dropdown')}
                  onClick={() => this.downloadOptionSelected(disableDSTU2, '1.0.2')}
                  role="menuitem"
                >
                  FHIR<sup>®</sup> DSTU2
                </DropdownItem>

                <DropdownItem
                  id='stu3DownloadOption'
                  className={classnames(disableSTU3 && 'disabled-dropdown')}
                  onClick={() => this.downloadOptionSelected(disableSTU3, '3.0.0')}
                  role="menuitem"
                >
                  FHIR<sup>®</sup> STU3
                </DropdownItem>

                <DropdownItem
                  id='r4DownloadOption'
                  className={classnames(disableR4 && 'disabled-dropdown')}
                  onClick={() => this.downloadOptionSelected(disableR4, '4.0.0')}
                >
                  FHIR<sup>®</sup> R4
                </DropdownItem>

                {disableDSTU2 &&
                  <UncontrolledTooltip className='light-tooltip' target='dstu2DownloadOption' placement="left">
                    Downloading this FHIR version is disabled based on external library versions.
                  </UncontrolledTooltip>
                }
                {disableSTU3 &&
                  <UncontrolledTooltip className='light-tooltip' target='stu3DownloadOption' placement="left">
                    Downloading this FHIR version is disabled based on external library versions.
                  </UncontrolledTooltip>
                }
                {disableR4 &&
                  <UncontrolledTooltip className='light-tooltip' target='r4DownloadOption' placement="left">
                    Downloading this FHIR version is disabled based on external library versions.
                  </UncontrolledTooltip>
                }
              </DropdownMenu>
            </Dropdown>

            <button
              onClick={() => this.handleSaveArtifact(artifact)}
              className="secondary-button"
              aria-label="Save"
            >
              <FontAwesomeIcon icon={faSave} className="icon" />Save
            </button>

            {publishEnabled &&
              <button
                onClick={() => { this.handleSaveArtifact(artifact); this.togglePublishModal(); }}
                className="secondary-button"
                aria-label="Publish"
              >
                <FontAwesomeIcon icon={faAlignRight} className="icon" />Publish
              </button>
            }
          </div>

          <div role="status" aria-live="assertive">{statusMessage}</div>
        </div>
      </header>
    );
  }

  render() {
    const {
      artifact, templates, modifierMap, modifiersByInputType, isLoadingModifiers, conversionFunctions
    } = this.props;
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
            <Tabs selectedIndex={this.state.activeTabIndex} onSelect={tabIndex => this.setActiveTab(tabIndex)}>
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
                    name={'subpopulations'}
                    artifact={artifact}
                    valueSets={this.props.valueSets}
                    loadValueSets={this.props.loadValueSets}
                    updateSubpopulations={this.updateSubpopulations}
                    parameters={namedParameters}
                    baseElements={artifact.baseElements}
                    externalCqlList={this.props.externalCqlList}
                    loadExternalCqlList={this.props.loadExternalCqlList}
                    addInstance={this.addInstance}
                    editInstance={this.editInstance}
                    updateInstanceModifiers={this.updateInstanceModifiers}
                    deleteInstance={this.deleteInstance}
                    getAllInstances={this.getAllInstances}
                    getAllInstancesInAllTrees={this.getAllInstancesInAllTrees}
                    templates={templates}
                    checkSubpopulationUsage={this.checkSubpopulationUsage}
                    updateRecsSubpop={this.updateRecsSubpop}
                    modifierMap={modifierMap}
                    modifiersByInputType={modifiersByInputType}
                    isLoadingModifiers={isLoadingModifiers}
                    conversionFunctions={conversionFunctions}
                    instanceNames={this.props.names}
                    scrollToElement={this.scrollToElement}
                    loginVSACUser={this.props.loginVSACUser}
                    setVSACAuthStatus={this.props.setVSACAuthStatus}
                    vsacStatus={this.props.vsacStatus}
                    vsacStatusText={this.props.vsacStatusText}
                    searchVSACByKeyword={this.props.searchVSACByKeyword}
                    isSearchingVSAC={this.props.isSearchingVSAC}
                    vsacSearchResults={this.props.vsacSearchResults}
                    vsacSearchCount={this.props.vsacSearchCount}
                    getVSDetails={this.props.getVSDetails}
                    isRetrievingDetails={this.props.isRetrievingDetails}
                    vsacDetailsCodes={this.props.vsacDetailsCodes}
                    vsacDetailsCodesError={this.props.vsacDetailsCodesError}
                    vsacFHIRCredentials={this.props.vsacFHIRCredentials}
                    isValidatingCode={this.props.isValidatingCode}
                    isValidCode={this.props.isValidCode}
                    codeData={this.props.codeData}
                    validateCode={this.props.validateCode}
                    resetCodeValidation={this.props.resetCodeValidation}
                  />
                </TabPanel>

                <TabPanel>
                  <div className="workspace-blurb">
                    Specify individual elements that can be re-used in the Inclusions, Exclusions, and Subpopulations,
                    or should standalone as independent expressions in the resulting artifact. An example might be a lab
                    result value that is referenced multiple times throughout the artifact.
                  </div>
                  <BaseElements
                    treeName='baseElements'
                    instance={artifact}
                    addBaseElement={this.addBaseElement}
                    loadValueSets={this.props.loadValueSets}
                    getAllInstances={this.getAllInstances}
                    getAllInstancesInAllTrees={this.getAllInstancesInAllTrees}
                    addInstance={this.addInstance}
                    editInstance={this.editInstance}
                    updateInstanceModifiers={this.updateInstanceModifiers}
                    deleteInstance={this.deleteInstance}
                    updateBaseElementLists={this.updateSubpopulations}
                    templates={templates}
                    valueSets={this.props.valueSets}
                    modifierMap={modifierMap}
                    modifiersByInputType={modifiersByInputType}
                    isLoadingModifiers={isLoadingModifiers}
                    conversionFunctions={conversionFunctions}
                    instanceNames={this.props.names}
                    baseElements={artifact.baseElements}
                    parameters={namedParameters}
                    externalCqlList={this.props.externalCqlList}
                    loadExternalCqlList={this.props.loadExternalCqlList}
                    scrollToElement={this.scrollToElement}
                    loginVSACUser={this.props.loginVSACUser}
                    setVSACAuthStatus={this.props.setVSACAuthStatus}
                    vsacStatus={this.props.vsacStatus}
                    vsacStatusText={this.props.vsacStatusText}
                    searchVSACByKeyword={this.props.searchVSACByKeyword}
                    isSearchingVSAC={this.props.isSearchingVSAC}
                    vsacSearchResults={this.props.vsacSearchResults}
                    vsacSearchCount={this.props.vsacSearchCount}
                    getVSDetails={this.props.getVSDetails}
                    isRetrievingDetails={this.props.isRetrievingDetails}
                    vsacDetailsCodes={this.props.vsacDetailsCodes}
                    vsacDetailsCodesError={this.props.vsacDetailsCodesError}
                    vsacFHIRCredentials={this.props.vsacFHIRCredentials}
                    isValidatingCode={this.props.isValidatingCode}
                    isValidCode={this.props.isValidCode}
                    codeData={this.props.codeData}
                    validateCode={this.props.validateCode}
                    resetCodeValidation={this.props.resetCodeValidation}
                    validateReturnType={false}
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
                    uniqueIdCounter={this.state.uniqueIdCounter}
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
                    parameters={this.props.artifact.parameters}
                    updateParameters={this.updateParameters}
                    instanceNames={this.props.names}
                    vsacFHIRCredentials={this.props.vsacFHIRCredentials}
                    loginVSACUser={this.props.loginVSACUser}
                    setVSACAuthStatus={this.props.setVSACAuthStatus}
                    vsacStatus={this.props.vsacStatus}
                    vsacStatusText={this.props.vsacStatusText}
                    isValidatingCode={this.props.isValidatingCode}
                    isValidCode={this.props.isValidCode}
                    codeData={this.props.codeData}
                    validateCode={this.props.validateCode}
                    resetCodeValidation={this.props.resetCodeValidation}
                    getAllInstancesInAllTrees={this.getAllInstancesInAllTrees}
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
                    subpopulations={this.props.artifact.subpopulations}
                    errorStatement={this.props.artifact.errorStatement}
                    updateErrorStatement={this.updateErrorStatement}
                  />
                </TabPanel>

                <TabPanel>
                  <div className="workspace-blurb">
                    Reference external CQL libraries that can be used in Inclusions, Exclusions, and Subpopulations.
                  </div>
                  <ExternalCQL
                    artifact={this.props.artifact}
                    externalCqlList={this.props.externalCqlList}
                    externalCqlLibrary={this.props.externalCqlLibrary}
                    externalCQLLibraryParents={this.props.externalCQLLibraryParents}
                    externalCqlLibraryDetails={this.props.externalCqlLibraryDetails}
                    externalCqlFhirVersion={this.props.externalCqlFhirVersion}
                    externalCqlErrors={this.props.externalCqlErrors}
                    isAddingExternalCqlLibrary={this.props.isAddingExternalCqlLibrary}
                    deleteExternalCqlLibrary={this.props.deleteExternalCqlLibrary}
                    addExternalLibrary={this.props.addExternalLibrary}
                    loadExternalCqlList={this.props.loadExternalCqlList}
                    clearExternalCqlValidationWarnings={this.props.clearExternalCqlValidationWarnings}
                    clearAddLibraryErrorsAndMessages={this.props.clearAddLibraryErrorsAndMessages}
                    loadExternalCqlLibraryDetails={this.props.loadExternalCqlLibraryDetails}
                    isLoadingExternalCqlDetails={this.props.isLoadingExternalCqlDetails}
                    addExternalCqlLibraryError={this.props.addExternalCqlLibraryError}
                    addExternalCqlLibraryErrorMessage={this.props.addExternalCqlLibraryErrorMessage}
                    librariesInUse={this.props.librariesInUse}
                  />
                </TabPanel>
              </div>
            </Tabs>
          </section>
        </div>

        <RepoUploadModal
          artifact={artifact}
          showModal={this.state.showPublishModal}
          closeModal={this.togglePublishModal}
          version={artifact.version}
        />

        <ArtifactModal
          artifactEditing={artifact}
          showModal={this.state.showArtifactModal}
          closeModal={this.closeArtifactModal}
        />

        <ELMErrorModal
          isOpen={this.state.showELMErrorModal}
          closeModal={this.closeELMErrorModal}
          errors={this.props.downloadedArtifact.elmErrors}
        />
      </div>
    );
  }
}

Builder.propTypes = {
  artifact: artifactProps,
  statusMessage: PropTypes.string,
  templates: PropTypes.array,
  loadTemplates: PropTypes.func.isRequired,
  loadValueSets: PropTypes.func.isRequired,
  loadArtifact: PropTypes.func.isRequired,
  initializeArtifact: PropTypes.func.isRequired,
  updateArtifact: PropTypes.func.isRequired,
  setStatusMessage: PropTypes.func.isRequired,
  downloadArtifact: PropTypes.func.isRequired,
  saveArtifact: PropTypes.func.isRequired,
  updateAndSaveArtifact: PropTypes.func.isRequired,
  modifierMap: PropTypes.object.isRequired,
  modifiersByInputType: PropTypes.object.isRequired,
  isLoadingModifiers: PropTypes.bool,
  conversionFunctions: PropTypes.array,
  validateCode: PropTypes.func.isRequired,
  resetCodeValidation: PropTypes.func.isRequired,
  isValidatingCode: PropTypes.bool.isRequired,
  isValidCode: PropTypes.bool,
  codeData: PropTypes.object,
  names: PropTypes.array.isRequired,
  librariesInUse: PropTypes.array.isRequired,
  externalCqlList: PropTypes.array,
  externalCQLLibraryParents: PropTypes.object.isRequired,
  externalCqlLibrary: PropTypes.object,
  externalCqlLibraryDetails: PropTypes.object,
  externalCqlFhirVersion: PropTypes.string,
  externalCqlErrors: PropTypes.array,
  isAddingExternalCqlLibrary: PropTypes.bool.isRequired,
  deleteExternalCqlLibrary: PropTypes.func.isRequired,
  addExternalLibrary: PropTypes.func.isRequired,
  loadExternalCqlList: PropTypes.func.isRequired,
  loadExternalCqlLibraryDetails: PropTypes.func.isRequired,
  isLoadingExternalCqlDetails: PropTypes.bool.isRequired,
  addExternalCqlLibraryError: PropTypes.number,
  addExternalCqlLibraryErrorMessage: PropTypes.string
};

// these props are used for dispatching actions
function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    loadTemplates,
    loadValueSets,
    loadArtifact,
    initializeArtifact,
    updateArtifact,
    setStatusMessage,
    downloadArtifact,
    saveArtifact,
    updateAndSaveArtifact,
    publishArtifact,
    loginVSACUser,
    setVSACAuthStatus,
    searchVSACByKeyword,
    getVSDetails,
    validateCode,
    resetCodeValidation,
    clearArtifactValidationWarnings,
    loadConversionFunctions,
    deleteExternalCqlLibrary,
    addExternalLibrary,
    loadExternalCqlList,
    clearExternalCqlValidationWarnings,
    clearAddLibraryErrorsAndMessages,
    loadExternalCqlLibraryDetails
  }, dispatch);
}

// these props come from the application's state when it is started
function mapStateToProps(state) {
  return {
    artifact: state.artifacts.artifact,
    downloadedArtifact: state.artifacts.downloadArtifact,
    statusMessage: state.artifacts.statusMessage,
    templates: state.templates.templates,
    valueSets: state.valueSets.valueSets,
    publishEnabled: state.artifacts.publishEnabled,
    names: state.artifacts.names,
    librariesInUse: state.artifacts.librariesInUse,
    vsacStatus: state.vsac.authStatus,
    vsacStatusText: state.vsac.authStatusText,
    isSearchingVSAC: state.vsac.isSearchingVSAC,
    vsacSearchResults: state.vsac.searchResults,
    vsacSearchCount: state.vsac.searchCount,
    isRetrievingDetails: state.vsac.isRetrievingDetails,
    isValidatingCode: state.vsac.isValidatingCode,
    isValidCode: state.vsac.isValidCode,
    codeData: state.vsac.codeData,
    vsacDetailsCodes: state.vsac.detailsCodes,
    vsacDetailsCodesError: state.vsac.detailsCodesErrorMessage,
    vsacFHIRCredentials: { username: state.vsac.username, password: state.vsac.password },
    modifierMap: state.modifiers.modifierMap,
    modifiersByInputType: state.modifiers.modifiersByInputType,
    isLoadingModifiers: state.modifiers.loadModifiers.isLoadingModifiers,
    conversionFunctions: state.modifiers.conversionFunctions,
    isLoggingOut: state.auth.isLoggingOut,
    externalCqlList: state.externalCQL.externalCqlList,
    externalCqlLibrary: state.externalCQL.externalCqlLibrary,
    externalCQLLibraryParents: state.externalCQL.externalCQLLibraryParents,
    externalCqlLibraryDetails: state.externalCQL.externalCqlLibraryDetails,
    externalCqlFhirVersion: state.externalCQL.fhirVersion,
    externalCqlErrors: state.externalCQL.externalCqlErrors,
    isAddingExternalCqlLibrary: state.externalCQL.addExternalCqlLibrary.isAdding,
    isLoadingExternalCqlDetails: state.externalCQL.loadExternalCqlLibraryDetails.isLoading,
    addExternalCqlLibraryError: state.externalCQL.addExternalCqlLibrary.error,
    addExternalCqlLibraryErrorMessage: state.externalCQL.addExternalCqlLibrary.message
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(withGracefulUnmount(Builder));
