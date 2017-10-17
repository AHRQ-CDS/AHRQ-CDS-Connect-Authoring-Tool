import React from 'react';

export default ({ location }) => (
  <div className="notFound" id="maincontent">
    <div className="notFound-wrapper">
      <h3>No match for <code>{location.pathname}</code></h3>
    </div>
  </div>
);
