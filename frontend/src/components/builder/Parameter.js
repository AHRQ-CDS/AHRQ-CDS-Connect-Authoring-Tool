import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Select from 'react-select';
import FontAwesome from 'react-fontawesome';
import { UncontrolledTooltip } from 'reactstrap';
import _ from 'lodash';

import StringField from './fields/StringField';
import TextAreaField from './fields/TextAreaField';
import BooleanEditor from './parameters/BooleanEditor';
import CodeEditor from './parameters/CodeEditor';
import IntegerEditor from './parameters/IntegerEditor';
import DateTimeEditor from './parameters/DateTimeEditor';
import DecimalEditor from './parameters/DecimalEditor';
import QuantityEditor from './parameters/QuantityEditor';
import StringEditor from './parameters/StringEditor';
import TimeEditor from './parameters/TimeEditor';
import IntervalOfIntegerEditor from './parameters/IntervalOfIntegerEditor';
import IntervalOfDateTimeEditor from './parameters/IntervalOfDateTimeEditor';
import IntervalOfDecimalEditor from './parameters/IntervalOfDecimalEditor';
import IntervalOfQuantityEditor from './parameters/IntervalOfQuantityEditor';

import {
  doesParameterNeedUsageWarning,
  parameterHasDuplicateName,
  parameterIsIncompleteWarning
} from '../../utils/warnings';

export default class Parameter extends Component {
  constructor(props) {
    super(props);

    this.state = { showParameter: true };
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

  showHideParameterBody = () => {
    this.setState({ showParameter: !this.state.showParameter });
  }

  updateParameter = (object) => {
    this.props.updateInstanceOfParameter(object, this.props.index);
  }

  deleteParameter = (index) => {
    const parameterUsed = this.props.usedBy ? this.props.usedBy.length !== 0 : false;
    if (!parameterUsed) {
      this.props.deleteParameter(index);
    }
  }

  changeParameterType = (type, name, comment) => {
    if (type) {
      this.updateParameter({ name, uniqueId: this.props.id, type: type.value, comment, value: null });
    }
  }

  renderParameter() {
    const parameterProps = {
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
      })
    };

    const codeEditorProps = {
      vsacFHIRCredentials: this.props.vsacFHIRCredentials,
      loginVSACUser: this.props.loginVSACUser,
      setVSACAuthStatus: this.props.setVSACAuthStatus,
      vsacStatus: this.props.vsacStatus,
      vsacStatusText: this.props.vsacStatusText,
      isValidatingCode: this.props.isValidatingCode,
      isValidCode: this.props.isValidCode,
      codeData: this.props.codeData,
      validateCode: this.props.validateCode,
      resetCodeValidation: this.props.resetCodeValidation
    };

