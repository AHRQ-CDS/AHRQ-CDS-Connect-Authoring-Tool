import React from 'react';
import { onVisitExternalLink, onVisitExternalForm } from '../utils/handlers';

export default () => (
  <div className="landing" id="maincontent">
    <div className="landing-wrapper">
      <p>
        The <strong>Clinical Decision Support (CDS) Authoring Tool</strong> is a component of the <strong>CDS
        Connect</strong> project.
      </p>

      <p>
        CDS Connect, sponsored by the <a href="https://www.ahrq.gov/">Agency for Healthcare Research and Quality</a>,
        aims to offer a systematic and replicable process for transforming patient-centered outcomes research (PCOR)
        findings into shareable standards-based CDS artifacts. CDS Connect provides a repository of CDS artifacts and
        will create a prototype infrastructure for sharing CDS across different health care settings and technologies.
      </p>

      <p>
        The CDS Authoring Tool, along with the <a href="https://cds.ahrq.gov/cdsconnect">CDS Connect Repository</a>,
        is designed to promote the creation and use of CDS in everyday clinical settings, connecting high-quality CDS to
        the U.S. healthcare community.  The CDS Authoring Tool provides an interface for creating CDS logic using
        simple forms and exporting it as <a target="_blank" rel="nofollow noopener noreferrer"
        onClick={onVisitExternalLink} href="http://www.hl7.org/implement/standards/product_brief.cfm?product_id=400">
        Health Level Seven (HL7) Clinical Quality Language (CQL) 1.2</a> <i className="fa fa-external-link"></i>{' '}
        artifacts using the <a target="_blank" rel="nofollow noopener noreferrer" onClick={onVisitExternalLink}
        href="http://hl7.org/fhir/DSTU2/index.html">HL7 Fast Healthcare Interoperability Resources (FHIR) DSTU 2</a>
        {' '}<i className="fa fa-external-link"></i> data model.
      </p>

      <p>
        The CDS Authoring Tool is released under an open source Apache 2.0 license and is available on GitHub at:{' '}
        <a target="_blank" rel="nofollow noopener noreferrer" onClick={onVisitExternalLink}
        href="https://github.com/ahrq-cds/ahrq-cds-connect-authoring-tool">https://github.com/ahrq-cds/ahrq-cds-connect-authoring-tool</a>
        {' '}<i className="fa fa-external-link"></i>.
      </p>

      <p>
        <img
          className="img-fluid img-thumbnail rounded mx-auto d-block"
          alt="screenshot of authoring a CDS artifact about statin use"
          src={`${process.env.PUBLIC_URL}/assets/images/statin-use-screenshot.png`} />
      </p>

      <p>
        The CDS Authoring Tool is currently under development and released as a beta capability. Although the
        development team strives to release bug-free code, beta software typically exhibits minor bugs and other
        limitations that would not be expected in production level software. Users should be aware of the following
        known limitations in this release of the authoring tool:
      </p>
      <ul>
        <li>a limited set of logical capabilities, primarily focused on inclusion/exclusion logic</li>
        <li>support for only rule-based CDS, providing string-based recommendation statements</li>
      </ul>
      <p>
        The CDS Connect team appreciates your <a href="https://cds.ahrq.gov/contact-us"
        onClick={onVisitExternalForm}>feedback</a> and participation to help shape the CDS Authoring Tool as it moves
        forward.
      </p>
    </div>
  </div>
);
