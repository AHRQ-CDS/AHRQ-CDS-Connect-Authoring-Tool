import React, { useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import { useQuery } from 'react-query';
import { CircularProgress, IconButton } from '@material-ui/core';
import { ArrowBackIos as ArrowBackIosIcon } from '@material-ui/icons';

import ConjunctionCard from './ConjunctionCard';
import getResourceOptions from './utils/getResourceOptions';
import { fetchResource } from 'queries/modifier-builder';
import { useSpacingStyles } from 'styles/hooks';
import useStyles from '../styles';

const ModifierBuilder = ({
  elementInstanceReturnType,
  fhirVersion,
  handleGoBack,
  setModifiersToAdd,
  modifier = undefined,
  editDirect = false
}) => {
  const [modifierTree, setModifierTree] = useState(
    modifier === undefined
      ? {
          inputTypes: [elementInstanceReturnType],
          returnType: undefined,
          type: 'UserDefinedModifier',
          where: { id: 'root', conjunctionType: 'and', rules: [] }
        }
      : modifier
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

  const updateModifierTree = tree => {
    let updatedTree = { ...modifierTree, returnType: getTreeReturnType(tree), where: tree };
    setModifierTree(updatedTree);
    setModifiersToAdd([updatedTree]);
  };

  return (
    <>
      <div className={styles.navHeader}>
        {!editDirect && (
          <IconButton onClick={handleGoBack}>
            <ArrowBackIosIcon fontSize="small" />
          </IconButton>
        )}

        <div>
          <div className={styles.tag}>WHERE</div>
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
          handleUpdate={updateModifierTree}
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
