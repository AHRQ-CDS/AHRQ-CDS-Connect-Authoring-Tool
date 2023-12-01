import React from 'react';
import PropTypes from 'prop-types';
import { Provider } from 'react-redux';
import { Route, Switch, Redirect } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from 'react-query';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { ThemeProvider, StyledEngineProvider } from '@mui/material/styles';

import App from './App';
import { Artifact } from 'components/artifact';
import { Tester } from 'components/testing';
import { Workspace } from 'components/builder/workspace';
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
    <StyledEngineProvider injectFirst>
      <ThemeProvider theme={lightTheme}>
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <QueryClientProvider client={queryClient}>
            <App>
              <Switch>
                <Route exact path="/">
                  <Landing />
                </Route>
                <PrivateRoute path="/build/:id" component={Workspace} />
                <PrivateRoute path="/build" component={Workspace} />
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
        </LocalizationProvider>
      </ThemeProvider>
    </StyledEngineProvider>
  </Provider>
);

Root.propTypes = {
  store: PropTypes.object.isRequired
};

export default Root;
