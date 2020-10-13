/* eslint-disable import/no-extraneous-dependencies */
import React from 'react';
import { Provider } from 'react-redux';
import { render, fireEvent } from '@testing-library/react'; // eslint-disable-line import/no-extraneous-dependencies
import { MemoryRouter } from 'react-router-dom';
import configureStore from '../store/configureStore';

const ProviderWrapper = ({ children }) => (
  <MemoryRouter>
    <Provider store={configureStore()}>
      {children}
    </Provider>
  </MemoryRouter>
);

const customRender = (ui, options) =>
  render(ui, { wrapper: ProviderWrapper, ...options });

const openSelect = (node) => fireEvent.keyDown(node, { keyCode: 40 });

export { act, fireEvent, wait, prettyDOM } from '@testing-library/react';
export { default as userEvent } from '@testing-library/user-event';
export {
  customRender as render,
  openSelect
};
