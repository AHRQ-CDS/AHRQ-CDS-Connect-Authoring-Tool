import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { Box, Divider, IconButton, Stack } from '@mui/material';
import { Close as CloseIcon, Visibility as VisibilityIcon } from '@mui/icons-material';

import ElementCardLabel from 'components/elements/ElementCard/ElementCardLabel';
import { ValueSetSelectModal } from 'components/modals';
import { Tooltip } from 'components/elements';

const ValueSetListTemplate = ({ handleDeleteValueSet, valueSets }) => {
  const [showValueSetViewModal, setShowValueSetViewModal] = useState(false);
  const [valueSetToView, setValueSetToView] = useState(null);
  const vsacApiKey = useSelector(state => state.vsac.apiKey);

  const handleViewValueSet = valueSet => {
    setValueSetToView(valueSet);
    setShowValueSetViewModal(true);
  };

  return (
    <div id="value-set-list-template">
      {valueSets.map((valueSet, index) => (
        <Stack key={`value-set-${index}`} direction="row" mb={1}>
          <ElementCardLabel
            id="value-set-label"
            label={`Value Set${valueSets.length > 1 ? ` ${index + 1}` : ''}`}
            mt="6px"
          />

          <Stack width="100%">
            <Stack alignItems="center" direction="row" justifyContent="space-between" mb={1}>
              {` ${valueSet.name} (${valueSet.oid})`}

              <Box>
                <Tooltip enabled={!Boolean(vsacApiKey)} placement="left" title="Authenticate VSAC to view details">
                  <IconButton
                    aria-label="View Value Set"
                    color="primary"
                    disabled={!Boolean(vsacApiKey)}
                    onClick={() => handleViewValueSet(valueSet)}
                  >
                    <VisibilityIcon fontSize="small" />
                  </IconButton>
                </Tooltip>

                <IconButton
                  aria-label={`Delete Value Set ${valueSet.name}`}
                  color="primary"
                  onClick={() => handleDeleteValueSet(valueSet)}
                >
                  <CloseIcon fontSize="small" />
                </IconButton>
              </Box>
            </Stack>

            <Divider />
          </Stack>
        </Stack>
      ))}

      {showValueSetViewModal && (
        <ValueSetSelectModal
          handleCloseModal={() => setShowValueSetViewModal(false)}
          readOnly
          savedValueSet={valueSetToView}
        />
      )}
    </div>
  );
};

ValueSetListTemplate.propTypes = {
  handleDeleteValueSet: PropTypes.func.isRequired,
  valueSets: PropTypes.array.isRequired
};

export default ValueSetListTemplate;
