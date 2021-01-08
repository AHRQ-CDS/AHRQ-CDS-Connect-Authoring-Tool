import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { IconButton } from '@material-ui/core';
import {
  ChatBubble as ChatBubbleIcon,
  Close as CloseIcon,
  ExpandLess as ExpandLessIcon,
  ExpandMore as ExpandMoreIcon,
  FormatIndentDecrease as FormatIndentDecreaseIcon,
  FormatIndentIncrease as FormatIndentIncreaseIcon,
  Sms as SmsIcon
} from '@material-ui/icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExclamationCircle } from '@fortawesome/free-solid-svg-icons';
import { UncontrolledTooltip } from 'reactstrap';
import clsx from 'clsx';

import { Dropdown, Modal } from 'components/elements';
import TemplateInstance from './TemplateInstance';
import ElementSelect from './ElementSelect';
import StringField from './fields/StringField';
import TextAreaField from './fields/TextAreaField';
import ExpressionPhrase from './modifiers/ExpressionPhrase';

import createTemplateInstance from '../../utils/templates';
import { hasGroupNestedWarning } from '../../utils/warnings';
import requiredIf from '../../utils/prop_types';
import { getFieldWithId } from '../../utils/instances';

export default class ConjunctionGroup extends Component {
  constructor(props) {
    super(props);

    const operationTemplates = this.props.templates.find(cat => cat.name === 'Operations').entries;
    this.types = operationTemplates.filter(template => template.conjunction);
    const listOperationTemplates = this.props.templates.find(cat => cat.name === 'List Operations') || [];
    this.listOperations = listOperationTemplates.entries;
    this.allTypes = this.props.templates.reduce((prev, curr) => [...prev, ...curr.entries], []);

    this.state = {
      showGroup: true,
      showComment: false,
      showConfirmDeleteModal: false
    };
  }

  handleTypeChange = (event, selectOptions) => {
    const type = selectOptions.find(option => option.name === event.target.value);
    this.props.editInstance(this.props.treeName, type, this.getPath(), true);
  }

  handleNameChange = (state) => {
    this.props.editInstance(this.props.treeName, state, this.getPath(), false);
  }

  handleCommentChange = (state) => {
    this.props.editInstance(this.props.treeName, state, this.getPath(), false);
  }

  addChild = (template) => {
    const instance = createTemplateInstance(template);
    this.props.addInstance(this.props.treeName, instance, this.getPath());
  }

  // if root component, returns root artifact path, otherwise calls child's getPath function with artifact id
  getPath() {
    if (this.props.root) {
      return this.props.instance.path;
    }
    return this.props.getPath(this.props.instance.uniqueId);
  }

  getChildsPath = (id) => {
    const artifactTree = this.props.instance;
    const childIndex = artifactTree.childInstances.findIndex(instance => instance.uniqueId === id);
    return `${this.getPath()}.childInstances.${childIndex}`;
  }

  // returns class name for odd conjunction groups determined from length of child instances
  getNestingClassName = () => {
    const level = this.getPath().split('.').filter(pathSection => pathSection === 'childInstances').length;
    if (level === 0) {
      return 'card-group__top';
    } else if (level % 2 === 0) {
      return 'card-group__even';
    }

    return 'card-group__odd';
  }

  // ----------------------- CLICK HANDLERS -------------------------------- //

