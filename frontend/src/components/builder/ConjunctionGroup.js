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

import { Dropdown } from 'components/elements';
import { DeleteConfirmationModal } from 'components/modals';
import TemplateInstance from './TemplateInstance';
import ElementSelect from './ElementSelect';
import { StringField, TextAreaField } from 'components/builder/fields';
import ExpressionPhrase from './ExpressionPhrase';

import createTemplateInstance from 'utils/templates';
import { hasGroupNestedWarning } from 'utils/warnings';
import requiredIf from 'utils/prop_types';
import { getFieldWithId } from 'utils/instances';

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
                <div className="card-field-group">
                  <div className="card-field">
                    <div className="card-label">Group:</div>

                    <div className="card-input">
                      <StringField field={elementNameField} handleUpdateField={this.handleNameChange} />
                    </div>
                  </div>

                  {showComment &&
                    <div className="card-field">
                      <div className="card-label">Comment:</div>

                      <div className="card-input">
                        <TextAreaField field={elementCommentField} handleUpdateField={this.handleCommentChange} />
                      </div>
                    </div>
                  }
                </div>
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
              addInstance={addInstance}
              artifact={artifact}
              baseElements={this.props.baseElements}
              conversionFunctions={this.props.conversionFunctions}
              deleteInstance={deleteInstance}
              disableAddElement={this.props.disableAddElement}
              editInstance={editInstance}
              elementUniqueId={this.props.elementUniqueId}
              externalCqlList={this.props.externalCqlList}
              getAllInstances={this.props.getAllInstances}
              getAllInstancesInAllTrees={this.props.getAllInstancesInAllTrees}
              getPath={this.getChildsPath}
              instance={instance}
              instanceNames={this.props.instanceNames}
              isLoadingModifiers={this.props.isLoadingModifiers}
              loadExternalCqlList={this.props.loadExternalCqlList}
              modifierMap={this.props.modifierMap}
              modifiersByInputType={this.props.modifiersByInputType}
              parameters={this.props.parameters}
              root={false}
              scrollToElement={this.props.scrollToElement}
              subPopulationIndex={this.props.subPopulationIndex}
              templates={templates}
              treeName={treeName}
              updateInstanceModifiers={this.props.updateInstanceModifiers}
              validateReturnType={this.props.validateReturnType}
              vsacApiKey={this.props.vsacApiKey}
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
          conversionFunctions={this.props.conversionFunctions}
          deleteInstance={this.props.deleteInstance}
          disableAddElement={this.props.disableAddElement}
          disableIndent={this.props.disableIndent}
          editInstance={this.props.editInstance}
          getPath={this.getChildsPath}
          instanceNames={this.props.instanceNames}
          isLoadingModifiers={this.props.isLoadingModifiers}
          modifierMap={this.props.modifierMap}
          modifiersByInputType={this.props.modifiersByInputType}
          otherInstances={this.props.getAllInstances(this.props.treeName)}
          parameters={this.props.parameters}
          renderIndentButtons={this.renderIndentButtons}
          scrollToElement={this.props.scrollToElement}
          subpopulationIndex={this.props.subPopulationIndex}
          templateInstance={instance}
          treeName={this.props.treeName}
          updateInstanceModifiers={this.props.updateInstanceModifiers}
          validateReturnType={this.props.validateReturnType}
          vsacApiKey={this.props.vsacApiKey}
        />

        {this.renderConjunctionSelect(instance)}
      </div>
    );
  }

  render() {
    const {
      artifact,
      baseElements,
      disableAddElement,
      elementUniqueId,
      externalCqlList,
      loadExternalCqlList,
      instance,
      parameters,
      templates,
      vsacApiKey
    } = this.props;
    const { showConfirmDeleteModal, showGroup } = this.state;
    const classname = `card-group ${this.getNestingClassName()}`;
    const elementName = getFieldWithId(instance.fields, 'element_name').value;

    return (
      <div className={classname}>
        {this.renderRoot()}
        {showGroup && this.renderChildren()}

        {showGroup &&
          <div className="card-element">
            <ElementSelect
              artifactId={artifact._id}
              baseElements={baseElements}
              categories={templates}
              disableAddElement={disableAddElement}
              elementUniqueId={elementUniqueId}
              externalCqlList={externalCqlList}
              fhirVersion={artifact.fhirVersion}
              inBaseElements={false}
              loadExternalCqlList={loadExternalCqlList}
              onSuggestionSelected={this.addChild}
              parameters={parameters}
              vsacApiKey={vsacApiKey}
            />
          </div>
        }

        {showConfirmDeleteModal &&
          <DeleteConfirmationModal
            deleteType="Group"
            handleCloseModal={this.closeConfirmDeleteModal}
            handleDelete={this.handleDeleteInstance}
          >
            <div>Group: {elementName ? elementName :'unnamed'}</div>
          </DeleteConfirmationModal>
        }
      </div>
    );
  }
}

ConjunctionGroup.propTypes = {
  addInstance: PropTypes.func.isRequired,
  artifact: PropTypes.object,
  baseElements: PropTypes.array.isRequired,
  conversionFunctions: PropTypes.array,
  deleteInstance: PropTypes.func.isRequired,
  disableAddElement: PropTypes.bool,
  disableIndent: PropTypes.bool,
  editInstance: PropTypes.func.isRequired,
  elementUniqueId: PropTypes.string,
  externalCqlList: PropTypes.array.isRequired,
  getAllInstances: PropTypes.func.isRequired,
  getAllInstancesInAllTrees: PropTypes.func.isRequired,
  getPath: requiredIf(PropTypes.func, props => !props.root), // path needed for children
  instance: PropTypes.object.isRequired,
  instanceNames: PropTypes.array.isRequired,
  isLoadingModifiers: PropTypes.bool,
  loadExternalCqlList: PropTypes.func.isRequired,
  modifierMap: PropTypes.object.isRequired,
  modifiersByInputType: PropTypes.object.isRequired,
  options: PropTypes.string,
  parameters: PropTypes.array,
  root: PropTypes.bool.isRequired,
  scrollToElement: PropTypes.func.isRequired,
  subPopulationIndex: PropTypes.number,
  templates: PropTypes.array,
  treeName: PropTypes.string.isRequired,
  updateInstanceModifiers: PropTypes.func.isRequired,
  validateReturnType: PropTypes.bool,
  vsacApiKey: PropTypes.string
};
