import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Box, Button, IconButton, Menu, MenuItem, Stack, TextField } from '@mui/material';
import { Clear as ClearIcon } from '@mui/icons-material';

import RecommendationAction from './RecommendationAction';
import RecommendationActionModal from './RecommendationActionModal';

const RecommendationSuggestion = ({
  addAction,
  updateAction,
  updateSuggestion,
  deleteAction,
  deleteSuggestion,
  index,
  suggestion
}) => {
  const [showModal, setShowModal] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(-1);
  const [currentActionResourceType, setCurrentActionResourceType] = useState(null);
  const [menuAnchorEl, setMenuAnchorEl] = useState(null);

  const handleMenuClick = event => {
    setMenuAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setMenuAnchorEl(null);
  };

  const newAction = type => {
    setMenuAnchorEl(null);
    setShowModal(true);
    setCurrentIndex(-1);
    setCurrentActionResourceType(type);
  };

  const editAction = index => {
    setShowModal(true);
    setCurrentIndex(index);
    setCurrentActionResourceType(suggestion.actions[index].resource.resourceType);
  };

  return (
    <Stack my={2}>
      <Stack alignItems="center" direction="row" justifyContent="space-between">
        Suggestion {index + 1}
        <IconButton aria-label="remove suggestion" color="primary" onClick={deleteSuggestion}>
          <ClearIcon fontSize="small" />
        </IconButton>
      </Stack>
      <TextField
        fullWidth
        hiddenLabel
        multiline
        onChange={event => updateSuggestion(event.target.value)}
        placeholder="Label for your suggestion"
        value={suggestion.label}
      />
      <Box sx={{ borderLeft: '3px solid darkgrey', paddingLeft: '20px' }} m={2}>
        {suggestion.actions.map((action, index) => (
          <RecommendationAction
            key={action.uid || index}
            action={action}
            editAction={() => editAction(index)}
            deleteAction={() => deleteAction(index)}
          />
        ))}
        <Stack direction="row">
          <Button color="primary" onClick={handleMenuClick} variant="contained">
            Add action
          </Button>
        </Stack>
      </Box>
      <Menu
        anchorEl={menuAnchorEl}
        id="download-menu"
        keepMounted
        onClose={handleMenuClose}
        open={Boolean(menuAnchorEl)}
      >
        <MenuItem onClick={() => newAction('MedicationRequest')}>Medication Request</MenuItem>
        <MenuItem onClick={() => newAction('ServiceRequest')}>Service Request</MenuItem>
      </Menu>
      {showModal && (
        <RecommendationActionModal
          closeModal={() => setShowModal(false)}
          type={currentActionResourceType}
          action={suggestion.actions[currentIndex] ?? {}}
          saveAction={action => {
            setShowModal(false);
            currentIndex === -1 ? addAction(action) : updateAction(action, currentIndex);
          }}
        />
      )}
    </Stack>
  );
};

RecommendationSuggestion.propTypes = {
  addAction: PropTypes.func.isRequired,
  updateAction: PropTypes.func.isRequired,
  updateSuggestion: PropTypes.func.isRequired,
  deleteAction: PropTypes.func.isRequired,
  deleteSuggestion: PropTypes.func.isRequired,
  index: PropTypes.number.isRequired,
  suggestion: PropTypes.object.isRequired
};

export default RecommendationSuggestion;
