import React, { Component } from 'react';
import PropTypes from 'prop-types';
import withGracefulUnmount from 'react-graceful-unmount';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import { Button, IconButton, Menu, MenuItem } from '@material-ui/core';
import {
  CheckCircle as CheckCircleIcon,
  Edit as EditIcon,
  Error as ErrorIcon,
  GetApp as GetAppIcon,
  MenuBook as MenuBookIcon,
  Save as SaveIcon
} from '@material-ui/icons';
import _ from 'lodash';

import loadTemplates from 'actions/templates';
import { setActiveTab, setScrollToId } from 'actions/navigation';
import { loadConversionFunctions, loadModifiers } from 'actions/modifiers';
import {
  setStatusMessage,
  downloadArtifact,
  saveArtifact,
  loadArtifact,
  updateArtifact,
  initializeArtifact,
  updateAndSaveArtifact,
  clearArtifactValidationWarnings
} from 'actions/artifacts';
import {
  loadExternalCqlList,
  loadExternalCqlLibraryDetails,
  addExternalLibrary,
  deleteExternalCqlLibrary,
  clearExternalCqlValidationWarnings,
  clearAddLibraryErrorsAndMessages
} from 'actions/external_cql';

import { ELMErrorModal } from 'components/modals';
import BaseElements from 'components/builder/BaseElements';
import ConjunctionGroup from 'components/builder/ConjunctionGroup';
import { ArtifactModal } from 'components/artifact';

import { ErrorStatement } from 'components/builder/error-statement';
import ExternalCQL from 'components/builder/ExternalCQL';
import Parameters from 'components/builder/Parameters';
import Recommendations from 'components/builder/Recommendations';
import Subpopulations from 'components/builder/Subpopulations';

import isBlankArtifact from 'utils/artifacts/isBlankArtifact';
import { findValueAtPath } from 'utils/find';
import { hasGroupNestedWarning } from 'utils/warnings';
import { errorStatementHasWarnings } from 'components/builder/error-statement/utils';
import { parametersHaveWarnings } from 'components/builder/parameters/utils';

import artifactProps from 'prop-types/artifact';
import { Summary } from 'components/builder/summary';

// TODO: This is needed because the tree on this.state is not updated in time. Figure out a better way to handle this
let localTree;

export class Builder extends Component {
  constructor(props) {
    super(props);

    this.state = {
      showArtifactModal: false,
      showELMErrorModal: false,
      showMenu: false,
      uniqueIdCounter: 0,
      downloadMenuAnchorElement: null
    };
  }

  componentDidMount() {
    this.props.loadExternalCqlList(this.props.match.params.id);
    this.props.loadTemplates().then(result => {
      // if there is a current artifact, load it, otherwise initialize new artifact
      if (this.props.match.params.id) {
        this.props.loadArtifact(this.props.match.params.id);
      } else {
        const operations = result.templates.find(template => template.name === 'Operations');
        const andTemplate = operations.entries.find(entry => entry.name === 'And');
        const orTemplate = operations.entries.find(entry => entry.name === 'Or');
        this.props.initializeArtifact(andTemplate, orTemplate);
      }
      this.props.loadConversionFunctions();
      this.props.loadModifiers();
    });
  }

  componentDidUpdate(prevProps) {
    if (this.props.scrollToId !== prevProps.scrollToId) {
      const elementToScrollTo = document.getElementById(this.props.scrollToId);
      if (elementToScrollTo) elementToScrollTo.scrollIntoView();
      this.props.setScrollToId(null);
    }
  }

  componentWillUnmount() {
    const { artifact, isLoggingOut } = this.props;

    if (!isBlankArtifact(artifact) && !isLoggingOut) {
      this.handleSaveArtifact(artifact, artifact);
    }
  }

  UNSAFE_componentWillReceiveProps(newProps) {
    // eslint-disable-line camelcase
    this.setState({ showELMErrorModal: newProps.downloadedArtifact.elmErrors.length > 0 });
  }

  // ----------------------- TABS ------------------------------------------ //

