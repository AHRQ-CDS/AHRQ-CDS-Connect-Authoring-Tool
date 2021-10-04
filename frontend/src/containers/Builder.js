import React, { Component } from 'react';
import PropTypes from 'prop-types';
import withGracefulUnmount from 'react-graceful-unmount';
import { connect, useSelector } from 'react-redux';
import { useQuery } from 'react-query';
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
import { loadConversionFunctions } from 'actions/modifiers';
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

import { ELMErrorModal } from 'components/modals';
import BaseElements from 'components/builder/BaseElements';
import ConjunctionGroup from 'components/builder/ConjunctionGroup';
import { ArtifactModal } from 'components/artifact';

import { ErrorStatement } from 'components/builder/error-statement';
import { ExternalCql } from 'components/builder/external-cql';
import { Parameters } from 'components/builder/parameters';
import { Recommendations } from 'components/builder/recommendations';
import Subpopulations from 'components/builder/Subpopulations';

import { fetchExternalCqlList } from 'queries/external-cql';
import { fetchModifiers } from 'queries/modifiers';

import isBlankArtifact from 'utils/artifacts/isBlankArtifact';
import { findValueAtPath } from 'utils/find';
import { hasGroupNestedWarning } from 'utils/warnings';
import { errorStatementHasWarnings } from 'components/builder/error-statement/utils';
import { parametersHaveWarnings } from 'components/builder/parameters/utils';
import { getAllElements, getElementNames } from 'components/builder/utils';

import artifactProps from 'prop-types/artifact';
import { Summary } from 'components/builder/summary';
import { HelpLink } from 'components/elements';

// TODO: This is needed because the tree on this.state is not updated in time. Figure out a better way to handle this
let localTree;

const TabIcon = ({ hasContent, hasError }) => {
  if (hasContent && !hasError) return <CheckCircleIcon className="tab-indicator" />;
  else if (hasError) return <ErrorIcon className="tab-indicator tab-indicator-error" />;

  return null;
};

export class Builder extends Component {
  constructor(props) {
    super(props);

    this.state = {
      showArtifactModal: false,
      showELMErrorModal: false,
      showMenu: false,
      downloadMenuAnchorElement: null
    };
  }

