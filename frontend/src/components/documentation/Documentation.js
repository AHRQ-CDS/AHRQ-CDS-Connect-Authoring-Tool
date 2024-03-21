import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { AppBar, Tabs, Tab } from '@mui/material';
import clsx from 'clsx';

import DataTypeGuide from './DataTypeGuide';
import UserGuide from './UserGuide';
import TermsAndConditions from './TermsAndConditions';
import Tutorial from './Tutorial';
import { useSpacingStyles } from 'styles/hooks';
import useStyles from './styles';

const TabPanel = ({ children, value, index, ...props }) => (
  <div
    role="tabpanel"
    hidden={value !== index}
    id={`documentation-tabpanel-${index}`}
    aria-labelledby={`documentation-tab-${index}`}
    {...props}
  >
    {value === index && children}
  </div>
);

const a11yProps = index => ({
  id: `tab-${index}`,
  'aria-controls': `tabpanel-${index}`
});

const Documentation = ({ activeTab = 0 }) => {
  const styles = useStyles();
  const spacingStyles = useSpacingStyles();
  const [value, setValue] = useState(activeTab);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <div className="documentation">
      <div className={spacingStyles.globalPadding}>
        <div className={clsx(styles.tabBar, spacingStyles.fullBleed)}>
          <AppBar position="static">
            <Tabs
              indicatorColor="secondary"
              textColor="inherit"
              value={value}
              onChange={handleChange}
              aria-label="documentation tabs"
              variant="fullWidth"
            >
              <Tab
                className={styles.tab}
                component={NavLink}
                to="/documentation/userguide"
                label="User Guide"
                {...a11yProps(0)}
              />
              <Tab
                className={styles.tab}
                component={NavLink}
                to="/documentation/tutorial"
                label="Tutorial"
                {...a11yProps(1)}
              />
              <Tab
                className={styles.tab}
                component={NavLink}
                to="/documentation/datatypes"
                label="Data Types"
                {...a11yProps(2)}
              />
              <Tab
                className={styles.tab}
                component={NavLink}
                to="/documentation/terms"
                label="Terms & Conditions"
                {...a11yProps(3)}
              />
            </Tabs>
          </AppBar>
        </div>

        <TabPanel value={value} index={0}>
          <UserGuide />
        </TabPanel>

        <TabPanel value={value} index={1}>
          <Tutorial />
        </TabPanel>

        <TabPanel value={value} index={2}>
          <DataTypeGuide />
        </TabPanel>

        <TabPanel value={value} index={3}>
          <TermsAndConditions />
        </TabPanel>
      </div>
    </div>
  );
};

export default Documentation;
