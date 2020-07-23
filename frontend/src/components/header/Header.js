import React, { memo } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLink } from '@fortawesome/free-solid-svg-icons';

import AhrqHeader from './AhrqHeader';
import Login from '../auth/Login';
import Logout from '../auth/Logout';

export default memo(function Header({
  isAuthenticated,
  authUser,
  authStatus,
  authStatusText,
  artifactSaved,
  loginUser,
  logoutUser,
  setAuthStatus
}) {
  return (
    <header className="header">
      <AhrqHeader />

      <div className="header__cdsbanner">
        <div className="header__cdsbanner-wrapper row">
          <div className="header__cdsbanner-text col-xs-12 col-md-5">
            <a href="/" alt="home">
              <div className="text-top">Patient-centered Outcomes Research</div>
              <div className="text-bottom">Clinical Decision Support Authoring</div>
            </a>
          </div>

          <div className="header__cdsbanner-auth col-xs-12 col-md-7">
            <a href="https://cds.ahrq.gov" className="cds-home-link">
              <FontAwesomeIcon icon={faLink} /> CDS Home
            </a>

            {isAuthenticated ?
              <Logout
                onLogoutClick={logoutUser}
                authUser={authUser}
                authStatus={authStatus}
                authStatusText={authStatusText}
                artifactSaved={artifactSaved}
              />
            :
              <Login
                onLoginClick={loginUser}
                authStatus={authStatus}
                authStatusText={authStatusText}
                setAuthStatus={setAuthStatus}
              />
            }
          </div>
        </div>
      </div>
    </header>
  );
});
