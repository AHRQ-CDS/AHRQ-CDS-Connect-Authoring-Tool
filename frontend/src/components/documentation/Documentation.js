import React, { useState } from 'react';
import { AppBar, Tabs, Tab } from '@material-ui/core';
import clsx from 'clsx';

import { DataTypeGuide, UserGuide } from '.';
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

const Documentation = () => {
  const styles = useStyles();
  const spacingStyles = useSpacingStyles();
  const [value, setValue] = useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <div className="documentation">
      <div className={spacingStyles.globalPadding}>
        <div className={clsx(styles.tabBar, spacingStyles.fullBleed)}>
          <AppBar position="static">
            <Tabs value={value} onChange={handleChange} aria-label="documentation tabs" variant="fullWidth">
              <Tab className={styles.tab} label="User Guide" {...a11yProps(0)} />
              <Tab className={styles.tab} label="Data Types" {...a11yProps(1)} />
            </Tabs>
          </AppBar>
        </div>

        <TabPanel value={value} index={0}>
          <UserGuide />
        </TabPanel>

        <TabPanel value={value} index={1}>
          <DataTypeGuide />
        </TabPanel>
      </div>
    </div>
  );
};

export default Documentation;
