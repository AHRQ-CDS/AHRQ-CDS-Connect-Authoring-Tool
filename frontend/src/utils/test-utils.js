import React from 'react';
import { Provider } from 'react-redux';
import { render as testingLibRender } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from 'react-query';
import { ThemeProvider, StyledEngineProvider } from '@mui/material/styles';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFnsV3';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { act, screen, fireEvent } from '@testing-library/react';

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

export const changeDate = async (value, index = 0) => {
  await act(async () => {
    fireEvent.change(screen.getAllByPlaceholderText(/mm\/dd\/yyyy/i)[index], { target: { value } });
  });
};

export const changeTime = async (value, index = 0) => {
  await act(async () => {
    fireEvent.change(screen.getAllByPlaceholderText(/hh:mm:ss/i)[index], { target: { value } });
  });
};

export { getRoles, logRoles } from '@testing-library/dom';
export { act, fireEvent, waitFor, waitForElementToBeRemoved, prettyDOM, screen, within } from '@testing-library/react';
export { default as userEvent, PointerEventsCheckLevel } from '@testing-library/user-event';
