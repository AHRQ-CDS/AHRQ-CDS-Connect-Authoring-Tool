import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { IconButton } from '@material-ui/core';
import {
  Close as CloseIcon,
  ExpandLess as ExpandLessIcon,
  ExpandMore as ExpandMoreIcon
} from '@material-ui/icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExclamationCircle } from '@fortawesome/free-solid-svg-icons';

import ConjunctionGroup from './ConjunctionGroup';
import ExpressionPhrase from './modifiers/ExpressionPhrase';

import { hasGroupNestedWarning } from '../../utils/warnings';
import StringField from './fields/StringField';

export default class Subpopulation extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isExpanded: this.props.subpopulation.expanded || false
    };
  }

  expand = () => {
    this.setState({ isExpanded: true });
  }

  collapse = () => {
    this.setState({ isExpanded: false });
  }

  addInstance = (name, template, path) => {
    this.props.addInstance(name, template, path, this.props.subpopulation.uniqueId);
  }

  getAllInstances = treeName => this.props.getAllInstances(treeName, null, this.props.subpopulation.uniqueId)

  editInstance = (treeName, fields, path, editingConjunction) => {
    this.props.editInstance(treeName, fields, path, editingConjunction, this.props.subpopulation.uniqueId);
  }

  deleteInstance = (treeName, path, toAdd) => {
    this.props.deleteInstance(treeName, path, toAdd, this.props.subpopulation.uniqueId);
  }

  onEnterKey = (e) => {
    e.which = e.which || e.keyCode;
    if (e.which === 13) {
      if (this.state.isExpanded) this.collapse();
      else this.expand();
    }
  }

  subpopulationHasOneChildWarning = () =>
    this.props.subpopulation.childInstances && this.props.subpopulation.childInstances.length < 1;

  hasNestedWarnings = (childInstances) => {
    const { instanceNames, baseElements, parameters, getAllInstancesInAllTrees, validateReturnType } = this.props;
    const allInstancesInAllTrees = getAllInstancesInAllTrees();
    const hasNestedWarning = hasGroupNestedWarning(
      childInstances,
      instanceNames,
      baseElements,
      parameters,
      allInstancesInAllTrees,
      validateReturnType
    );
    return hasNestedWarning;
  }

  render() {
    const { subpopulation, instanceNames } = this.props;
    const { isExpanded } = this.state;
    const headerClass = classNames('card-element__header', { collapsed: !isExpanded });
    const headerTopClass = classNames('card-element__header-top', { collapsed: !isExpanded });
    const duplicateNameIndex = instanceNames.findIndex(name =>
      name.id !== subpopulation.uniqueId && name.name === subpopulation.subpopulationName);

    return (
      <div className="subpopulation card-group card-group__top">
        <div className="card-element">
          <div className={headerClass}>
            <div className={headerTopClass}>
              {isExpanded ?
                <div className="card-element__heading">
                  <StringField
                    id="subpopulation_title"
                    name="Subpopulation"
                    uniqueId={this.props.subpopulation.uniqueId}
                    updateInstance={(value) => {
                      this.props.setSubpopulationName(value.subpopulation_title, this.props.subpopulation.uniqueId);
                    }}
                    value={this.props.subpopulation.subpopulationName}
                  />

                  {duplicateNameIndex !== -1 &&
                    <div className='warning'>Warning: Name already in use. Choose another name.</div>
                  }
                </div>
              :
                <div className="card-element__heading">
                  <div className="heading-name">
                    {this.props.subpopulation.subpopulationName}:
                    {
                      (duplicateNameIndex !== -1 ||
                      this.subpopulationHasOneChildWarning() ||
                      this.hasNestedWarnings(this.props.subpopulation.childInstances)) &&
                      <div className="warning"><FontAwesomeIcon icon={faExclamationCircle} /> Has warnings</div>
                    }
                  </div>
                </div>
              }

              <div className="card-element__buttons">
                <IconButton
                  aria-label={`${isExpanded ? 'hide' : 'show'} ${this.props.subpopulation.subpopulationName}`}
                  color="primary"
                  onClick={isExpanded ? this.collapse : this.expand}
                >
                  {isExpanded ? <ExpandLessIcon fontSize="small" /> : <ExpandMoreIcon fontSize="small" />}
                </IconButton>

                <IconButton
                  aria-label="close"
                  color="primary"
                  onClick={() => this.props.deleteSubpopulation(this.props.subpopulation.uniqueId)}
                >
                  <CloseIcon fontSize="small" />
                </IconButton>
              </div>
            </div>

            {!isExpanded &&
              <ExpressionPhrase
                class="expression expression__group expression-collapsed"
                instance={this.props.subpopulation}
                baseElements={this.props.baseElements}
              />
            }
          </div>

          {isExpanded && this.renderContents()}
        </div>
      </div>
    );
  }

  renderContents = () => (
    <div className="card-element__body">
      {this.subpopulationHasOneChildWarning() &&
        <div className='warning'>This subpopulation needs at least one element</div>
      }

      <ExpressionPhrase
        class="expression expression__group"
        instance={this.props.subpopulation}
        baseElements={this.props.baseElements}
      />
  
      <ConjunctionGroup
        root={true}
        treeName={this.props.treeName}
        artifact={this.props.artifact}
        templates={this.props.templates}
        instance={this.props.subpopulation}
        addInstance={this.addInstance}
        editInstance={this.editInstance}
        deleteInstance={this.deleteInstance}
        getAllInstances={this.getAllInstances}
        getAllInstancesInAllTrees={this.props.getAllInstancesInAllTrees}
        updateInstanceModifiers={this.props.updateInstanceModifiers}
        parameters={this.props.parameters}
        baseElements={this.props.baseElements}
        externalCqlList={this.props.externalCqlList}
        loadExternalCqlList={this.props.loadExternalCqlList}
        subPopulationIndex={this.props.subpopulationIndex}
        modifierMap={this.props.modifierMap}
        modifiersByInputType={this.props.modifiersByInputType}
        isLoadingModifiers={this.props.isLoadingModifiers}
        conversionFunctions={this.props.conversionFunctions}
        instanceNames={this.props.instanceNames}
        scrollToElement={this.props.scrollToElement}
        loginVSACUser={this.props.loginVSACUser}
        setVSACAuthStatus={this.props.setVSACAuthStatus}
        vsacStatus={this.props.vsacStatus}
        vsacStatusText={this.props.vsacStatusText}
        searchVSACByKeyword={this.props.searchVSACByKeyword}
        isSearchingVSAC={this.props.isSearchingVSAC}
        vsacSearchResults={this.props.vsacSearchResults}
        vsacSearchCount={this.props.vsacSearchCount}
        getVSDetails={this.props.getVSDetails}
        isRetrievingDetails={this.props.isRetrievingDetails}
        vsacDetailsCodes={this.props.vsacDetailsCodes}
        vsacDetailsCodesError={this.props.vsacDetailsCodesError}
        vsacApiKey={this.props.vsacApiKey}
        validateReturnType={this.props.validateReturnType}
        isValidatingCode={this.props.isValidatingCode}
        isValidCode={this.props.isValidCode}
        codeData={this.props.codeData}
        validateCode={this.props.validateCode}
        resetCodeValidation={this.props.resetCodeValidation}
      />
    </div>
  );
}

