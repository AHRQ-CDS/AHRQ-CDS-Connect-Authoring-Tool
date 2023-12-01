import React from 'react';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import nock from 'nock';
import { render, screen, userEvent } from 'utils/test-utils';
import SelectModifierAction from '../SelectModifierAction';

describe('<SelectModifierAction />', () => {
  const renderComponent = ({
    elementInstance = {},
    modifiersByInputType = {},
    updateModifiers = jest.fn(),
    ...props
  } = {}) =>
    render(
      <SelectModifierAction
        elementInstance={elementInstance}
        modifiersByInputType={modifiersByInputType}
        updateModifiers={updateModifiers}
        {...props}
      />
    );
  const renderComponentWithState = ({
    elementInstance = {},
    modifiersByInputType = {},
    updateModifiers = jest.fn(),
    ...props
  } = {}) =>
    render(
      <Provider
        store={createStore(x => x, {
          artifacts: { artifact: { _id: 'artifact-id', fhirVersion: '4.0.1', baseElements: [] } }
        })}
      >
        <SelectModifierAction
          elementInstance={elementInstance}
          modifiersByInputType={modifiersByInputType}
          updateModifiers={updateModifiers}
          {...props}
        />
      </Provider>
    );

  afterAll(() => nock.restore());

  it('renders nothing when cannot have modifiers', () => {
    renderComponent({ elementInstance: { cannotHaveModifiers: true } });
    const button = screen.queryByRole('button', { name: 'Add Modifiers' });
    expect(button).not.toBeInTheDocument();
  });

  it('renders nothing when there are no relevant modifiers', () => {
    renderComponent({ elementInstance: { cannotHaveModifiers: false } }); // No modifiersByInputType so no relevantModifiers
    const button = screen.queryByRole('button', { name: 'Add Modifiers' });
    expect(button).not.toBeInTheDocument();
  });

  it('renders loading text when loading modifiers', () => {
    renderComponent({ isLoadingModifiers: true });
    expect(screen.queryByRole('button', { name: 'Add Modifiers' })).not.toBeInTheDocument();
    expect(screen.getByText('Loading modifiers...')).toBeInTheDocument();
  });

  it('renders add modifiers button when there are relevant modifiers', () => {
    const elementInstance = { returnType: 'list_of_conditions', modifiers: [] }; // cannotHaveModifiers is not specified, so they are allowed
    const modifiersByInputType = { list_of_conditions: [{ name: 'TestModifier' }] };
    renderComponent({ elementInstance, modifiersByInputType });
    expect(screen.getByRole('button', { name: 'Add Modifiers' })).toBeInTheDocument();
  });

  it('renders modifier select modal when clicking add modifiers', () => {
    const elementInstance = { returnType: 'list_of_conditions', fields: [], modifiers: [] }; // cannotHaveModifiers is not specified, so they are allowed
    const modifiersByInputType = { list_of_conditions: [{ name: 'TestModifier' }] };
    renderComponentWithState({ elementInstance, modifiersByInputType });

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    userEvent.click(screen.getByRole('button', { name: 'Add Modifiers' }));
    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });

  it('calls updateModifiers when adding modifiers', async () => {
    nock('http://localhost')
      .persist()
      .get(`/authoring/api/modifiers/artifact-id`)
      .reply(200, [
        {
          id: 'ConfirmedCondition',
          name: 'Confirmed',
          inputTypes: ['list_of_conditions'],
          returnType: 'list_of_conditions',
          cqlTemplate: 'BaseModifier',
          cqlLibraryFunction: 'C3F.Confirmed'
        }
      ]);

    const elementInstance = { returnType: 'list_of_conditions', fields: [], modifiers: [] }; // cannotHaveModifiers is not specified, so they are allowed
    const modifiersByInputType = { list_of_conditions: [{ name: 'Confirmed' }] };
    const updateModifiers = jest.fn();
    renderComponentWithState({ elementInstance, modifiersByInputType, updateModifiers });

    userEvent.click(screen.getByRole('button', { name: 'Add Modifiers' }));
    userEvent.click(screen.getByRole('button', { name: 'Select Modifiers' }));
    userEvent.click(screen.getByRole('button', { name: 'Select modifier... ​' }));
    userEvent.click(await screen.findByRole('option', { name: 'Confirmed' }));
    expect(screen.getByRole('button', { name: 'Add' })).not.toBeDisabled();
    userEvent.click(screen.getByRole('button', { name: 'Add' }));

    expect(updateModifiers).toHaveBeenCalledTimes(1);
  });
});
