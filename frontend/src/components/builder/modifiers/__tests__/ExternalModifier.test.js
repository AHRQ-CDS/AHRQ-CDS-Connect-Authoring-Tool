import React from 'react';
import { render } from 'utils/test-utils';
import ExternalModifier from '../ExternalModifier';

jest.mock('../../editors/Editor', () => () => <div>Editor</div>);

describe('<ExternalModifier />', () => {
  const renderComponent = (props = {}) =>
    render(
      <ExternalModifier
        argumentTypes={[]}
        index={0}
        modifierArguments={[]}
        name="external"
        updateAppliedModifier={jest.fn()}
        value={[]}
        vsacApiKey="key"
        {...props}
      />
    );

  it('renders the name', () => {
    const { container } = renderComponent({ name: 'external modifier test' });

    expect(container).toHaveTextContent('external modifier test');
  });

  it('renders no editors when there is only one argument and argumentType', () => {
    const { queryByText } = renderComponent({
      modifierArguments: [{ name: 'first' }],
      argumentTypes: [{ calculated: 'boolean' }]
    });

    expect(queryByText('Editor')).toBeNull();
  });

  it('renders one editor when there are two arguments', () => {
    const { getByText } = renderComponent({
      modifierArguments: [{ name: 'first' }, { name: 'second' }],
      argumentTypes: [{ calculated: 'decimal' }, { calculated: 'integer' }]
    });

    expect(getByText('Editor')).not.toBeNull();
  });

  it('renders n-1 editors when there are n arguments', () => {
    // Test with five arguments to verify four editors are present
    const { getAllByText } = renderComponent({
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

    expect(getAllByText('Editor')).toHaveLength(4);
  });
});
