/* Polyfills for IE 11 */
import 'react-app-polyfill/ie11';
import 'react-app-polyfill/stable';

import React from 'react';
import { render } from 'react-dom';
import { BrowserRouter as Router } from 'react-router-dom';

import configureStore from './store/configureStore';
import Root from './containers/Root';
import './styles/App.scss';

/* setup redux store */
const store = configureStore();
window.store = store;

render(
  <Router basename={process.env.PUBLIC_URL}>
    <Root store={store} />
  </Router>,
  document.getElementById('root')
);
