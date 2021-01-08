import React from 'react';
import { useSelector } from 'react-redux';
import { ThemeProvider } from '@material-ui/core/styles';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLink } from '@fortawesome/free-solid-svg-icons';

import { Login, Logout } from 'components/auth';
import darkTheme from 'styles/theme';

const CdsHeader = () => {
  const isAuthenticated = useSelector(state => state.auth.isAuthenticated);

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

              {isAuthenticated ? <Logout /> : <Login />}
            </div>
          </div>
        </div>
      </header>
    </ThemeProvider>
  );
};

export default CdsHeader;
