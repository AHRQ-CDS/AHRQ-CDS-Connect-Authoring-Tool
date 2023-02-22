import React from 'react';
import PropTypes from 'prop-types';
import { Stack } from '@mui/material';
import { Check as CheckIcon } from '@mui/icons-material';

import ElementCardLabel from 'components/elements/ElementCard/ElementCardLabel';

const ReturnTypeTemplate = ({ returnType, returnTypeIsValid }) => (
  <Stack direction="row" my={1}>
    <ElementCardLabel label="Return Type" />

    <Stack data-testid="return-type-template" alignItems="center" direction="row" mb={1}>
      {returnTypeIsValid && <CheckIcon fontSize="small" sx={{ marginRight: '5px' }} />}
      {returnType}
    </Stack>
  </Stack>
);

ReturnTypeTemplate.propTypes = {
  returnType: PropTypes.string.isRequired,
  returnTypeIsValid: PropTypes.bool.isRequired
};

export default ReturnTypeTemplate;
