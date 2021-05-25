import React from 'react';
import Landing from '../Landing';
import { render } from 'utils/test-utils';

describe('<Landing />', () => {
  const renderComponent = ({ pathname = '/', ...props } = {}) => render(<Landing isAuthenticated={false} {...props} />);

  it('renders without crashing', () => {
    const { container } = renderComponent();

    expect(container).not.toBeEmptyDOMElement();
  });
});
