import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { IconButton } from '@material-ui/core';
import {
  ChatBubble as ChatBubbleIcon,
  Close as CloseIcon,
  ExpandLess as ExpandLessIcon,
  ExpandMore as ExpandMoreIcon,
  Sms as SmsIcon
} from '@material-ui/icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExclamationCircle } from '@fortawesome/free-solid-svg-icons';
import { UncontrolledTooltip } from 'reactstrap';
import clsx from 'clsx';
import _ from 'lodash';

import StringField from './fields/StringField';
import TextAreaField from './fields/TextAreaField';
import Editor from './editors/Editor';

import { Dropdown, Modal } from 'components/elements';
import { doesParameterNeedUsageWarning, parameterHasDuplicateName } from 'utils/warnings';

export default class Parameter extends Component {
  constructor(props) {
    super(props);

    this.state = {
      showParameter: true,
      showComment: false,
      showConfirmDeleteModal: false
    };
  }

  componentDidMount = () => {
    const { id, type, name, value, comment } = this.props;
    if (_.isUndefined(id)) {
      this.updateParameter({
        name,
        uniqueId: _.uniqueId('parameter-'),
        type,
        comment,
        value
      });
    }
  }

  toggleComment = () => {
    this.setState({ showComment: !this.state.showComment });
  }

  showHideParameterBody = () => {
    this.setState({ showParameter: !this.state.showParameter });
  }

  updateParameter = (object) => {
    this.props.updateInstanceOfParameter(object, this.props.index);
  }

  deleteParameter = () => {
    this.props.deleteParameter(this.props.index);
  }

  openConfirmDeleteModal = () => {
    const parameterUsed = this.props.usedBy ? this.props.usedBy.length !== 0 : false;
    if (!parameterUsed) {
      this.setState({ showConfirmDeleteModal: true });
    }
  }

  closeConfirmDeleteModal = () => {
    this.setState({ showConfirmDeleteModal: false });
  }

  handleDeleteParameter = () => {
    this.deleteParameter();
    this.closeConfirmDeleteModal();
  }

  renderConfirmDeleteModal() {
    return (
      <Modal
        title="Delete Parameter Confirmation"
        submitButtonText="Delete"
        handleShowModal={this.state.showConfirmDeleteModal}
        handleCloseModal={this.closeConfirmDeleteModal}
        handleSaveModal={this.handleDeleteParameter}
      >
        <div className="delete-parameter-confirmation-modal modal__content">
          <h5>
            {`Are you sure you want to permanently delete
            ${this.props.name ? 'the following' : 'this unnamed'} parameter?`}
          </h5>

          {this.props.name && <div className="parameter-info">
            <span>Parameter: </span>
            <span>{this.props.name}</span>
          </div>}
        </div>
      </Modal>
    );
  }

  changeParameterType = (event, name, comment, typeOptions) => {
    const type = typeOptions.find(option => option.value === event.target.value);
    if (type) {
      this.updateParameter({ name, uniqueId: this.props.id, type: type.value, comment, value: null });
    }
  }

  startsWithVowel = (toCheck) => {
    const vowelRegex = '^[aieouAEIOU].*';
    return toCheck.match(vowelRegex);
  }

  renderParameter() {
    const editorProps = {
      id: `param-name-${this.props.index}`,
      name: this.props.name,
      type: this.props.type != null ? this.props.type : null,
      label: 'Default Value:',
      value: this.props.value,
      updateInstance: e => this.updateParameter({
        name: this.props.name,
        uniqueId: this.props.id,
        type: this.props.type,
        comment: this.props.comment,
        value: (e != null ? e.value : null)
      }),
      vsacApiKey: this.props.vsacApiKey,
      loginVSACUser: this.props.loginVSACUser,
      setVSACAuthStatus: this.props.setVSACAuthStatus,
      vsacStatus: this.props.vsacStatus,
      vsacStatusText: this.props.vsacStatusText,
      isValidatingCode: this.props.isValidatingCode,
      isValidCode: this.props.isValidCode,
      codeData: this.props.codeData,
      validateCode: this.props.validateCode,
      resetCodeValidation: this.props.resetCodeValidation,
      vsacIsAuthenticating: this.props.vsacIsAuthenticating
    };

    return <Editor {...editorProps} />;
  }

  renderCollapsed(id, index, name, type, parameterUsed, disabledClass, parameterNeedsWarning) {
    let value = this.props.value || "";

    //integers and objects (datetime, codes, etc) are handled differently
    switch (typeof value){
      case 'number':
        value = value.toString();
        break;
      case 'object':
        value = value.str;
        break;
      default:
        break;
    }

    return (
      <div className="card-element">
        <div className="card-element__header collapsed">
          <div className="card-element__header-top">
            <div className="card-group__title card-element__heading">
              <div className="heading-name">
                {name}: {parameterNeedsWarning &&
                  <div className="warning"><FontAwesomeIcon icon={faExclamationCircle} /> Has warnings</div>
                }
              </div>
            </div>

            {this.renderElementButtons(parameterUsed, disabledClass)}
          </div>

          <div className="expression expression__group expression-collapsed">
            <div className="expression-logic">
              {this.startsWithVowel(type) ? "An " : "A "}
              <span className="expression-item expression-tag" aria-label="Type">
                {type}
              </span>
                parameter {value ? " that defaults to " : " with no default value."}
              {value &&
                <span className='expression-item expression-tag' aria-label='Default Value' >
                  {value}
                </span>
              }
            </div>
          </div>
        </div>
      </div>
    );
  }

