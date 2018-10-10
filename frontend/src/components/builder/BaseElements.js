import React, { Component } from 'react';
import PropTypes from 'prop-types';
import FontAwesome from 'react-fontawesome';
import _ from 'lodash';
import { UncontrolledTooltip } from 'reactstrap';
import ElementSelect from './ElementSelect';
import TemplateInstance from './TemplateInstance';
import ConjunctionGroup from './ConjunctionGroup';

import createTemplateInstance from '../../utils/templates';


export default class BaseElements extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isExpanded: true
    };
  }

  collapse = () => {
    this.setState({ isExpanded: false });
  }

  expand = () => {
    this.setState({ isExpanded: true });
  }

  onEnterKey = (e) => {
    e.which = e.which || e.keyCode;
    if (e.which === 13) {
      if (this.state.isExpanded) this.collapse();
      else this.expand();
    }
  }

  addChild = (template) => {
    const instance = createTemplateInstance(template);
    instance.path = '';
    if (instance.conjunction) {
      instance.parameters[0].value = `Base Element List ${this.props.instance.baseElements.length + 1}`;
    }
    this.props.addBaseElement(instance);
  }

  addInstance = (name, template, path, baseElement, returnType) => {
    this.props.addInstance(name, template, path, baseElement.uniqueId, undefined, null, returnType);
  }

  editInstance = (treeName, params, path, editingConjunction, baseElement) => {
    this.props.editInstance(treeName, params, path, editingConjunction, baseElement.uniqueId);
  }

  deleteInstance = (treeName, path, toAdd, baseElement) => {
    this.props.deleteInstance(treeName, path, toAdd, baseElement.uniqueId, true);
  }

  updateInstanceModifiers = (t, modifiers, path, index) => {
    this.props.updateInstanceModifiers(t, modifiers, path, index, true);
  }

  // TODO update variable names
  updateBaseElementList = (name, uniqueId) => {
    const newSubpopulations = _.cloneDeep(this.props.instance.baseElements);
    const subpopulationIndex = this.props.instance.baseElements.findIndex(baseElement => baseElement.uniqueId === uniqueId);
    newSubpopulations[subpopulationIndex].parameters[0].value = name;

    this.props.updateSubpopulations(newSubpopulations, 'baseElements');
  }

  isBaseElementListUsed = (element) => {
    return element.usedBy ? element.usedBy.length !== 0 : false;
  }

  deleteBaseElementList = (uniqueId) => {
    const newSubpopulations = _.cloneDeep(this.props.instance.baseElements);
    const subpopulationIndex = this.props.instance.baseElements.findIndex(baseElement => baseElement.uniqueId === uniqueId);
    const baseElementListIsInUse = this.isBaseElementListUsed(newSubpopulations[subpopulationIndex]);
    if (!baseElementListIsInUse) {
      newSubpopulations.splice(subpopulationIndex, 1);
      this.props.updateSubpopulations(newSubpopulations, 'baseElements');
    }
  }

  getPath = () => 'baseElements'

  getChildsPath = (id) => {
    const artifactTree = this.props.instance;
    const childIndex = artifactTree.baseElements.findIndex(instance => instance.uniqueId === id);
    return `${childIndex}`;
  }

  renderListOperationConjunction = (s, i) => {
    const listTypes = ['list_of_observations', 'list_of_conditions', 'list_of_medication_statements',
      'list_of_medication_orders', 'list_of_procedures', 'list_of_allergy_intolerances', 'list_of_encounters'];
    return (
      <div className="card-element__body">
        <ConjunctionGroup
          root={true}
          treeName={this.props.treeName}
          artifact={this.props.instance}
          templates={this.props.templates}
          valueSets={this.props.valueSets}
          loadValueSets={this.props.loadValueSets}
          instance={s}
          addInstance={(name, template, path, uid, index, tree, returnType) => this.addInstance(name, template, path, s, returnType)}
          editInstance={(treeName, params, path, editingConjunction) => this.editInstance(treeName, params, path, editingConjunction, s)}
          deleteInstance={(treeName, path, toAdd) => this.deleteInstance(treeName, path, toAdd, s)}
          getAllInstances={this.props.getAllInstances}
          updateInstanceModifiers={(t, modifiers, path) => this.updateInstanceModifiers(t, modifiers, path, i)}
          parameters={this.props.parameters}
          baseElements={this.props.baseElements}
          getPath={this.getChildsPath} // TODO Need these??
          conversionFunctions={this.props.conversionFunctions}
          instanceNames={this.props.instanceNames}
          subPopulationIndex={this.props.subPopulationIndex} // TODO Need these??
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
          validateReturnType={true}
          returnTypes={listTypes}
          options={'listOperations'}
          inBaseElements={true}
        />
      </div>
    );
  }

  renderList = (s, i) => {
    let name = s.parameters[0].value;
    const duplicateNameIndex = this.props.instanceNames.findIndex(name =>
      name.id !== s.uniqueId && name.name === s.parameters[0].value);
    const baseElementListUsed = this.isBaseElementListUsed(s);
    const disabledClass = baseElementListUsed ? 'disabled' : '';
    return (
      <div className="subpopulation card-group card-group__top">
        <div className="card-element">
          <div className="card-element__header">
            {this.state.isExpanded ?
              <div className="subpopulation__title">
                <FontAwesome fixedWidth name='angle-double-down'
                  id="collapse-icon"
                  tabIndex="0"
                  onClick={this.state.isExpanded ? this.collapse : this.expand}
                  onKeyPress={this.onEnterKey}
                />

                <input
                  type="text"
                  className="subpopulation__name-input"
                  title="Base Element List Title"
                  aria-label="Base Element List Title"
                  value={name}
                  onClick={event => event.stopPropagation()}
                  onChange={(event) => {
                    this.updateBaseElementList(event.target.value, s.uniqueId);
                  }}
                />
                {duplicateNameIndex !== -1
                  && <div className='warning'>Warning: Name already in use. Choose another name.</div>}
              </div>
              :
              <div className="subpopulation-title">
                <FontAwesome fixedWidth name='angle-double-right'
                  id="collapse-icon"
                  tabIndex="0"
                  onClick={this.state.isExpanded ? this.collapse : this.expand}
                  onKeyPress={this.onEnterKey}
                />
                <h4>{s.parameters[0].value}</h4>
              </div>
            }

            <div className="card-element__buttons">
              <button className="secondary-button" onClick={this.state.isExpanded ? this.collapse : this.expand}>
                {this.state.isExpanded ? 'Done' : 'Edit'}
              </button>

              <button
                aria-label="Remove subpopulation"
                className={`secondary-button ${disabledClass}`}
                id={`deletebutton-${s.uniqueId}`}
                onClick={() => this.deleteBaseElementList(s.uniqueId)}>
                <FontAwesome fixedWidth name='times' />
              </button>
              {baseElementListUsed &&
                <UncontrolledTooltip
                  target={`deletebutton-${s.uniqueId}`} placement="left">
                  This base element is referenced somewhere else. To delete this element, remove all references to it.
              </UncontrolledTooltip>}
            </div>
          </div>

          {this.state.isExpanded && this.renderListOperationConjunction(s, i)}
        </div>
      </div>
    );
  }
  render() {
    return <div>
      {this.props.instance.baseElements.map((s, i) => {
        if (s.conjunction) {
          return <div className="subpopulations" key={i}>{this.renderList(s, i)}</div>;
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
                subpopulationIndex={this.props.subPopulationIndex}
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
