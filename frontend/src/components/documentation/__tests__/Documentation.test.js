import React from 'react';
import Documentation from '../Documentation';
import { render, screen, userEvent } from 'utils/test-utils';

describe('<Documentation />', () => {
  it('renders without crashing', () => {
    const { container } = render(<Documentation />);

    expect(container).not.toBeEmptyDOMElement();
  });

  it('renders the user guide', () => {
    const { getAllByText } = render(<Documentation />);

    expect(getAllByText('CDS Authoring Tool User Guide')).not.toBeNull();
  });

  it('renders the data type guide', () => {
    const { getAllByText } = render(<Documentation />);
    userEvent.click(screen.getByRole('tab', { name: 'Data Types' }));

    expect(getAllByText('Data Types and Expressions')).not.toBeNull();
  });
});
