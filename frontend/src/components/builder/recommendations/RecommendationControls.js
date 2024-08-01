import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Box, IconButton } from '@mui/material';
import {
  ArrowDropDown as ArrowDropDownIcon,
  ArrowDropUp as ArrowDropUpIcon,
  ChatBubble as ChatBubbleIcon,
  Clear as ClearIcon,
  Sms as SmsIcon
} from '@mui/icons-material';

import { Tooltip } from 'components/elements';
import { DeleteConfirmationModal } from 'components/modals';

const RecommendationControls = ({
  canMoveDown,
  canMoveUp,
  comment,
  handleDeleteRecommendation,
  handleMoveRecommendation,
  setShowComment,
  showComment,
  text
}) => {
  const [showConfirmDeleteModal, setShowConfirmDeleteModal] = useState(false);
  const isMovable = canMoveUp || canMoveDown;

  const deleteRecommendation = () => {
    setShowConfirmDeleteModal(true);
    handleDeleteRecommendation();
  };

  return (
    <Box position="absolute" right="20px" top="20px">
      <Tooltip title={showComment ? 'Hide Comment' : 'Show Comment'}>
        <IconButton
          aria-label={showComment ? 'hide comment' : 'show comment'}
          color="primary"
          onClick={() => setShowComment(!showComment)}
          sx={{ color: comment !== '' && 'common.blueHighlight' }}
        >
          {comment !== '' ? <SmsIcon fontSize="small" /> : <ChatBubbleIcon fontSize="small" />}
        </IconButton>
      </Tooltip>

      {isMovable && (
        <>
          <Tooltip enabled={canMoveUp} title="Move Up">
            <IconButton
              aria-label="move up recommendation"
              color="primary"
              disabled={!canMoveUp}
              onClick={() => handleMoveRecommendation('up')}
            >
              <ArrowDropUpIcon />
            </IconButton>
          </Tooltip>

          <Tooltip enabled={canMoveDown} title="Move Down">
            <IconButton
              aria-label="move down recommendation"
              color="primary"
              disabled={!canMoveDown}
              onClick={() => handleMoveRecommendation('down')}
            >
              <ArrowDropDownIcon />
            </IconButton>
          </Tooltip>
        </>
      )}

      <IconButton aria-label="delete recommendation" color="primary" onClick={() => setShowConfirmDeleteModal(true)}>
        <ClearIcon fontSize="small" />
      </IconButton>

      {showConfirmDeleteModal && (
        <DeleteConfirmationModal
          deleteType="recommendation"
          handleCloseModal={() => setShowConfirmDeleteModal(false)}
          handleDelete={deleteRecommendation}
        >
          <>{text === '' ? <i>Blank recommendation</i> : text}</>
        </DeleteConfirmationModal>
      )}
    </Box>
  );
};

RecommendationControls.propTypes = {
  canMoveDown: PropTypes.bool.isRequired,
  canMoveUp: PropTypes.bool.isRequired,
  comment: PropTypes.string.isRequired,
  handleDeleteRecommendation: PropTypes.func.isRequired,
  handleMoveRecommendation: PropTypes.func.isRequired,
  setShowComment: PropTypes.func.isRequired,
  showComment: PropTypes.bool.isRequired,
  text: PropTypes.string.isRequired
};

export default RecommendationControls;
