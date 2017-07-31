/* eslint-disable import/first */
import React from 'react';
import { NavLink } from 'react-router-dom';
import '../node_modules/font-awesome/css/font-awesome.css';
import './styles/App.css';
import 'react-select/dist/react-select.css';

export default () => (
  <div>
    <h2>Welcome to the Clinical Decision Support Authoring Tool</h2>
    <p>Build and export your first Clinicial Decision Support artifact by clicking <NavLink to="/build">here</NavLink>. </p>

    <h3>About</h3>
    <p>The <strong>CDS Authoring Tool</strong> is a key part of CDS Connect, a project sponsored by the <a href="https://www.ahrq.gov/">Agency for Healthcare Research and Quality</a> that seeks to generate a systematic and replicable process for transforming patient-centered outcomes research (PCOR) findings into shareable and standards-based clinical decision support (CDS) electronic artifacts.</p>
    <p>It is hoped that this authoring tool, along with the <a href="https://cdsconnect.ahrqdev.org/">CDS Connect Repository</a>, will promote the creation and use of CDS in everyday clinical settings, and that it will serve as the linchpin for connecting high-quality CDS to the U.S. healthcare community.</p>
    <p>As an alpha capability, the CDS Authoring Tool is targeted to a select audience for internal testing and validation. It lacks many of the features that would be required for the final production version. As we move to beta, the target audience will need to be expanded to a broader set of users for testing, validation, and acceptance.</p>
  </div>
);
