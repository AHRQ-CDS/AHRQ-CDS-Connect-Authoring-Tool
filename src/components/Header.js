import React from 'react';

const Header = () => {
  return (
    <header className="header">
      <div className="header__hhsbanner">
        <a href="https://www.hhs.gov/">
          <img src="/themes/custom/cds_connect/images/hhs-logo-small-graybg.png"
               title="HHS--US Department of Health and Human Services"
               alt="HHS--US Department of Health and Human Services" />
          <span className="header__hhstext">U.S. Department of Health &amp; Human Services</span>
        </a>

        <div className="header__links">
          <span><a href="https://www.ahrq.gov/">AHRQ Home</a></span>
          <span><a href="https://www.ahrq.gov/cpi/about/index.html">About AHRQ</a></span>
          <span><a href="https://www.ahrq.gov/contact/index.html">Contact AHRQ</a></span>
          <span><a href="https://info.ahrq.gov/">FAQ</a></span>
          <span>
            <a href="http://subscriptions.ahrq.gov/service/multi_subscribe.html?code=USAHRQ">
              <img src="/themes/custom/cds_connect/images/primary-mail-list-icon.png" alt="mail icon" /> Email Updates
            </a>
          </span>
        </div>
      </div>

      <div className="header__ahrqbanner">
        <a href="http://www.ahrq.gov/index.html" title="AHRQ Home" rel="home" id="logo">
          <img src="/themes/custom/cds_connect/images/ahrq-logo.png"
               title="AHRQ--Agency for Healthcare Research and Quality: Advancing Excellence in Health Care"
               alt="AHRQ--Agency for Healthcare Research and Quality: Advancing Excellence in Health Care" />
        </a>
      </div>
    </header>
  );
};

Header.displayName = 'Header';

export default Header;
