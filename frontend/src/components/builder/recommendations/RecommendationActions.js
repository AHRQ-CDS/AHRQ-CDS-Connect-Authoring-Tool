import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { IconButton } from '@material-ui/core';
import {
  ArrowDropDown as ArrowDropDownIcon,
  ArrowDropUp as ArrowDropUpIcon,
  ChatBubble as ChatBubbleIcon,
  Clear as ClearIcon,
  Sms as SmsIcon
} from '@material-ui/icons';
import clsx from 'clsx';

import { Tooltip } from 'components/elements';
import { DeleteConfirmationModal } from 'components/modals';
import useStyles from './styles';

const RecommendationActions = ({
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
  const styles = useStyles();
  const isMovable = canMoveUp || canMoveDown;

  const deleteRecommendation = () => {
    setShowConfirmDeleteModal(true);
    handleDeleteRecommendation();
  };

  return (
    <div className={styles.recommendationCardActions}>
      <Tooltip title={showComment ? 'Hide Comment' : 'Show Comment'}>
        <IconButton
          aria-label={showComment ? 'hide comment' : 'show comment'}
          className={clsx(comment !== '' && styles.buttonHighlight)}
          onClick={() => setShowComment(!showComment)}
        >
          {comment !== '' ? <SmsIcon fontSize="small" /> : <ChatBubbleIcon fontSize="small" />}
        </IconButton>
      </Tooltip>

      {isMovable && (
        <>
          <Tooltip enabled={canMoveUp} title="Move Up">
            <IconButton
              aria-label="move up recommendation"
              disabled={!canMoveUp}
              onClick={() => handleMoveRecommendation('up')}
            >
              <ArrowDropUpIcon />
            </IconButton>
          </Tooltip>

          <Tooltip enabled={canMoveDown} title="Move Down">
            <IconButton
              aria-label="move down recommendation"
              disabled={!canMoveDown}
              onClick={() => handleMoveRecommendation('down')}
            >
              <ArrowDropDownIcon />
            </IconButton>
          </Tooltip>
        </>
      )}

      <IconButton aria-label="delete recommendation" onClick={() => setShowConfirmDeleteModal(true)}>
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
    </div>
  );
};

RecommendationActions.propTypes = {
  canMoveDown: PropTypes.bool.isRequired,
  canMoveUp: PropTypes.bool.isRequired,
  comment: PropTypes.string.isRequired,
  handleDeleteRecommendation: PropTypes.func.isRequired,
  handleMoveRecommendation: PropTypes.func.isRequired,
  setShowComment: PropTypes.func.isRequired,
  showComment: PropTypes.bool.isRequired,
  text: PropTypes.string.isRequired
};

export default RecommendationActions;
