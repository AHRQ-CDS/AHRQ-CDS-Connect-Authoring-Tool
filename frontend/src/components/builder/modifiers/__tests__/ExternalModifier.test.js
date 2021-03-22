import React from 'react';
import { render, screen } from 'utils/test-utils';
import ExternalModifier from '../ExternalModifier';

describe('<ExternalModifier />', () => {
  const renderComponent = (props = {}) =>
    render(
      <ExternalModifier
        argumentTypes={[]}
        handleUpdateModifier={jest.fn()}
        modifierArguments={[]}
        name="external"
        values={[]}
        {...props}
      />
    );

  it('renders the name', () => {
    const { container } = renderComponent({ name: 'external modifier test' });

    expect(container).toHaveTextContent('external modifier test');
  });

  it('renders no editors when there is only one argument and argumentType', () => {
    renderComponent({
      modifierArguments: [{ name: 'first' }],
      argumentTypes: [{ calculated: 'boolean' }]
    });

    expect(screen.getByTestId('editors')).toBeEmptyDOMElement();
  });

  it('renders one editor when there are two arguments', () => {
    renderComponent({
      modifierArguments: [{ name: 'first' }, { name: 'second' }],
      argumentTypes: [{ calculated: 'decimal' }, { calculated: 'integer' }]
    });

    expect(screen.queryByText(/first/)).not.toBeInTheDocument();
    expect(screen.getByText(/second/)).toBeInTheDocument();
  });

  it('renders n-1 editors when there are n arguments', () => {
    // Test with five arguments to verify four editors are present
    renderComponent({
      modifierArguments: [
        { name: 'first' },
        { name: 'second' },
        { name: 'third' },
        { name: 'fourth' },
        { name: 'fifth' }
      ],
      argumentTypes: [
        { calculated: 'string' },
        { calculated: 'datetime' },
        { calculated: 'interval_datetime' },
        { calculated: 'quantity' },
        { calculated: 'time' }
      ]
    });

    expect(screen.queryByText(/first/)).not.toBeInTheDocument();
    expect(screen.getByText(/second/)).toBeInTheDocument();
    expect(screen.getByText(/third/)).toBeInTheDocument();
    expect(screen.getByText(/fourth/)).toBeInTheDocument();
    expect(screen.getByText(/fifth/)).toBeInTheDocument();
  });
});