  indentClickHandler = (instance) => {
    const { treeName, artifact, templates, disableAddElement } = this.props;
    if (disableAddElement) {
      return;
    }
    const operationTemplates = templates.find(template => template.name === 'Operations').entries;
    const conjunctionTemplates = operationTemplates.filter(template => template.conjunction);

    // Decide what type of conjunction group to create when indenting
    let conjunctionType;
    if (artifact[treeName].id === 'Or') {
      conjunctionType = conjunctionTemplates.find(template => template.id === 'And');
    } else { // Default is adding an OR
      conjunctionType = conjunctionTemplates.find(template => template.id === 'Or');
    }

    if (instance.conjunction) {
      // Indenting a conjunction group (and it's children)
      const newInstance = createTemplateInstance(conjunctionType, [instance]);
      const parentPath = this.getPath().split('.').slice(0, -2).join('.'); // Path of parent of conjunction group
      const index = Number(this.getPath().split('.').pop()); // Index of to indent group at
      const toAdd = [{ instance: newInstance, path: parentPath, index }];

      this.props.deleteInstance(treeName, this.getPath(), toAdd);
    } else {
      // Indent a single templateInstance
      const newInstance = createTemplateInstance(conjunctionType, [instance]);
      const index = Number(this.getChildsPath(instance.uniqueId).split('.').pop()); // Index to add new conjunction at
      const toAdd = [{ instance: newInstance, path: this.getPath(), index }];

      this.props.deleteInstance(treeName, this.getChildsPath(instance.uniqueId), toAdd);
    }
  }

  outdentClickHandler = (instance) => {
    const { disableAddElement } = this.props;
    if (disableAddElement) {
      return;
    }
    if (instance.conjunction) {
      // Outdenting a conjunction group. Removes the conjunction, readds each child to the conjunction's parent
      const toAdd = [];
      instance.childInstances.forEach((child, i) => {
        // Path of the parent where items get added
        const parentPath = this.getPath().split('.').slice(0, -2).join('.');
        let index = this.getPath().split('.').pop(); // Index of the conjunction group
        index = Number(index) + i; // Index to add the conjunction's children at
        return toAdd.push({ instance: child, path: parentPath, index });
      });

      this.props.deleteInstance(this.props.treeName, this.getPath(), toAdd);
    } else {
      // Outdenting a single templateInstance
      // Path of the parent of the group instance is coming from. This is where it will be readded
      const parentPath = this.getPath().split('.').slice(0, -2).join('.');
      let index = this.getPath().split('.').pop(); // Index of the parent
      index = Number(index) + 1; // Readd the child that is being outdented right below the parent it came from
      const toAdd = [{ instance, path: parentPath, index }];
      this.props.deleteInstance(this.props.treeName, this.getChildsPath(instance.uniqueId), toAdd);
    }
  }

  deleteInstance = () => {
    this.props.deleteInstance(this.props.treeName, this.getPath());
  }

  openConfirmDeleteModal = () => {
    if (!this.props.disableAddElement) {
      this.setState({ showConfirmDeleteModal: true });
    }
  }

  closeConfirmDeleteModal = () => {
    this.setState({ showConfirmDeleteModal: false });
  }

  handleDeleteInstance = () => {
    this.deleteInstance();
    this.closeConfirmDeleteModal();
  }

  renderConfirmDeleteModal() {
    const elementName = getFieldWithId(this.props.instance.fields, 'element_name').value;

    return (
      <Modal
        title="Delete Group Confirmation"
        submitButtonText="Delete"
        handleShowModal={this.state.showConfirmDeleteModal}
        handleCloseModal={this.closeConfirmDeleteModal}
        handleSaveModal={this.handleDeleteInstance}
      >
        <div className="delete-group-confirmation-modal modal__content">
          <h5>
            {`Are you sure you want to permanently delete ${elementName ? 'the following' : 'this unnamed'} group?`}
          </h5>

          {elementName && <div className="group-info">
            <span>Group: </span>
            <span>{elementName}</span>
          </div>}
        </div>
      </Modal>
    );
  }

  conjunctionHasDuplicateName = (child) => {
    const elementNameField = getFieldWithId(child.fields, 'element_name');
    const nameValue = elementNameField.value === undefined ? '' : elementNameField.value;
    const duplicateNameIndex = this.props.instanceNames.findIndex(name =>
      name.id !== child.uniqueId && name.name === nameValue);
    return duplicateNameIndex !== -1;
  }

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

  showHideGroupBody = () => {
    this.setState({ showGroup: !this.state.showGroup });
  }

