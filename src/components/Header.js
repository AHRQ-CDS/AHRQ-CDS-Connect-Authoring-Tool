import React from 'react';

export default () => (
  <header className="header">
    <div className="header__hhsbanner columns is-mobile">
      <a href="https://www.hhs.gov/" className="header__hhsbannerlink column">
        <img src="/assets/images/hhs-logo.png"
             title="HHS--US Department of Health and Human Services"
             alt="HHS--US Department of Health and Human Services" />
        <span className="header__hhstext">U.S. Department of Health &amp; Human Services</span>
      </a>

      <div className="header__links column">
        <span><a href="https://www.ahrq.gov/">AHRQ Home</a></span>
        <span><a href="https://www.ahrq.gov/cpi/about/index.html">About AHRQ</a></span>
        <span><a href="https://www.ahrq.gov/contact/index.html">Contact AHRQ</a></span>
        <span><a href="https://info.ahrq.gov/">FAQ</a></span>
        <span>
          <a href="http://subscriptions.ahrq.gov/service/multi_subscribe.html?code=USAHRQ">
            <img src="/assets/images/primary-mail-list-icon.png" alt="mail icon" /> Email Updates
          </a>
        </span>
      </div>
    </div>

    <div className="header__ahrqbanner">
      <a href="http://www.ahrq.gov/index.html" title="AHRQ Home" rel="home" id="logo">
        <img src="/assets/images/ahrq-logo.png"
             title="AHRQ--Agency for Healthcare Research and Quality: Advancing Excellence in Health Care"
             alt="AHRQ--Agency for Healthcare Research and Quality: Advancing Excellence in Health Care" />
      </a>
    </div>

    <div className="header__stripe-container">
      <div className="header__stripe header__stripe--purple"></div>
      <div className="header__stripe header__stripe--light-blue"></div>
      <div className="header__stripe header__stripe--orange"></div>
      <div className="header__stripe header__stripe--green"></div>
      <div className="header__stripe header__stripe--dark-blue"></div>
    </div>
  </header>
);
