import React from 'react';
import Parameter from '../Parameter';
import { render, fireEvent, openSelect } from '../../../utils/test-utils';

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
        vsacFHIRCredentials={{ username: 'username', password: 'password' }}
        vsacStatus=""
        vsacStatusText=""
        {...props}
      />
    );

  it('can be named', () => {
    const updateInstanceOfParameter = jest.fn();

    const { getByLabelText } = renderComponent({
      type: 'boolean',
      updateInstanceOfParameter
    });

    fireEvent.change(getByLabelText('Parameter Name'), { target: { value: 'Parameter 007' } });

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
    const { getByLabelText } = renderComponent({
      type: 'boolean',
      deleteParameter,
      index
    });

    fireEvent.click(getByLabelText('Delete Parameter'));

    expect(deleteParameter).toBeCalledWith(index);
  });

  it('changes parameter type when edited', () => {
    const updateInstanceOfParameter = jest.fn();
    const { getByText, getByLabelText } = renderComponent({ type: 'boolean', updateInstanceOfParameter });

    openSelect(getByLabelText('Select Parameter Type'));
    fireEvent.click(getByText('Integer'));

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
    const { getByLabelText } = renderComponent({
      type: 'boolean',
      collapseParameter,
    });
    //collapse the parameter
    fireEvent.click(getByLabelText('hide-'));
    expect(getByLabelText('Type')).not.toBeNull();
    //expand the parameter
    fireEvent.click(getByLabelText('hide-'));
    expect(getByLabelText('Select Parameter Type')).not.toBeNull();
  });

  it('displays the Editor when passed a valid parameter type', () => {
    const { getByText } = renderComponent({ type: 'boolean' });

    expect(getByText('Editor')).not.toBeNull();
  });
});
