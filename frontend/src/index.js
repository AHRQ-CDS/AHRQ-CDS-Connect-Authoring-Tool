import React from 'react';
import { render } from 'react-dom';
import { BrowserRouter as Router } from 'react-router-dom';
import ReactModal from 'react-modal';
import 'react-select/dist/react-select.css';

/* Polyfills for IE 11 */
import 'core-js/fn/array/find';
import 'core-js/fn/array/find-index';
import 'core-js/fn/array/from';
import 'core-js/fn/array/includes';
import 'core-js/fn/function/bind';
import 'core-js/fn/number/is-nan';
import 'core-js/fn/number/is-integer';
import 'core-js/fn/string/includes';
import 'core-js/fn/set';

import configureStore from './store/configureStore';
import Root from './containers/Root';
import '../node_modules/font-awesome/css/font-awesome.css';
import './styles/App.css';

/* setup redux store */
const store = configureStore();
window.store = store;

/* set modal root */
ReactModal.setAppElement('#root');

render(
  <Router basename={process.env.PUBLIC_URL}>
    <Root store={store} />
  </Router>,
  document.getElementById('root')
);
