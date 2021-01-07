import React from 'react';
import { render, userEvent, screen } from 'utils/test-utils';
import Parameters from '../Parameters';

describe('<Parameters />', () => {
  const renderComponent = (props = {}) =>
    render(
      <Parameters
        getAllInstancesInAllTrees={jest.fn()}
        instanceNames={[]}
        isValidatingCode={false}
        loginVSACUser={jest.fn()}
        parameters={[
          {
            name: 'Parameter 007',
            uniqueId: 'parameter-007',
            type: 'string',
            value: '',
            usedBy: [],
            comment: ''
          }
        ]}
        resetCodeValidation={jest.fn()}
        setVSACAuthStatus={jest.fn()}
        updateParameters={jest.fn()}
        validateCode={jest.fn()}
        vsacApiKey={'key'}
        vsacIsAuthenticating={false}
        vsacStatus=""
        vsacStatusText=""
        {...props}
      />
    );

  it('renders a list of parameters', () => {
    const { container } = renderComponent();

    expect(container.querySelectorAll('.parameter')).toHaveLength(1);
  });

  it('can add a new parameter with the New parameter button', () => {
    const updateParameters = jest.fn();
    renderComponent({ parameters: [], updateParameters });

    userEvent.click(screen.getByRole('button', { name: 'New parameter' }));

    expect(updateParameters).toBeCalledWith([
      expect.objectContaining({
        name: null,
        type: 'boolean',
        value: null,
        uniqueId: expect.stringMatching(/^parameter-\d+$/)
      })
    ]);
  });

  it('can update a parameter', () => {
    const updateParameters = jest.fn();
    renderComponent({ updateParameters });

    userEvent.click(screen.getByRole('button', { name: 'String' }));
    userEvent.click(screen.getByRole('option', { name: 'Integer' }));

    expect(updateParameters).toBeCalledWith([
      {
        name: 'Parameter 007',
        uniqueId: 'parameter-007',
        type: 'integer',
        comment: '',
        value: null
      }
    ]);
  });

  it('can delete parameter', () => {
    const updateParameters = jest.fn();
    renderComponent({ updateParameters });

    userEvent.click(screen.getByRole('button', { name: 'delete parameter' }));

    expect(updateParameters).toBeCalledWith([]);
  });
});
