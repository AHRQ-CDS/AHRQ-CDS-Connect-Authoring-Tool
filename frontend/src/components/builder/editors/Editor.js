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
      'label',
      'name',
      'type',
      'updateInstance',
      'value'
    ]);

    const codeEditorProps = _.pick(this.props, [
      'codeData',
      'isValidatingCode',
      'isValidCode',
      'loginVSACUser',
      'resetCodeValidation',
      'setVSACAuthStatus',
      'validateCode',
      'vsacApiKey',
      'vsacIsAuthenticating',
      'vsacStatus',
      'vsacStatusText'
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
  codeData: PropTypes.object,
  disableEditing: PropTypes.bool,
  isConcept: PropTypes.bool,
  isValidatingCode: PropTypes.bool.isRequired,
  isValidCode: PropTypes.bool,
  label: PropTypes.string.isRequired,
  loginVSACUser: PropTypes.func.isRequired,
  name: PropTypes.string,
  resetCodeValidation: PropTypes.func.isRequired,
  setVSACAuthStatus: PropTypes.func.isRequired,
  type: PropTypes.string.isRequired,
  updateInstance: PropTypes.func.isRequired,
  validateCode: PropTypes.func.isRequired,
  value: PropTypes.any,
  vsacApiKey: PropTypes.string,
  vsacIsAuthenticating: PropTypes.bool,
  vsacStatus: PropTypes.string,
  vsacStatusText: PropTypes.string,
};