  toggleComment = () => {
    this.setState({ showComment: !this.state.showComment });
  }

  // ----------------------- RENDERS --------------------------------------- //

  renderDisabledTooltip = id => (
    <UncontrolledTooltip
      target={id} placement="left">
      To edit or delete this element, remove all references to the Base Element List.
    </UncontrolledTooltip>
  );

  renderConjunctionSelect = () => {
    const { options, instance } = this.props;
    const selectOptions = options === 'listOperations' ? this.listOperations : this.types;

    return (
      <div className="card-group__conjunction-select">
        <Dropdown
          id="conjunction-select"
          label={instance.name ? null : "Select one"}
          onChange={event => this.handleTypeChange(event, selectOptions)}
          options={selectOptions}
          value={instance.name}
          valueKey="id"
          labelKey="name"
        />
      </div>
    );
  };

  renderIndentButtons = instance => (
    // Indenting is always possible, outdent only possible when not at root already
    <span className="indent-outdent-container">
      {this.getPath() !== '' &&
        <span id={`outdentbutton-${instance.uniqueId}`}>
          <IconButton
            aria-label="outdent"
            color="primary"
            disabled={this.props.disableAddElement}
            onClick={() => this.outdentClickHandler(instance)}
          >
            <FormatIndentDecreaseIcon fontSize="small" />
          </IconButton>

          {this.props.disableAddElement && this.renderDisabledTooltip(`outdentbutton-${instance.uniqueId}`)}
        </span>
      }

      <span id={`indentbutton-${instance.uniqueId}`}>
        <IconButton
          aria-label="indent"
          color="primary"
          disabled={this.props.disableAddElement}
          onClick={() => this.indentClickHandler(instance)}
        >
          <FormatIndentIncreaseIcon fontSize="small" />
        </IconButton>

        {this.props.disableAddElement && this.renderDisabledTooltip(`indentbutton-${instance.uniqueId}`)}
      </span>
    </span>
  )

  renderRoot() {
    const { showGroup, showComment } = this.state;
    const collapsedClass = showGroup ? '' : 'expression-collapsed';
    const elementNameField = getFieldWithId(this.props.instance.fields, 'element_name');
    const elementCommentField = getFieldWithId(this.props.instance.fields,'comment');
    const conjunctionHasDuplicateName = this.conjunctionHasDuplicateName(this.props.instance);
    const showHasWarnings = conjunctionHasDuplicateName || this.hasNestedWarnings(this.props.instance.childInstances);
    const hasComment = elementCommentField && elementCommentField.value && elementCommentField.value !== '';

    if (!this.props.root) {
      const { disableAddElement } = this.props;

      return (
        <div className="card-group__top">
          <div className="card-group__header">
            <div className="card-group__title">
              {showGroup ?
                <>
                  <StringField
                    id={elementNameField.id}
                    name={elementNameField.name}
                    value={elementNameField.value}
                    updateInstance={this.handleNameChange}
                  />

                  {showComment &&
                    <TextAreaField
                      id={elementCommentField.id}
                      name={elementCommentField.name}
                      value={elementCommentField.value}
                      updateInstance={this.handleCommentChange}
                    />
                  }
                </>
              :
                <div className="group-heading-name">
                  {elementNameField.value}:
                  {showHasWarnings &&
                    <div className="warning"><FontAwesomeIcon icon={faExclamationCircle} /> Has warnings</div>
                  }
                </div>
              }
            </div>

            <div className="card-group__buttons">
              {showGroup && this.renderIndentButtons(this.props.instance)}

              {showGroup &&
                <IconButton
                  aria-label="show comment"
                  className={clsx(hasComment && 'has-comment')}
                  color="primary"
                  onClick={this.toggleComment}
                >
                  {hasComment ? <SmsIcon fontSize="small" /> : <ChatBubbleIcon fontSize="small" />}
                </IconButton>
              }

              <IconButton
                aria-label={`hide ${elementNameField.name}`}
                color="primary"
                onClick={this.showHideGroupBody}
              >
                {showGroup ? <ExpandLessIcon fontSize="small" /> : <ExpandMoreIcon fontSize="small" />}
              </IconButton>

              <span id={`deletebutton-${this.props.instance.uniqueId}`}>
                <IconButton
                  aria-label={`remove ${this.props.instance.name}`}
                  color="primary"
                  disabled={disableAddElement}
                  onClick={this.openConfirmDeleteModal}
                >
                  <CloseIcon fontSize="small" />
                </IconButton>
              </span>

              {disableAddElement && this.renderDisabledTooltip(`deletebutton-${this.props.instance.uniqueId}`)}
            </div>
          </div>

          <div className="card-group__warnings">
            {conjunctionHasDuplicateName && showGroup &&
              <div className="warning">Warning: Name already in use. Choose another name.</div>
            }
          </div>

          <ExpressionPhrase
            class={`expression expression__group ${collapsedClass}`}
            instance={this.props.instance}
            baseElements={this.props.baseElements}
          />
        </div>
      );
    }

    return null;
  }