  tabHasContent = tabName => {
    const { artifact, externalCqlList } = this.props;
    const { baseElements, errorStatement, parameters, recommendations, subpopulations } = artifact;

    switch (tabName) {
      case 'expTreeInclude':
      case 'expTreeExclude':
        return this.getAllInstances(tabName).length > 0;
      case 'subpopulations':
        return (
          subpopulations.length > 3 ||
          (subpopulations.length === 3 &&
            (subpopulations[2].subpopulationName !== 'Subpopulation 1' || subpopulations[2].childInstances.length > 0))
        );
      case 'baseElements':
        return baseElements.length > 0;
      case 'recommendations':
        return recommendations.length > 0;
      case 'parameters':
        return parameters.length > 0;
      case 'handleErrors':
        return errorStatement.ifThenClauses[0].ifCondition.value !== null;
      case 'externalCQL':
        return externalCqlList.length > 0;
      default:
        return false;
    }
  };

  tabHasErrors = tabName => {
    const { artifact, names } = this.props; // externalCqlList,
    const allInstancesInAllTrees = this.getAllInstancesInAllTrees();
    const { baseElements, errorStatement, expTreeInclude, expTreeExclude, parameters, subpopulations } = artifact;
    const namedParameters = parameters.filter(({ name }) => name?.length);

    switch (tabName) {
      case 'expTreeInclude':
      case 'expTreeExclude': {
        const instances = this.getAllInstances(tabName);
        return hasGroupNestedWarning(instances, names, baseElements, namedParameters, allInstancesInAllTrees);
      }
      case 'subpopulations': {
        const filteredSubpopulations = subpopulations.filter(({ special }) => !special);
        const emptySubpopulations = filteredSubpopulations.filter(({ childInstances }) => childInstances.length === 0);
        const instances = _.flatten(filteredSubpopulations.map(({ childInstances }) => childInstances));
        return (
          emptySubpopulations.length > 0 ||
          hasGroupNestedWarning(instances, names, baseElements, namedParameters, allInstancesInAllTrees)
        );
      }
      case 'baseElements': {
        return hasGroupNestedWarning(baseElements, names, baseElements, namedParameters, allInstancesInAllTrees, false);
      }
      case 'parameters': {
        return parametersHaveWarnings(parameters, names, allInstancesInAllTrees);
      }
      case 'handleErrors':
        return errorStatementHasWarnings(errorStatement, expTreeInclude, expTreeExclude);
      default:
        return false;
    }
  };

  // ----------------------- INSTANCES ------------------------------------- //

  getAllInstancesInAllTrees = () => {
    const { artifact } = this.props;
    let allInstancesInAllTrees = this.getAllInstances('expTreeInclude');
    allInstancesInAllTrees = allInstancesInAllTrees.concat(this.getAllInstances('expTreeExclude'));
    artifact.subpopulations.forEach(s => {
      if (!s.special) {
        allInstancesInAllTrees = allInstancesInAllTrees.concat(
          this.getAllInstances('subpopulations', null, s.uniqueId)
        );
      }
    });
    artifact.baseElements.forEach(baseElement => {
      allInstancesInAllTrees = allInstancesInAllTrees.concat(
        this.getAllInstances('baseElements', null, baseElement.uniqueId)
      );
    });

    return allInstancesInAllTrees;
  };

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

    const result = _.flatten(
      (treeInstance.childInstances || []).map(instance => {
        if (instance.childInstances) {
          return _.flatten([instance, this.getAllInstances(treeName, instance)]);
        }
        instance.tab = treeName;
        return instance;
      })
    );

