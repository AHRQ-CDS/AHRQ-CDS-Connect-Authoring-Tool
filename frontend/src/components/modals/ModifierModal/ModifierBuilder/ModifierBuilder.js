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

const ModifierBuilder = ({ elementInstanceReturnType, fhirVersion, handleGoBack }) => {
  const [modifierTree, setModifierTree] = useState({ id: 'root', conjunctionType: 'and', rules: [] });
  const resourceQuery = useQuery(['resources', { fhirVersion, elementInstanceReturnType }], () =>
    fetchResource(fhirVersion, elementInstanceReturnType)
  );
  const resourceOptions = useMemo(() => getResourceOptions(resourceQuery.data), [resourceQuery.data]);
  const spacingStyles = useSpacingStyles();
  const styles = useStyles();

  return (
    <>
      <div className={styles.navHeader}>
        <IconButton onClick={handleGoBack}>
          <ArrowBackIosIcon fontSize="small" />
        </IconButton>

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
          rule={modifierTree}
          depth={0}
          handleUpdate={setModifierTree}
          resourceOptions={resourceOptions}
        />
      )}
    </>
  );
};

ModifierBuilder.propTypes = {
  elementInstanceReturnType: PropTypes.string.isRequired,
  fhirVersion: PropTypes.string.isRequired,
  handleGoBack: PropTypes.func.isRequired
};

export default ModifierBuilder;
