import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ElementSelect from './ElementSelect';
import TemplateInstance from './TemplateInstance';
import ListGroup from './ListGroup';

import createTemplateInstance from '../../utils/templates';
import { getFieldWithId } from '../../utils/instances';

export default class BaseElements extends Component {
  addChild = (template) => {
    const instance = createTemplateInstance(template);
    instance.path = '';
    if (instance.conjunction) {
      const nameField = getFieldWithId(instance.fields, 'element_name');
      nameField.value = `Base Element ${this.props.instance.baseElements.length + 1}`;
    }
    this.props.addBaseElement(instance);
  }

  getPath = () => 'baseElements';

  getChildsPath = (id) => {
    const artifactTree = this.props.instance;
    const childIndex = artifactTree.baseElements.findIndex(instance => instance.uniqueId === id);
    return `${childIndex}`;
  }

  renderListOperationConjunction = (s, i) => (
    <div>
      <ListGroup
        addInstance={this.props.addInstance}
        artifact={this.props.instance}
        baseElements={this.props.baseElements}
        conversionFunctions={this.props.conversionFunctions}
        deleteInstance={this.props.deleteInstance}
        editInstance={this.props.editInstance}
        externalCqlList={this.props.externalCqlList}
        getAllInstances={this.props.getAllInstances}
        getAllInstancesInAllTrees={this.props.getAllInstancesInAllTrees}
        index={i}
        instance={s}
        instanceNames={this.props.instanceNames}
        isLoadingModifiers={this.props.isLoadingModifiers}
        loadExternalCqlList={this.props.loadExternalCqlList}
        modifierMap={this.props.modifierMap}
        modifiersByInputType={this.props.modifiersByInputType}
        parameters={this.props.parameters}
        scrollToElement={this.props.scrollToElement}
        templates={this.props.templates}
        treeName={this.props.treeName}
        updateBaseElementLists={this.props.updateBaseElementLists}
        updateInstanceModifiers={this.props.updateInstanceModifiers}
        vsacApiKey={this.props.vsacApiKey}
      />
    </div>
  );

  render() {
    const allInstancesInAllTrees = this.props.getAllInstancesInAllTrees();
    return <div>
      {this.props.instance.baseElements.map((s, i) => {
        if (s.conjunction) {
          return (
            <div className="subpopulations"
              key={i}
              id={s.uniqueId}>
              {this.renderListOperationConjunction(s, i)}
            </div>
          );
        }

        return (
          <div className="card-group card-group__top" key={i} id={s.uniqueId}>
            <div className="card-group-section subpopulation base-element">
              <TemplateInstance
                allInstancesInAllTrees={allInstancesInAllTrees}
                baseElements={this.props.baseElements}
                conversionFunctions={this.props.conversionFunctions}
                deleteInstance={this.props.deleteInstance}
                editInstance={this.props.editInstance}
                getPath={this.getChildsPath}
                instanceNames={this.props.instanceNames}
                isLoadingModifiers={this.props.isLoadingModifiers}
                modifierMap={this.props.modifierMap}
                modifiersByInputType={this.props.modifiersByInputType}
                otherInstances={[]}
                parameters={this.props.parameters}
                renderIndentButtons={() => {}}
                scrollToElement={this.props.scrollToElement}
                templateInstance={s}
                treeName={this.props.treeName}
                updateInstanceModifiers={this.props.updateInstanceModifiers}
                validateReturnType={this.props.validateReturnType}
                vsacApiKey={this.props.vsacApiKey}
              />
            </div>
          </div>
        );
      })}

      <div className="card-group card-group__top">
        <div className="card-element">
          <ElementSelect
            artifactId={this.props.instance._id}
            baseElements={this.props.baseElements}
            categories={this.props.templates}
            externalCqlList={this.props.externalCqlList}
            fhirVersion={this.props.fhirVersion}
            inBaseElements={true}
            loadExternalCqlList={this.props.loadExternalCqlList}
            onSuggestionSelected={this.addChild}
            parameters={this.props.parameters}
            vsacApiKey={this.props.vsacApiKey}
          />
        </div>
      </div>
    </div>;
  }
}

BaseElements.propTypes = {
  addBaseElement: PropTypes.func.isRequired,
  addInstance: PropTypes.func.isRequired,
  baseElements: PropTypes.array.isRequired,
  conversionFunctions: PropTypes.array,
  deleteInstance: PropTypes.func.isRequired,
  editInstance: PropTypes.func.isRequired,
  externalCqlList: PropTypes.array.isRequired,
  getAllInstances: PropTypes.func.isRequired,
  getAllInstancesInAllTrees: PropTypes.func.isRequired,
  instance: PropTypes.object.isRequired,
  instanceNames: PropTypes.array.isRequired,
  isLoadingModifiers: PropTypes.bool,
  loadExternalCqlList: PropTypes.func.isRequired,
  modifierMap: PropTypes.object.isRequired,
  modifiersByInputType: PropTypes.object.isRequired,
  parameters: PropTypes.array.isRequired,
  scrollToElement: PropTypes.func.isRequired,
  templates: PropTypes.array.isRequired,
  treeName: PropTypes.string.isRequired,
  updateBaseElementLists: PropTypes.func.isRequired,
  updateInstanceModifiers: PropTypes.func.isRequired,
  validateReturnType: PropTypes.bool.isRequired,
  vsacApiKey: PropTypes.string
};
