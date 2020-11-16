import React from 'react';
import PropTypes from 'prop-types';
import { useLocation } from 'react-router-dom';
import { useSpacingStyles } from 'styles/hooks';
import useStyles from './styles';

const ErrorPage = ({ errorType }) => {
  const styles = useStyles();
  const spacingStyles = useSpacingStyles();
  const { pathname } = useLocation();

  const getErrorMessage = () => {
    switch (errorType) {
      case 'notLoggedIn':
        return (
          <>
            You must be logged in to access <code>{pathname}</code>
          </>
        );
      case 'notFound':
        return (
          <>
            No match for <code>{pathname}</code>
          </>
        );
      default:
        return 'An error has occured';
    }
  };

  return (
    <div className={styles.root} id="maincontent">
      <div className={spacingStyles.globalPadding}>
        <h3>{getErrorMessage()}</h3>
      </div>
    </div>
  );
};

ErrorPage.propTypes = {
  errorType: PropTypes.string
};

export default ErrorPage;
