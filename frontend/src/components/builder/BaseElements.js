import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ElementSelect from './ElementSelect';
import TemplateInstance from './TemplateInstance';
import ListGroup from './ListGroup';

import createTemplateInstance from '../../utils/templates';


export default class BaseElements extends Component {
  addChild = (template) => {
    const instance = createTemplateInstance(template);
    instance.path = '';
    if (instance.conjunction) {
      instance.parameters[0].value = `Base Element List ${this.props.instance.baseElements.length + 1}`;
    }
    this.props.addBaseElement(instance);
  }

  getPath = () => 'baseElements'

  getChildsPath = (id) => {
    const artifactTree = this.props.instance;
    const childIndex = artifactTree.baseElements.findIndex(instance => instance.uniqueId === id);
    return `${childIndex}`;
  }

  renderListOperationConjunction = (s, i) => (
    <div>
      <ListGroup
        treeName={this.props.treeName}
        artifact={this.props.instance}
        templates={this.props.templates}
        valueSets={this.props.valueSets}
        loadValueSets={this.props.loadValueSets}
        instance={s}
        index={i}
        addInstance={this.props.addInstance}
        editInstance={this.props.editInstance}
        deleteInstance={this.props.deleteInstance}
        getAllInstances={this.props.getAllInstances}
        updateInstanceModifiers={this.props.updateInstanceModifiers}
        updateBaseElementLists={this.props.updateBaseElementLists}
        parameters={this.props.parameters}
        baseElements={this.props.baseElements}
        conversionFunctions={this.props.conversionFunctions}
        instanceNames={this.props.instanceNames}
        loginVSACUser={this.props.loginVSACUser}
        setVSACAuthStatus={this.props.setVSACAuthStatus}
        vsacStatus={this.props.vsacStatus}
        vsacStatusText={this.props.vsacStatusText}
        timeLastAuthenticated={this.props.timeLastAuthenticated}
        searchVSACByKeyword={this.props.searchVSACByKeyword}
        isSearchingVSAC={this.props.isSearchingVSAC}
        vsacSearchResults={this.props.vsacSearchResults}
        vsacSearchCount={this.props.vsacSearchCount}
        getVSDetails={this.props.getVSDetails}
        isRetrievingDetails={this.props.isRetrievingDetails}
        vsacDetailsCodes={this.props.vsacDetailsCodes}
        vsacFHIRCredentials={this.props.vsacFHIRCredentials}
        isValidatingCode={this.props.isValidatingCode}
        isValidCode={this.props.isValidCode}
        codeData={this.props.codeData}
        validateCode={this.props.validateCode}
        resetCodeValidation={this.props.resetCodeValidation}
      />
    </div>
  );

