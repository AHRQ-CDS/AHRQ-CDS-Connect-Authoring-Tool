import React from 'react';

export default function AhrqHeader() {
  return (
    <div className="ahrq">
      <div className="usa-banner usa-banner-bg">
        <div className="usa-accordion usa-accordion-text-color">
          <header className="usa-banner__header">
            <div className="row no-gutters row-mobile-offset">
              <div className="col-sm-auto col-lg-auto offset-lg-1 img-icon">
                <img
                  className="usa-banner__header-flag"
                  src={`${process.env.PUBLIC_URL}/assets/images/us_flag_small.png`}
                  alt="U.S. flag"
                />
              </div>

              <div className="col-sm-auto col-lg-auto banner-hhs img-icon">
                <img
                  className="usa-banner__header-flag"
                  src={`${process.env.PUBLIC_URL}/assets/images/logo-HHSmini.png`}
                  alt="Health and Human Services Logo"
                />
              </div>

              <div className="col-sm-8 col-lg-8 txt-gov-banner">
                <p className="usa-banner__header-text">
                  <a href="https://www.hhs.gov/">
                    An official website of the Department of Health &amp; Human Services
                  </a>
                </p>
              </div>
            </div>
          </header>
        </div>
      </div>

      <div role="main" className="container-fluid js-quickedit-main-content">
        <div className="row">
          <header id="primary-header" className="header row-side-margins mobile-row-side-margins" role="heading">
            <div className="col-md-12">
              <div className="primary-header-wrapper">
                <div className="row">
                  <div className="col-xs-12 col-sm-12 col-md-12 col-lg-3 col-xl-3">
                    <div className="logo-ahrq">
                      <a href="https://www.ahrq.gov">
                        <img
                          src={`${process.env.PUBLIC_URL}/assets/images/logo-ahrq.png`}
                          alt="AHRQ: Agency for Healthcare Research and Quality"
                        />
                      </a>
                    </div>
                  </div>

                  <div className="d-xs-none d-sm-none d-md-none d-lg-block col-lg-9 d-xl-block col-xl-9">
                    <div id="utility-nav">
                      <ul className="clearfix">
                        <li className="first">
                          <a href="https://search.ahrq.gov/" target="_blank" rel="noopener noreferrer">
                            Search All AHRQ Sites
                          </a>
                        </li>

                        <li>
                          <a href="https://www.ahrq.gov/cpi/about/careers/index.html" target="_blank" rel="noopener noreferrer">
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
                          <a href="https://info.ahrq.gov/" target="_blank" rel="noopener noreferrer">FAQs</a>
                        </li>

                        <li>
                          <a
                            href="https://subscriptions.ahrq.gov/accounts/USAHRQ/subscriber/new"
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <img
                              src={`${process.env.PUBLIC_URL}/assets/images/envelope-regular.png`}
                              width="18"
                              height="18"
                              className="utility-envelope"
                              alt=""
                            /> Email Updates
                          </a>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </header>
        </div>
      </div>
    </div>
  );
}
