import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import createBrowserHistory from 'history/createBrowserHistory';

import App from './App';
import Header from './components/Header';
import AuthorPage from './components/AuthorPage';
import BuilderPage from './components/BuilderPage';

const history = createBrowserHistory();

ReactDOM.render(
  <Router history={history}>
    <div>
      <Header />
      <main>
        <Switch>
          <Route path='/build/:group' component={BuilderPage} />
          <Route path='/build' component={BuilderPage} />
        </Switch>
        <Route path='/author' component={AuthorPage} />
        <Route exact path='/' component={App} />
      </main>
    </div>
  </Router>,
  document.getElementById('root')
);
