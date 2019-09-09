import React from 'react';
import PropTypes from 'prop-types';
import { Provider } from 'react-redux';
import { Route, Switch } from 'react-router-dom';

import PrivateRoute from './PrivateRoute';
import App from './App';
import Landing from '../containers/Landing';
import BuilderContainer from '../containers/Builder';
import Artifact from '../containers/Artifact';
import Testing from '../containers/Testing';
import Documentation from '../components/Documentation';
import NoMatch from '../components/NotFoundPage';

const Root = (props) => {
  const { store } = props;

  return (
    <Provider store={store}>
      <App>
        <Switch>
          <Route exact path="/" component={Landing} />
          <PrivateRoute path='/build/:id' component={BuilderContainer} />
          <PrivateRoute path='/build' component={BuilderContainer} />
          <PrivateRoute path='/artifacts' component={Artifact} />
          <PrivateRoute path='/testing' component={Testing} />
          <Route path='/documentation' component={Documentation} />
          <Route component={NoMatch} />
        </Switch>
      </App>
    </Provider>
  );
};

Root.propTypes = {
  store: PropTypes.object.isRequired
};

Root.displayName = 'Root';

export default Root;
