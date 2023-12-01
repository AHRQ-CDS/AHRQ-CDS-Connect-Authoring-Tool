import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { useSelector } from 'react-redux';
import ListGroup from 'components/builder/ListGroup';
import { ArtifactElement } from 'components/builder/artifact-element';
import { ElementSelect } from 'components/builder/element-select';
import { getLabelForInstance, getFieldWithId } from 'utils/instances';
import createTemplateInstance from 'utils/templates';
import { getElementErrors, hasWarnings } from 'utils/warnings';
import { getAllElements, getElementNames } from 'components/builder/utils';

const BaseElements = ({
  addBaseElement,
  addInstance,
  deleteInstance,
  editInstance,
  updateBaseElementLists,
  updateInstanceModifiers,
  validateReturnType
}) => {
  const artifact = useSelector(state => state.artifacts.artifact);
  const { baseElements } = artifact;
  const parameters = artifact.parameters.filter(({ name }) => name?.length);
  const allElements = getAllElements(artifact) ?? [];
  const instanceNames = getElementNames(allElements);

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
            <div key={baseElement.uniqueId} id={baseElement.uniqueId}>
              <ListGroup
                addInstance={addInstance}
                deleteInstance={deleteInstance}
                deleteLists={() => deleteBaseElements(i)}
                editInstance={editInstance}
                listInstance={baseElement}
                updateLists={baseElement => updateBaseElements(baseElement, i)}
                updateInstanceModifiers={updateInstanceModifiers}
              />
            </div>
          );
        }
        return (
          <div key={baseElement.uniqueId} id={baseElement.uniqueId}>
            <ArtifactElement
              alerts={getElementErrors(baseElement, allElements, baseElements, instanceNames, parameters)}
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
                allElements,
                validateReturnType
              )}
              label={getLabelForInstance(baseElement, baseElements)}
              updateModifiers={(modifiers, fhirVersion) =>
                updateInstanceModifiers(
                  'baseElements',
                  modifiers,
                  getChildsPath(baseElement.uniqueId),
                  null,
                  null,
                  fhirVersion
                )
              }
              validateReturnType={validateReturnType}
            />
          </div>
        );
      })}
      <ElementSelect handleAddElement={addElement} />
    </>
  );
};

BaseElements.propTypes = {
  addBaseElement: PropTypes.func.isRequired,
  addInstance: PropTypes.func.isRequired,
  deleteInstance: PropTypes.func.isRequired,
  editInstance: PropTypes.func.isRequired,
  updateBaseElementLists: PropTypes.func.isRequired,
  updateInstanceModifiers: PropTypes.func.isRequired,
  validateReturnType: PropTypes.bool.isRequired
};

export default BaseElements;
