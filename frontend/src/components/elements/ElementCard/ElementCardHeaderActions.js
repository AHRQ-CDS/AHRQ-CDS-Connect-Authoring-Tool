import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { IconButton } from '@material-ui/core';
import {
  ChatBubble as ChatBubbleIcon,
  Clear as ClearIcon,
  ExpandLess as ExpandLessIcon,
  ExpandMore as ExpandMoreIcon,
  Sms as SmsIcon
} from '@material-ui/icons';
import clsx from 'clsx';

import { DeleteConfirmationModal } from 'components/modals';
import { Tooltip } from 'components/elements';
import { changeToCase } from 'utils/strings';
import useStyles from './styles';

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
  const styles = useStyles();

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
            className={clsx(hasComment && styles.buttonHighlight)}
            onClick={handleToggleComment}
          >
            {hasComment ? <SmsIcon fontSize="small" /> : <ChatBubbleIcon fontSize="small" />}
          </IconButton>
        </Tooltip>
      )}

      <Tooltip title={showContent ? 'Collapse' : 'Expand'}>
        <IconButton aria-label={showContent ? 'collapse' : 'expand'} onClick={handleToggleContent}>
          {showContent ? <ExpandLessIcon fontSize="small" /> : <ExpandMoreIcon fontSize="small" />}
        </IconButton>
      </Tooltip>

      <Tooltip title={disableDeleteMessage || 'Delete'}>
        <IconButton
          aria-label="delete"
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
