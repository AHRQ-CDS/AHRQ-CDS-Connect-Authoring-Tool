import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import createBrowserHistory from 'history/createBrowserHistory';
import App from './App';
import Navbar from './components/Navbar';
import Artifact from './components/artifact/Artifact';
import BuilderPage from './components/builder/BuilderPage';
import NoMatch from './components/NotFoundPage';

const history = createBrowserHistory();

export default () => (
  <Router history={history}>
    <div>
      <Navbar />
      <main id="maincontent">
        <Switch>
          <Route path='/build/:id' component={BuilderPage} />
          <Route path='/build' component={BuilderPage} />
          <Route path='/artifacts' component={Artifact} />
          <Route exact path='/' component={App} />
          <Route component={NoMatch}/>
        </Switch>
      </main>
    </div>
  </Router>
);
