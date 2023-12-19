import React from 'react';
import { render, userEvent, screen, waitFor } from 'utils/test-utils';
import ValueSetListTemplate from '../ValueSetListTemplate';

const valueSet1 = { name: 'value-set-1', oid: '001' };
const valueSet2 = { name: 'value-set-2', oid: '002' };

describe('<ValueSetListTemplate />', () => {
  const renderComponent = (props = {}) =>
    render(<ValueSetListTemplate valueSets={[]} handleDeleteValueSet={jest.fn()} {...props} />);

  it('renders a single value set correctly', () => {
    const { container } = renderComponent({ valueSets: [valueSet1] });

    const valueSetLabels = container.querySelectorAll('#value-set-label');
    expect(valueSetLabels).toHaveLength(1);
    expect(valueSetLabels[0]).toHaveTextContent('Value Set');
  });

  it('renders more than one value set correctly', () => {
    const { container } = renderComponent({ valueSets: [valueSet1, valueSet2] });

    const valueSetLabels = container.querySelectorAll('#value-set-label');
    expect(valueSetLabels).toHaveLength(2);
    expect(valueSetLabels[0]).toHaveTextContent('Value Set 1');
    expect(valueSetLabels[1]).toHaveTextContent('Value Set 2');
  });

  it('calls handleDeleteValueSet on value set delete', async () => {
    const handleDeleteValueSet = jest.fn();
    renderComponent({ valueSets: [valueSet1], handleDeleteValueSet });

    await waitFor(() => userEvent.click(screen.getByRole('button', { name: /delete value set/i })));

    expect(handleDeleteValueSet).toBeCalledWith(valueSet1);
  });
});
