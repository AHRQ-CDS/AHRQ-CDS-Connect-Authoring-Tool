import React from 'react';
import { useDispatch } from 'react-redux';
import PropTypes from 'prop-types';
import { IconButton } from '@material-ui/core';
import { Link as LinkIcon } from '@material-ui/icons';
import clsx from 'clsx';

import { setActiveTab, setScrollToId } from 'actions/navigation';
import { getTabIndexFromName, getTabNameFromIndex } from '../utils';
import { useFieldStyles, useSpacingStyles } from 'styles/hooks';

const ReferenceTemplate = ({ elementNames, referenceField, referenceInstanceTab }) => {
  const dispatch = useDispatch();
  const fieldStyles = useFieldStyles();
  const spacingStyles = useSpacingStyles();

  const baseElementTabIndex = getTabIndexFromName('baseElements');
  const parameterTabIndex = getTabIndexFromName('parameters');
  const referenceTabIndex = getTabIndexFromName(referenceInstanceTab);

  const getReferenceName = () => {
    switch (referenceField.id) {
      case 'externalCqlReference':
        return referenceField.value.id;
      case 'baseElementArgumentReference':
      case 'parameterArgumentReference':
        return referenceField.value.elementName;
      default:
        return elementNames.find(name => name.id === referenceField.value.id)?.name || '';
    }
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

  const handleLinkToElement = () => {
    let activeTabIndex = 0;
    if (referenceField.id === 'baseElementReference' || referenceField.id === 'baseElementArgumentReference')
      activeTabIndex = baseElementTabIndex;
    else if (referenceField.id === 'parameterReference' || referenceField.id === 'parameterArgumentReference')
      activeTabIndex = parameterTabIndex;
    else if (referenceField.id === 'baseElementUse' || referenceField.id === 'parameterUse')
      activeTabIndex = referenceTabIndex;
    if (activeTabIndex == null) return;

    dispatch(setScrollToId(referenceField.value.id));
    dispatch(setActiveTab(activeTabIndex));
  };

  const isUse = referenceField.id === 'baseElementUse' || referenceField.id === 'parameterUse';

  return (
    <div className={clsx(fieldStyles.field, spacingStyles.alignCenter)} id="reference-template">
      <div className={clsx(fieldStyles.fieldLabel, fieldStyles.fieldLabelShort)}>
        {referenceLabelMap[referenceField.id]}:
      </div>

      <div className={fieldStyles.fieldDetails}>
        <div className={fieldStyles.fieldDisplay}>
          {getReferenceName()} {isUse && <>&#8594; {getTabNameFromIndex(referenceTabIndex)}</>}
        </div>

        {referenceField.id !== 'externalCqlReference' && (
          <div className={fieldStyles.fieldButtons}>
            <IconButton aria-label="see element definition" color="primary" onClick={handleLinkToElement}>
              <LinkIcon fontSize="small" />
            </IconButton>
          </div>
        )}
      </div>
    </div>
  );
};

ReferenceTemplate.propTypes = {
  elementNames: PropTypes.array.isRequired,
  referenceField: PropTypes.object.isRequired,
  referenceInstanceTab: PropTypes.string.isRequired
};

export default ReferenceTemplate;
