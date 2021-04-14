import React from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { IconButton } from '@material-ui/core';
import { Link as LinkIcon } from '@material-ui/icons';
import clsx from 'clsx';

import { useFieldStyles } from 'styles/hooks';

const ReferenceTemplate = ({ referenceField, referenceInstanceTab, scrollToElement }) => {
  const artifactNames = useSelector(state => state.artifacts.names);
  const fieldStyles = useFieldStyles();

  const referenceName =
    referenceField.id === 'externalCqlReference'
      ? referenceField.value.id
      : artifactNames.find(name => name.id === referenceField.value.id).name || '';

  const tabLabelMap = {
    expTreeInclude: 'Inclusions',
    expTreeExclude: 'Exclusions',
    subpopulations: 'Subpopulations',
    baseElements: 'Base Element'
  };

  const referenceLabelMap = {
    baseElementReference: 'Base Element',
    parameterReference: 'Parameter',
    externalCqlReference: 'External CQL Element',
    baseElementUse: 'Element Use'
  };

  const scrollToTabIndex = Object.keys(tabLabelMap).indexOf(referenceInstanceTab);
  const referenceLabel = referenceField.id === 'baseElementUse' ? <>&#8594; {tabLabelMap[referenceInstanceTab]}</> : '';

  return (
    <div className={fieldStyles.field} id="reference-template">
      <div className={clsx(fieldStyles.fieldLabel, fieldStyles.fieldLabelTall)}>
        {referenceLabelMap[referenceField.id]}:
      </div>

      <div className={fieldStyles.fieldDetails}>
        <div className={fieldStyles.fieldDisplay}>
          {referenceName} {referenceLabel}
        </div>

        {referenceField.id !== 'externalCqlReference' && (
          <div className={fieldStyles.fieldButtons}>
            <IconButton
              aria-label="see element definition"
              color="primary"
              onClick={() => scrollToElement(referenceField.value.id, referenceField.id, scrollToTabIndex)}
            >
              <LinkIcon fontSize="small" />
            </IconButton>
          </div>
        )}
      </div>
    </div>
  );
};

ReferenceTemplate.propTypes = {
  referenceField: PropTypes.object.isRequired,
  referenceInstanceTab: PropTypes.string.isRequired,
  scrollToElement: PropTypes.func.isRequired
};

export default ReferenceTemplate;
