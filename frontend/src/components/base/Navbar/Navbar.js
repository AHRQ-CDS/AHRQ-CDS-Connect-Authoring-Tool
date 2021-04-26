import React from 'react';
import PropTypes from 'prop-types';
import { NavLink, useLocation } from 'react-router-dom';
import { Tab, Tabs } from '@material-ui/core';
import clsx from 'clsx';

import { onVisitExternalForm } from 'utils/handlers';
import { useAccessibilityStyles, useSpacingStyles } from 'styles/hooks';
import useStyles from './styles';

const a11yProps = index => ({
  id: `tab-${index}`,
  'aria-controls': `tabpanel-${index}`
});

const tabNavigationValue = ({ pathname, isAuthenticated }) => {
  switch (pathname) {
    case '/':
    case '/documentation':
      return pathname;
    case '/artifacts':
    case '/build':
    case '/testing':
      return isAuthenticated ? pathname : false;
    default:
      return false;
  }
};

const Navtab = ({ index, isExternal = false, ...props }, ref) => {
  const styles = useStyles();
  const linkProps = {
    [isExternal ? 'href' : 'to']: props.value
  };

  return (
    <Tab
      className={styles.tab}
      component={isExternal ? 'a' : NavLink}
      onClick={isExternal ? onVisitExternalForm : null}
      {...a11yProps(index)}
      {...props}
      {...linkProps}
    />
  );
};

const Navbar = ({ isAuthenticated }) => {
  const styles = useStyles();
  const spacingStyles = useSpacingStyles();
  const accessibilityStyles = useAccessibilityStyles();
  const { pathname } = useLocation();

  return (
    <div className={spacingStyles.globalPadding}>
      <div className={accessibilityStyles.srOnly} id="cds-main-navigation">
        Main navigation
      </div>

      <Tabs
        value={tabNavigationValue({ pathname, isAuthenticated })}
        className={clsx(styles.tabs, spacingStyles.fullBleed)}
        TabIndicatorProps={{ style: { display: 'none' } }}
      >
        <Navtab label="Home" index={0} value="/" exact />

        {isAuthenticated && [
          <Navtab key={1} label="Artifacts" index={1} value="/artifacts" />,
          <Navtab key={2} label="Workspace" index={2} value="/build" />,
          <Navtab key={3} label="Testing" index={3} value="/testing" />
        ]}

        <Navtab label="Documentation" index={4} value="/documentation" />

        {!isAuthenticated && (
          <Navtab label="Sign Up" index={5} value="https://cds.ahrq.gov/form/cds-authoring-tool-sign-up" isExternal />
        )}

        <Navtab label="Contact Us" index={6} value="https://cds.ahrq.gov/contact-us" isExternal />
      </Tabs>
    </div>
  );
};

Navbar.propTypes = {
  isAuthenticated: PropTypes.bool.isRequired
};

export default Navbar;
