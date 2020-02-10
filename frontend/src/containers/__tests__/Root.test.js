import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { createMockStore } from 'redux-test-utils';
import { reduxState } from '../../utils/test_fixtures';
import { render } from '../../utils/test-utils';
import Root from '../Root';

jest.mock('../../containers/Landing', () => () => <div>Landing Container</div>);
jest.mock('../../containers/Builder', () => () => <div>Builder Container</div>);
jest.mock('../../containers/Artifact', () => () => <div>Artifact Container</div>);
jest.mock('../../containers/Testing', () => () => <div>Testing Container</div>);
jest.mock('../../components/Documentation', () => () => <div>Documentation Component</div>);
jest.mock('../../components/NotFoundPage', () => () => <div>NotFoundPage Component</div>);
jest.mock('../../components/NotLoggedInPage', () => () => <div>NotLoggedInPage Component</div>);

describe('<Root />', () => {
  const renderComponent = ({ path = '/', store = reduxState, ...props } = {}) =>
    render(
      <MemoryRouter initialEntries={[path]}>
        <Root store={createMockStore(store)} {...props} />
      </MemoryRouter>
    );

  describe('navigation', () => {
    it('renders the Landing page', () => {
      const { getByText } = renderComponent();

      expect(getByText('Landing Container')).toBeDefined();
    });

    it('renders the Documentation page', () => {
      const { getByText } = renderComponent({ path: '/documentation' });

      expect(getByText('Documentation Component')).toBeDefined();
    });

    it('redirects /userguide to /documentation', () => {
      const { getByText } = renderComponent({ path: '/userguide' });

      expect(getByText('Documentation Component')).toBeDefined();
    });

    it('renders a not found page', () => {
      const { getByText } = renderComponent({ path: '/foo' });

      expect(getByText('NotFoundPage Component')).toBeDefined();
    });

    describe('private routes', () => {
      it('renders the NotLoggedInPage when not logged in', () => {
        const { getByText } = renderComponent({
          path: '/build',
          store: {
            ...reduxState,
            auth: {
              ...reduxState,
              isAuthenticated: false
            }
          }
        });

        expect(getByText('NotLoggedInPage Component')).toBeDefined();
      });

      it('renders the Builder index page', () => {
        let { getByText } = renderComponent({ path: '/build' });

        expect(getByText('Builder Container')).toBeDefined();
      });

      it('renders the Builder show page', () => {
        let { getByText } = renderComponent({ path: '/build/123' });

        expect(getByText('Builder Container')).toBeDefined();
      });

      it('renders the Artifact page', () => {
        let { getByText } = renderComponent({ path: '/artifacts' });

        expect(getByText('Artifact Container')).toBeDefined();
      });

      it('renders the Testing page', () => {
        let { getByText} = renderComponent({ path: '/testing' });

        expect(getByText('Testing Container')).toBeDefined();
      });
    });
  });
});
