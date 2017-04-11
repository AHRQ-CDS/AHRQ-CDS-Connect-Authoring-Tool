import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import createBrowserHistory from 'history/createBrowserHistory';
import axe from 'react-axe';
import App from './App';
import Navbar from './components/Navbar';
import AuthorPage from './components/AuthorPage';
import BuilderPage from './components/BuilderPage';

const history = createBrowserHistory();

// log accessibility errors to the console.
// works in Chrome, with limited functionality in Safari and Firefox
if (process.env.NODE_ENV === 'development') {
  axe(React, ReactDOM, 1000);
}

ReactDOM.render(
  <Router history={history}>
    <div>
      <Navbar />
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
  document.getElementById('root'),
);
