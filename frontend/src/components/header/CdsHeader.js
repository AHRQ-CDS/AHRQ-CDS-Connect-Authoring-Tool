import React from 'react';
import { useSelector } from 'react-redux';
import { ThemeProvider, StyledEngineProvider } from '@mui/material/styles';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLink } from '@fortawesome/free-solid-svg-icons';

import { Login, Logout } from 'components/auth';
import darkTheme from 'styles/theme';

const CdsHeader = () => {
  const isAuthenticated = useSelector(state => state.auth.isAuthenticated);

  return (
    <StyledEngineProvider injectFirst>
      <ThemeProvider theme={darkTheme}>
        <div className="cds-header-alert">
          Planned for August 29, 2024, the CDS Connect Project will be transitioning into a temporary hiatus. This
          transition is part of establishing a new sustainment model for CDS Connect related to the recent Challenge
          Competition and Request for Information. The creation of new user accounts will continue routinely until
          09/12/2024. After that time, account creation may be delayed. Platform services are expected to remain
          available during this time but may experience occasional outages during this hiatus. For updates on the hiatus
          or to report an issue, please contact the AHRQ team at clinicaldecisionsupport@ahrq.hhs.gov.
        </div>
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

                {isAuthenticated ? <Logout /> : <Login />}
              </div>
            </div>
          </div>
        </header>
      </ThemeProvider>
    </StyledEngineProvider>
  );
};

export default CdsHeader;
