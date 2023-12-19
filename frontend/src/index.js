import 'react-app-polyfill/stable';

import React from 'react';
import { render } from 'react-dom';
import { BrowserRouter as Router } from 'react-router-dom';

import configureStore from './store/configureStore';
import Root from './containers/Root';
import '@fontsource/open-sans/latin.css';
import '@fontsource/open-sans/latin-300-italic.css';
import '@fontsource/open-sans/latin-400-italic.css';
import '@fontsource/open-sans/latin-600-italic.css';
import '@fontsource/open-sans/latin-700-italic.css';
import '@fontsource/open-sans/latin-800-italic.css';
import './styles/App.scss';

// setup redux store
const store = configureStore();
window.store = store;

render(
  <Router basename={process.env.PUBLIC_URL}>
    <Root store={store} />
  </Router>,
  document.getElementById('root')
);
