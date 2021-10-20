import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { IconButton } from '@mui/material';
import {
  ChatBubble as ChatBubbleIcon,
  Clear as ClearIcon,
  ExpandLess as ExpandLessIcon,
  ExpandMore as ExpandMoreIcon,
  Sms as SmsIcon
} from '@mui/icons-material';

import { DeleteConfirmationModal } from 'components/modals';
import { Tooltip } from 'components/elements';
import { changeToCase } from 'utils/strings';

const ElementCardHeaderActions = ({
  disableDeleteMessage,
  handleDelete,
  handleToggleContent,
  handleToggleComment,
  hasComment,
  label,
  showContent,
  showComment,
  titleValue
}) => {
  const [showConfirmDeleteModal, setShowConfirmDeleteModal] = useState(false);

  const handleDeleteElement = () => {
    handleDelete();
    setShowConfirmDeleteModal(false);
  };

  return (
    <>
      {showContent && (
        <Tooltip title={showComment ? 'Hide Comment' : 'Show Comment'}>
          <IconButton
            aria-label={showComment ? 'hide comment' : 'show comment'}
            color="primary"
            onClick={handleToggleComment}
            sx={{ color: hasComment && 'common.blueHighlight' }}
          >
            {hasComment ? <SmsIcon fontSize="small" /> : <ChatBubbleIcon fontSize="small" />}
          </IconButton>
        </Tooltip>
      )}

      <Tooltip title={showContent ? 'Collapse' : 'Expand'}>
        <IconButton aria-label={showContent ? 'collapse' : 'expand'} color="primary" onClick={handleToggleContent}>
          {showContent ? <ExpandLessIcon fontSize="small" /> : <ExpandMoreIcon fontSize="small" />}
        </IconButton>
      </Tooltip>

      <Tooltip title={disableDeleteMessage || 'Delete'}>
        <IconButton
          aria-label="delete"
          color="primary"
          disabled={Boolean(disableDeleteMessage)}
          onClick={() => setShowConfirmDeleteModal(true)}
        >
          <ClearIcon fontSize="small" />
        </IconButton>
      </Tooltip>

      {showConfirmDeleteModal && (
        <DeleteConfirmationModal
          deleteType={label}
          handleCloseModal={() => setShowConfirmDeleteModal(false)}
          handleDelete={handleDeleteElement}
        >
          <>
            {changeToCase(label, 'capitalCase')}: {titleValue || 'unnamed'}
          </>
        </DeleteConfirmationModal>
      )}
    </>
  );
};

ElementCardHeaderActions.propTypes = {
  disableDeleteMessage: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]).isRequired,
  handleDelete: PropTypes.func.isRequired,
  handleToggleContent: PropTypes.func.isRequired,
  handleToggleComment: PropTypes.func.isRequired,
  hasComment: PropTypes.bool.isRequired,
  label: PropTypes.string.isRequired,
  showContent: PropTypes.bool.isRequired,
  showComment: PropTypes.bool.isRequired,
  titleValue: PropTypes.string
};

export default ElementCardHeaderActions;