    return result;
  };

  addInstance = async (
    treeName,
    instance,
    parentPath,
    uid = null,
    currentIndex,
    incomingTree,
    updatedReturnType = null
  ) => {
    const treeData = this.findTree(treeName, uid);
    const tree = incomingTree || treeData.tree;
    const target = findValueAtPath(tree, parentPath).childInstances;
    const index = currentIndex !== undefined ? currentIndex : target.length;
    target.splice(index, 0, instance); // Insert instance at specific instance - only used for indenting now

    if (updatedReturnType) {
      tree.returnType = updatedReturnType;
    }
    localTree = tree;
    await this.setTree(treeName, treeData, tree);
    this.updateFHIRVersion();
  };

  addBaseElement = async (instance, uid = null, incomingTree) => {
    const treeData = this.findTree('baseElements', uid);
    const tree = incomingTree || treeData.tree;
    tree.push(instance);
    await this.setTree('baseElements', treeData, tree);
    this.updateFHIRVersion();
  };

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
      editedFields.forEach(editedField => {
        // function to retrieve relevant field
        const fieldIndex = target.fields.findIndex(field =>
          Object.prototype.hasOwnProperty.call(editedField, field.id)
        );

        // If an attribute was specified, update that one. Otherwise update the value attribute.
        if (editedField.attributeToEdit) {
          target.fields[fieldIndex][editedField.attributeToEdit] = editedField[target.fields[fieldIndex].id];
        } else {
          target.fields[fieldIndex].value = editedField[target.fields[fieldIndex].id];
        }
      });
    }

    this.setTree(treeName, treeData, tree);
  };

  deleteInstance = async (treeName, path, elementsToAdd, uid = null, updatedReturnType = null) => {
    const treeData = this.findTree(treeName, uid);
    const tree = treeData.tree;
    const index = path.slice(-1);
    const target = findValueAtPath(tree, path.slice(0, path.length - 2));
    target.splice(index, 1); // remove item at index position

    if (updatedReturnType) {
      tree.returnType = updatedReturnType;
    }

    await this.setTree(treeName, treeData, tree);
    localTree = tree;

    // elementsToAdd is an array of elements to be readded when indenting or outdenting
    if (elementsToAdd) {
      elementsToAdd.forEach(element => {
        this.addInstance(treeName, element.instance, element.path, uid, element.index, localTree);
      });
    }

    this.updateFHIRVersion();
  };

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
  };

  showELMErrorModal = () => {
    this.setState({ showELMErrorModal: true });
  };

  closeELMErrorModal = () => {
    this.setState({ showELMErrorModal: false });
    this.props.clearArtifactValidationWarnings();
  };

  // ----------------------- ARTIFACTS ------------------------------------- //

  openArtifactModal = () => {
    this.setState({ showArtifactModal: true });
  };

  closeArtifactModal = () => {
    this.setState({ showArtifactModal: false });
  };

  handleSaveArtifact = (artifactEditing, artifactPropsChanged) => {
    this.props.updateAndSaveArtifact(artifactEditing, artifactPropsChanged);
    this.closeArtifactModal(false);
  };

  instancesInclude = (instances, instanceName) => {
    if (!instances || instances.length === 0) return false;
    if (instances.some(instance => instance.name === instanceName)) return true;
    return false;
  };

  updateFHIRVersion = () => {
    const { artifact, externalCqlList, updateAndSaveArtifact } = this.props;
    const hasExternalCql =
      externalCqlList && Boolean(externalCqlList.find(cqlLibrary => cqlLibrary.linkedArtifactId === artifact._id));
    const hasServiceRequest = this.instancesInclude(this.getAllInstancesInAllTrees(), 'Service Request');
    if (hasExternalCql & !hasServiceRequest) return;

    let updatedArtifact = _.cloneDeep(artifact);
    updatedArtifact.fhirVersion = hasServiceRequest ? '4.0.0' : '';
    updateAndSaveArtifact(updatedArtifact);
  };

  // ----------------------- TREES ----------------------------------------- //

  // Identifies tree to modify whether state tree or tree in an array.
  findTree = (treeName, uid) => {
    const clonedTree = _.cloneDeep(this.props.artifact[treeName]);
    if (uid == null) {
      return { tree: clonedTree };
    }

    const index = clonedTree.findIndex(sub => sub.uniqueId === uid);
    return { array: clonedTree, tree: clonedTree[index], index };
  };

  // Sets new tree based on if state tree or array tree
  setTree = (treeName, treeData, tree) => {
    if ('array' in treeData) {
      const index = treeData.index;
      treeData.array[index] = tree;
      this.props.updateArtifact(this.props.artifact, { [treeName]: treeData.array });
    } else {
      this.props.updateArtifact(this.props.artifact, { [treeName]: tree });
    }
  };

  // ----------------------------------------------------------------------- //

  incrementUniqueIdCounter = () => {
    this.setState({ uniqueIdCounter: this.state.uniqueIdCounter + 1 });
  };

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
  };

  updateSubpopulations = async (subpopulations, target = 'subpopulations') => {
    await this.props.updateArtifact(this.props.artifact, { [target]: subpopulations });
    this.updateFHIRVersion();
  };

  updateRecommendations = recommendations => {
    this.props.updateArtifact(this.props.artifact, { recommendations });
  };

  updateParameters = parameters => {
    this.props.updateArtifact(this.props.artifact, { parameters });
  };

  updateErrorStatement = errorStatement => {
    this.props.updateArtifact(this.props.artifact, { errorStatement });
  };

  checkSubpopulationUsage = uniqueId => {
    for (let i = 0; i < this.props.artifact.recommendations.length; i++) {
      const subpops = this.props.artifact.recommendations[i].subpopulations;
      for (let j = 0; j < subpops.length; j++) {
        if (subpops[j].uniqueId === uniqueId) {
          return true;
        }
      }
    }
    return false;
  };

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
  };

  // ----------------------- RENDER ---------------------------------------- //

  renderConjunctionGroup = treeName => {
    const {
      artifact,
      conversionFunctions,
      isLoadingModifiers,
      modifierMap,
      modifiersByInputType,
      templates
    } = this.props;
    const namedParameters = _.filter(artifact.parameters, p => !_.isNull(p.name) && p.name.length);

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
          templates={templates}
          treeName={treeName}
          updateInstanceModifiers={this.updateInstanceModifiers}
          vsacApiKey={this.props.vsacApiKey}
        />
      );
    }

    return <div>Loading...</div>;
  };

  renderHeader() {
    const { statusMessage, artifact } = this.props;
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
              onClick={() => this.handleSaveArtifact(artifact, artifact)}
              startIcon={<SaveIcon />}
              variant="contained"
            >
              Save
            </Button>
          </div>

          {statusMessage && (
            <div role="status" aria-live="assertive">
              {statusMessage}
            </div>
          )}
        </div>
      </header>
    );
  }

  render() {
    const {
      activeTab,
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
    const { showArtifactModal, showELMErrorModal, uniqueIdCounter } = this.state;

    let namedParameters = [];
    if (artifact) {
      namedParameters = _.filter(artifact.parameters, p => !_.isNull(p.name) && p.name.length);
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
            <Tabs selectedIndex={activeTab} onSelect={tabIndex => this.props.setActiveTab(tabIndex)}>
              <TabList aria-label="Workspace Tabs">
                <Tab>Summary</Tab>
                <Tab>
                  Inclusions
                  {this.tabHasContent('expTreeInclude') && !this.tabHasErrors('expTreeInclude') && (
                    <CheckCircleIcon className="tab-indicator" />
                  )}
                  {this.tabHasErrors('expTreeInclude') && <ErrorIcon className="tab-indicator tab-indicator-error" />}
                </Tab>
                <Tab>
                  Exclusions
                  {this.tabHasContent('expTreeExclude') && !this.tabHasErrors('expTreeExclude') && (
                    <CheckCircleIcon className="tab-indicator" />
                  )}
                  {this.tabHasErrors('expTreeExclude') && <ErrorIcon className="tab-indicator tab-indicator-error" />}
                </Tab>
                <Tab>
                  Subpopulations
                  {this.tabHasContent('subpopulations') && !this.tabHasErrors('subpopulations') && (
                    <CheckCircleIcon className="tab-indicator" />
                  )}
                  {this.tabHasErrors('subpopulations') && <ErrorIcon className="tab-indicator tab-indicator-error" />}
                </Tab>
                <Tab>
                  Base Elements
                  {this.tabHasContent('baseElements') && !this.tabHasErrors('baseElements') && (
                    <CheckCircleIcon className="tab-indicator" />
                  )}
                  {this.tabHasErrors('baseElements') && <ErrorIcon className="tab-indicator tab-indicator-error" />}
                </Tab>
                <Tab>
                  Recommendations
                  {this.tabHasContent('recommendations') && <CheckCircleIcon className="tab-indicator" />}
                </Tab>
                <Tab>
                  Parameters
                  {this.tabHasContent('parameters') && !this.tabHasErrors('parameters') && (
                    <CheckCircleIcon className="tab-indicator" />
                  )}
                  {this.tabHasErrors('parameters') && <ErrorIcon className="tab-indicator tab-indicator-error" />}
                </Tab>
                <Tab>
                  Handle Errors
                  {this.tabHasContent('handleErrors') && !this.tabHasErrors('handleErrors') && (
                    <CheckCircleIcon className="tab-indicator" />
                  )}
                  {this.tabHasErrors('handleErrors') && <ErrorIcon className="tab-indicator tab-indicator-error" />}
                </Tab>
                <Tab>
                  <MenuBookIcon className="tab-indicator" /> External CQL
                  {this.tabHasContent('externalCQL') && <CheckCircleIcon className="tab-indicator" />}
                </Tab>
              </TabList>

              <div className="tab-panel-container">
                <TabPanel>
                  <Summary handleOpenArtifactModal={() => this.openArtifactModal()} />
                </TabPanel>

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
                    status, out of bound lab results, or evidence that the recommended therapy is already being used by
                    the patient.
                  </div>
                  {this.renderConjunctionGroup('expTreeExclude')}
                </TabPanel>

                <TabPanel>
                  <div className="workspace-blurb">
                    Specify criteria that further segments the target population into subpopulations that should receive
                    more specific recommendations. An example might be splitting the population by risk score so that
                    higher risk patients receive a stronger recommendation than lower risk patients.
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
                    fhirVersion={artifact.fhirVersion}
                    getAllInstances={this.getAllInstances}
                    getAllInstancesInAllTrees={this.getAllInstancesInAllTrees}
                    instance={artifact}
                    instanceNames={names}
                    isLoadingModifiers={isLoadingModifiers}
                    loadExternalCqlList={loadExternalCqlList}
                    modifierMap={modifierMap}
                    modifiersByInputType={modifiersByInputType}
                    parameters={namedParameters}
                    templates={templates}
                    treeName="baseElements"
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
                    setActiveTab={this.props.setActiveTab}
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

                  <ErrorStatement handleUpdateErrorStatement={this.updateErrorStatement} />
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

        {showArtifactModal && (
          <ArtifactModal
            artifactEditing={artifact}
            handleCloseModal={this.closeArtifactModal}
            handleUpdateArtifact={this.handleSaveArtifact}
          />
        )}

        {showELMErrorModal && (
          <ELMErrorModal handleCloseModal={this.closeELMErrorModal} errors={downloadedArtifact.elmErrors} />
        )}
      </div>
    );
  }
}

Builder.propTypes = {
  activeTab: PropTypes.number.isRequired,
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
  scrollToId: PropTypes.string,
  setActiveTab: PropTypes.func.isRequired,
  setScrollToId: PropTypes.func.isRequired,
  setStatusMessage: PropTypes.func.isRequired,
  statusMessage: PropTypes.string,
  templates: PropTypes.array,
  updateAndSaveArtifact: PropTypes.func.isRequired,
  updateArtifact: PropTypes.func.isRequired,
  vsacApiKey: PropTypes.string
};

// these props are used for dispatching actions
function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
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
      loadModifiers,
      loadTemplates,
      saveArtifact,
      setActiveTab,
      setScrollToId,
      setStatusMessage,
      updateAndSaveArtifact,
      updateArtifact
    },
    dispatch
  );
}

// these props come from the application's state when it is started
function mapStateToProps(state) {
  return {
    activeTab: state.navigation.activeTab,
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
    scrollToId: state.navigation.scrollToId,
    statusMessage: state.artifacts.statusMessage,
    templates: state.templates.templates,
    vsacApiKey: state.vsac.apiKey
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(withGracefulUnmount(Builder));
