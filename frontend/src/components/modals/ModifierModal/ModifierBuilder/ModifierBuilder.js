import React, { useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import { useQuery } from 'react-query';
import { CircularProgress, IconButton } from '@mui/material';
import { ArrowBackIos as ArrowBackIosIcon } from '@mui/icons-material';

import ConjunctionCard from './ConjunctionCard';
import getResourceOptions from './utils/getResourceOptions';
import getModifierExpression from './utils/getModifierExpression';
import { fetchResource } from 'queries/modifier-builder';
import { useSpacingStyles } from 'styles/hooks';
import useStyles from '../styles';

const ModifierBuilder = ({
  elementInstanceReturnType,
  fhirVersion,
  handleGoBack,
  modifierToEdit,
  setModifiersToAdd
}) => {
  const [modifierTree, setModifierTree] = useState(
    modifierToEdit || {
      inputTypes: [elementInstanceReturnType],
      returnType: undefined,
      type: 'UserDefinedModifier',
      where: { id: 'root', conjunctionType: 'and', rules: [] }
    }
  );
  const resourceQuery = useQuery(['resources', { fhirVersion, elementInstanceReturnType }], () =>
    fetchResource(fhirVersion, elementInstanceReturnType)
  );
  const resourceOptions = useMemo(() => getResourceOptions(resourceQuery.data), [resourceQuery.data]);
  const spacingStyles = useSpacingStyles();
  const styles = useStyles();

  const getTreeReturnType = tree => {
    if (tree.rules.length !== 0) return elementInstanceReturnType;
    return undefined;
  };

  const handleUpdateModifierTree = tree => {
    let updatedTree = { ...modifierTree, returnType: getTreeReturnType(tree), where: tree };
    setModifierTree(updatedTree);
    setModifiersToAdd([updatedTree]);
  };

  return (
    <>
      <div className={styles.navHeader}>
        <div className={styles.navHeaderGroup}>
          <div className={styles.navHeaderButtons}>
            {!modifierToEdit && (
              <IconButton aria-label="go back" onClick={handleGoBack} size="large">
                <ArrowBackIosIcon fontSize="small" />
              </IconButton>
            )}
            <div className={styles.tag}>WHERE</div>
          </div>

          <div className={styles.modifierExpression}>{getModifierExpression(modifierTree)}</div>
        </div>
      </div>

      {resourceQuery.isLoading && (
        <div className={spacingStyles.center}>
          <CircularProgress />
        </div>
      )}

      {resourceQuery.isSuccess && (
        <ConjunctionCard
          rule={modifierTree.where}
          depth={0}
          handleUpdateConjunction={handleUpdateModifierTree}
          resourceOptions={resourceOptions}
        />
      )}
    </>
  );
};

ModifierBuilder.propTypes = {
  elementInstanceReturnType: PropTypes.string.isRequired,
  fhirVersion: PropTypes.string.isRequired,
  handleGoBack: PropTypes.func.isRequired,
  modifiersToAdd: PropTypes.array.isRequired,
  setModifiersToAdd: PropTypes.func.isRequired
};

export default ModifierBuilder;
