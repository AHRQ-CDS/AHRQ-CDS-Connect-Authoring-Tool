import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { MenuBook as MenuBookIcon } from '@material-ui/icons';
import _ from 'lodash';

import Editor from 'components/builder/editors/Editor';
import { useSpacingStyles } from 'styles/hooks';
import useStyles from './styles';

const ExternalModifier = ({ argumentTypes, handleUpdateModifier, modifierArguments, name, value }) => {
  const vsacApiKey = useSelector(state => state.vsac.apiKey);
  const spacingStyles = useSpacingStyles();
  const styles = useStyles();

  const assignValue = (event, argIndex) => {
    const valuesClone = _.cloneDeep(value);
    valuesClone[argIndex] = event.value;

    handleUpdateModifier({ value: valuesClone });
  };

  const editorPropsArray = [];
  if (modifierArguments.length > 1) {
    const defaultEditorProps = { vsacApiKey };

    modifierArguments.forEach((arg, argIndex) => {
      // We don't want the modifier input arguments to include the first function argument
      if (argIndex === 0) return;
      const editorProps = _.cloneDeep(defaultEditorProps);
      editorProps.key = argIndex;
      editorProps.id = `external-modifier-${argIndex}`;
      editorProps.name = arg.name;
      editorProps.label = `${arg.name}:`;
      editorProps.type = argumentTypes[argIndex].calculated;
      editorProps.value = value[argIndex];
      editorProps.updateInstance = event => assignValue(event, argIndex);
      editorPropsArray.push(editorProps);
    });
  }

  useEffect(() => {
    if (!value || value.length === 0) {
      handleUpdateModifier({ value: new Array(modifierArguments.length).fill(null) });
    }
  }, [handleUpdateModifier, modifierArguments.length, value]);

  return (
    <div className={styles.modifier}>
      <div className={styles.modifierHeader}>
        <MenuBookIcon fontSize="small" />
        {name}
      </div>

      <div className={spacingStyles.indent}>
        {editorPropsArray.map(editorProps => (
          <Editor {...editorProps} />
        ))}
      </div>
    </div>
  );
};

ExternalModifier.propTypes = {
  argumentTypes: PropTypes.array.isRequired,
  handleUpdateModifier: PropTypes.func.isRequired,
  modifierArguments: PropTypes.array.isRequired,
  name: PropTypes.string.isRequired,
  value: PropTypes.any
};

export default ExternalModifier;
