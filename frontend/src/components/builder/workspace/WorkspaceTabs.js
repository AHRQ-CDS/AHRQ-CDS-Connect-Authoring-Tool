import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Tab, TabList, TabPanel, Tabs } from 'react-tabs';
import { CheckCircle as CheckCircleIcon, Error as ErrorIcon, MenuBook as MenuBookIcon } from '@mui/icons-material';
import { updateArtifact } from 'actions/artifacts';
import { setActiveTab } from 'actions/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { Summary } from 'components/builder/summary';
import ConjunctionGroup from 'components/builder/ConjunctionGroup';
import Subpopulations from 'components/builder/Subpopulations';
import BaseElements from 'components/builder/BaseElements';
import { Recommendations } from 'components/builder/recommendations';
import { Parameters } from 'components/builder/parameters';
import { ErrorStatement } from 'components/builder/error-statement';
import { ExternalCql } from 'components/builder/external-cql';
import WorkspaceBlurb from './WorkspaceBlurb';
import { blurbs } from './blurbs';
import { getTabMetadata } from './tabUtils';
import { getFHIRVersion, getTree } from 'components/builder/utils';
import { findValueAtPath } from 'utils/find';
import { checkForNeedToPromote, isElementUnionIntersect } from 'utils/lists';

import { useSpacingStyles } from 'styles/hooks';
import useStyles from './styles';

