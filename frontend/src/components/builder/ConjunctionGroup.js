import React from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { CircularProgress } from '@mui/material';
import { useQuery } from 'react-query';
import fetchTemplates from 'queries/fetchTemplates';
import { ArtifactElement } from 'components/builder/artifact-element';
import { GroupElement, ConjunctionTypeSelect } from 'components/builder/group-element';
import createTemplateInstance from 'utils/templates';
import { getElementErrors, hasDuplicateName, hasGroupNestedWarning, hasWarnings } from 'utils/warnings';
import requiredIf from 'utils/prop_types';
import { getLabelForInstance } from 'utils/instances';
import { getAllElements, getElementNames } from './utils';

const ConjunctionGroup = ({
  addInstance,
  baseIndentLevel,
  deleteInstance,
  disableAddElement,
  disableIndent,
  editInstance,
  elementUniqueId,
  getPath: getPathOfParent,
  instance,
  options,
  root,
  subpopulationUniqueId,
  treeName,
  updateInstanceModifiers,
  validateReturnType
}) => {
  const artifact = useSelector(state => state.artifacts.artifact);
  const { data: templates, isLoading: isTemplatesLoading } = useQuery('templates', () => fetchTemplates(), {
    staleTime: Infinity
  });

  if (isTemplatesLoading) {
    return <CircularProgress />;
  }

  const baseElements = artifact.baseElements;
  const allElements = getAllElements(artifact) ?? [];
  const instanceNames = getElementNames(allElements);
  const parameters = artifact.parameters.filter(({ name }) => name?.length);

  const conjunctionGroupOptions = templates.find(t => t.name === 'Operations').entries ?? [];
  const listOperationOptions = templates.find(t => t.name === 'List Operations').entries ?? [];
  const selectOptions = options === 'listOperations' ? listOperationOptions : conjunctionGroupOptions ?? [];
  const hasDuplicateNameWarning = hasDuplicateName(instance, instanceNames, baseElements, parameters, allElements);
  const hasNestedWarning = hasGroupNestedWarning(
    instance.childInstances,
    instanceNames,
    baseElements,
    parameters,
    allElements,
    validateReturnType
  );

  // if root component, returns root artifact path, otherwise calls child's getPath function with artifact id
  const getPath = () => {
    if (root) {
      return instance.path;
    }
    return getPathOfParent(instance.uniqueId);
  };

  const getChildsPath = id => {
    const artifactTree = instance;
    const childIndex = artifactTree.childInstances.findIndex(instance => instance.uniqueId === id);
    return `${getPath()}.childInstances.${childIndex}`;
  };

  const getIndentParity = path => {
    const level = path.split('.').filter(pathSection => pathSection === 'childInstances').length;
    if (level % 2 === (baseIndentLevel ?? 0)) {
      return 'even';
    }
    return 'odd';
  };

  const indentClickHandler = element => {
    if (disableAddElement) {
      return;
    }

    // Decide what type of conjunction group to create when indenting
    let conjunctionType;
    if (instance.name === 'Or') {
      conjunctionType = conjunctionGroupOptions.find(template => template.id === 'And');
    } else {
      // Default is adding an OR
      conjunctionType = conjunctionGroupOptions.find(template => template.id === 'Or');
    }

    if (element.conjunction) {
      // Indenting a conjunction group (and it's children)
      const newInstance = createTemplateInstance(conjunctionType, [element]);
      const parentPath = getPath().split('.').slice(0, -2).join('.'); // Path of parent of conjunction group
      const index = Number(getPath().split('.').pop()); // Index of to indent group at
      const toAdd = [{ instance: newInstance, path: parentPath, index }];

      deleteInstance(treeName, getPath(), toAdd);
    } else {
      // Indent a single templateInstance
      const newInstance = createTemplateInstance(conjunctionType, [element]);
      const index = Number(getChildsPath(element.uniqueId).split('.').pop()); // Index to add new conjunction at
      const toAdd = [{ instance: newInstance, path: getPath(), index }];

      deleteInstance(treeName, getChildsPath(element.uniqueId), toAdd);
    }
  };

  const outdentClickHandler = element => {
    if (disableAddElement) {
      return;
    }
    if (element.conjunction) {
      // Outdenting a conjunction group. Removes the conjunction, readds each child to the conjunction's parent
      const toAdd = element.childInstances.map((child, i) => {
        // Path of the parent where items get added
        const parentPath = getPath().split('.').slice(0, -2).join('.');
        let index = getPath().split('.').pop(); // Index of the conjunction group
        index = Number(index) + i; // Index to add the conjunction's children at
        return { instance: child, path: parentPath, index };
      });

      deleteInstance(treeName, getPath(), toAdd);
    } else {
      // Outdenting a single templateInstance
      // Path of the parent of the group instance is coming from. This is where it will be readded
      const parentPath = getPath().split('.').slice(0, -2).join('.');
      let index = getPath().split('.').pop(); // Index of the parent
      index = Number(index) + 1; // Readd the child that is being outdented right below the parent it came from
      const toAdd = [{ instance: element, path: parentPath, index }];
      deleteInstance(treeName, getChildsPath(element.uniqueId), toAdd);
    }
  };

  const renderArtifactElement = (instance, group) => (
    <div key={instance.uniqueId} className="card-group-section" id={instance.uniqueId}>
      <ArtifactElement
        alerts={getElementErrors(instance, allElements, baseElements, instanceNames, parameters)}
        allowIndent={!disableIndent}
        allowOutdent={getPath() !== ''} // cannot outdent if at the root
        baseElementInUsedList={!!disableAddElement}
        elementInstance={instance}
        handleDeleteElement={() => deleteInstance(treeName, getChildsPath(instance.uniqueId))}
        handleIndent={() => indentClickHandler(instance)}
        handleOutdent={() => outdentClickHandler(instance)}
        handleUpdateElement={newElementField =>
          editInstance(treeName, newElementField, getChildsPath(instance.uniqueId), false)
        }
        hasErrors={hasWarnings(instance, instanceNames, baseElements, parameters, allElements, validateReturnType)}
        indentParity={getIndentParity(getChildsPath(instance.uniqueId))}
        label={getLabelForInstance(instance, baseElements)}
        updateModifiers={(modifiers, fhirVersion) =>
          updateInstanceModifiers(
            treeName,
            modifiers,
            getChildsPath(instance.uniqueId),
            subpopulationUniqueId,
            null,
            fhirVersion
          )
        }
        validateReturnType={validateReturnType}
      />

      <ConjunctionTypeSelect
        editInstance={type => editInstance(treeName, type, getPath(), true)}
        name={group.name}
        options={selectOptions}
      />
    </div>
  );

  const renderChildren = () =>
    instance.childInstances.map(child => {
      // return null if child instance conjunction is false
      if (child.conjunction) {
        return (
          <div key={child.uniqueId} className="card-group">
            <ConjunctionGroup
              addInstance={addInstance}
              baseIndentLevel={baseIndentLevel}
              deleteInstance={deleteInstance}
              disableAddElement={disableAddElement}
              editInstance={editInstance}
              elementUniqueId={elementUniqueId}
              getPath={getChildsPath}
              instance={child}
              root={false}
              subpopulationUniqueId={subpopulationUniqueId}
              treeName={treeName}
              updateInstanceModifiers={updateInstanceModifiers}
              validateReturnType={validateReturnType}
            />

            <ConjunctionTypeSelect
              editInstance={type => editInstance(treeName, type, getPath(), true)}
              name={instance.name}
              options={selectOptions}
            />
          </div>
        );
      }

      return renderArtifactElement(child, instance);
    });

  return (
    <GroupElement
      alerts={getElementErrors(instance, [], [], instanceNames, [])} // We know the conjunction group isn't a parameter or baseElement, so we can pass in empty arrays
      allowIndent={true}
      allowOutdent={getPath() !== ''}
      disable={!!disableAddElement}
      elementUniqueId={elementUniqueId}
      groupInstance={instance}
      handleAddElement={template => addInstance(treeName, createTemplateInstance(template), getPath())}
      handleDeleteElement={() => deleteInstance(treeName, getPath())}
      handleIndent={() => indentClickHandler(instance)}
      handleOutdent={() => outdentClickHandler(instance)}
      handleUpdateElement={newElementField => editInstance(treeName, newElementField, getPath(), false)}
      hasErrors={hasDuplicateNameWarning || hasNestedWarning}
      indentParity={getIndentParity(getPath())}
      root={root}
    >
      {renderChildren()}
    </GroupElement>
  );
};

ConjunctionGroup.propTypes = {
  addInstance: PropTypes.func.isRequired,
  baseIndentLevel: PropTypes.number,
  deleteInstance: PropTypes.func.isRequired,
  disableAddElement: PropTypes.bool,
  disableIndent: PropTypes.bool,
  editInstance: PropTypes.func.isRequired,
  elementUniqueId: PropTypes.string,
  getPath: requiredIf(PropTypes.func, props => !props.root), // path needed for children
  instance: PropTypes.object.isRequired,
  options: PropTypes.string,
  root: PropTypes.bool.isRequired,
  subpopulationUniqueId: PropTypes.string,
  treeName: PropTypes.string.isRequired,
  updateInstanceModifiers: PropTypes.func.isRequired,
  validateReturnType: PropTypes.bool
};

export default ConjunctionGroup;
