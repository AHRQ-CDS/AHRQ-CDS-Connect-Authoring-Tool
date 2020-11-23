import React, { Component } from 'react';
import Editor from '../editors/Editor';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBook } from '@fortawesome/free-solid-svg-icons';

/* eslint-disable jsx-a11y/label-has-for */
export default class ExternalModifier extends Component {
  constructor(props) {
    super(props);

    // We want to fill a null value array of the length of the arguments array if it doesn't already exist
    if (!props.value || props.value.length === 0) {
      props.updateAppliedModifier(props.index, { value: new Array(props.arguments.length).fill(null) });
    }
  }

  assignValue(event, argIndex) {
    const valuesClone = _.cloneDeep(this.props.value);
    valuesClone[argIndex] = event.value;
    this.props.updateAppliedModifier(this.props.index, { value: valuesClone });
  }

  render() {
    const editorPropsArray = [];
    if (this.props.arguments.length > 1) {
      const defaultEditorProps = {
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
        condenseUI: true
      };

      this.props.arguments.forEach((arg, argIndex) => {
        // We don't want the modifier input arguments to include the first function argument
        if (argIndex === 0) return;
        const editorProps = _.cloneDeep(defaultEditorProps);
        editorProps.key = argIndex;
        editorProps.id = `external-modifier-${this.props.index}-${argIndex}`;
        editorProps.name = arg.name;
        editorProps.label = `${arg.name}:`;
        editorProps.type = this.props.argumentTypes[argIndex].calculated;
        editorProps.value = this.props.value[argIndex];
        editorProps.updateInstance = (event => this.assignValue(event, argIndex));
        editorPropsArray.push(editorProps);
      });
    }

    return (
      <div className="external-modifier form__group">
        <label className="modifier-title">
          <FontAwesomeIcon icon={faBook} /> {this.props.name}
        </label>

        <div className="modifier-editor-group">
          {editorPropsArray.map(editorProps => {
            return <Editor {...editorProps} />;
          })}
        </div>
      </div>
    );
  } 
};

ExternalModifier.propTypes = {
  index: PropTypes.number.isRequired,
  name: PropTypes.string.isRequired,
  value: PropTypes.any,
  arguments: PropTypes.array.isRequired,
  argumentTypes: PropTypes.array.isRequired,
  updateAppliedModifier: PropTypes.func.isRequired,
  vsacApiKey: PropTypes.string,
  loginVSACUser: PropTypes.func.isRequired,
  setVSACAuthStatus: PropTypes.func.isRequired,
  vsacStatus: PropTypes.string,
  vsacStatusText: PropTypes.string,
  isValidatingCode: PropTypes.bool.isRequired,
  isValidCode: PropTypes.bool,
  codeData: PropTypes.object,
  validateCode: PropTypes.func.isRequired,
  resetCodeValidation: PropTypes.func.isRequired
};
