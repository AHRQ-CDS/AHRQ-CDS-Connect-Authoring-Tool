/* eslint-disable max-len */
import React, { Component } from 'react';

const ahrqLinks = [
  { name: 'AHRQ Home', link: 'https://www.ahrq.gov/' },
  { name: 'Contact AHRQ', link: 'https://www.ahrq.gov/contact/index.html' },
  { name: 'FAQ', link: 'https://info.ahrq.gov/' },
  { name: 'Topics', link: 'https://www.ahrq.gov/topics/index.html' },
  { name: 'Programs', link: 'https://www.ahrq.gov/professionals/index.html' },
  { name: 'Research', link: 'https://www.ahrq.gov/research/index.html' },
  { name: 'Data', link: 'https://www.ahrq.gov/data/main-redirect-page.html' },
  { name: 'Tools', link: 'https://www.ahrq.gov/data/tools-main-redirect-page.html' },
  { name: 'Funding & Grants', link: 'https://www.ahrq.gov/funding/index.html' },
  { name: 'News & Events', link: 'https://www.ahrq.gov/news/index.html' },
  { name: 'About', link: 'https://www.ahrq.gov/cpi/index.html' }
];

const cdsAuthoringToolLinks = [
  { name: 'CDS Authoring Tool Home', link: '/' },
  { name: 'Documentation', link: '' }, // TODO: add link
  { name: 'Request an Account', link: '' }, // TODO: add link
  { name: 'Feedback', link: 'mailto:cds-authoring-list@lists.mitre.org' }
];

const cdsToolLinks = [
  { name: 'CDS Home', link: 'https://cds.ahrq.gov/' },
  { name: 'Overview', link: 'https://cds.ahrq.gov/overview' },
  { name: 'CDS Connect', link: 'https://cds.ahrq.gov/cdsconnect' },
  { name: 'Learning Network', link: 'https://cds.ahrq.gov/learning-network' },
  { name: 'Evaluation', link: 'https://cds.ahrq.gov/evaluation' },
  { name: 'Funding Opportunities', link: 'https://cds.ahrq.gov/funding-opportunities' },
  { name: 'Resources', link: 'https://cds.ahrq.gov/resources' },
  { name: 'Contact Us', link: 'https://cds.ahrq.gov/contact-us' },
  { name: 'Disclaimer for CDS Connect', link: 'https://cds.ahrq.gov/disclaimer' },
  { name: 'Privacy Statement', link: 'https://cds.ahrq.gov/privacy' }
];

const siteLinks = [
  { name: 'Accessibility', link: 'http://www.ahrq.gov/policy/electronic/accessibility/index.html' },
  { name: 'Disclaimers', link: 'http://www.ahrq.gov/policy/electronic/disclaimers/index.html' },
  { name: 'EEO', link: 'http://www.ahrq.gov/policy/eeo/index.html' },
  { name: 'Electronic Policies', link: 'http://www.ahrq.gov/policy/electronic/about/policyix.html' },
  { name: 'FOIA', link: 'http://www.ahrq.gov/policy/foia/index.html' },
  { name: 'HHS Digital Strategy', link: 'http://www.hhs.gov/digitalstrategy' },
  { name: 'HHS Nondiscrimination Notice', link: 'https://www.hhs.gov/civil-rights/for-individuals/nondiscrimination/index.html' },
  { name: 'Inspector General', link: 'http://oig.hhs.gov/' },
  { name: 'Plain Writing Act', link: 'http://www.ahrq.gov/policy/electronic/plain-writing/index.html' },
  { name: 'Privacy Policy', link: 'http://www.ahrq.gov/policy/electronic/privacy/index.html' },
  { name: 'Viewers & Players', link: 'http://www.hhs.gov/plugins.html' }
];

export default class Footer extends Component {
  renderedNav = (links) => {
    if (links == null || links.length === 0) { return null; }

    return links.map((link, index) =>
      <li key={`link-${index}`}>
        <a href={link.link}>{link.name}</a>
      </li>
    );
  }