Subpopulation.propTypes = {
  artifact: PropTypes.object.isRequired,
  subpopulation: PropTypes.object.isRequired,
  subpopulationIndex: PropTypes.number.isRequired,
  setSubpopulationName: PropTypes.func.isRequired,
  deleteSubpopulation: PropTypes.func.isRequired,
  addInstance: PropTypes.func.isRequired,
  editInstance: PropTypes.func.isRequired,
  updateInstanceModifiers: PropTypes.func.isRequired,
  deleteInstance: PropTypes.func.isRequired,
  getAllInstances: PropTypes.func.isRequired,
  getAllInstancesInAllTrees: PropTypes.func.isRequired,
  instanceNames: PropTypes.array.isRequired,
  treeName: PropTypes.string.isRequired,
  parameters: PropTypes.array.isRequired,
  externalCqlList: PropTypes.array.isRequired,
  loadExternalCqlList: PropTypes.func.isRequired,
  templates: PropTypes.array.isRequired,
  modifierMap: PropTypes.object.isRequired,
  modifiersByInputType: PropTypes.object.isRequired,
  isLoadingModifiers: PropTypes.bool,
  conversionFunctions: PropTypes.array,
  scrollToElement: PropTypes.func,
  loginVSACUser: PropTypes.func.isRequired,
  setVSACAuthStatus: PropTypes.func.isRequired,
  vsacStatus: PropTypes.string,
  vsacStatusText: PropTypes.string,
  searchVSACByKeyword: PropTypes.func.isRequired,
  isSearchingVSAC: PropTypes.bool.isRequired,
  vsacSearchResults: PropTypes.array.isRequired,
  vsacSearchCount: PropTypes.number.isRequired,
  getVSDetails: PropTypes.func.isRequired,
  isRetrievingDetails: PropTypes.bool.isRequired,
  vsacDetailsCodes: PropTypes.array.isRequired,
  vsacDetailsCodesError: PropTypes.string.isRequired,
};
