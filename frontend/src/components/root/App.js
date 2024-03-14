import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { getCurrentUser } from 'actions/auth';

import { Analytics, Navbar } from 'components/base';
import CdsHeader from 'components/header/CdsHeader';
import AhrqHeader from 'components/header/AhrqHeader';
import CdsFooter from 'components/footer/CdsFooter';
import AhrqFooter from 'components/footer/AhrqFooter';

const App = ({ children }) => {
  const isAuthenticated = useSelector(state => state.auth.isAuthenticated);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getCurrentUser());
  }, [dispatch]);

  return (
    <div className="app">
      <a className="skiplink" href="#maincontent">
        Skip to main content
      </a>
      <Analytics gtmKey={process.env.REACT_APP_GTM_KEY} dapURL={process.env.REACT_APP_DAP_URL} />
      <AhrqHeader />
      <CdsHeader />
      <Navbar isAuthenticated={isAuthenticated} />
      {children}
      <CdsFooter />
      <AhrqFooter />
    </div>
  );
};

export default App;
