import React from 'react';
import { Provider } from 'react-redux';
import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { MuiPickersUtilsProvider } from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';
import { QueryClient, QueryClientProvider } from 'react-query';
import configureStore from '../store/configureStore';

const ProviderWrapper = ({ children }) => (
  <MemoryRouter>
    <Provider store={configureStore()}>
      <MuiPickersUtilsProvider utils={DateFnsUtils}>
        <QueryClientProvider client={new QueryClient()}>{children}</QueryClientProvider>
      </MuiPickersUtilsProvider>
    </Provider>
  </MemoryRouter>
);

const customRender = (ui, options) => render(ui, { wrapper: ProviderWrapper, ...options });

export { getRoles, logRoles } from '@testing-library/dom';
export { act, fireEvent, waitFor, waitForElementToBeRemoved, prettyDOM, screen, within } from '@testing-library/react';
export { default as userEvent } from '@testing-library/user-event';
export { customRender as render };
