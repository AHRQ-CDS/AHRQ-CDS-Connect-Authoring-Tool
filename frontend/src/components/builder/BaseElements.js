import React, { Component } from 'react';
import PropTypes from 'prop-types';

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

  renderListOperationConjunction = (s, i) => (
    <div>
      <ListGroup
        addInstance={this.props.addInstance}
        artifact={this.props.instance}
        baseElements={this.props.baseElements}
        conversionFunctions={this.props.conversionFunctions}
        deleteInstance={this.props.deleteInstance}
        editInstance={this.props.editInstance}
        getAllInstances={this.props.getAllInstances}
        getAllInstancesInAllTrees={this.props.getAllInstancesInAllTrees}
        index={i}
        instance={s}
        instanceNames={this.props.instanceNames}
        isLoadingModifiers={this.props.isLoadingModifiers}
        modifierMap={this.props.modifierMap}
        modifiersByInputType={this.props.modifiersByInputType}
        parameters={this.props.parameters}
        templates={this.props.templates}
        treeName={this.props.treeName}
        updateBaseElementLists={this.props.updateBaseElementLists}
        updateInstanceModifiers={this.props.updateInstanceModifiers}
        vsacApiKey={this.props.vsacApiKey}
      />
    </div>
  );

  render() {
    const {
      baseElements,
      deleteInstance,
      disableAddElement,
      editInstance,
      getAllInstancesInAllTrees,
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
        {this.props.instance.baseElements.map((baseElement, i) => {
          if (baseElement.conjunction) {
            return (
              <div className="subpopulations" key={i} id={baseElement.uniqueId}>
                {this.renderListOperationConjunction(baseElement, i)}
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
  conversionFunctions: PropTypes.array,
  deleteInstance: PropTypes.func.isRequired,
  editInstance: PropTypes.func.isRequired,
  getAllInstances: PropTypes.func.isRequired,
  getAllInstancesInAllTrees: PropTypes.func.isRequired,
  instance: PropTypes.object.isRequired,
  instanceNames: PropTypes.array.isRequired,
  isLoadingModifiers: PropTypes.bool,
  modifierMap: PropTypes.object.isRequired,
  modifiersByInputType: PropTypes.object.isRequired,
  parameters: PropTypes.array.isRequired,
  templates: PropTypes.array.isRequired,
  treeName: PropTypes.string.isRequired,
  updateBaseElementLists: PropTypes.func.isRequired,
  updateInstanceModifiers: PropTypes.func.isRequired,
  validateReturnType: PropTypes.bool.isRequired,
  vsacApiKey: PropTypes.string
};
