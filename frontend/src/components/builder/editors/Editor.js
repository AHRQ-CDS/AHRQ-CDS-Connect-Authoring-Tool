import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';

import BooleanEditor from './BooleanEditor';
import CodeEditor from './CodeEditor';
import IntegerEditor from './IntegerEditor';
import DateTimeEditor from './DateTimeEditor';
import DecimalEditor from './DecimalEditor';
import QuantityEditor from './QuantityEditor';
import StringEditor from './StringEditor';
import TimeEditor from './TimeEditor';
import IntervalOfIntegerEditor from './IntervalOfIntegerEditor';
import IntervalOfDateTimeEditor from './IntervalOfDateTimeEditor';
import IntervalOfDecimalEditor from './IntervalOfDecimalEditor';
import IntervalOfQuantityEditor from './IntervalOfQuantityEditor';

export default class Editor extends Component {
  render() {
    const genericProps = _.pick(this.props, [
      'id',
      'name',
      'type',
      'label',
      'value',
      'updateInstance',
      'condenseUI'
    ]);

    const codeEditorProps = _.pick(this.props, [
      'vsacFHIRCredentials',
      'loginVSACUser',
      'setVSACAuthStatus',
      'vsacStatus',
      'vsacStatusText',
      'isValidatingCode',
      'isValidCode',
      'codeData',
      'validateCode',
      'resetCodeValidation'
    ]);

    switch (this.props.type) {
      case 'boolean':
        return <BooleanEditor {...genericProps} />;
      case 'system_code':
        return <CodeEditor {...genericProps} {...codeEditorProps} />;
      case 'system_concept':
        return <CodeEditor {...genericProps} {...codeEditorProps} isConcept={true} />;
      case 'integer':
        return <IntegerEditor {...genericProps} />;
      case 'datetime':
        return <DateTimeEditor {...genericProps} />;
      case 'decimal':
        return <DecimalEditor {...genericProps} />;
      case 'system_quantity':
        return <QuantityEditor {...genericProps} />;
      case 'string':
        return <StringEditor {...genericProps} />;
      case 'time':
        return <TimeEditor {...genericProps} />;
      case 'interval_of_integer':
        return <IntervalOfIntegerEditor {...genericProps} />;
      case 'interval_of_datetime':
        return <IntervalOfDateTimeEditor {...genericProps} />;
      case 'interval_of_decimal':
        return <IntervalOfDecimalEditor {...genericProps} />;
      case 'interval_of_quantity':
        return <IntervalOfQuantityEditor {...genericProps} />;
      default:
        return null;
    }
  }
}

Editor.propTypes = {
  id: PropTypes.string.isRequired,
  name: PropTypes.string,
  label: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
  value: PropTypes.any,
  updateInstance: PropTypes.func.isRequired,
  isConcept: PropTypes.bool,
  disableEditing: PropTypes.bool,
  vsacFHIRCredentials: PropTypes.object,
  loginVSACUser: PropTypes.func.isRequired,
  setVSACAuthStatus: PropTypes.func.isRequired,
  vsacStatus: PropTypes.string,
  vsacStatusText: PropTypes.string,
  isValidatingCode: PropTypes.bool.isRequired,
  isValidCode: PropTypes.bool,
  codeData: PropTypes.object,
  validateCode: PropTypes.func.isRequired,
  resetCodeValidation: PropTypes.func.isRequired,
  condenseUI: PropTypes.bool
};

Editor.defaultProps = {
  condenseUI: false
};
