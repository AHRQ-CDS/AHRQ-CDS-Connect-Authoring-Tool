import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import createBrowserHistory from 'history/createBrowserHistory';

import App from './App';
import Landing from './components/Landing';
import BuilderPage from './components/builder/BuilderPage';
import Artifact from './components/artifact/Artifact';
import NoMatch from './components/NotFoundPage';

const history = createBrowserHistory();

export default () => (
  <Router history={history}>
    <App>
      <Route exact path="/" component={Landing} />
      <Route path='/build/:id' component={BuilderPage} />
      <Route path='/build' component={BuilderPage} />
      <Route path='/artifacts' component={Artifact} />
      <Route component={NoMatch} />
    </App>
  </Router>
);
