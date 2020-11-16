import React from 'react';
import PropTypes from 'prop-types';
import { Provider } from 'react-redux';
import { Route, Switch, Redirect } from 'react-router-dom';
import { ThemeProvider } from '@material-ui/core/styles';

import PrivateRoute from './PrivateRoute';
import App from './App';
import BuilderContainer from 'containers/Builder';
import Artifact from 'containers/Artifact';
import Testing from 'containers/Testing';
import { Landing } from 'components/landing';
import { Documentation } from 'components/documentation';
import { ErrorPage } from 'components/base';
import lightTheme from 'styles/theme';

const Root = (props) => {
  const { store } = props;

  return (
    <Provider store={store}>
      <ThemeProvider theme={lightTheme}>
        <App>
          <Switch>
            <Route exact path="/"><Landing /></Route>
            <PrivateRoute path='/build/:id' component={BuilderContainer} />
            <PrivateRoute path='/build' component={BuilderContainer} />
            <PrivateRoute path='/artifacts' component={Artifact} />
            <PrivateRoute path='/testing' component={Testing} />
            <Route path='/documentation'><Documentation /></Route>
            <Redirect from='/userguide' to='/documentation' />
            <Route><ErrorPage errorType='notFound' /></Route>
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
