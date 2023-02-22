import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';

import { ElementSelect } from './element-select';
import ListGroup from './ListGroup';
import { ArtifactElement } from 'components/builder/artifact-element';
import { getElementErrors, hasWarnings } from 'utils/warnings';
import { getLabelForInstance } from 'utils/instances';

import createTemplateInstance from 'utils/templates';
import { getFieldWithId } from 'utils/instances';

export default class BaseElements extends Component {
  addChild = template => {
    const instance = createTemplateInstance(template);
    instance.path = '';
    if (instance.conjunction) {
      const nameField = getFieldWithId(instance.fields, 'element_name');
      nameField.value = `Base Element ${this.props.instance.baseElements.length + 1}`;
    }
    this.props.addBaseElement(instance);
  };

  getPath = () => 'baseElements';

  getChildsPath = id => {
    const artifactTree = this.props.instance;
    const childIndex = artifactTree.baseElements.findIndex(instance => instance.uniqueId === id);
    return `${childIndex}`;
  };

  updateBaseElements = (newBaseElement, index) => {
    const baseElementsCopy = _.cloneDeep(this.props.baseElements);
    baseElementsCopy[index] = newBaseElement;
    this.props.updateBaseElementLists(baseElementsCopy, 'baseElements');
  };

  deleteBaseElements = index => {
    const baseElementsCopy = _.cloneDeep(this.props.baseElements);
    baseElementsCopy.splice(index, 1);

    // Update Base Elements and update FHIRVersion because
    // elements that required a specific FHIR version may have been removed.
    // Because deleteInstance isn't called directly, we need to check here.
    this.props.updateBaseElementLists(baseElementsCopy, 'baseElements', true);
  };

  renderConjunctionGroup = (baseElement, i) => {
    const {
      addInstance,
      artifact,
      baseElements,
      deleteInstance,
      editInstance,
      getAllInstancesInAllTrees,
      instanceNames,
      isLoadingModifiers,
      modifiersByInputType,
      parameters,
      templates,
      updateInstanceModifiers,
      vsacApiKey
    } = this.props;
    return (
      <ListGroup
        addInstance={addInstance}
        artifact={artifact}
        baseElements={baseElements}
        deleteInstance={deleteInstance}
        deleteLists={() => this.deleteBaseElements(i)}
        editInstance={editInstance}
        getAllInstancesInAllTrees={getAllInstancesInAllTrees}
        instanceNames={instanceNames}
        isLoadingModifiers={isLoadingModifiers}
        listInstance={baseElement}
        modifiersByInputType={modifiersByInputType}
        parameters={parameters}
        templates={templates}
        updateLists={baseElement => this.updateBaseElements(baseElement, i)}
        updateInstanceModifiers={updateInstanceModifiers}
        vsacApiKey={vsacApiKey}
      />
    );
  };

  render() {
    const {
      baseElements,
      deleteInstance,
      disableAddElement,
      editInstance,
      getAllInstancesInAllTrees,
      instance,
      instanceNames,
      isLoadingModifiers,
      modifiersByInputType,
      parameters,
      treeName,
      updateInstanceModifiers,
      validateReturnType,
      vsacApiKey
    } = this.props;
    const allInstancesInAllTrees = getAllInstancesInAllTrees();

    return (
      <div>
        {instance.baseElements.map((baseElement, i) => {
          if (baseElement.conjunction) {
            return (
              <div className="subpopulations" key={i}>
                {this.renderConjunctionGroup(baseElement, i)}
              </div>
            );
          }

          return (
            <div className="card-group card-group__top" key={i} id={baseElement.uniqueId}>
              <div className="card-group-section subpopulation base-element">
                <ArtifactElement
                  alerts={getElementErrors(
                    baseElement,
                    allInstancesInAllTrees,
                    baseElements,
                    instanceNames,
                    parameters
                  )}
                  allInstancesInAllTrees={allInstancesInAllTrees}
                  allowIndent={false}
                  baseElementInUsedList={!!disableAddElement}
                  elementInstance={baseElement}
                  handleDeleteElement={() => deleteInstance(treeName, this.getChildsPath(baseElement.uniqueId))}
                  handleUpdateElement={newElementField =>
                    editInstance(treeName, newElementField, this.getChildsPath(baseElement.uniqueId), false)
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
                    updateInstanceModifiers(treeName, modifiers, this.getChildsPath(baseElement.uniqueId))
                  }
                  validateReturnType={validateReturnType}
                  vsacApiKey={vsacApiKey}
                />
              </div>
            </div>
          );
        })}

        <ElementSelect handleAddElement={this.addChild} />
      </div>
    );
  }
}

BaseElements.propTypes = {
  addBaseElement: PropTypes.func.isRequired,
  addInstance: PropTypes.func.isRequired,
  baseElements: PropTypes.array.isRequired,
  deleteInstance: PropTypes.func.isRequired,
  editInstance: PropTypes.func.isRequired,
  getAllInstancesInAllTrees: PropTypes.func.isRequired,
  instance: PropTypes.object.isRequired,
  instanceNames: PropTypes.array.isRequired,
  isLoadingModifiers: PropTypes.bool,
  modifiersByInputType: PropTypes.object.isRequired,
  parameters: PropTypes.array.isRequired,
  templates: PropTypes.array.isRequired,
  treeName: PropTypes.string.isRequired,
  updateBaseElementLists: PropTypes.func.isRequired,
  updateInstanceModifiers: PropTypes.func.isRequired,
  validateReturnType: PropTypes.bool.isRequired,
  vsacApiKey: PropTypes.string
};