  renderChildren() {
    const {
      artifact, treeName, templates, addInstance, editInstance, deleteInstance
    } = this.props;

    return this.props.instance.childInstances.map((instance, i) => {
      // return null if child instance conjunction is false
      if (instance.conjunction) {
        return (
          <div key={instance.uniqueId} className="card-group">
            <ConjunctionGroup
              root={false}
              treeName={treeName}
              artifact={artifact}
              templates={templates}
              instance={instance}
              addInstance={addInstance}
              editInstance={editInstance}
              deleteInstance={deleteInstance}
              getAllInstances={this.props.getAllInstances}
              getAllInstancesInAllTrees={this.props.getAllInstancesInAllTrees}
              updateInstanceModifiers={this.props.updateInstanceModifiers}
              parameters={this.props.parameters}
              baseElements={this.props.baseElements}
              externalCqlList={this.props.externalCqlList}
              loadExternalCqlList={this.props.loadExternalCqlList}
              getPath={this.getChildsPath}
              modifierMap={this.props.modifierMap}
              modifiersByInputType={this.props.modifiersByInputType}
              isLoadingModifiers={this.props.isLoadingModifiers}
              conversionFunctions={this.props.conversionFunctions}
              instanceNames={this.props.instanceNames}
              subPopulationIndex={this.props.subPopulationIndex}
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
              disableAddElement={this.props.disableAddElement}
              elementUniqueId={this.props.elementUniqueId}
              vsacIsAuthenticating={this.props.vsacIsAuthenticating}
            />

            {this.renderConjunctionSelect(i)}
          </div>
        );
      }

      return this.renderTemplate(instance);
    });
  }

  renderTemplate(instance) {
    const allInstancesInAllTrees = this.props.getAllInstancesInAllTrees();

    return (
      <div key={instance.uniqueId} className="card-group-section" id={instance.uniqueId}>
        <TemplateInstance
          allInstancesInAllTrees={allInstancesInAllTrees}
          baseElements={this.props.baseElements}
          codeData={this.props.codeData}
          conversionFunctions={this.props.conversionFunctions}
          deleteInstance={this.props.deleteInstance}
          disableAddElement={this.props.disableAddElement}
          disableIndent={this.props.disableIndent}
          editInstance={this.props.editInstance}
          getPath={this.getChildsPath}
          getVSDetails={this.props.getVSDetails}
          instanceNames={this.props.instanceNames}
          isLoadingModifiers={this.props.isLoadingModifiers}
          isRetrievingDetails={this.props.isRetrievingDetails}
          isSearchingVSAC={this.props.isSearchingVSAC}
          isValidatingCode={this.props.isValidatingCode}
          isValidCode={this.props.isValidCode}
          loginVSACUser={this.props.loginVSACUser}
          modifierMap={this.props.modifierMap}
          modifiersByInputType={this.props.modifiersByInputType}
          otherInstances={this.props.getAllInstances(this.props.treeName)}
          parameters={this.props.parameters}
          renderIndentButtons={this.renderIndentButtons}
          resetCodeValidation={this.props.resetCodeValidation}
          scrollToElement={this.props.scrollToElement}
          searchVSACByKeyword={this.props.searchVSACByKeyword}
          setVSACAuthStatus={this.props.setVSACAuthStatus}
          subpopulationIndex={this.props.subPopulationIndex}
          templateInstance={instance}
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

        {this.renderConjunctionSelect(instance)}
      </div>
    );
  }