  componentDidMount() {
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
  updateInstanceModifiers = async (treeName, modifiers, path, subpopIndex, updatedReturnType = null) => {
    const tree = _.cloneDeep(this.props.artifact[treeName]);
    const valuePath = _.isNumber(subpopIndex) ? tree[subpopIndex] : tree;
    const target = findValueAtPath(valuePath, path);
    target.modifiers = modifiers;

    if (updatedReturnType) {
      valuePath.returnType = updatedReturnType;
    }
    await this.props.updateArtifact(this.props.artifact, { [treeName]: tree });
    this.updateFHIRVersion();
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
    const allInstances = this.getAllInstancesInAllTrees();
    const hasExternalCql =
      externalCqlList && Boolean(externalCqlList.find(cqlLibrary => cqlLibrary.linkedArtifactId === artifact._id));
    const hasServiceRequest = this.instancesInclude(allInstances, 'Service Request');
    const hasCustomModifier = allInstances.some(({ modifiers }) => modifiers?.some(({ where }) => where));
    if ((hasExternalCql && !hasServiceRequest) || hasCustomModifier) return;

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
          getAllInstances={this.getAllInstances}
          getAllInstancesInAllTrees={this.getAllInstancesInAllTrees}
          instance={artifact[treeName]}
          instanceNames={this.props.names}
          isLoadingModifiers={isLoadingModifiers}
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

  renderTabList() {
    const { artifact, externalCqlList, names } = this.props;
    const {
      baseElements,
      errorStatement,
      expTreeInclude,
      expTreeExclude,
      parameters,
      recommendations,
      subpopulations
    } = artifact;
    const allInstancesInAllTrees = this.getAllInstancesInAllTrees();
    const namedParameters = parameters.filter(({ name }) => name?.length);
    const allElements = getAllElements(artifact);
    const elementNames = getElementNames(allElements);

    const filteredSubpopulations = subpopulations.filter(({ special }) => !special);
    const emptySubpopulations = filteredSubpopulations.filter(({ childInstances }) => childInstances.length === 0);
    const subpopulationInstances = _.flatten(filteredSubpopulations.map(({ childInstances }) => childInstances));

    const tabMetadata = {
      expTreeInclude: {
        hasContent: expTreeInclude.childInstances.length > 0,
        hasError: hasGroupNestedWarning(
          this.getAllInstances('expTreeInclude'),
          names,
          baseElements,
          namedParameters,
          allInstancesInAllTrees
        )
      },
      expTreeExclude: {
        hasContent: expTreeExclude.childInstances.length > 0,
        hasError: hasGroupNestedWarning(
          this.getAllInstances('expTreeExclude'),
          names,
          baseElements,
          namedParameters,
          allInstancesInAllTrees
        )
      },
      subpopulations: {
        hasContent:
          subpopulations.length > 3 ||
          (subpopulations.length === 3 &&
            (subpopulations[2].subpopulationName !== 'Subpopulation 1' || subpopulations[2].childInstances.length > 0)),
        hasError:
          emptySubpopulations.length > 0 ||
          hasGroupNestedWarning(subpopulationInstances, names, baseElements, namedParameters, allInstancesInAllTrees)
      },
      baseElements: {
        hasContent: baseElements.length > 0,
        hasError: hasGroupNestedWarning(
          baseElements,
          names,
          baseElements,
          namedParameters,
          allInstancesInAllTrees,
          false
        )
      },
      recommendations: {
        hasContent: recommendations.length > 0,
        hasError: false
      },
      parameters: {
        hasContent: parameters.length > 0,
        hasError: parametersHaveWarnings(parameters, elementNames)
      },
      handleErrors: {
        hasContent: errorStatement.ifThenClauses[0].ifCondition.value != null,
        hasError: errorStatementHasWarnings(errorStatement, expTreeInclude, expTreeExclude)
      },
      externalCQL: {
        hasContent: externalCqlList.length > 0,
        hasError: false
      }
    };

    return (
      <TabList aria-label="Workspace Tabs">
        <Tab>Summary</Tab>
        <Tab>
          Inclusions
          <TabIcon {...tabMetadata.expTreeInclude} />
        </Tab>
        <Tab>
          Exclusions
          <TabIcon {...tabMetadata.expTreeExclude} />
        </Tab>
        <Tab>
          Subpopulations
          <TabIcon {...tabMetadata.subpopulations} />
        </Tab>
        <Tab>
          Base Elements
          <TabIcon {...tabMetadata.baseElements} />
        </Tab>
        <Tab>
          Recommendations
          <TabIcon {...tabMetadata.recommendations} />
        </Tab>
        <Tab>
          Parameters
          <TabIcon {...tabMetadata.parameters} />
        </Tab>
        <Tab>
          Handle Errors
          <TabIcon {...tabMetadata.handleErrors} />
        </Tab>
        <Tab>
          <MenuBookIcon className="tab-indicator" /> External CQL
          <TabIcon {...tabMetadata.externalCQL} />
        </Tab>
      </TabList>
    );
  }

  render() {
    const {
      activeTab,
      artifact,
      conversionFunctions,
      downloadedArtifact,
      isLoadingModifiers,
      modifierMap,
      modifiersByInputType,
      names,
      templates,
      vsacApiKey
    } = this.props;
    const { showArtifactModal, showELMErrorModal } = this.state;

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
              {this.renderTabList()}

              <div className="tab-panel-container">
                <TabPanel>
                  <Summary handleOpenArtifactModal={() => this.openArtifactModal()} />
                </TabPanel>

                <TabPanel>
                  <div className="workspace-blurb">
                    Specify criteria to identify a target population that should receive a recommendation from this
                    artifact. Examples might include an age range, gender, presence of a certain condition, or lab
                    results within a specific range.
                    <HelpLink linkPath="documentation#Inclusions" />
                  </div>
                  {this.renderConjunctionGroup('expTreeInclude')}
                </TabPanel>

                <TabPanel>
                  <div className="workspace-blurb">
                    Specify criteria to identify patients that should be excluded from the target population and,
                    therefore, from receiving a recommendation from this artifact. Examples might include pregnancy
                    status, out of bound lab results, or evidence that the recommended therapy is already being used by
                    the patient.
                    <HelpLink linkPath="documentation#Exclusions" />
                  </div>
                  {this.renderConjunctionGroup('expTreeExclude')}
                </TabPanel>

                <TabPanel>
                  <div className="workspace-blurb">
                    Specify criteria that further segments the target population into subpopulations that should receive
                    more specific recommendations. An example might be splitting the population by risk score so that
                    higher risk patients receive a stronger recommendation than lower risk patients.
                    <HelpLink linkPath="documentation#Subpopulations" />
                  </div>

                  <Subpopulations
                    addInstance={this.addInstance}
                    artifact={artifact}
                    baseElements={artifact.baseElements}
                    checkSubpopulationUsage={this.checkSubpopulationUsage}
                    conversionFunctions={conversionFunctions}
                    deleteInstance={this.deleteInstance}
                    editInstance={this.editInstance}
                    getAllInstances={this.getAllInstances}
                    getAllInstancesInAllTrees={this.getAllInstancesInAllTrees}
                    instanceNames={names}
                    isLoadingModifiers={isLoadingModifiers}
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
                    <HelpLink linkPath="documentation#Base_Elements" />
                  </div>

                  <BaseElements
                    addBaseElement={this.addBaseElement}
                    addInstance={this.addInstance}
                    baseElements={artifact.baseElements}
                    conversionFunctions={conversionFunctions}
                    deleteInstance={this.deleteInstance}
                    editInstance={this.editInstance}
                    fhirVersion={artifact.fhirVersion}
                    getAllInstances={this.getAllInstances}
                    getAllInstancesInAllTrees={this.getAllInstancesInAllTrees}
                    instance={artifact}
                    instanceNames={names}
                    isLoadingModifiers={isLoadingModifiers}
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
                    order a medication, perform a test, or provide the patient educational materials. Only the first
                    eligible recommendation will be delivered.
                    <HelpLink linkPath="documentation#Recommendations" />
                  </div>

                  <Recommendations handleUpdateRecommendations={this.updateRecommendations} />
                </TabPanel>

                <TabPanel>
                  <div className="workspace-blurb">
                    Specify named parameters that allow individual implementers to control pre-determined aspects of the
                    artifact in their own environment. Examples might include the option to allow lower grade evidence,
                    thresholds at which recommendations should be provided, or customized age ranges.
                    <HelpLink linkPath="documentation#Parameters" />
                  </div>

                  <Parameters handleUpdateParameters={this.updateParameters} />
                </TabPanel>

                <TabPanel>
                  <div className="workspace-blurb">
                    Specify error messages that should be delivered under certain exceptional circumstances when the CDS
                    artifact is executed. An example might be to deliver an error message if the patient would normally
                    receive the recommendation but has been excluded.
                    <HelpLink linkPath="documentation#Handle_Errors" />
                  </div>

                  <ErrorStatement handleUpdateErrorStatement={this.updateErrorStatement} />
                </TabPanel>

                <TabPanel>
                  <div className="workspace-blurb">
                    Reference external CQL libraries that can be used in Inclusions, Exclusions, and Subpopulations.
                    <HelpLink linkPath="documentation#External_CQL" />
                  </div>

                  <ExternalCql />
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
  artifact: artifactProps,
  conversionFunctions: PropTypes.array,
  downloadArtifact: PropTypes.func.isRequired,
  externalCqlList: PropTypes.array,
  initializeArtifact: PropTypes.func.isRequired,
  isLoadingModifiers: PropTypes.bool,
  librariesInUse: PropTypes.array.isRequired,
  loadArtifact: PropTypes.func.isRequired,
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
      clearArtifactValidationWarnings,
      downloadArtifact,
      initializeArtifact,
      loadArtifact,
      loadConversionFunctions,
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
    artifact: state.artifacts.artifact,
    conversionFunctions: state.modifiers.conversionFunctions,
    downloadedArtifact: state.artifacts.downloadArtifact,
    isLoggingOut: state.auth.isLoggingOut,
    librariesInUse: state.artifacts.librariesInUse,
    names: state.artifacts.names,
    scrollToId: state.navigation.scrollToId,
    statusMessage: state.artifacts.statusMessage,
    templates: state.templates.templates,
    vsacApiKey: state.vsac.apiKey
  };
}

const BuilderWithQuery = props => {
  const artifact = useSelector(state => state.artifacts.artifact);
  const query = { artifactId: artifact?._id };
  const externalCqlListQuery = useQuery(['externalCql', query], () => fetchExternalCqlList(query), {
    enabled: query.artifactId != null
  });
  const modifiersQuery = useQuery(['modifiers', query], () => fetchModifiers(query), {
    enabled: query.artifactId != null
  });

  return (
    <Builder
      externalCqlList={externalCqlListQuery.data ?? []}
      isLoadingModifiers={modifiersQuery.isLoading}
      modifierMap={modifiersQuery.data?.modifierMap ?? {}}
      modifiersByInputType={modifiersQuery.data?.modifiersByInputType ?? {}}
      {...props}
    />
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(withGracefulUnmount(BuilderWithQuery));
