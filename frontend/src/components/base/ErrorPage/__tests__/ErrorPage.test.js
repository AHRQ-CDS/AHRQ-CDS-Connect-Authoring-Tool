import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import ErrorPage from '../ErrorPage';
import { render, screen } from 'utils/test-utils';

describe('<ErrorPage />', () => {
  const renderComponent = ({ pathname = '/', ...props } = {}) =>
    render(
      <MemoryRouter initialEntries={[pathname]}>
        <ErrorPage {...props} />
      </MemoryRouter>
    );

  it('renders a generic message when errorType is not provided', () => {
    renderComponent();

    expect(screen.getByRole('heading', {name: 'An error has occured'})).toBeInTheDocument();
  });

  it('renders a not found message with the intended location', () => {
    renderComponent({
      errorType: 'notFound',
      pathname: '/fake-path',
    });

    expect(screen.getByRole('heading', {name: 'No match for /fake-path'})).toBeInTheDocument();
  });

  it('renders a must be logged in message with the intended location', () => {
    renderComponent({
      errorType: 'notLoggedIn',
      pathname: '/artifacts'
    });

    expect(screen.getByRole('heading', {name: 'You must be logged in to access /artifacts'})).toBeInTheDocument();
  });
});