  render() {
    return (
      <div className="footer">
        <div className="footer__top">
          <div className="footer__top-wrapper row">
            <div className="footer__top-ahrq col-12 col-md-3">
              <nav className="nav" aria-labelledby="sitemap-ahrq">
                <div className="link-header" id="sitemap-ahrq">AHRQ Site</div>
                <ul>{this.renderedNav(ahrqLinks)}</ul>
              </nav>
            </div>

            <div className="footer__top-cds col-12 col-md-6">
              <nav className="nav" aria-labelledby="sitemap-cds-authoring-tool">
                <div className="link-header" id="sitemap-cds-authoring-tool">
                  <img src="/assets/images/home-icon.png" alt="cds authoring tool home" />
                  <a href="/" alt="home">CDS Authoring Tool Site</a>
                </div>

                <ul>{this.renderedNav(cdsAuthoringToolLinks)}</ul>
              </nav>

              <nav className="nav" aria-labelledby="sitemap-cds">
                <div className="link-header" id="sitemap-cds">CDS Site</div>
                <ul>{this.renderedNav(cdsToolLinks)}</ul>
              </nav>
            </div>

            <div className="footer__top-contact col-12 col-md-3">
              <div className="footer__top-contact-hhs">
                <a href="https://www.hhs.gov">U.S. Department of Health &amp; Human Services</a><br />
                <a href="https://www.whitehouse.gov">The White House</a><br />
                <a href="https://www.usa.gov">USA.gov: The U.S. Government's Official Web Portal</a>
              </div>

              <div className="footer__top-contact-ahrq">
                <strong>Agency for Healthcare Research and Quality</strong><br />
                5600 Fishers Lane<br />
                Rockville, MD 20857<br />
                <strong>Telephone:</strong> (301) 427-1364
              </div>
            </div>
          </div>
        </div>

        <div className="footer__bottom">
          <div className="footer__bottom-wrapper row">
            <div className="footer__bottom-sitelinks col-12 row">
              <div className="footer__bottom-sitelinks-ahrq col-12 col-md-1">
                <img src="/assets/images/ahrq-footer-logo.png" alt="footer logo" />
              </div>

              <div className="footer__bottom-sitelinks-links col-12 col-md-7">
                <nav className="nav" aria-labelledby="sitelinks">
                  <div className="visually-hidden" id="sitelinks">AHRQ Policy</div>
                  <ul>{this.renderedNav(siteLinks)}</ul>
                </nav>
              </div>

              <div className="footer__bottom-sitelinks-social col-12 col-md-4 row">
                <div className="social-title col-5">Get Social</div>

                <div className="addthis_horizontal_follow_toolbox social-links col-7">
                  <div id="atftbx" className="at-follow-tbx-element addthis-smartlayers addthis-animated at4-show">
                    <div className="addthis_toolbox addthis_default_style addthis_32x32_style">
                      <a className="at300b at-follow-btn ext" data-svc="facebook" data-svc-id="ahrq.gov" title="Follow on Facebook" href="http://www.facebook.com/ahrq.gov" target="_blank">
                        <div className="at4-icon-left at4-icon">
                          <span className="at-icon-wrapper facebook">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" title="Facebook" alt="Facebook" className="at-icon at-icon-facebook">
                              <g>
                                <path d="M21 6.144C20.656 6.096 19.472 6 18.097 6c-2.877 0-4.85 1.66-4.85 4.7v2.62H10v3.557h3.247V26h3.895v-9.123h3.234l.497-3.557h-3.73v-2.272c0-1.022.292-1.73 1.858-1.73h2V6.143z" fillRule="evenodd"></path>
                              </g>
                            </svg>
                          </span>
                          <span className="at_a11y">Follow on Facebook</span>
                        </div>
                        <span className="addthis_follow_label">Facebook</span>
                      </a>

                      <a className="at300b at-follow-btn ext" data-svc="twitter" data-svc-id="ahrqnews" title="Follow on Twitter" href="http://twitter.com/intent/follow?source=followbutton&amp;variant=1.0&amp;screen_name=ahrqnews" target="_blank">
                        <div className="at4-icon-left at4-icon">
                          <span className="at-icon-wrapper twitter">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" title="Twitter" alt="Twitter" className="at-icon at-icon-twitter">
                              <g>
                                <path d="M26.67 9.38c-.78.35-1.63.58-2.51.69.9-.54 1.6-1.4 1.92-2.42-.85.5-1.78.87-2.78 1.06a4.38 4.38 0 0 0-7.57 3c0 .34.04.68.11 1-3.64-.18-6.86-1.93-9.02-4.57-.38.65-.59 1.4-.59 2.2 0 1.52.77 2.86 1.95 3.64-.72-.02-1.39-.22-1.98-.55v.06c0 2.12 1.51 3.89 3.51 4.29a4.37 4.37 0 0 1-1.97.07c.56 1.74 2.17 3 4.09 3.04a8.82 8.82 0 0 1-5.44 1.87c-.35 0-.7-.02-1.04-.06a12.43 12.43 0 0 0 6.71 1.97c8.05 0 12.45-6.67 12.45-12.45 0-.19-.01-.38-.01-.57.84-.62 1.58-1.39 2.17-2.27z"></path>
                              </g>
                            </svg>
                          </span>
                          <span className="at_a11y">Follow on Twitter</span>
                        </div>
                        <span className="addthis_follow_label">Twitter</span>
                      </a>

                      <a className="at300b at-follow-btn ext" data-svc="youtube" data-svc-id="AHRQHealthTV?sub_confirmation=1" title="Follow on YouTube" href="http://www.youtube.com/user/AHRQHealthTV?sub_confirmation=1" target="_blank">
                        <div className="at4-icon-left at4-icon">
                          <span className="at-icon-wrapper youtube">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" title="YouTube" alt="YouTube" className="at-icon at-icon-youtube">
                              <g>
                                <path d="M13.73 18.974V12.57l5.945 3.212-5.944 3.192zm12.18-9.778c-.837-.908-1.775-.912-2.205-.965C20.625 8 16.007 8 16.007 8c-.01 0-4.628 0-7.708.23-.43.054-1.368.058-2.205.966-.66.692-.875 2.263-.875 2.263S5 13.303 5 15.15v1.728c0 1.845.22 3.69.22 3.69s.215 1.57.875 2.262c.837.908 1.936.88 2.426.975 1.76.175 7.482.23 7.482.15 0 .08 4.624.072 7.703-.16.43-.052 1.368-.057 2.205-.965.66-.69.875-2.262.875-2.262s.22-1.845.22-3.69v-1.73c0-1.844-.22-3.69-.22-3.69s-.215-1.57-.875-2.262z" fillRule="evenodd"></path>
                              </g>
                            </svg>
                          </span>
                          <span className="at_a11y">Follow on YouTube</span>
                        </div>
                        <span className="addthis_follow_label">YouTube</span>
                      </a>

                      <a className="at300b at-follow-btn ext" data-svc="linkedin" data-svc-id="agency-for-healthcare-research-and-quality" title="Follow on LinkedIn" href="http://www.linkedin.com/company/agency-for-healthcare-research-and-quality" target="_blank">
                        <div className="at4-icon-left at4-icon">
                          <span className="at-icon-wrapper linkedin">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" title="LinkedIn" alt="LinkedIn" className="at-icon at-icon-linkedin">
                              <g>
                                <path d="M25 24.967h-3.77v-5.902c0-1.407-.025-3.217-1.96-3.217-1.963 0-2.263 1.534-2.263 3.117v6.002H13.24V12.832h3.615v1.66h.053c.502-.955 1.733-1.96 3.567-1.96 3.82 0 4.525 2.512 4.525 5.78v6.655zM8.988 11.174a2.186 2.186 0 0 1 0-4.374 2.187 2.187 0 0 1 0 4.374zm-1.89 1.658h3.777v12.135H7.1V12.832z" fillRule="evenodd"></path>
                              </g>
                            </svg>
                          </span>
                          <span className="at_a11y">Follow on LinkedIn</span>
                        </div>
                        <span className="addthis_follow_label">LinkedIn</span>
                      </a>
                      <div className="atclear"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
