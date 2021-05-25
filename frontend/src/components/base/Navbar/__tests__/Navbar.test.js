import React from 'react';
import Navbar from '../Navbar';
import { render } from 'utils/test-utils';

describe('<Navbar />', () => {
  it('renders without crashing', () => {
    const { container } = render(<Navbar isAuthenticated={false} />);

    expect(container).not.toBeEmptyDOMElement();
  });
});