  render() {
    const { showGroup } = this.state;
    const classname = `card-group ${this.getNestingClassName()}`;

    return (
      <div className={classname}>
        {this.renderRoot()}
        {showGroup && this.renderChildren()}

        {showGroup &&
          <div className="card-element">
            <ElementSelect
              artifactId={this.props.artifact._id}
              categories={this.props.templates}
              onSuggestionSelected={this.addChild}
              parameters={this.props.parameters}
              baseElements={this.props.baseElements}
              externalCqlList={this.props.externalCqlList}
              loadExternalCqlList={this.props.loadExternalCqlList}
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
              isValidatingCode={this.props.isValidatingCode}
              isValidCode={this.props.isValidCode}
              codeData={this.props.codeData}
              validateCode={this.props.validateCode}
              resetCodeValidation={this.props.resetCodeValidation}
              inBaseElements={false}
              disableAddElement={this.props.disableAddElement}
              elementUniqueId={this.props.elementUniqueId}
            />
          </div>
        }
        {this.renderConfirmDeleteModal()}
      </div>
    );
  }
}

ConjunctionGroup.propTypes = {
  artifact: PropTypes.object,
  codeData: PropTypes.object,
  conversionFunctions: PropTypes.array,
  deleteInstance: PropTypes.func.isRequired,
  disableAddElement: PropTypes.bool,
  disableIndent: PropTypes.bool,
  elementUniqueId: PropTypes.string,
  externalCqlList: PropTypes.array.isRequired,
  getAllInstances: PropTypes.func.isRequired,
  getAllInstancesInAllTrees: PropTypes.func.isRequired,
  getPath: requiredIf(PropTypes.func, props => !props.root), // path needed for children
  getVSDetails: PropTypes.func.isRequired,
  instanceNames: PropTypes.array.isRequired,
  isLoadingModifiers: PropTypes.bool,
  isRetrievingDetails: PropTypes.bool.isRequired,
  isSearchingVSAC: PropTypes.bool.isRequired,
  isValidatingCode: PropTypes.bool.isRequired,
  isValidCode: PropTypes.bool,
  loadExternalCqlList: PropTypes.func.isRequired,
  loginVSACUser: PropTypes.func.isRequired,
  modifierMap: PropTypes.object.isRequired,
  modifiersByInputType: PropTypes.object.isRequired,
  options: PropTypes.string,
  resetCodeValidation: PropTypes.func.isRequired,
  root: PropTypes.bool.isRequired,
  scrollToElement: PropTypes.func.isRequired,
  searchVSACByKeyword: PropTypes.func.isRequired,
  setVSACAuthStatus: PropTypes.func.isRequired,
  templates: PropTypes.array,
  treeName: PropTypes.string.isRequired,
  validateCode: PropTypes.func.isRequired,
  validateReturnType: PropTypes.bool,
  vsacApiKey: PropTypes.string,
  vsacDetailsCodes: PropTypes.array.isRequired,
  vsacDetailsCodesError: PropTypes.string.isRequired,
  vsacIsAuthenticating: PropTypes.bool.isRequired,
  vsacSearchCount: PropTypes.number.isRequired,
  vsacSearchResults: PropTypes.array.isRequired,
  vsacStatus: PropTypes.string,
  vsacStatusText: PropTypes.string
};
