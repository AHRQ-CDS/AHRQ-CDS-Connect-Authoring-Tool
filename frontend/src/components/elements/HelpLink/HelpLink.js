import React from 'react';
import PropTypes from 'prop-types';
import { Link as RouterLink } from 'react-router-dom';
import { Button, IconButton, Tooltip } from '@material-ui/core';
import { Help as HelpIcon } from '@material-ui/icons';

import useStyles from './styles';

const HelpLink = ({ linkPath, showText, tooltipTitle = 'View Documentation' }) => {
  const styles = useStyles();

  return (
    <>
      {showText ? (
        <Button
          className={styles.helpButton}
          color="primary"
          component={RouterLink}
          rel="noopener noreferrer"
          target="_blank"
          to={`/${linkPath}`}
        >
          <HelpIcon /> HELP
        </Button>
      ) : (
        <Tooltip title={tooltipTitle} arrow>
          <IconButton
            className={styles.helpLink}
            href={`${process.env.PUBLIC_URL}/${linkPath}`}
            rel="noopener noreferrer"
            size="small"
            target="_blank"
            variant="contained"
          >
            <HelpIcon />
          </IconButton>
        </Tooltip>
      )}
    </>
  );
};

HelpLink.propTypes = {
  linkPath: PropTypes.string.isRequired,
  showText: PropTypes.bool,
  tooltipTitle: PropTypes.string
};

export default HelpLink;
