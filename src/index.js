import React from 'react';
import { render } from 'react-dom';
import { BrowserRouter as Router } from 'react-router-dom';
import 'react-select/dist/react-select.css';

import configureStore from './store/configureStore';
import Root from './containers/Root';
import '../node_modules/font-awesome/css/font-awesome.css';
import './styles/App.css';

const store = configureStore();

window.store = store;

render(
  <Router basename={process.env.PUBLIC_URL}>
    <Root store={store} />
  </Router>,
  document.getElementById('root')
);