const WorkspaceTabs = ({ externalCqlList, handleSaveArtifact }) => {
  const spacingStyles = useSpacingStyles();
  const styles = useStyles();
  const [tabMetadata, setTabMetadata] = useState({});
  const activeTab = useSelector(state => state.navigation.activeTab);
  const artifact = useSelector(state => state.artifacts.artifact) ?? null;
  const dispatch = useDispatch();
  const handleUpdateArtifact = (a, artifactProps) => dispatch(updateArtifact(a, artifactProps));

  useEffect(() => {
    if (artifact) setTabMetadata(getTabMetadata(artifact, externalCqlList.length));
  }, [artifact, externalCqlList]);

  const addInstance = (
    treeName,
    instance,
    parentPath,
    uid = null,
    currentIndex = null,
    incomingTree = null,
    updatedReturnType = null
  ) => {
    const { tree: foundTree, array: treeArray, index: treeIndex } = getTree(artifact, treeName, uid);
    const tree = incomingTree || foundTree;
    const target = findValueAtPath(tree, parentPath).childInstances;
    const index = currentIndex != null ? currentIndex : target.length;
    target.splice(index, 0, instance); // Insert instance at specific instance - only used for indenting now

    if (updatedReturnType) {
      tree.returnType = updatedReturnType;
    }

    if (treeName === 'baseElements' && isElementUnionIntersect(tree.id)) {
      checkForNeedToPromote(tree);
    }

    let artifactPropsToUpdate = { [treeName]: tree };
    if (treeArray != null) {
      treeArray[treeIndex] = tree;
      artifactPropsToUpdate = { [treeName]: treeArray };
    }

    const updatedArtifact = { ...artifact, ...artifactPropsToUpdate };
    const updatedFhirVersion = getFHIRVersion(updatedArtifact, externalCqlList, artifact._id);
    if (updatedFhirVersion !== artifact.fhirVersion) {
      artifactPropsToUpdate.fhirVersion = updatedFhirVersion;
    }

    handleUpdateArtifact(artifact, artifactPropsToUpdate);
  };

  const addBaseElement = (instance, uid = null, incomingTree) => {
    const { tree: foundTree, array: treeArray, index: treeIndex } = getTree(artifact, 'baseElements', uid);
    const tree = incomingTree || foundTree;
    tree.push(instance);

    let artifactPropsToUpdate = { baseElements: tree };
    if (treeArray != null) {
      treeArray[treeIndex] = tree;
      artifactPropsToUpdate = { baseElements: treeArray };
    }

    const updatedArtifact = { ...artifact, ...artifactPropsToUpdate };
    const updatedFhirVersion = getFHIRVersion(updatedArtifact, externalCqlList, artifact._id);
    if (updatedFhirVersion !== artifact.fhirVersion) {
      artifactPropsToUpdate.fhirVersion = updatedFhirVersion;
    }

    handleUpdateArtifact(artifact, artifactPropsToUpdate);
  };

  const deleteInstance = (treeName, path, elementsToAdd, uid = null, updatedReturnType = null) => {
    const { tree, array: treeArray, index: treeIndex } = getTree(artifact, treeName, uid);
    const index = path.slice(-1);
    const target = findValueAtPath(tree, path.slice(0, path.length - 2));
    target.splice(index, 1); // remove item at index position

    if (updatedReturnType) {
      tree.returnType = updatedReturnType;
    }

    // elementsToAdd is an array of elements to be re-added when indenting or outdenting
    if (elementsToAdd) {
      // Note: elements in elementsToAdd are a custom object with the element, path, and index to add
      elementsToAdd.forEach(element => {
        addInstance(treeName, element.instance, element.path, uid, element.index, tree);
      });
    }

    if (treeName === 'baseElements' && isElementUnionIntersect(tree.id)) {
      checkForNeedToPromote(tree);
    }

    let artifactPropsToUpdate = { [treeName]: tree };
    if (treeArray != null) {
      treeArray[treeIndex] = tree;
      artifactPropsToUpdate = { [treeName]: treeArray };
    }

    const updatedArtifact = { ...artifact, ...artifactPropsToUpdate };
    const updatedFhirVersion = getFHIRVersion(updatedArtifact, externalCqlList, artifact._id);
    if (updatedFhirVersion !== artifact.fhirVersion) {
      artifactPropsToUpdate.fhirVersion = updatedFhirVersion;
    }

    handleUpdateArtifact(artifact, artifactPropsToUpdate);
  };

  const editInstance = (treeName, editedFields, path, editingConjunctionType = false, uid = null) => {
    const { tree, array: treeArray, index: treeIndex } = getTree(artifact, treeName, uid);
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

    let artifactPropsToUpdate = { [treeName]: tree };
    if (treeArray != null) {
      treeArray[treeIndex] = tree;
      artifactPropsToUpdate = { [treeName]: treeArray };
    }

    handleUpdateArtifact(artifact, artifactPropsToUpdate);
  };

  const updateInstanceModifiers = (
    treeName,
    modifiers,
    path,
    uid = null,
    updatedReturnType = null,
    fhirVersion = null
  ) => {
    const { tree, array: treeArray, index: treeIndex } = getTree(artifact, treeName, uid);
    const target = findValueAtPath(tree, path);
    target.modifiers = modifiers;

    if (updatedReturnType) {
      tree.returnType = updatedReturnType;
    }

    if (treeName === 'baseElements' && isElementUnionIntersect(tree.id)) {
      checkForNeedToPromote(tree);
    }

    let artifactPropsToUpdate = { [treeName]: tree };
    if (treeArray != null) {
      treeArray[treeIndex] = tree;
      artifactPropsToUpdate = { [treeName]: treeArray };
    }

    if (fhirVersion) {
      artifactPropsToUpdate.fhirVersion = fhirVersion;
    }

    const updatedArtifact = { ...artifact, ...artifactPropsToUpdate };
    const updatedFhirVersion = getFHIRVersion(updatedArtifact, externalCqlList, artifact._id);
    if (updatedFhirVersion !== artifact.fhirVersion && fhirVersion == null) {
      artifactPropsToUpdate.fhirVersion = updatedFhirVersion;
    }

    handleUpdateArtifact(artifact, artifactPropsToUpdate);
  };

  const updateSubpopulations = (subpopulations, target = 'subpopulations', updateFHIRVersion = false) => {
    const artifactPropsToUpdate = { [target]: subpopulations };
    if (updateFHIRVersion) {
      const updatedArtifact = { ...artifact, ...artifactPropsToUpdate };
      const updatedFhirVersion = getFHIRVersion(updatedArtifact, externalCqlList, artifact._id);
      if (updatedFhirVersion !== artifact.fhirVersion) {
        artifactPropsToUpdate.fhirVersion = updatedFhirVersion;
      }
    }

    handleUpdateArtifact(artifact, artifactPropsToUpdate);
  };

  const updateRecommendations = recommendations => {
    const artifactPropsToUpdate = { recommendations };
    if (artifact.fhirVersion === '' && recommendations.some(rec => rec.suggestions.length > 0)) {
      // Once a suggestion is added, only FHIR R4 versions are allowed
      artifactPropsToUpdate.fhirVersion = '4.0.x';
    } else if (recommendations.every(rec => rec.suggestions.length === 0)) {
      // If there are no suggestions, recalculate the FHIR version based on the rest of the artifact
      const updatedArtifact = { ...artifact, ...artifactPropsToUpdate };
      artifactPropsToUpdate.fhirVersion = getFHIRVersion(updatedArtifact, externalCqlList, artifact._id);
    }
    handleUpdateArtifact(artifact, artifactPropsToUpdate);
  };

  const TabIcon = ({ hasContent, hasError }) => {
    if (hasContent && !hasError) return <CheckCircleIcon className={styles.tabIndicator} />;
    else if (hasError) return <ErrorIcon className={styles.tabIndicatorError} />;

    return null;
  };

  return (
    <div className={styles.body}>
      <Tabs
        selectedIndex={activeTab}
        selectedTabClassName={styles.tabSelected}
        onSelect={index => dispatch(setActiveTab(index))}
      >
        <TabList aria-label="Workspace Tabs" className={styles.tabList}>
          <Tab className={styles.tab}>Summary</Tab>
          <Tab className={styles.tab}>
            Inclusions <TabIcon {...tabMetadata.expTreeInclude} />
          </Tab>
          <Tab className={styles.tab}>
            Exclusions <TabIcon {...tabMetadata.expTreeExclude} />
          </Tab>
          <Tab className={styles.tab}>
            Subpopulations <TabIcon {...tabMetadata.subpopulations} />
          </Tab>
          <Tab className={styles.tab}>
            Base Elements <TabIcon {...tabMetadata.baseElements} />
          </Tab>
          <Tab className={styles.tab}>
            Recommendations <TabIcon {...tabMetadata.recommendations} />
          </Tab>
          <Tab className={styles.tab}>
            Parameters <TabIcon {...tabMetadata.parameters} />
          </Tab>
          <Tab className={styles.tab}>
            Handle Errors <TabIcon {...tabMetadata.handleErrors} />
          </Tab>
          <Tab className={styles.tab}>
            <MenuBookIcon className={styles.tabIndicator} />
            External CQL <TabIcon {...tabMetadata.externalCQL} />
          </Tab>
        </TabList>
        <div className={spacingStyles.verticalPadding}>
          <TabPanel>
            <Summary handleSaveArtifact={handleSaveArtifact} />
          </TabPanel>
          <TabPanel>
            <WorkspaceBlurb {...blurbs.inclusions} />
            <ConjunctionGroup
              addInstance={addInstance}
              deleteInstance={deleteInstance}
              editInstance={editInstance}
              instance={artifact.expTreeInclude}
              root={true}
              treeName={'expTreeInclude'}
              updateInstanceModifiers={updateInstanceModifiers}
            />
          </TabPanel>
          <TabPanel>
            <WorkspaceBlurb {...blurbs.exclusions} />
            <ConjunctionGroup
              addInstance={addInstance}
              deleteInstance={deleteInstance}
              editInstance={editInstance}
              instance={artifact.expTreeExclude}
              root={true}
              treeName={'expTreeExclude'}
              updateInstanceModifiers={updateInstanceModifiers}
            />
          </TabPanel>
          <TabPanel>
            <WorkspaceBlurb {...blurbs.subpopulations} />
            <Subpopulations
              addInstance={addInstance}
              deleteInstance={deleteInstance}
              editInstance={editInstance}
              updateInstanceModifiers={updateInstanceModifiers}
              updateSubpopulations={updateSubpopulations}
            />
          </TabPanel>
          <TabPanel>
            <WorkspaceBlurb {...blurbs.baseElements} />
            <BaseElements
              addBaseElement={addBaseElement}
              addInstance={addInstance}
              deleteInstance={deleteInstance}
              editInstance={editInstance}
              updateBaseElementLists={updateSubpopulations}
              updateInstanceModifiers={updateInstanceModifiers}
              validateReturnType={false}
            />
          </TabPanel>
          <TabPanel>
            <WorkspaceBlurb {...blurbs.recommendations} />
            <Recommendations handleUpdateRecommendations={updateRecommendations} />
          </TabPanel>
          <TabPanel>
            <WorkspaceBlurb {...blurbs.parameters} />
            <Parameters handleUpdateParameters={parameters => handleUpdateArtifact(artifact, { parameters })} />
          </TabPanel>
          <TabPanel>
            <WorkspaceBlurb {...blurbs.errors} />
            <ErrorStatement
              handleUpdateErrorStatement={errorStatement => handleUpdateArtifact(artifact, { errorStatement })}
            />
          </TabPanel>
          <TabPanel>
            <WorkspaceBlurb {...blurbs.externalCQL} />
            <ExternalCql />
          </TabPanel>
        </div>
      </Tabs>
    </div>
  );
};

WorkspaceTabs.propTypes = {
  externalCqlList: PropTypes.array.isRequired,
  handleSaveArtifact: PropTypes.func.isRequired
};

export default WorkspaceTabs;
