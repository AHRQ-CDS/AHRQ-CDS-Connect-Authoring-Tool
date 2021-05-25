import React from 'react';

export default function Footer() {
  return (
    <div className="ahrq">
      <footer>
        <div className="row row-side-margins hide-on-desktop">
          <div className="col-sm-12" id="top-button-container">
            <a href="#maincontent" id="top-button">
              Back to Top
              <img
                alt="Go back to top"
                height="25"
                src={`${process.env.PUBLIC_URL}/assets/images/chevron-circle-up-solid.png`}
                width="25"
              />
            </a>
          </div>
        </div>

        <div id="footer1">
          <div className="row">
            <div className="col-md-12 side-row-margins">
              <div className="f1-div-width div-float init-pad">
                <h3>Connect With Us</h3>

                <a href="http://www.facebook.com/ahrq.gov" target="_blank" rel="noopener noreferrer">
                  <img
                    src={`${process.env.PUBLIC_URL}/assets/images/facebook-f-brands.png`}
                    height="35"
                    alt="Facebook"
                  />
                </a>

                <a href="https://twitter.com/ahrqnews" target="_blank" rel="noopener noreferrer">
                  <img
                    src={`${process.env.PUBLIC_URL}/assets/images/twitter-brands.png`}
                    className="img-spacing"
                    height="35"
                    alt="Twitter"
                  />
                </a>

                <a href="http://www.youtube.com/user/AHRQHealthTV" target="_blank" rel="noopener noreferrer">
                  <img
                    src={`${process.env.PUBLIC_URL}/assets/images/youtube-brands.png`}
                    className="img-spacing"
                    height="35"
                    alt="You Tube"
                  />
                </a>

                <a
                  href="http://www.linkedin.com/company/agency-for-healthcare-research-and-quality"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <img
                    src={`${process.env.PUBLIC_URL}/assets/images/linkedin-in-brands.png`}
                    className="img-spacing"
                    height="35"
                    alt="LinkedIn"
                  />
                </a>
              </div>

              <div className="f1-div-width div-float">
                <h3 className="header-mobile-top-spacing">Sign up for Email Updates</h3>

                <p className="primary-small email">
                  To sign up for updates or to access your subscriber preferences, please enter your email address
                  below.
                </p>

                <form
                  id="GD-snippet-form"
                  action="https://subscriptions.ahrq.gov/accounts/USAHRQ/subscribers/qualify"
                  acceptCharset="UTF-8"
                  method="post"
                >
                  <input name="utf8" type="hidden" value="✓" />

                  <div role="search">
                    <label className="usa-sr-only" htmlFor="email">
                      Search
                    </label>
                    <input className="usa-input email-input" id="email" type="text" name="email" />
                    <input className="usa-button email-update-button" type="submit" name="commit" value="Sign Up" />
                  </div>
                </form>
              </div>

              <div className="f1-div-width div-float">
                <address>
                  <h3 className="header-mobile-top-spacing">Agency for Healthcare Research and Quality</h3>
                  <p className="primary-regular">
                    5600 Fishers Lane
                    <br />
                    Rockville, MD 20857
                    <br />
                    Telephone: (301) 427-1364
                  </p>
                </address>
              </div>
            </div>
          </div>
        </div>

        <div id="footer2">
          <div className="row">
            <div className="col-md-12 side-row-margins init-pad">
              <div className="left-div div-width-partial left-margin">
                <ul className="clearfix">
                  <li className="first">
                    <a
                      href="https://www.ahrq.gov/cpi/about/careers/index.html"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Careers
                    </a>
                  </li>

                  <li>
                    <a href="https://www.ahrq.gov/contact/index.html" target="_blank" rel="noopener noreferrer">
                      Contact Us
                    </a>
                  </li>

                  <li>
                    <a
                      href="https://www.ahrq.gov/topics/informacion-en-espanol/index.html"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Español
                    </a>
                  </li>

                  <li className="last">
                    <a href="https://info.ahrq.gov/" target="_blank" rel="noopener noreferrer">
                      FAQs
                    </a>
                  </li>
                </ul>
              </div>

              <div className="left-div div-width-partial">
                <ul className="clearfix">
                  <li className="first">
                    <a
                      href="https://www.ahrq.gov/policy/electronic/accessibility/index.html"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Accessibility
                    </a>
                  </li>

                  <li>
                    <a
                      href="https://www.ahrq.gov/policy/electronic/disclaimers/index.html"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Disclaimers
                    </a>
                  </li>

                  <li>
                    <a href="https://www.ahrq.gov/policy/eeo/index.html" target="_blank" rel="noopener noreferrer">
                      EEO
                    </a>
                  </li>

                  <li>
                    <a
                      href="https://www.ahrq.gov/policy/electronic/about/policyix.html"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Electronic Policies
                    </a>
                  </li>
                </ul>
              </div>

              <div className="left-div div-width-partial">
                <ul>
                  <li>
                    <a href="https://www.ahrq.gov/policy/foia/index.html" target="_blank" rel="noopener noreferrer">
                      FOIA
                    </a>
                  </li>

                  <li>
                    <a href="http://www.hhs.gov/web/governance/strategy.html" target="_blank" rel="noopener noreferrer">
                      HHS Digital Strategy
                    </a>
                  </li>

                  <li>
                    <a
                      href="https://www.hhs.gov/civil-rights/for-individuals/nondiscrimination/index.html"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      HHS Nondiscrimination Notice
                    </a>
                  </li>

                  <li>
                    <a href="https://oig.hhs.gov/" target="_blank" rel="noopener noreferrer">
                      Inspector General
                    </a>
                  </li>
                </ul>
              </div>

              <div className="left-div div-width-partial">
                <ul>
                  <li>
                    <a
                      href="https://www.ahrq.gov/policy/electronic/plain-writing/index.html"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Plain Writing Act
                    </a>
                  </li>

                  <li>
                    <a
                      href="https://www.ahrq.gov/policy/electronic/privacy/index.html"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Privacy Policy
                    </a>
                  </li>

                  <li className="last">
                    <a href="http://www.hhs.gov/plugins.html" target="_blank" rel="noopener noreferrer">
                      Viewers &amp; Players
                    </a>
                  </li>
                </ul>
              </div>

              <div className="left-div div-width-full footer-border">
                <ul>
                  <li>
                    <a href="http://www.hhs.gov/" target="_blank" rel="noopener noreferrer">
                      U.S. Department of Health &amp; Human Services
                    </a>
                  </li>

                  <li>
                    <a href="http://www.whitehouse.gov/" target="_blank" rel="noopener noreferrer">
                      The White House
                    </a>
                  </li>

                  <li>
                    <a href="http://www.usa.gov/" target="_blank" rel="noopener noreferrer">
                      USA.gov
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
