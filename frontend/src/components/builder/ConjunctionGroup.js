import React from 'react';
import PropTypes from 'prop-types';
import { ArtifactElement } from 'components/builder/artifact-element';
import { GroupElement, ConjunctionTypeSelect } from 'components/builder/group-element';
import createTemplateInstance from 'utils/templates';
import { getElementErrors, hasDuplicateName, hasGroupNestedWarning, hasWarnings } from 'utils/warnings';
import requiredIf from 'utils/prop_types';
import { getLabelForInstance } from 'utils/instances';

const ConjunctionGroup = ({
  addInstance,
  artifact,
  baseElements,
  baseIndentLevel,
  deleteInstance,
  disableAddElement,
  disableIndent,
  editInstance,
  elementUniqueId,
  getAllInstancesInAllTrees,
  getPath: getPathOfParent,
  instance,
  instanceNames,
  isLoadingModifiers,
  modifiersByInputType,
  options,
  parameters,
  root,
  subpopulationUniqueId,
  templates,
  treeName,
  updateInstanceModifiers,
  validateReturnType,
  vsacApiKey
}) => {
  const conjunctionGroupOptions = templates.find(t => t.name === 'Operations').entries;
  const listOperationOptions = templates.find(t => t.name === 'List Operations').entries;
  const selectOptions = options === 'listOperations' ? listOperationOptions : conjunctionGroupOptions;
  const allInstancesInAllTrees = getAllInstancesInAllTrees();
  const hasDuplicateNameWarning = hasDuplicateName(
    instance,
    instanceNames,
    baseElements,
    parameters,
    allInstancesInAllTrees
  );
  const hasNestedWarning = hasGroupNestedWarning(
    instance.childInstances,
    instanceNames,
    baseElements,
    parameters,
    allInstancesInAllTrees,
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

  const indentClickHandler = instance => {
    if (disableAddElement) {
      return;
    }

    // Decide what type of conjunction group to create when indenting
    let conjunctionType;
    if (artifact[treeName].id === 'Or') {
      conjunctionType = conjunctionGroupOptions.find(template => template.id === 'And');
    } else {
      // Default is adding an OR
      conjunctionType = conjunctionGroupOptions.find(template => template.id === 'Or');
    }

    if (instance.conjunction) {
      // Indenting a conjunction group (and it's children)
      const newInstance = createTemplateInstance(conjunctionType, [instance]);
      const parentPath = getPath().split('.').slice(0, -2).join('.'); // Path of parent of conjunction group
      const index = Number(getPath().split('.').pop()); // Index of to indent group at
      const toAdd = [{ instance: newInstance, path: parentPath, index }];

      deleteInstance(treeName, getPath(), toAdd);
    } else {
      // Indent a single templateInstance
      const newInstance = createTemplateInstance(conjunctionType, [instance]);
      const index = Number(getChildsPath(instance.uniqueId).split('.').pop()); // Index to add new conjunction at
      const toAdd = [{ instance: newInstance, path: getPath(), index }];

      deleteInstance(treeName, getChildsPath(instance.uniqueId), toAdd);
    }
  };

  const outdentClickHandler = instance => {
    if (disableAddElement) {
      return;
    }
    if (instance.conjunction) {
      // Outdenting a conjunction group. Removes the conjunction, readds each child to the conjunction's parent
      const toAdd = [];
      instance.childInstances.forEach((child, i) => {
        // Path of the parent where items get added
        const parentPath = getPath().split('.').slice(0, -2).join('.');
        let index = getPath().split('.').pop(); // Index of the conjunction group
        index = Number(index) + i; // Index to add the conjunction's children at
        return toAdd.push({ instance: child, path: parentPath, index });
      });

      deleteInstance(treeName, getPath(), toAdd);
    } else {
      // Outdenting a single templateInstance
      // Path of the parent of the group instance is coming from. This is where it will be readded
      const parentPath = getPath().split('.').slice(0, -2).join('.');
      let index = getPath().split('.').pop(); // Index of the parent
      index = Number(index) + 1; // Readd the child that is being outdented right below the parent it came from
      const toAdd = [{ instance, path: parentPath, index }];
      deleteInstance(treeName, getChildsPath(instance.uniqueId), toAdd);
    }
  };

  const renderArtifactElement = (instance, group) => (
    <div key={instance.uniqueId} className="card-group-section" id={instance.uniqueId}>
      <ArtifactElement
        alerts={getElementErrors(instance, allInstancesInAllTrees, baseElements, instanceNames, parameters)}
        allInstancesInAllTrees={allInstancesInAllTrees}
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
        hasErrors={hasWarnings(
          instance,
          instanceNames,
          baseElements,
          parameters,
          allInstancesInAllTrees,
          validateReturnType
        )}
        indentParity={getIndentParity(getChildsPath(instance.uniqueId))}
        instanceNames={instanceNames}
        isLoadingModifiers={isLoadingModifiers}
        label={getLabelForInstance(instance, baseElements)}
        modifiersByInputType={modifiersByInputType}
        updateModifiers={modifiers =>
          updateInstanceModifiers(treeName, modifiers, getChildsPath(instance.uniqueId), subpopulationUniqueId)
        }
        validateReturnType={validateReturnType}
        vsacApiKey={vsacApiKey}
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
              artifact={artifact}
              baseElements={baseElements}
              baseIndentLevel={baseIndentLevel}
              deleteInstance={deleteInstance}
              disableAddElement={disableAddElement}
              editInstance={editInstance}
              elementUniqueId={elementUniqueId}
              getAllInstancesInAllTrees={getAllInstancesInAllTrees}
              getPath={getChildsPath}
              instance={child}
              instanceNames={instanceNames}
              isLoadingModifiers={isLoadingModifiers}
              modifiersByInputType={modifiersByInputType}
              parameters={parameters}
              root={false}
              subpopulationUniqueId={subpopulationUniqueId}
              templates={templates}
              treeName={treeName}
              updateInstanceModifiers={updateInstanceModifiers}
              validateReturnType={validateReturnType}
              vsacApiKey={vsacApiKey}
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
  artifact: PropTypes.object,
  baseElements: PropTypes.array.isRequired,
  baseIndentLevel: PropTypes.number,
  deleteInstance: PropTypes.func.isRequired,
  disableAddElement: PropTypes.bool,
  disableIndent: PropTypes.bool,
  editInstance: PropTypes.func.isRequired,
  elementUniqueId: PropTypes.string,
  getAllInstancesInAllTrees: PropTypes.func.isRequired,
  getPath: requiredIf(PropTypes.func, props => !props.root), // path needed for children
  instance: PropTypes.object.isRequired,
  instanceNames: PropTypes.array.isRequired,
  isLoadingModifiers: PropTypes.bool,
  modifiersByInputType: PropTypes.object.isRequired,
  options: PropTypes.string,
  parameters: PropTypes.array,
  root: PropTypes.bool.isRequired,
  subpopulationUniqueId: PropTypes.string,
  templates: PropTypes.array,
  treeName: PropTypes.string.isRequired,
  updateInstanceModifiers: PropTypes.func.isRequired,
  validateReturnType: PropTypes.bool,
  vsacApiKey: PropTypes.string
};

export default ConjunctionGroup;
