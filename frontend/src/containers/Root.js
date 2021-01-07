import React from 'react';
import PropTypes from 'prop-types';
import { Provider } from 'react-redux';
import { Route, Switch, Redirect } from 'react-router-dom';
import { MuiPickersUtilsProvider } from '@material-ui/pickers';
import { ThemeProvider } from '@material-ui/core/styles';
import DateFnsUtils from '@date-io/date-fns';

import App from './App';
import Artifact from 'containers/Artifact';
import Builder from 'containers/Builder';
import Testing from 'containers/Testing';
import { Documentation } from 'components/documentation';
import { ErrorPage } from 'components/base';
import { Landing } from 'components/landing';
import { PrivateRoute } from 'components/auth';
import lightTheme from 'styles/theme';

const Root = ({ store }) => (
  <Provider store={store}>
    <ThemeProvider theme={lightTheme}>
      <MuiPickersUtilsProvider utils={DateFnsUtils}>
        <App>
          <Switch>
            <Route exact path="/"><Landing /></Route>
            <PrivateRoute path='/build/:id' component={Builder} />
            <PrivateRoute path='/build' component={Builder} />
            <PrivateRoute path='/artifacts' component={Artifact} />
            <PrivateRoute path='/testing' component={Testing} />
            <Route path='/documentation'><Documentation /></Route>
            <Redirect from='/userguide' to='/documentation' />
            <Route path='*'><ErrorPage errorType='notFound' /></Route>
          </Switch>
        </App>
      </MuiPickersUtilsProvider>
    </ThemeProvider>
  </Provider>
);

Root.propTypes = {
  store: PropTypes.object.isRequired
};

export default Root;
