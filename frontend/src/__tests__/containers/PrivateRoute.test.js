import React from 'react';
import { Provider } from 'react-redux';
import { createMockStore } from 'redux-test-utils';
import PrivateRoute from '../../containers/PrivateRoute';
import { render } from '../../utils/test-utils';

describe('<PrivateRoute />', () => {
  it('Unauthenticated user is rendered a Not Logged In message', () => {
    const store = createMockStore({
      auth: { isAuthenticated: false }
    });

    const { container } = render(
      <Provider store={store}>
        <PrivateRoute component={() => <div>Private route</div>} path="" />
      </Provider>
    );

    expect(container).toHaveTextContent('You must be logged in to access');
  });

  it('Authenticated user is rendered the correct component', () => {
    const store = createMockStore({
      auth: { isAuthenticated: true }
    });

    const { container } = render(
      <Provider store={store}>
        <PrivateRoute component={() => <div>Private route</div>} path="" />
      </Provider>
    );

    expect(container).toHaveTextContent('Private route');
  });
});
