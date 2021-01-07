import React, { memo } from 'react';
import PropTypes from 'prop-types';
import { ThemeProvider } from '@material-ui/core/styles';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLink } from '@fortawesome/free-solid-svg-icons';

import { Login, Logout } from 'components/auth';
import darkTheme from 'styles/theme';

const CdsHeader = memo(function Header({
  artifactSaved,
  authStatus,
  authStatusText,
  authUser,
  isAuthenticated,
  isAuthenticating,
  loginUser,
  logoutUser,
  setAuthStatus
}) {
  return (
    <ThemeProvider theme={darkTheme}>
      <header className="cds-header">
        <div className="cds-header__cdsbanner">
          <div className="cds-header__cdsbanner-wrapper">
            <div className="cds-header__cdsbanner-text">
              <a href="/" alt="home">
                <div className="text-top">Patient-centered Outcomes Research</div>
                <div className="text-bottom">Clinical Decision Support Authoring</div>
              </a>
            </div>

            <div className="cds-header__cdsbanner-auth">
              <a href="https://cds.ahrq.gov" className="cds-home-link">
                <FontAwesomeIcon icon={faLink} /> CDS Home
              </a>

              {isAuthenticated ?
                <Logout
                  artifactSaved={artifactSaved}
                  authStatus={authStatus}
                  authStatusText={authStatusText}
                  authUser={authUser}
                  onLogoutClick={logoutUser}
                />
              :
                <Login
                  authStatus={authStatus}
                  authStatusText={authStatusText}
                  isAuthenticating={isAuthenticating}
                  onLoginClick={loginUser}
                  setAuthStatus={setAuthStatus}
                />
              }
            </div>
          </div>
        </div>
      </header>
    </ThemeProvider>
  );
});

CdsHeader.propTypes = {
  artifactSaved: PropTypes.bool.isRequired,
  authStatus: PropTypes.string,
  authStatusText: PropTypes.string,
  authUser: PropTypes.string,
  isAuthenticated: PropTypes.bool.isRequired,
  isAuthenticating: PropTypes.bool.isRequired,
  loginUser: PropTypes.func.isRequired,
  logoutUser: PropTypes.func.isRequired,
  setAuthStatus: PropTypes.func.isRequired
};

export default CdsHeader;
