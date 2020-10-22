import React from 'react';
import ExternalModifier from '../ExternalModifier';
import { render } from '../../../../utils/test-utils';

jest.mock('../../editors/Editor', () => () => <div>Editor</div>);

describe('<ExternalModifier />', () => {
  const renderComponent = (props = {}) =>
    render(
      <ExternalModifier
        index={0}
        name="external"
        value={[]}
        arguments={[]}
        argumentTypes={[]}
        updateAppliedModifier={jest.fn()}
        vsacFHIRCredentials={{ username: 'username', password: 'password' }}
        loginVSACUser={jest.fn()}
        setVSACAuthStatus={jest.fn()}
        vsacStatus=""
        vsacStatusText=""
        isValidatingCode={false}
        validateCode={jest.fn()}
        resetCodeValidation={jest.fn()}
        {...props}
      />
    );

  it('renders the name', () => {
    const { container } = renderComponent({ name: 'external modifier test' });

    expect(container).toHaveTextContent('external modifier test');
  });

  it('renders no editors when there is only one argument and argumentType', () => {
    const { queryByText } = renderComponent({
      arguments: [{ name: 'first' }],
      argumentTypes: [{ calculated: 'boolean' }]
    });

    expect(queryByText('Editor')).toBeNull();
  });

  it('renders one editor when there are two arguments', () => {
    const { getByText } = renderComponent({
      arguments: [{ name: 'first' }, { name: 'second' }],
      argumentTypes: [{ calculated: 'decimal' }, { calculated: 'integer' }]
    });

    expect(getByText('Editor')).not.toBeNull();
  });

  it('renders n-1 editors when there are n arguments', () => {
    // Test with five arguments to verify four editors are present
    const { getAllByText } = renderComponent({
      arguments: [
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