  renderElementButtons = (parameterUsed, disabledClass) => {
    const { name, id, comment } = this.props;
    const { showParameter } = this.state;
    const hasComment = comment && comment !== '';

    return (
      <div className="card-element__buttons">
        {showParameter &&
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
          aria-label={`hide-${name}`}
          color="primary"
          onClick={this.showHideParameterBody}
        >
          {showParameter ? <ExpandLessIcon fontSize="small" /> : <ExpandMoreIcon fontSize="small" />}
        </IconButton>

        <span id={`deletebutton-${id}`}>
          <IconButton
            aria-label="delete parameter"
            color="primary"
            disabled={parameterUsed}
            onClick={this.openConfirmDeleteModal}
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        </span>

        {parameterUsed &&
          <UncontrolledTooltip target={`deletebutton-${id}`} placement="left">
            To delete this parameter, remove all references to it.
          </UncontrolledTooltip>
        }
      </div>
    );
  }

  render() {
    const {
      index, name, id, type, value, comment, usedBy, instanceNames
    } = this.props;

    const { showParameter, showComment } = this.state;
    const parameterUsed = this.props.usedBy ? this.props.usedBy.length !== 0 : false;
    const disabledClass = parameterUsed ? 'disabled' : '';

    const typeOptions = [
      { value: 'boolean', label: 'Boolean' },
      { value: 'system_code', label: 'Code' },
      { value: 'system_concept', label: 'Concept' },
      { value: 'integer', label: 'Integer' },
      { value: 'datetime', label: 'DateTime' },
      { value: 'decimal', label: 'Decimal' },
      { value: 'system_quantity', label: 'Quantity' },
      { value: 'string', label: 'String' },
      { value: 'time', label: 'Time' },
      { value: 'interval_of_integer', label: 'Interval<Integer>' },
      { value: 'interval_of_datetime', label: 'Interval<DateTime>' },
      { value: 'interval_of_decimal', label: 'Interval<Decimal>' },
      { value: 'interval_of_quantity', label: 'Interval<Quantity>' }
    ];

    const doesHaveDuplicateName = parameterHasDuplicateName(
      name,
      id,
      usedBy,
      instanceNames,
      this.props.getAllInstancesInAllTrees()
    );

    const doesHaveParameterUsageWarning = doesParameterNeedUsageWarning(
      name,
      usedBy,
      comment,
      this.props.getAllInstancesInAllTrees()
    );

    const parameterNeedsWarning
      = doesHaveDuplicateName || doesHaveParameterUsageWarning;
    const typeLabel  = typeOptions.find(typeOption => typeOption.value === type).label;

    return (
      <div className="parameter card-group card-group__top" id={id}>
        {showParameter ?
          <div className="card-element">
            <div className="card-element__header">
              <div className="card-element__header-top">
                <div className="card-group__title">
                  <StringField
                    id={`param-name-${index}`}
                    name={'Parameter Name'}
                    value={name}
                    disabled={parameterUsed}
                    updateInstance={e => (this.updateParameter({
                      name: e[`param-name-${index}`],
                      uniqueId: id,
                      type,
                      comment,
                      value
                    }))}
                  />

                  {showComment &&
                    <TextAreaField
                      id={id}
                      name="Comment"
                      value={comment}
                      updateInstance={e => this.updateParameter({ name, uniqueId: id, type, comment: e[id], value })}
                    />
                  }
                </div>

                {this.renderElementButtons(parameterUsed, disabledClass)}
              </div>

              <div className="card-group__warnings">
                {doesHaveDuplicateName && !doesHaveParameterUsageWarning &&
                  <div className="warning">Warning: Name already in use. Choose another name.</div>
                }

                {parameterUsed &&
                  <div className="notification">
                    <FontAwesomeIcon icon={faExclamationCircle} />
                    Parameter name and type can't be changed while it is being referenced.
                  </div>
                }

                {doesHaveParameterUsageWarning &&
                  <div className="warning">
                    Warning: One or more uses of this Parameter have changed. Choose another name.
                  </div>
                }
              </div>
            </div>

            <div className="card-element__body">
              <div className="field">
                <div className="field-label">Parameter Type:</div>

                <Dropdown
                  className="field-input field-input-lg"
                  disabled={parameterUsed}
                  id={`parameter-${index}`}
                  label={type ? null : 'Parameter type'}
                  onChange={event => this.changeParameterType(event, name, comment, typeOptions)}
                  options={typeOptions}
                  value={type}
                />
              </div>

              {this.renderParameter()}
            </div>
          </div>
        : this.renderCollapsed(id, index, name, typeLabel, parameterUsed, disabledClass, parameterNeedsWarning)}
        {this.renderConfirmDeleteModal()}
      </div>
    );
  }
}

Parameter.propTypes = {
  index: PropTypes.number.isRequired,
  name: PropTypes.string,
  type: PropTypes.string,
  id: PropTypes.string,
  usedBy: PropTypes.array,
  updateInstanceOfParameter: PropTypes.func.isRequired,
  deleteParameter: PropTypes.func.isRequired,
  instanceNames: PropTypes.array.isRequired,
  vsacApiKey: PropTypes.string,
  setVSACAuthStatus: PropTypes.func.isRequired,
  vsacStatus: PropTypes.string,
  vsacStatusText: PropTypes.string,
  isValidatingCode: PropTypes.bool.isRequired,
  isValidCode: PropTypes.bool,
  codeData: PropTypes.object,
  validateCode: PropTypes.func.isRequired,
  resetCodeValidation: PropTypes.func.isRequired,
  getAllInstancesInAllTrees: PropTypes.func.isRequired,
  vsacIsAuthenticating: PropTypes.bool.isRequired
};
