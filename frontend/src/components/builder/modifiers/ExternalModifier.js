import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBook } from '@fortawesome/free-solid-svg-icons';
import _ from 'lodash';

import Editor from '../editors/Editor';

export default class ExternalModifier extends Component {
  constructor(props) {
    super(props);

    // We want to fill a null value array of the length of the arguments array if it doesn't already exist
    if (!props.value || props.value.length === 0) {
      props.updateAppliedModifier(props.index, { value: new Array(props.modifierArguments.length).fill(null) });
    }
  }

  assignValue(event, argIndex) {
    const { index, updateAppliedModifier, value } = this.props;
    const valuesClone = _.cloneDeep(value);
    valuesClone[argIndex] = event.value;

    updateAppliedModifier(index, { value: valuesClone });
  }

  render() {
    const { argumentTypes, index, modifierArguments, name, value, vsacApiKey } = this.props;
    const editorPropsArray = [];

    if (modifierArguments.length > 1) {
      const defaultEditorProps = { vsacApiKey };

      modifierArguments.forEach((arg, argIndex) => {
        // We don't want the modifier input arguments to include the first function argument
        if (argIndex === 0) return;
        const editorProps = _.cloneDeep(defaultEditorProps);
        editorProps.key = argIndex;
        editorProps.id = `external-modifier-${index}-${argIndex}`;
        editorProps.name = arg.name;
        editorProps.label = `${arg.name}:`;
        editorProps.type = argumentTypes[argIndex].calculated;
        editorProps.value = value[argIndex];
        editorProps.updateInstance = event => this.assignValue(event, argIndex);
        editorPropsArray.push(editorProps);
      });
    }

    return (
      <div className="external-modifier">
        <div className="external-modifier-title">
          <FontAwesomeIcon icon={faBook} /> {name}
        </div>

        <div className="editors">
          {editorPropsArray.map(editorProps => (
            <Editor {...editorProps} />
          ))}
        </div>
      </div>
    );
  }
}

ExternalModifier.propTypes = {
  argumentTypes: PropTypes.array.isRequired,
  index: PropTypes.number.isRequired,
  modifierArguments: PropTypes.array.isRequired,
  name: PropTypes.string.isRequired,
  updateAppliedModifier: PropTypes.func.isRequired,
  value: PropTypes.any,
  vsacApiKey: PropTypes.string
};
