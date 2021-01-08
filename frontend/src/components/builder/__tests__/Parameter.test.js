import React from 'react';
import { render, fireEvent, userEvent, screen } from 'utils/test-utils';
import Parameter from '../Parameter';

jest.mock('../editors/Editor', () => () => <div>Editor</div>);

describe('<Parameter />', () => {
  const renderComponent = (props = {}) =>
    render(
      <Parameter
        comment=""
        deleteParameter={jest.fn()}
        getAllInstancesInAllTrees={jest.fn()}
        id="test-id"
        index={0}
        instanceNames={[]}
        isValidatingCode={false}
        isValidCode={false}
        name=""
        resetCodeValidation={jest.fn()}
        setVSACAuthStatus={jest.fn()}
        type=""
        updateInstanceOfParameter={jest.fn()}
        validateCode={jest.fn()}
        value={null}
        vsacApiKey={'key'}
        vsacIsAuthenticating={false}
        vsacStatus=""
        vsacStatusText=""
        {...props}
      />
    );

  it('can be named', () => {
    const updateInstanceOfParameter = jest.fn();

    renderComponent({
      type: 'boolean',
      updateInstanceOfParameter
    });

    fireEvent.change(document.querySelector('input[type=text]'), { target: { value: 'Parameter 007' } });

    expect(updateInstanceOfParameter).toBeCalledWith(
      {
        comment: '',
        name: 'Parameter 007',
        type: 'boolean',
        uniqueId: 'test-id',
        value: null
      },
      0
    );
  });

  it('can be deleted', () => {
    const deleteParameter = jest.fn();
    const index = 5;
    renderComponent({
      type: 'boolean',
      deleteParameter,
      index
    });

    userEvent.click(screen.getByRole('button', { name: 'delete parameter' }));
    userEvent.click(screen.getByRole('button', { name: 'Delete' }));

    expect(deleteParameter).toBeCalledWith(index);
  });

  it('changes parameter type when edited', () => {
    const updateInstanceOfParameter = jest.fn();
    renderComponent({ type: 'boolean', updateInstanceOfParameter });

    userEvent.click(screen.getByRole('button', { name: 'Boolean' }));
    userEvent.click(screen.getByRole('option', { name: 'Integer' }));

    expect(updateInstanceOfParameter).toBeCalledWith(
      {
        comment: '',
        name: '',
        type: 'integer',
        uniqueId: 'test-id',
        value: null
      },
      0
    );
  });

  it('can be collapsed and expanded', () => {
    const collapseParameter = jest.fn();
    renderComponent({
      type: 'boolean',
      collapseParameter
    });

    // collapse the parameter
    fireEvent.click(screen.getByLabelText('hide-'));
    expect(screen.getByLabelText('Type')).toBeInTheDocument();

    // expand the parameter
    fireEvent.click(screen.getByLabelText('hide-'));
    expect(screen.getByRole('button', { name: 'Boolean' })).toBeInTheDocument();
  });

  it('displays the Editor when passed a valid parameter type', () => {
    renderComponent({ type: 'boolean' });

    expect(screen.getByText('Editor')).not.toBeNull();
  });
});
