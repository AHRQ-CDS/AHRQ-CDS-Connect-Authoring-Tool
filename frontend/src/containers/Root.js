import React from 'react';
import PropTypes from 'prop-types';
import { Provider } from 'react-redux';
import { Route, Switch, Redirect } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from 'react-query';
import { MuiPickersUtilsProvider } from '@material-ui/pickers';
import { ThemeProvider } from '@material-ui/core/styles';
import DateFnsUtils from '@date-io/date-fns';

import App from './App';
import { Artifact } from 'components/artifact';
import Builder from 'containers/Builder';
import { Tester } from 'components/testing';
import { Documentation } from 'components/documentation';
import { ErrorPage } from 'components/base';
import { Landing } from 'components/landing';
import { PrivateRoute } from 'components/auth';
import lightTheme from 'styles/theme';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false
    }
  }
});

const Root = ({ store }) => (
  <Provider store={store}>
    <ThemeProvider theme={lightTheme}>
      <MuiPickersUtilsProvider utils={DateFnsUtils}>
        <QueryClientProvider client={queryClient}>
          <App>
            <Switch>
              <Route exact path="/">
                <Landing />
              </Route>
              <PrivateRoute path="/build/:id" component={Builder} />
              <PrivateRoute path="/build" component={Builder} />
              <PrivateRoute path="/artifacts" component={Artifact} />
              <PrivateRoute path="/testing" component={Tester} />
              <Route path="/documentation">
                <Documentation />
              </Route>
              <Redirect from="/userguide" to="/documentation" />
              <Route path="*">
                <ErrorPage errorType="notFound" />
              </Route>
            </Switch>
          </App>
        </QueryClientProvider>
      </MuiPickersUtilsProvider>
    </ThemeProvider>
  </Provider>
);

Root.propTypes = {
  store: PropTypes.object.isRequired
};

export default Root;
