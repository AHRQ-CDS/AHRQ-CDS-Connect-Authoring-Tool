import React from 'react';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import nock from 'nock';
import { render, screen } from 'utils/test-utils';
import { mockArtifact } from 'mocks/artifacts';
import ExternalModifier from '../ExternalModifier';

describe('<ExternalModifier />', () => {
  const renderComponent = ({ artifact = mockArtifact, ...props } = {}) =>
    render(
      <Provider store={createStore(x => x, { artifacts: { artifact } })}>
        <ExternalModifier
          argumentTypes={[]}
          handleUpdateModifier={jest.fn()}
          modifierArguments={[]}
          name="external"
          values={[]}
          {...props}
        />
      </Provider>
    );

  afterAll(() => nock.restore());

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
    nock('http://localhost').get(`/authoring/api/externalCQL/${mockArtifact._id}`).reply(200, []);

    renderComponent({
      modifierArguments: [{ name: 'first' }, { name: 'second' }],
      argumentTypes: [{ calculated: 'decimal' }, { calculated: 'integer' }]
    });

    expect(screen.queryByText(/first/)).not.toBeInTheDocument();
    expect(screen.getByText(/second/)).toBeInTheDocument();
  });

  it('renders n-1 editors when there are n arguments', () => {
    nock('http://localhost').get(`/authoring/api/externalCQL/${mockArtifact._id}`).reply(200, []);

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
