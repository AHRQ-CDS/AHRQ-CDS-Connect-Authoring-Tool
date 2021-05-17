import React from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { IconButton } from '@material-ui/core';
import { Link as LinkIcon } from '@material-ui/icons';
import clsx from 'clsx';

import { useFieldStyles, useSpacingStyles } from 'styles/hooks';

const ReferenceTemplate = ({ referenceField, referenceInstanceTab, scrollToElement }) => {
  const artifactNames = useSelector(state => state.artifacts.names);
  const fieldStyles = useFieldStyles();
  const spacingStyles = useSpacingStyles();

  const getReferenceName = () => {
    switch (referenceField.id) {
      case 'externalCqlReference':
        return referenceField.value.id;
      case 'baseElementArgumentReference':
      case 'parameterArgumentReference':
        return referenceField.value.elementName;
      default:
        return artifactNames.find(name => name.id === referenceField.value.id).name || '';
    }
  };

  // keep in this order
  const tabLabelMap = {
    expTreeInclude: 'Inclusions',
    expTreeExclude: 'Exclusions',
    subpopulations: 'Subpopulations',
    baseElements: 'Base Element'
  };

  const referenceLabelMap = {
    baseElementArgumentReference: 'Base Element',
    baseElementReference: 'Base Element',
    baseElementUse: 'Element Use',
    externalCqlReference: 'External CQL Element',
    parameterArgumentReference: 'Parameter',
    parameterReference: 'Parameter',
    parameterUse: 'Parameter Use'
  };

  const scrollToTabIndex = Object.keys(tabLabelMap).indexOf(referenceInstanceTab);
  const isUse = referenceField.id === 'baseElementUse' || referenceField.id === 'parameterUse';

  return (
    <div className={clsx(fieldStyles.field, spacingStyles.alignCenter)} id="reference-template">
      <div className={clsx(fieldStyles.fieldLabel, fieldStyles.fieldLabelShort)}>
        {referenceLabelMap[referenceField.id]}:
      </div>

      <div className={fieldStyles.fieldDetails}>
        <div className={fieldStyles.fieldDisplay}>
          {getReferenceName()} {isUse && <>&#8594; {tabLabelMap[referenceInstanceTab]}</>}
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
