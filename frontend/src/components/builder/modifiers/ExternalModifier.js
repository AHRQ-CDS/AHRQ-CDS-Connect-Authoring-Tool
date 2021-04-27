import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { MenuBook as MenuBookIcon } from '@material-ui/icons';
import clsx from 'clsx';
import _ from 'lodash';

import { EditorsTemplate } from 'components/builder/templates';
import { useSpacingStyles } from 'styles/hooks';
import useStyles from './styles';

const ExternalModifier = ({ argumentTypes, handleUpdateModifier, modifierArguments, name, values }) => {
  const spacingStyles = useSpacingStyles();
  const styles = useStyles();

  const assignValue = (newValue, index) => {
    const valuesClone = _.cloneDeep(values);
    valuesClone[index] = newValue;

    handleUpdateModifier({ value: valuesClone });
  };

  useEffect(() => {
    if (!values || values.length === 0) {
      handleUpdateModifier({ value: new Array(modifierArguments.length).fill(null) });
    }
  }, [handleUpdateModifier, modifierArguments.length, values]);

  return (
    <div className={styles.modifier}>
      <div className={styles.modifierHeader}>
        <MenuBookIcon fontSize="small" />
        {name}
      </div>

      <div className={clsx(spacingStyles.indent, spacingStyles.fullWidth)} data-testid="editors">
        {modifierArguments.length > 1 &&
          modifierArguments.map((modifierArg, index) => {
            // We don't want the modifier input arguments to include the first function argument
            if (index === 0) return null;

            return (
              <EditorsTemplate
                key={index}
                handleUpdateEditor={newValue => assignValue(newValue, index)}
                label={modifierArg.name}
                isNested
                showArgumentType
                type={argumentTypes[index].calculated}
                value={values[index]}
              />
            );
          })}
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
