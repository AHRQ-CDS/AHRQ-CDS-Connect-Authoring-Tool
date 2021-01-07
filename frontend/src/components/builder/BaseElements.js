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
        codeData={this.props.codeData}
        modifierMap={this.props.modifierMap}
        modifiersByInputType={this.props.modifiersByInputType}
        isLoadingModifiers={this.props.isLoadingModifiers}
        conversionFunctions={this.props.conversionFunctions}
        deleteInstance={this.props.deleteInstance}
        editInstance={this.props.editInstance}
        externalCqlList={this.props.externalCqlList}
        getAllInstances={this.props.getAllInstances}
        getAllInstancesInAllTrees={this.props.getAllInstancesInAllTrees}
        getVSDetails={this.props.getVSDetails}
        index={i}
        instance={s}
        instanceNames={this.props.instanceNames}
        isRetrievingDetails={this.props.isRetrievingDetails}
        isSearchingVSAC={this.props.isSearchingVSAC}
        isValidatingCode={this.props.isValidatingCode}
        isValidCode={this.props.isValidCode}
        loadExternalCqlList={this.props.loadExternalCqlList}
        loginVSACUser={this.props.loginVSACUser}
        parameters={this.props.parameters}
        resetCodeValidation={this.props.resetCodeValidation}
        scrollToElement={this.props.scrollToElement}
        searchVSACByKeyword={this.props.searchVSACByKeyword}
        setVSACAuthStatus={this.props.setVSACAuthStatus}
        templates={this.props.templates}
        treeName={this.props.treeName}
        updateBaseElementLists={this.props.updateBaseElementLists}
        updateInstanceModifiers={this.props.updateInstanceModifiers}
        validateCode={this.props.validateCode}
        vsacApiKey={this.props.vsacApiKey}
        vsacDetailsCodes={this.props.vsacDetailsCodes}
        vsacDetailsCodesError={this.props.vsacDetailsCodesError}
        vsacIsAuthenticating={this.props.vsacIsAuthenticating}
        vsacSearchCount={this.props.vsacSearchCount}
        vsacSearchResults={this.props.vsacSearchResults}
        vsacStatus={this.props.vsacStatus}
        vsacStatusText={this.props.vsacStatusText}
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
                codeData={this.props.codeData}
                modifierMap={this.props.modifierMap}
                modifiersByInputType={this.props.modifiersByInputType}
                isLoadingModifiers={this.props.isLoadingModifiers}
                conversionFunctions={this.props.conversionFunctions}
                deleteInstance={this.props.deleteInstance}
                editInstance={this.props.editInstance}
                getPath={this.getChildsPath}
                getVSDetails={this.props.getVSDetails}
                instanceNames={this.props.instanceNames}
                isRetrievingDetails={this.props.isRetrievingDetails}
                isSearchingVSAC={this.props.isSearchingVSAC}
                isValidatingCode={this.props.isValidatingCode}
                isValidCode={this.props.isValidCode}
                loginVSACUser={this.props.loginVSACUser}
                otherInstances={[]}
                parameters={this.props.parameters}
                renderIndentButtons={() => {}}
                resetCodeValidation={this.props.resetCodeValidation}
                scrollToElement={this.props.scrollToElement}
                searchVSACByKeyword={this.props.searchVSACByKeyword}
                setVSACAuthStatus={this.props.setVSACAuthStatus}
                templateInstance={s}
                treeName={this.props.treeName}
                updateInstanceModifiers={this.props.updateInstanceModifiers}
                validateCode={this.props.validateCode}
                validateReturnType={this.props.validateReturnType}
                vsacApiKey={this.props.vsacApiKey}
                vsacDetailsCodes={this.props.vsacDetailsCodes}
                vsacDetailsCodesError={this.props.vsacDetailsCodesError}
                vsacIsAuthenticating={this.props.vsacIsAuthenticating}
                vsacSearchCount={this.props.vsacSearchCount}
                vsacSearchResults={this.props.vsacSearchResults}
                vsacStatus={this.props.vsacStatus}
                vsacStatusText={this.props.vsacStatusText}
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
            codeData={this.props.codeData}
            externalCqlList={this.props.externalCqlList}
            getVSDetails={this.props.getVSDetails}
            inBaseElements={true}
            isRetrievingDetails={this.props.isRetrievingDetails}
            isSearchingVSAC={this.props.isSearchingVSAC}
            isValidatingCode={this.props.isValidatingCode}
            isValidCode={this.props.isValidCode}
            loadExternalCqlList={this.props.loadExternalCqlList}
            loginVSACUser={this.props.loginVSACUser}
            onSuggestionSelected={this.addChild}
            parameters={this.props.parameters}
            resetCodeValidation={this.props.resetCodeValidation}
            searchVSACByKeyword={this.props.searchVSACByKeyword}
            setVSACAuthStatus={this.props.setVSACAuthStatus}
            validateCode={this.props.validateCode}
            vsacApiKey={this.props.vsacApiKey}
            vsacDetailsCodes={this.props.vsacDetailsCodes}
            vsacDetailsCodesError={this.props.vsacDetailsCodesError}
            vsacSearchCount={this.props.vsacSearchCount}
            vsacSearchResults={this.props.vsacSearchResults}
            vsacStatus={this.props.vsacStatus}
            vsacStatusText={this.props.vsacStatusText}
          />
        </div>
      </div>
    </div>;
  }
}

BaseElements.propTypes = {
  addBaseElement: PropTypes.func.isRequired,
  addInstance: PropTypes.func.isRequired,
  codeData: PropTypes.object,
  modifierMap: PropTypes.object.isRequired,
  modifiersByInputType: PropTypes.object.isRequired,
  isLoadingModifiers: PropTypes.bool,
  conversionFunctions: PropTypes.array,
  deleteInstance: PropTypes.func.isRequired,
  editInstance: PropTypes.func.isRequired,
  externalCqlList: PropTypes.array.isRequired,
  getAllInstances: PropTypes.func.isRequired,
  getAllInstancesInAllTrees: PropTypes.func.isRequired,
  getVSDetails: PropTypes.func.isRequired,
  instance: PropTypes.object.isRequired,
  instanceNames: PropTypes.array.isRequired,
  isRetrievingDetails: PropTypes.bool.isRequired,
  isSearchingVSAC: PropTypes.bool.isRequired,
  isValidatingCode: PropTypes.bool.isRequired,
  isValidCode: PropTypes.bool,
  loadExternalCqlList: PropTypes.func.isRequired,
  loginVSACUser: PropTypes.func.isRequired,
  parameters: PropTypes.array.isRequired,
  resetCodeValidation: PropTypes.func.isRequired,
  scrollToElement: PropTypes.func.isRequired,
  searchVSACByKeyword: PropTypes.func.isRequired,
  setVSACAuthStatus: PropTypes.func.isRequired,
  templates: PropTypes.array.isRequired,
  treeName: PropTypes.string.isRequired,
  updateBaseElementLists: PropTypes.func.isRequired,
  updateInstanceModifiers: PropTypes.func.isRequired,
  validateCode: PropTypes.func.isRequired,
  validateReturnType: PropTypes.bool.isRequired,
  vsacApiKey: PropTypes.string,
  vsacDetailsCodes: PropTypes.array.isRequired,
  vsacDetailsCodesError: PropTypes.string.isRequired,
  vsacIsAuthenticating: PropTypes.bool.isRequired,
  vsacSearchCount: PropTypes.number.isRequired,
  vsacSearchResults: PropTypes.array.isRequired,
  vsacStatus: PropTypes.string,
  vsacStatusText: PropTypes.string
};
