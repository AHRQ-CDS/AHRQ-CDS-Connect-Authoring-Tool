import React from 'react';
import Documentation from '../Documentation';
import { render, screen, userEvent, waitFor } from 'utils/test-utils';

describe('<Documentation />', () => {
  it('renders without crashing', () => {
    const { container } = render(<Documentation />);

    expect(container).not.toBeEmptyDOMElement();
  });

  it('renders the user guide', () => {
    const { getAllByText } = render(<Documentation />);

    expect(getAllByText('CDS Authoring Tool User Guide')).not.toBeNull();
  });

  it('renders the tutorial', async () => {
    const { getAllByText } = render(<Documentation />);
    await waitFor(() => userEvent.click(screen.getByRole('tab', { name: 'Tutorial' })));

    expect(getAllByText('CDS Authoring Tool Tutorial')).not.toBeNull();
  });

  it('renders the data type guide', async () => {
    const { getAllByText } = render(<Documentation />);
    await waitFor(() => userEvent.click(screen.getByRole('tab', { name: 'Data Types' })));

    expect(getAllByText('Data Types and Modifiers')).not.toBeNull();
  });

  it('renders the terms and conditions guide', async () => {
    const { getAllByText } = render(<Documentation />);
    await waitFor(() => userEvent.click(screen.getByRole('tab', { name: 'Terms & Conditions' })));

    expect(getAllByText('CDS Authoring Tool Terms and Conditions')).not.toBeNull();
  });

  describe('default tabs based on props', () => {
    it('renders the user guide with activeTab=0', () => {
      const { getAllByText, queryAllByText } = render(<Documentation activeTab={0} />);
      expect(getAllByText('CDS Authoring Tool User Guide')).not.toBeNull();
      expect(queryAllByText('CDS Authoring Tool Tutorial')).toHaveLength(0);
      expect(queryAllByText('Data Types and Modifiers')).toHaveLength(0);
      expect(queryAllByText('CDS Authoring Tool Terms and Conditions')).toHaveLength(0);
    });

    it('renders the tutorial with activeTab=1', () => {
      const { getAllByText, queryAllByText } = render(<Documentation activeTab={1} />);
      expect(queryAllByText('CDS Authoring Tool User Guide')).toHaveLength(0);
      expect(getAllByText('CDS Authoring Tool Tutorial')).not.toBeNull();
      expect(queryAllByText('Data Types and Modifiers')).toHaveLength(0);
      expect(queryAllByText('CDS Authoring Tool Terms and Conditions')).toHaveLength(0);
    });

    it('renders the data types with activeTab=2', () => {
      const { getAllByText, queryAllByText } = render(<Documentation activeTab={2} />);
      expect(queryAllByText('CDS Authoring Tool User Guide')).toHaveLength(0);
      expect(queryAllByText('CDS Authoring Tool Tutorial')).toHaveLength(0);
      expect(getAllByText('Data Types and Modifiers')).not.toBeNull();
      expect(queryAllByText('CDS Authoring Tool Terms and Conditions')).toHaveLength(0);
    });

    it('renders the terms and conditions with activeTab=3', () => {
      const { getAllByText, queryAllByText } = render(<Documentation activeTab={3} />);
      expect(queryAllByText('CDS Authoring Tool User Guide')).toHaveLength(0);
      expect(queryAllByText('CDS Authoring Tool Tutorial')).toHaveLength(0);
      expect(queryAllByText('Data Types and Modifiers')).toHaveLength(0);
      expect(getAllByText('CDS Authoring Tool Terms and Conditions')).not.toBeNull();
    });
  });
});
