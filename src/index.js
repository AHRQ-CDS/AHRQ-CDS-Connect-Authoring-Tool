import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import createBrowserHistory from 'history/createBrowserHistory';

import App from './App';
import Navbar from './components/Navbar';
import AuthorPage from './components/AuthorPage';
import BuilderPage from './components/BuilderPage';

const history = createBrowserHistory();

ReactDOM.render(
  <Router history={history}>
    <div>
      <Navbar />
      <main>
        <Route exact path='/' component={App} />
        <Route exact path='/author' component={AuthorPage} />
        <Route exact path='/build' component={BuilderPage} />
      </main>
    </div>
  </Router>,
  document.getElementById('root')
);
