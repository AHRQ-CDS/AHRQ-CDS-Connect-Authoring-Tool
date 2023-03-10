import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import ListGroup from 'components/builder/ListGroup';
import { ArtifactElement } from 'components/builder/artifact-element';
import { ElementSelect } from 'components/builder/element-select';
import { getLabelForInstance, getFieldWithId } from 'utils/instances';
import createTemplateInstance from 'utils/templates';
import { getElementErrors, hasWarnings } from 'utils/warnings';

const BaseElements = ({
  addBaseElement,
  addInstance,
  baseElements,
  deleteInstance,
  editInstance,
  getAllInstancesInAllTrees,
  instanceNames,
  isLoadingModifiers,
  modifiersByInputType,
  parameters,
  templates,
  updateBaseElementLists,
  updateInstanceModifiers,
  validateReturnType,
  vsacApiKey
}) => {
  const allInstancesInAllTrees = getAllInstancesInAllTrees();

  const getChildsPath = id => {
    const childIndex = baseElements.findIndex(instance => instance.uniqueId === id);
    return `${childIndex}`;
  };

  const addElement = template => {
    const instance = createTemplateInstance(template);
    instance.path = '';
    if (instance.conjunction) {
      const nameField = getFieldWithId(instance.fields, 'element_name');
      nameField.value = `Base Element ${baseElements.length + 1}`;
    }
    addBaseElement(instance);
  };

  const updateBaseElements = (newBaseElement, index) => {
    const baseElementsCopy = _.cloneDeep(baseElements);
    baseElementsCopy[index] = newBaseElement;
    updateBaseElementLists(baseElementsCopy, 'baseElements');
  };

  const deleteBaseElements = index => {
    const baseElementsCopy = _.cloneDeep(baseElements);
    baseElementsCopy.splice(index, 1);

    // Update Base Elements and update FHIRVersion because
    // elements that required a specific FHIR version may have been removed.
    // Because deleteInstance isn't called directly, we need to check here.
    updateBaseElementLists(baseElementsCopy, 'baseElements', true);
  };

  return (
    <>
      {baseElements.map((baseElement, i) => {
        if (baseElement.conjunction) {
          return (
            <ListGroup
              key={baseElement.uniqueId}
              addInstance={addInstance}
              baseElements={baseElements}
              deleteInstance={deleteInstance}
              deleteLists={() => deleteBaseElements(i)}
              editInstance={editInstance}
              getAllInstancesInAllTrees={getAllInstancesInAllTrees}
              instanceNames={instanceNames}
              isLoadingModifiers={isLoadingModifiers}
              listInstance={baseElement}
              modifiersByInputType={modifiersByInputType}
              parameters={parameters}
              templates={templates}
              updateLists={baseElement => updateBaseElements(baseElement, i)}
              updateInstanceModifiers={updateInstanceModifiers}
              vsacApiKey={vsacApiKey}
            />
          );
        }
        return (
          <ArtifactElement
            key={baseElement.uniqueId}
            alerts={getElementErrors(baseElement, allInstancesInAllTrees, baseElements, instanceNames, parameters)}
            allInstancesInAllTrees={allInstancesInAllTrees}
            allowIndent={false}
            baseElementInUsedList={false} // Since this is not a list, this prop is always false
            elementInstance={baseElement}
            handleDeleteElement={() => deleteInstance('baseElements', getChildsPath(baseElement.uniqueId))}
            handleUpdateElement={newElementField =>
              editInstance('baseElements', newElementField, getChildsPath(baseElement.uniqueId), false)
            }
            hasErrors={hasWarnings(
              baseElement,
              instanceNames,
              baseElements,
              parameters,
              allInstancesInAllTrees,
              validateReturnType
            )}
            isLoadingModifiers={isLoadingModifiers}
            instanceNames={instanceNames}
            label={getLabelForInstance(baseElement, baseElements)}
            modifiersByInputType={modifiersByInputType}
            updateModifiers={modifiers =>
              updateInstanceModifiers('baseElements', modifiers, getChildsPath(baseElement.uniqueId))
            }
            validateReturnType={validateReturnType}
            vsacApiKey={vsacApiKey}
          />
        );
      })}
      <ElementSelect handleAddElement={addElement} />
    </>
  );
};

BaseElements.propTypes = {
  addBaseElement: PropTypes.func.isRequired,
  addInstance: PropTypes.func.isRequired,
  baseElements: PropTypes.array.isRequired,
  deleteInstance: PropTypes.func.isRequired,
  editInstance: PropTypes.func.isRequired,
  getAllInstancesInAllTrees: PropTypes.func.isRequired,
  instanceNames: PropTypes.array.isRequired,
  isLoadingModifiers: PropTypes.bool,
  modifiersByInputType: PropTypes.object.isRequired,
  parameters: PropTypes.array.isRequired,
  templates: PropTypes.array.isRequired,
  updateBaseElementLists: PropTypes.func.isRequired,
  updateInstanceModifiers: PropTypes.func.isRequired,
  validateReturnType: PropTypes.bool.isRequired,
  vsacApiKey: PropTypes.string
};

export default BaseElements;
