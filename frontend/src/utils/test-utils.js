import React from 'react';
import { render, fireEvent } from '@testing-library/react'; // eslint-disable-line import/no-extraneous-dependencies
import { MemoryRouter } from 'react-router-dom';

const ProviderWrapper = ({ children }) => (
  <MemoryRouter>
    {children}
  </MemoryRouter>
);

const customRender = (ui, options) =>
  render(ui, { wrapper: ProviderWrapper, ...options });

const openSelect = (node) => fireEvent.keyDown(node, { keyCode: 40 });

export { act, fireEvent, wait, prettyDOM } from '@testing-library/react';
export {
  customRender as render,
  openSelect
};