    switch (this.props.type) {
      case 'boolean':
        return <BooleanEditor {...parameterProps} />;
      case 'system_code':
        return <CodeEditor {...parameterProps} {...codeEditorProps} />;
      case 'system_concept':
        return <CodeEditor {...parameterProps} {...codeEditorProps} isConcept={true} />;
      case 'integer':
        return <IntegerEditor {...parameterProps} />;
      case 'datetime':
        return <DateTimeEditor {...parameterProps} />;
      case 'decimal':
        return <DecimalEditor {...parameterProps} />;
      case 'system_quantity':
        return <QuantityEditor {...parameterProps} />;
      case 'string':
        return <StringEditor {...parameterProps} />;
      case 'time':
        return <TimeEditor {...parameterProps} />;
      case 'interval_of_integer':
        return <IntervalOfIntegerEditor {...parameterProps} />;
      case 'interval_of_datetime':
        return <IntervalOfDateTimeEditor {...parameterProps} />;
      case 'interval_of_decimal':
        return <IntervalOfDecimalEditor {...parameterProps} />;
      case 'interval_of_quantity':
        return <IntervalOfQuantityEditor {...parameterProps} />;
      default:
        return null;
    }
  }

  renderCollapsed(id, index, name, parameterUsed, disabledClass, parameterNeedsWarning) {
    const { showParameter } = this.state;

    return (
      <div className="card-element">
        <div className="card-element__header">
          <div className="heading-name">
            {name}: {parameterNeedsWarning &&
              <div className="warning"><FontAwesome name="exclamation-circle" /> Has warnings</div>
            }
          </div>

          <div className="card-element__buttons">
            <button
              onClick={this.showHideParameterBody}
              className="element__hidebutton transparent-button"
              aria-label={`hide ${name}`}>
              <FontAwesome name={showParameter ? 'angle-double-down' : 'angle-double-right'} />
            </button>

            <button
              id={`deletebutton-${id}`}
              onClick={() => { this.deleteParameter(index); }}
              className={`button transparent-button delete-button ${disabledClass}`}
              aria-label="Delete Parameter">
              <FontAwesome fixedWidth name='close' />
            </button>
            {parameterUsed &&
              <UncontrolledTooltip
                target={`deletebutton-${id}`} placement="left">
                  To delete this parameter, remove all references to it.
              </UncontrolledTooltip> }
          </div>
        </div>
      </div>
    );
  }

  render() {
    const {
      index, name, id, type, value, comment, usedBy, instanceNames
    } = this.props;
    const { showParameter } = this.state;
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
    const parameterUsed = this.props.usedBy ? this.props.usedBy.length !== 0 : false;
    const disabledClass = parameterUsed ? 'disabled' : '';
    const doesHaveParameterUsageWarning = doesParameterNeedUsageWarning(
      name,
      usedBy,
      comment,
      this.props.getAllInstancesInAllTrees()
    );
    const isIncompleteWarning = parameterIsIncompleteWarning(type, value);
    const parameterNeedsWarning
      = doesHaveDuplicateName || doesHaveParameterUsageWarning || (isIncompleteWarning != null);

    return (
      <div className="parameter card-group card-group__top" id={id}>
        {showParameter ? <div className="card-element">
          <div className="card-element__header">
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


            <div className="card-element__buttons">
              <button
                onClick={this.showHideParameterBody}
                className="element__hidebutton transparent-button"
                aria-label={`hide ${name}`}>
                <FontAwesome name={showParameter ? 'angle-double-down' : 'angle-double-right'} />
              </button>

              <button
                id={`deletebutton-${id}`}
                onClick={() => { this.deleteParameter(index); }}
                className={`button transparent-button delete-button ${disabledClass}`}
                aria-label="Delete Parameter">
                <FontAwesome fixedWidth name='close' />
              </button>
              {parameterUsed &&
                <UncontrolledTooltip
                  target={`deletebutton-${id}`} placement="left">
                    To delete this parameter, remove all references to it.
                </UncontrolledTooltip> }
            </div>
          </div>

          {(isIncompleteWarning != null)
            && !doesHaveDuplicateName
            && !doesHaveParameterUsageWarning
            && <div className="warning">
                  {`Warning: Default value is incomplete. ${isIncompleteWarning}`}
                </div>
          }

          {doesHaveDuplicateName
            && !doesHaveParameterUsageWarning
            && <div className="warning">Warning: Name already in use. Choose another name.</div>}

          {parameterUsed
            && <div className="notification">
                  <FontAwesome name="exclamation-circle" />
                  Parameter name and type can't be changed while it is being referenced.
                </div>}

          {doesHaveParameterUsageWarning
            && <div className="warning">
                  Warning: One or more uses of this Parameter have changed. Choose another name.
                </div>
          }

          <div className="card-element__body">
            <div className="parameter__item">
              <TextAreaField
                key={id}
                id={id}
                name={'Comment'}
                value={comment}
                updateInstance={e => this.updateParameter({
                  name,
                  uniqueId: id,
                  type,
                  comment: e[id],
                  value
                })}
                />
            </div>

            <div className="parameter__item row">
              <div className="col-3 bold align-right">
                <label htmlFor={`parameter-${index}`}>Parameter Type:</label>
              </div>

              <div className="col-9">
                <Select
                  aria-label={'Select Parameter Type'}
                  inputProps={{ title: 'Select Parameter Type', id: `parameter-${index}` }}
                  options={typeOptions}
                  value={type}
                  disabled={parameterUsed}
                  clearable={false}
                  onChange={parameterType => this.changeParameterType(parameterType, name, comment)}
                />
              </div>
            </div>

            {this.renderParameter()}
          </div>
        </div> : this.renderCollapsed(id, index, name, parameterUsed, disabledClass, parameterNeedsWarning)}
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
  vsacFHIRCredentials: PropTypes.object,
  setVSACAuthStatus: PropTypes.func.isRequired,
  vsacStatus: PropTypes.string,
  vsacStatusText: PropTypes.string,
  isValidatingCode: PropTypes.bool.isRequired,
  isValidCode: PropTypes.bool,
  codeData: PropTypes.object,
  validateCode: PropTypes.func.isRequired,
  resetCodeValidation: PropTypes.func.isRequired,
  getAllInstancesInAllTrees: PropTypes.func.isRequired
};
