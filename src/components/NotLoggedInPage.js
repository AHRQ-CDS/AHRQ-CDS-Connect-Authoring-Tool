import React from 'react';

export default ({ location }) => (
  <div>
    <h3>You must be logged in to access <code>{location.pathname}</code></h3>
  </div>
);
