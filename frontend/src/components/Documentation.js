import React from 'react';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import UserGuide from './UserGuide';
import DataTypeGuide from './DataTypeGuide';

const Documentation = () => (
  <div className="builder">
    <div className="builder-wrapper">
      <section className="builder__canvas">
        <Tabs>
          <TabList aria-label="Documentation Tabs">
            <Tab>User Guide</Tab>
            <Tab>Data Types</Tab>
          </TabList>

          <div className="tab-panel-container">
            <TabPanel>
              <UserGuide/>
            </TabPanel>
            <TabPanel>
              <DataTypeGuide/>
            </TabPanel>
          </div>
        </Tabs>
      </section>
    </div>
  </div>
);

export default Documentation;
