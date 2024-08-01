import React from 'react';
import PropTypes from 'prop-types';
import { IconButton, Paper } from '@mui/material';
import { Clear as ClearIcon, Edit as EditIcon } from '@mui/icons-material';
import { Tooltip } from 'components/elements';
import { useButtonStyles } from 'styles/hooks';
import useStyles from './styles';

const RecommendationAction = ({ action, editAction, deleteAction }) => {
  const buttonStyles = useButtonStyles();
  const styles = useStyles();
  return (
    <Paper className={styles.action} data-testid="action">
      <div>
        <div className={styles.actionTitle}>{action.resource.resourceType} Create Action</div>
        <div>{action.description}</div>
      </div>
      <div>
        <Tooltip title="Edit">
          <IconButton
            aria-label="edit action"
            className={buttonStyles.iconButton}
            onClick={editAction}
            color="primary"
            variant="contained"
            size="large"
          >
            <EditIcon />
          </IconButton>
        </Tooltip>
        <Tooltip title="Delete">
          <IconButton
            aria-label="delete action"
            className={buttonStyles.iconButton}
            onClick={deleteAction}
            color="primary"
            variant="contained"
            size="large"
          >
            <ClearIcon />
          </IconButton>
        </Tooltip>
      </div>
    </Paper>
  );
};

RecommendationAction.propTypes = {
  action: PropTypes.object.isRequired,
  editAction: PropTypes.func.isRequired,
  deleteAction: PropTypes.func.isRequired
};

export default RecommendationAction;
