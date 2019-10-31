import React from 'react';
import NotFoundPage from '../NotFoundPage';
import { render } from '../../utils/test-utils';

describe('<NotFoundPage />', () => {
  it('renders a message with the intended location', () => {
    const { container } = render(
      <NotFoundPage location={{ pathname: '/fake-path' }} />
    );

    expect(container.querySelector('.notFound-wrapper')).toHaveTextContent('No match for /fake-path');
  });
});
