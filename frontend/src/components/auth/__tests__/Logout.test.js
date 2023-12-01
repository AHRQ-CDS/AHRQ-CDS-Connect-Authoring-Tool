import React from 'react';
import { Provider } from 'react-redux';
import { createMockStore as reduxCreateMockStore } from 'redux-test-utils';
import { reduxState } from 'utils/test_fixtures';
import { screen, render } from 'utils/test-utils';
import Logout from '../Logout';

const defaultState = {
  ...reduxState,
  auth: {
    ...reduxState.auth,
    termsAcceptedDate: null
  }
};

const createMockStore = state => {
  const store = reduxCreateMockStore(state);
  const { dispatch } = store;

  store.dispatch = (...args) => {
    dispatch(...args);
    return Promise.resolve({});
  };

  return store;
};

const renderComponent = ({ store = createMockStore(defaultState), ...props } = {}) =>
  render(
    <Provider store={store}>
      <Logout />
    </Provider>
  );

describe('<Logout />', () => {
  it('should render terms and conditions modal if termsAcceptedDate is null', () => {
    const store = createMockStore(defaultState);
    renderComponent({ store });

    const dialog = screen.getByRole('dialog');
    expect(dialog).toBeInTheDocument();
  });

  it('should not render terms and conditions if termsAcceptedDate is not null', () => {
    const store = createMockStore({
      ...defaultState,
      auth: { ...defaultState.auth, termsAcceptedDate: new Date().toString() }
    });
    renderComponent({ store });

    const dialog = screen.queryByRole('dialog');
    expect(dialog).not.toBeInTheDocument();
  });
});
