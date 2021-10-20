import React from 'react';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';
import { Box, Divider, IconButton, Stack } from '@mui/material';
import { Link as LinkIcon } from '@mui/icons-material';

import ElementCardLabel from 'components/elements/ElementCard/ElementCardLabel';
import { setActiveTab, setScrollToId } from 'actions/navigation';
import { getTabIndexFromName, getTabNameFromIndex } from '../utils';

const ReferenceTemplate = ({ elementNames, referenceField, referenceInstanceTab }) => {
  const dispatch = useDispatch();

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
    <Stack alignItems="center" direction="row">
      <ElementCardLabel label={referenceLabelMap[referenceField.id]} />

      <Stack width="100%">
        <Stack alignItems="center" direction="row" justifyContent="space-between">
          <Box my={1}>
            {getReferenceName()} {isUse && <>&#8594; {getTabNameFromIndex(referenceTabIndex)}</>}
          </Box>

          {referenceField.id !== 'externalCqlReference' && (
            <IconButton aria-label="see element definition" color="primary" onClick={handleLinkToElement}>
              <LinkIcon fontSize="small" />
            </IconButton>
          )}
        </Stack>

        <Divider />
      </Stack>
    </Stack>
  );
};

ReferenceTemplate.propTypes = {
  elementNames: PropTypes.array.isRequired,
  referenceField: PropTypes.object.isRequired,
  referenceInstanceTab: PropTypes.string.isRequired
};

export default ReferenceTemplate;
