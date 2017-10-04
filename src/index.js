import React from 'react';
import { render } from 'react-dom';
import Modal from 'react-modal';
import Routes from './routes';

// Override overlay background color for all modals in app
Modal.defaultStyles.overlay.backgroundColor = 'rgba(100,100,100,0.75)';

// log accessibility errors to the console.
// works in Chrome, with limited functionality in Safari and Firefox
if (process.env.NODE_ENV === 'development') {
  // axe(React, ReactDOM, 1000);
}

render(
  <Routes />,
  document.getElementById('root'),
);
