import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import createBrowserHistory from 'history/createBrowserHistory';
import App from './App';
import Navbar from './components/Navbar';
import AuthorPage from './components/AuthorPage';
import BuilderPage from './components/BuilderPage';
import NoMatch from './components/NotFoundPage';

const history = createBrowserHistory();

export default () => (
  <Router history={history}>
    <div>
      <Navbar />
      <main>
        <Switch>
          <Route path='/build/:group' component={BuilderPage} />
          <Route path='/build' component={BuilderPage} />
          <Route path='/author' component={AuthorPage} />
          <Route exact path='/' component={App} />
          <Route component={NoMatch}/>
        </Switch>
      </main>
    </div>
  </Router>
);