  render() {
    return <div>
      {this.props.instance.baseElements.map((s, i) => {
        if (s.conjunction) {
          return <div className="subpopulations" key={i}>{this.renderListOperationConjunction(s, i)}</div>;
        }
        return (
          <div className="card-group card-group__top" key={i}>
            <div className="card-group-section subpopulation base-element">
              <TemplateInstance
                valueSets={this.props.valueSets}
                loadValueSets={this.props.loadValueSets}
                getPath={this.getChildsPath}
                treeName={this.props.treeName}
                templateInstance={s}
                otherInstances={[]}
                editInstance={this.props.editInstance}
                updateInstanceModifiers={this.props.updateInstanceModifiers}
                deleteInstance={this.props.deleteInstance}
                renderIndentButtons={() => {}}
                conversionFunctions={this.props.conversionFunctions}
                instanceNames={this.props.instanceNames}
                baseElements={this.props.baseElements}
                loginVSACUser={this.props.loginVSACUser}
                setVSACAuthStatus={this.props.setVSACAuthStatus}
                vsacStatus={this.props.vsacStatus}
                vsacStatusText={this.props.vsacStatusText}
                timeLastAuthenticated={this.props.timeLastAuthenticated}
                searchVSACByKeyword={this.props.searchVSACByKeyword}
                isSearchingVSAC={this.props.isSearchingVSAC}
                vsacSearchResults={this.props.vsacSearchResults}
                vsacSearchCount={this.props.vsacSearchCount}
                getVSDetails={this.props.getVSDetails}
                isRetrievingDetails={this.props.isRetrievingDetails}
                vsacDetailsCodes={this.props.vsacDetailsCodes}
                vsacFHIRCredentials={this.props.vsacFHIRCredentials}
                validateReturnType={this.props.validateReturnType}
                isValidatingCode={this.props.isValidatingCode}
                isValidCode={this.props.isValidCode}
                codeData={this.props.codeData}
                validateCode={this.props.validateCode}
                resetCodeValidation={this.props.resetCodeValidation} />
              </div>
            </div>
        );
      })}

      <div className="card-group card-group__top">
        <div className="card-element">
          <ElementSelect
            categories={this.props.templates}
            onSuggestionSelected={this.addChild}
            parameters={this.props.parameters}
            loginVSACUser={this.props.loginVSACUser}
            setVSACAuthStatus={this.props.setVSACAuthStatus}
            vsacStatus={this.props.vsacStatus}
            vsacStatusText={this.props.vsacStatusText}
            timeLastAuthenticated={this.props.timeLastAuthenticated}
            searchVSACByKeyword={this.props.searchVSACByKeyword}
            isSearchingVSAC={this.props.isSearchingVSAC}
            vsacSearchResults={this.props.vsacSearchResults}
            vsacSearchCount={this.props.vsacSearchCount}
            getVSDetails={this.props.getVSDetails}
            isRetrievingDetails={this.props.isRetrievingDetails}
            vsacDetailsCodes={this.props.vsacDetailsCodes}
            vsacFHIRCredentials={this.props.vsacFHIRCredentials}
            isValidatingCode={this.props.isValidatingCode}
            isValidCode={this.props.isValidCode}
            codeData={this.props.codeData}
            validateCode={this.props.validateCode}
            resetCodeValidation={this.props.resetCodeValidation}
            inBaseElements={true}
          />
        </div>
      </div>
    </div>;
  }
}

BaseElements.propTypes = {
  treeName: PropTypes.string.isRequired,
  instance: PropTypes.object.isRequired,
  addBaseElement: PropTypes.func.isRequired,
  loadValueSets: PropTypes.func.isRequired,
  editInstance: PropTypes.func.isRequired,
  updateInstanceModifiers: PropTypes.func.isRequired,
  deleteInstance: PropTypes.func.isRequired,
  templates: PropTypes.array.isRequired,
  valueSets: PropTypes.array,
  conversionFunctions: PropTypes.array,
  instanceNames: PropTypes.array.isRequired,
  parameters: PropTypes.array.isRequired,
  loginVSACUser: PropTypes.func.isRequired,
  setVSACAuthStatus: PropTypes.func.isRequired,
  vsacStatus: PropTypes.string,
  vsacStatusText: PropTypes.string,
  timeLastAuthenticated: PropTypes.instanceOf(Date),
  searchVSACByKeyword: PropTypes.func.isRequired,
  isSearchingVSAC: PropTypes.bool.isRequired,
  vsacSearchResults: PropTypes.array.isRequired,
  vsacSearchCount: PropTypes.number.isRequired,
  getVSDetails: PropTypes.func.isRequired,
  isRetrievingDetails: PropTypes.bool.isRequired,
  vsacDetailsCodes: PropTypes.array.isRequired,
  vsacFHIRCredentials: PropTypes.object.isRequired,
  isValidatingCode: PropTypes.bool.isRequired,
  isValidCode: PropTypes.bool,
  codeData: PropTypes.object,
  validateCode: PropTypes.func.isRequired,
  resetCodeValidation: PropTypes.func.isRequired,
  validateReturnType: PropTypes.bool.isRequired
};
