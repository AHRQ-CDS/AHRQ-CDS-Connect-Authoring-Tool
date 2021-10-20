import React from 'react';
import { Provider } from 'react-redux';
import { render as testingLibRender } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from 'react-query';
import { ThemeProvider, StyledEngineProvider } from '@mui/material/styles';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import { screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import configureStore from '../store/configureStore';
import lightTheme from 'styles/theme';

const ProviderWrapper = ({ children }) => (
  <MemoryRouter>
    <Provider store={configureStore()}>
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <QueryClientProvider client={new QueryClient()}>
          <StyledEngineProvider injectFirst>
            <ThemeProvider theme={lightTheme}>{children}</ThemeProvider>
          </StyledEngineProvider>
        </QueryClientProvider>
      </LocalizationProvider>
    </Provider>
  </MemoryRouter>
);

export const render = (ui, options) => testingLibRender(ui, { wrapper: ProviderWrapper, ...options });

export const changeDate = (value, index = 0) => {
  userEvent.click(screen.queryAllByRole('textbox', { name: /choose date/i })[index]);
  userEvent.click(
    screen.getByRole('button', {
      name: /calendar view is open, go to text input view/i
    })
  );
  fireEvent.change(screen.getByPlaceholderText(/mm\/dd\/yyyy/i), { target: { value } });
  userEvent.click(
    screen.getByRole('button', {
      name: /ok/i
    })
  );
};

export const changeTime = (value, index = 0) => {
  userEvent.click(screen.queryAllByRole('textbox', { name: /choose time/i })[index]);
  userEvent.click(
    screen.getByRole('button', {
      name: /clock view is open, go to text input view/i
    })
  );
  fireEvent.change(screen.getByPlaceholderText(/hh:mm:ss/i), { target: { value } });
  userEvent.click(
    screen.getByRole('button', {
      name: /ok/i
    })
  );
};

export { getRoles, logRoles } from '@testing-library/dom';
export { act, fireEvent, waitFor, waitForElementToBeRemoved, prettyDOM, screen, within } from '@testing-library/react';
export { default as userEvent } from '@testing-library/user-event';
