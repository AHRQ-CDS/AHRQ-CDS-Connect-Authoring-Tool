import React, { Fragment, Component } from 'react';
import { Helmet } from 'react-helmet';
import PropTypes from 'prop-types';

export default class Analytics extends Component {
  render() {
    const { gtmKey, dapURL } = this.props;
    if (!gtmKey || !dapURL) {
      return null;
    }

    return (
      <Fragment>
        <Helmet>
          {/* Google Tag Manager */}
          <script type="text/javascript">{`
          (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
          new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
          j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
          'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
          })(window,document,'script','dataLayer','${gtmKey}');
          `}</script>
          {/* End Google Tag Manager */}
          {/* DAP Analytics */}
          <script type="text/javascript" src={dapURL} id="_fed_an_ua_tag"></script>
          {/* End DAP Analytics */}
        </Helmet>
        <noscript>
          <iframe src={`https://www.googletagmanager.com/ns.html?id=${gtmKey}`}
                  height="0"
                  width="0"
                  title="Google Tag Manager"
                  style={{ display: 'none', visibility: 'hidden' }}>
          </iframe>
        </noscript>
      </Fragment>
    );
  }
}

Analytics.propTypes = {
  gtmKey: PropTypes.string,
  dapURL: PropTypes.string
};
