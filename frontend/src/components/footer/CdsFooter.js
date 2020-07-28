import React from 'react';

const cdsToolLinks = [
  { name: 'CDS Home', link: 'https://cds.ahrq.gov/' },
  { name: 'CDS Connect', link: 'https://cds.ahrq.gov/cdsconnect' },
  { name: 'Evaluation', link: 'https://cds.ahrq.gov/evaluation' },
  { name: 'Resources', link: 'https://cds.ahrq.gov/resources' },
  { name: 'Disclaimer for CDS Connect', link: 'https://cds.ahrq.gov/disclaimer' },
  { name: 'Overview', link: 'https://cds.ahrq.gov/overview' },
  { name: 'Learning Network', link: 'https://cds.ahrq.gov/learning-network' },
  { name: 'Funding Opportunities', link: 'https://cds.ahrq.gov/funding-opportunities' },
  { name: 'Contact Us', link: 'https://cds.ahrq.gov/contact-us' },
  { name: 'Privacy Statement', link: 'https://cds.ahrq.gov/privacy' }
];

export default function CdsFooter() {
  return (
    <footer className="cds-footer">
      <div className="cds-footer__container">
        <div className="cds-footer__column">
          <div className="cds-footer__header">
            <img
              src={`${process.env.PUBLIC_URL}/assets/images/cds-connect-logo.png`}
              height="35"
              alt="CDS Connect"
            /> Clinical Decision Support (CDS)
          </div>

          <div className="cds-footer__tagline">
            Accelerating Evidence into Practice through CDS.
          </div>
        </div>

        <div className="cds-footer__column">
          <h6 className="cds-footer__header">CDS Site Links</h6>
          <div className="cds-footer__links">
            {cdsToolLinks.map(link =>
              <a href={link.link}>{link.name}</a>
            )}
          </div>
        </div>
      </div>
    </footer>
  );
}
