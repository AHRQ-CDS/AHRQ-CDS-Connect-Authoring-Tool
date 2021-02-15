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
import { UncontrolledTooltip } from 'reactstrap';
import _ from 'lodash';

import { DeleteConfirmationModal } from 'components/modals';
import ConjunctionGroup from './ConjunctionGroup';
import ExpressionPhrase from './ExpressionPhrase';

import { hasGroupNestedWarning } from 'utils/warnings';
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
    const { artifact, name, subpopulation, updateSubpopulations } = this.props;
    const newSubpopulations = _.cloneDeep(artifact[name]);
    const subpopulationIndex = artifact[name].findIndex(sp => sp.uniqueId === subpopulation.uniqueId);
    newSubpopulations.splice(subpopulationIndex, 1);

    updateSubpopulations(newSubpopulations, name);
    this.closeConfirmDeleteModal();
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
    const { checkSubpopulationUsage, instanceNames, setSubpopulationName, subpopulation } = this.props;
    const { isExpanded } = this.state;
    const subpopulationUsed = checkSubpopulationUsage(subpopulation.uniqueId);
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
                    uniqueId={subpopulation.uniqueId}
                    updateInstance={(value) => {
                      setSubpopulationName(value.subpopulation_title, subpopulation.uniqueId);
                    }}
                    value={subpopulation.subpopulationName}
                  />

                  {duplicateNameIndex !== -1 &&
                    <div className='warning'>Warning: Name already in use. Choose another name.</div>
                  }
                </div>
              :
                <div className="card-element__heading">
                  <div className="heading-name">
                    {subpopulation.subpopulationName}:
                    {
                      (duplicateNameIndex !== -1 ||
                      this.subpopulationHasOneChildWarning() ||
                      this.hasNestedWarnings(subpopulation.childInstances)) &&
                      <div className="warning"><FontAwesomeIcon icon={faExclamationCircle} /> Has warnings</div>
                    }
                  </div>
                </div>
              }

              <div className="card-element__buttons">
                <IconButton
                  aria-label={`${isExpanded ? 'hide' : 'show'} ${subpopulation.subpopulationName}`}
                  color="primary"
                  onClick={isExpanded ? this.collapse : this.expand}
                >
                  {isExpanded ? <ExpandLessIcon fontSize="small" /> : <ExpandMoreIcon fontSize="small" />}
                </IconButton>

                <span id={`deletebutton-${subpopulation.uniqueId}`}>
                  <IconButton
                    aria-label="delete subpopulation"
                    color="primary"
                    disabled={subpopulationUsed}
                    onClick={this.openConfirmDeleteModal}
                  >
                    <CloseIcon fontSize="small" />
                  </IconButton>
                </span>

                {subpopulationUsed &&
                  <UncontrolledTooltip target={`deletebutton-${subpopulation.uniqueId}`} placement="left">
                    To delete this subpopulation, remove all references to it.
                  </UncontrolledTooltip>
                }
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

  renderContents = () => {
    const {
      artifact,
      baseElements,
      conversionFunctions,
      externalCqlList,
      getAllInstancesInAllTrees,
      instanceNames,
      isLoadingModifiers,
      loadExternalCqlList,
      modifierMap,
      modifiersByInputType,
      parameters,
      scrollToElement,
      subpopulation,
      subpopulationIndex,
      templates,
      treeName,
      updateInstanceModifiers,
      validateReturnType,
      vsacApiKey
    } = this.props;
    const { showConfirmDeleteModal } = this.state;
    const subpopulationName = subpopulation.subpopulationName;

    return (
      <div className="card-element__body">
        {this.subpopulationHasOneChildWarning() &&
          <div className='warning'>This subpopulation needs at least one element</div>
        }

        <ExpressionPhrase
          class="expression expression__group"
          instance={subpopulation}
          baseElements={baseElements}
        />

        <ConjunctionGroup
          addInstance={this.addInstance}
          artifact={artifact}
          baseElements={baseElements}
          conversionFunctions={conversionFunctions}
          deleteInstance={this.deleteInstance}
          editInstance={this.editInstance}
          externalCqlList={externalCqlList}
          getAllInstances={this.getAllInstances}
          getAllInstancesInAllTrees={getAllInstancesInAllTrees}
          instance={subpopulation}
          instanceNames={instanceNames}
          isLoadingModifiers={isLoadingModifiers}
          loadExternalCqlList={loadExternalCqlList}
          modifierMap={modifierMap}
          modifiersByInputType={modifiersByInputType}
          parameters={parameters}
          root={true}
          scrollToElement={scrollToElement}
          subPopulationIndex={subpopulationIndex}
          templates={templates}
          treeName={treeName}
          updateInstanceModifiers={updateInstanceModifiers}
          validateReturnType={validateReturnType}
          vsacApiKey={vsacApiKey}
        />

        {showConfirmDeleteModal &&
          <DeleteConfirmationModal
            deleteType="Subpopulation"
            handleCloseModal={this.closeConfirmDeleteModal}
            handleDelete={this.handleDeleteSubpopulation}
          >
            <div>Subpopulation: {subpopulationName ? subpopulationName :'unnamed'}</div>
          </DeleteConfirmationModal>
        }
      </div>
    );
  }
}

Subpopulation.propTypes = {
  addInstance: PropTypes.func.isRequired,
  artifact: PropTypes.object.isRequired,
  baseElements: PropTypes.array.isRequired,
  checkSubpopulationUsage: PropTypes.func.isRequired,
  conversionFunctions: PropTypes.array,
  deleteInstance: PropTypes.func.isRequired,
  editInstance: PropTypes.func.isRequired,
  externalCqlList: PropTypes.array.isRequired,
  getAllInstances: PropTypes.func.isRequired,
  getAllInstancesInAllTrees: PropTypes.func.isRequired,
  instanceNames: PropTypes.array.isRequired,
  isLoadingModifiers: PropTypes.bool,
  loadExternalCqlList: PropTypes.func.isRequired,
  modifierMap: PropTypes.object.isRequired,
  modifiersByInputType: PropTypes.object.isRequired,
  name: PropTypes.string.isRequired,
  parameters: PropTypes.array.isRequired,
  scrollToElement: PropTypes.func,
  setSubpopulationName: PropTypes.func.isRequired,
  subpopulation: PropTypes.object.isRequired,
  subpopulationIndex: PropTypes.number.isRequired,
  templates: PropTypes.array.isRequired,
  treeName: PropTypes.string.isRequired,
  updateInstanceModifiers: PropTypes.func.isRequired,
  updateSubpopulations: PropTypes.func.isRequired,
  vsacApiKey: PropTypes.string
};
