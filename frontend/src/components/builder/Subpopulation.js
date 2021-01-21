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

import { Modal } from 'components/elements';
import ConjunctionGroup from './ConjunctionGroup';
import ExpressionPhrase from './modifiers/ExpressionPhrase';

import { hasGroupNestedWarning } from '../../utils/warnings';
import StringField from './fields/StringField';

export default class Subpopulation extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isExpanded: this.props.subpopulation.expanded || false,
      showConfirmDeleteModal: false
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

  openConfirmDeleteModal = () => {
    this.setState({ showConfirmDeleteModal: true });
  }

  closeConfirmDeleteModal = () => {
    this.setState({ showConfirmDeleteModal: false });
  }

  handleDeleteSubpopulation = () => {
    this.props.deleteSubpopulation(this.props.subpopulation.uniqueId);
    this.closeConfirmDeleteModal();
  }

  renderConfirmDeleteModal() {
    const subpopulationName = this.props.subpopulation.subpopulationName;

    return (
      <Modal
        title="Delete Subpopulation Confirmation"
        submitButtonText="Delete"
        isOpen={this.state.showConfirmDeleteModal}
        handleCloseModal={this.closeConfirmDeleteModal}
        handleSaveModal={this.handleDeleteSubpopulation}
      >
        <div className="delete-subpopulation-confirmation-modal modal__content">
          <h5>
            {`Are you sure you want to permanently delete
              ${subpopulationName ? 'the following' : 'this unnamed'} subpopulation?`}
          </h5>

          {subpopulationName && <div className="subpopulation-info">
            <span>Subpopulation: </span>
            <span>{subpopulationName}</span>
          </div>}
        </div>
      </Modal>
    );
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
                  aria-label="remove subpopulation"
                  color="primary"
                  onClick={this.openConfirmDeleteModal}
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
        addInstance={this.addInstance}
        artifact={this.props.artifact}
        baseElements={this.props.baseElements}
        conversionFunctions={this.props.conversionFunctions}
        deleteInstance={this.deleteInstance}
        editInstance={this.editInstance}
        externalCqlList={this.props.externalCqlList}
        getAllInstances={this.getAllInstances}
        getAllInstancesInAllTrees={this.props.getAllInstancesInAllTrees}
        instance={this.props.subpopulation}
        instanceNames={this.props.instanceNames}
        isLoadingModifiers={this.props.isLoadingModifiers}
        loadExternalCqlList={this.props.loadExternalCqlList}
        modifierMap={this.props.modifierMap}
        modifiersByInputType={this.props.modifiersByInputType}
        parameters={this.props.parameters}
        root={true}
        scrollToElement={this.props.scrollToElement}
        subPopulationIndex={this.props.subpopulationIndex}
        templates={this.props.templates}
        treeName={this.props.treeName}
        updateInstanceModifiers={this.props.updateInstanceModifiers}
        validateReturnType={this.props.validateReturnType}
        vsacApiKey={this.props.vsacApiKey}
      />
      {this.renderConfirmDeleteModal()}
    </div>
  );
}

Subpopulation.propTypes = {
  addInstance: PropTypes.func.isRequired,
  artifact: PropTypes.object.isRequired,
  baseElements: PropTypes.array.isRequired,
  conversionFunctions: PropTypes.array,
  deleteInstance: PropTypes.func.isRequired,
  deleteSubpopulation: PropTypes.func.isRequired,
  editInstance: PropTypes.func.isRequired,
  externalCqlList: PropTypes.array.isRequired,
  getAllInstances: PropTypes.func.isRequired,
  getAllInstancesInAllTrees: PropTypes.func.isRequired,
  instanceNames: PropTypes.array.isRequired,
  isLoadingModifiers: PropTypes.bool,
  loadExternalCqlList: PropTypes.func.isRequired,
  modifierMap: PropTypes.object.isRequired,
  modifiersByInputType: PropTypes.object.isRequired,
  parameters: PropTypes.array.isRequired,
  scrollToElement: PropTypes.func,
  setSubpopulationName: PropTypes.func.isRequired,
  subpopulation: PropTypes.object.isRequired,
  subpopulationIndex: PropTypes.number.isRequired,
  templates: PropTypes.array.isRequired,
  treeName: PropTypes.string.isRequired,
  updateInstanceModifiers: PropTypes.func.isRequired,
  vsacApiKey: PropTypes.string
};
