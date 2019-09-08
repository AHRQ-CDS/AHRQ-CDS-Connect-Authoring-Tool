import React from 'react';
import { render } from '@testing-library/react'; // eslint-disable-line import/no-extraneous-dependencies
import { MemoryRouter } from 'react-router-dom';

const ProviderWrapper = ({ children }) => (
  <MemoryRouter>
    {children}
  </MemoryRouter>
);

const customRender = (ui, options) =>
  render(ui, { wrapper: ProviderWrapper, ...options });

export { act, fireEvent, wait } from '@testing-library/react';
export { customRender as render };
