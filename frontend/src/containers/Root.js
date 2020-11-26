import React from 'react';
import PropTypes from 'prop-types';
import { Provider } from 'react-redux';
import { Route, Switch, Redirect } from 'react-router-dom';
import { ThemeProvider } from '@material-ui/core/styles';

import PrivateRoute from './PrivateRoute';
import App from './App';
import Landing from 'containers/Landing';
import BuilderContainer from 'containers/Builder';
import Artifact from 'containers/Artifact';
import Testing from 'containers/Testing';
import Documentation from 'components/Documentation';
import NoMatch from 'components/NotFoundPage';
import lightTheme from 'styles/theme';

const Root = (props) => {
  const { store } = props;

  return (
    <Provider store={store}>
      <ThemeProvider theme={lightTheme}>
        <App>
          <Switch>
            <Route exact path="/" component={Landing} />
            <PrivateRoute path='/build/:id' component={BuilderContainer} />
            <PrivateRoute path='/build' component={BuilderContainer} />
            <PrivateRoute path='/artifacts' component={Artifact} />
            <PrivateRoute path='/testing' component={Testing} />
            <Route path='/documentation' component={Documentation} />
            <Redirect from='/userguide' to='/documentation' />
            <Route component={NoMatch} />
          </Switch>
        </App>
      </ThemeProvider>
    </Provider>
  );
};

Root.propTypes = {
  store: PropTypes.object.isRequired
};

Root.displayName = 'Root';

export default Root;
