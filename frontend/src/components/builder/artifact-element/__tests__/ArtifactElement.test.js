import React from 'react';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import nock from 'nock';
import _ from 'lodash';
import { fireEvent, render, screen, userEvent, waitFor, within } from 'utils/test-utils';
import { createTemplateInstance } from 'utils/test_helpers';
import {
  genericInstance,
  genericBaseElementInstance,
  genericBaseElementUseInstance,
  genericInstanceWithModifiers
} from 'utils/test_fixtures';
import mockModifiers from 'mocks/modifiers/mockModifiers';
import { getFieldWithType } from 'utils/instances';
import ArtifactElement from '../ArtifactElement';
import { getElementErrors } from 'utils/warnings';

describe('<ArtifactElement />', () => {
  const apiKey = 'api-123';
  const elementInstance = createTemplateInstance(genericInstance);
  const defaultModifiersByInputType = {};
  mockModifiers.forEach(modifier => {
    modifier.inputTypes.forEach(inputType => {
      defaultModifiersByInputType[inputType] = (defaultModifiersByInputType[inputType] || []).concat(modifier);
    });
  });

  const baseElementBeingUsed = {
    ...createTemplateInstance(genericBaseElementInstance),
    uniqueId: 'element-1',
    usedBy: ['element-2']
  };

  const useOfBaseElementInInclusions = {
    ...createTemplateInstance(genericBaseElementUseInstance),
    tab: 'expTreeInclude',
    uniqueId: 'element-2'
  };

  const baseElementNotBeingUsed = {
    ...createTemplateInstance(genericBaseElementInstance),
    uniqueId: 'element-3',
    usedBy: []
  };

  const renderComponentWithState = ({
    baseElements = [],
    baseElementInUsedList = false,
    elementInstance = {},
    expTreeInclude = { childInstances: [] },
    handleDeleteElement = jest.fn(),
    handleUpdateElement = jest.fn(),
    hasErrors = false,
    label = '',
    updateModifiers = jest.fn(),
    ...props
  } = {}) =>
    render(
      <Provider
        store={createStore(x => x, {
          artifacts: {
            artifact: {
              _id: 'artifact-id',
              fhirVersion: '4.0.1',
              expTreeInclude,
              expTreeExclude: { childInstances: [] },
              subpopulations: [],
              baseElements,
              parameters: []
            }
          },
          vsac: { apiKey }
        })}
      >
        <ArtifactElement
          baseElementInUsedList={baseElementInUsedList}
          elementInstance={elementInstance}
          handleDeleteElement={handleDeleteElement}
          handleUpdateElement={handleUpdateElement}
          hasErrors={hasErrors}
          label={label || elementInstance.name}
          updateModifiers={updateModifiers}
          {...props}
        />
      </Provider>
    );

  beforeEach(() => {
    nock('http://localhost').persist().get(`/authoring/api/modifiers/artifact-id`).reply(200, mockModifiers);
  });

  afterAll(() => nock.restore());

  it('should display value set details from artifact element without editing', () => {
    const { valueSets } = getFieldWithType(elementInstance.fields, '_vsac');
    const { container } = renderComponentWithState({ elementInstance });

    const [selectedValueSet] = container.querySelectorAll('#value-set-list-template');
    expect(selectedValueSet).toHaveTextContent(`Value Set 1: ${valueSets[0].name} (${valueSets[0].oid})`);
  });

  it('should delete a value set from an artifact element', async () => {
    const vsacField = getFieldWithType(elementInstance.fields, '_vsac');
    const { valueSets } = vsacField;
    const handleUpdateElement = jest.fn();

    renderComponentWithState({ handleUpdateElement, elementInstance });

    await waitFor(() => userEvent.click(screen.getByRole('button', { name: 'Delete Value Set VS' })));

    expect(handleUpdateElement).toHaveBeenCalledWith([
      { [vsacField.id]: [valueSets[1]], attributeToEdit: 'valueSets' }
    ]);
  });

  it('should delete a code from an artifact element', async () => {
    const vsacField = getFieldWithType(elementInstance.fields, '_vsac');
    const { codes } = vsacField;
    const handleUpdateElement = jest.fn();

    renderComponentWithState({ elementInstance, handleUpdateElement });

    await waitFor(() => userEvent.click(screen.getByRole('button', { name: 'delete code TestName (123-4)' })));

    expect(handleUpdateElement).toHaveBeenCalledWith([{ [vsacField.id]: [codes[1]], attributeToEdit: 'codes' }]);
  });

  it('should hide the body and footer when collapsed', () => {
    const { container, getByLabelText } = renderComponentWithState({ elementInstance });

    fireEvent.click(getByLabelText('collapse'));

    expect(container.querySelector('.card-element__body')).toBeNull();
    expect(container.querySelector('.card-element__footer')).toBeNull();
  });

  describe('BaseElements instances', () => {
    const renderBaseElementComponent = (props = {}) =>
      renderComponentWithState({
        expTreeInclude: { childInstances: [useOfBaseElementInInclusions] },
        baseElements: [baseElementBeingUsed, baseElementNotBeingUsed],
        elementInstance: baseElementBeingUsed,
        ...props
      });

    const renderBaseElementComponentWithState = ({
      expTreeInclude = { childInstances: [useOfBaseElementInInclusions] },
      baseElements = [baseElementBeingUsed, baseElementNotBeingUsed],
      baseElementInUsedList = false,
      elementInstance = baseElementBeingUsed,
      handleDeleteElement = jest.fn(),
      handleUpdateElement = jest.fn(),
      hasErrors = false,
      label = '',
      updateModifiers = jest.fn(),
      ...props
    } = {}) =>
      render(
        <Provider
          store={createStore(x => x, {
            artifacts: {
              artifact: {
                _id: 'artifact-id',
                fhirVersion: '4.0.1',
                expTreeInclude,
                expTreeExclude: { childInstances: [] },
                subpopulations: [],
                baseElements,
                parameters: []
              }
            },
            vsac: { apiKey }
          })}
        >
          <ArtifactElement
            baseElementInUsedList={baseElementInUsedList}
            elementInstance={elementInstance}
            handleDeleteElement={handleDeleteElement}
            handleUpdateElement={handleUpdateElement}
            hasErrors={hasErrors}
            label={label || elementInstance.name}
            updateModifiers={updateModifiers}
            {...props}
          />
        </Provider>
      );

    it('cannot be deleted if in use in the artifact', () => {
      const handleDeleteElement = jest.fn();
      const { getByLabelText, queryByText } = renderBaseElementComponent({ handleDeleteElement });
      fireEvent.click(getByLabelText('delete Observation'));
      expect(queryByText('Delete')).toBeNull();
      expect(handleDeleteElement).not.toBeCalled();
    });

    it('can be deleted if not in use in the artifact', () => {
      const handleDeleteElement = jest.fn();
      const { getByLabelText, getByText } = renderBaseElementComponent({
        handleDeleteElement,
        elementInstance: baseElementNotBeingUsed
      });

      fireEvent.click(getByLabelText('delete Observation'));
      fireEvent.click(getByText('Delete'));
      expect(handleDeleteElement).toHaveBeenCalledTimes(1);
      expect(handleDeleteElement).toHaveBeenCalledWith(); // No arguments
    });

    it('cannot add modifiers that change the return type if in use in the artifact', async () => {
      renderBaseElementComponentWithState();

      await waitFor(() => userEvent.click(screen.getAllByRole('button', { name: /Add Modifiers/i })[0]));
      const modal = within(await screen.findByRole('dialog'));
      await waitFor(() => userEvent.click(modal.getAllByRole('button', { name: 'Select Modifiers' })[0]));
      await waitFor(() => userEvent.click(modal.getByLabelText('Select modifier...')));

      await waitFor(() => {
        expect(screen.queryAllByRole('option').length).toBe(3);
      });

      expect(screen.queryAllByText(/Limited modifiers/i).length).toBeGreaterThan(0);
      expect(screen.getByText('Verified')).toBeInTheDocument();
      expect(screen.getByText('With Unit')).toBeInTheDocument();
      expect(screen.getByText('Look Back')).toBeInTheDocument();
    });

    it('displays all modifiers when not in use', async () => {
      renderBaseElementComponentWithState({
        elementInstance: {
          ...baseElementBeingUsed,
          usedBy: []
        }
      });
      await waitFor(() => userEvent.click(screen.getAllByRole('button', { name: /Add Modifiers/i })[0]));
      const modal = within(await screen.findByRole('dialog'));
      await waitFor(() => userEvent.click(modal.getAllByRole('button', { name: 'Select Modifiers' })[0]));
      await waitFor(() => userEvent.click(modal.getByLabelText('Select modifier...')));
      await waitFor(() => expect(screen.queryAllByRole('option').length).toBe(10));
    });

    it('can remove modifiers that do not change the return type', async () => {
      const modifiers = genericInstanceWithModifiers.modifiers;
      const updateModifiers = jest.fn();
      renderBaseElementComponent({
        elementInstance: {
          ...baseElementBeingUsed,
          modifiers
        },
        updateModifiers
      });

      updateModifiers.mockClear();
      fireEvent.click(screen.getAllByRole('button', { name: 'remove modifier' })[0]);
      await waitFor(() => userEvent.click(screen.getByRole('button', { name: 'Delete' })));

      expect(updateModifiers).toBeCalled();
    });

    it('cannot remove modifiers that change the return type if in use in the artifact', () => {
      const modifiers = genericInstanceWithModifiers.modifiers;
      const updateModifiers = jest.fn();
      renderBaseElementComponent({
        elementInstance: {
          ...baseElementBeingUsed,
          modifiers
        },
        updateModifiers
      });

      updateModifiers.mockClear();
      fireEvent.click(screen.getAllByRole('button', { name: 'remove modifier' })[1]);

      expect(updateModifiers).not.toBeCalled();
    });

    it('can remove modifiers', async () => {
      const updateModifiers = jest.fn();
      renderBaseElementComponent({
        elementInstance: {
          ...baseElementNotBeingUsed,
          modifiers: genericInstanceWithModifiers.modifiers
        },
        updateModifiers
      });

      updateModifiers.mockClear();
      fireEvent.click(screen.getAllByRole('button', { name: 'remove modifier' })[2]);
      await waitFor(() => userEvent.click(screen.getByRole('button', { name: 'Delete' })));

      expect(updateModifiers).toHaveBeenCalledWith(genericInstanceWithModifiers.modifiers.slice(0, -1));
    });

    it('visualizes original base element information on base element uses', () => {
      const baseElementUse = { ...useOfBaseElementInInclusions };
      baseElementUse.fields[0].value = 'Use of Base Element in Inclusions';
      const baseElement = { ...baseElementBeingUsed };
      baseElement.fields[0].value = 'Base Element Being Used';
      renderBaseElementComponent({
        expTreeInclude: { childInstances: [baseElementUse] },
        baseElements: [baseElement, baseElementNotBeingUsed],
        elementInstance: baseElementUse
      });

      expect(screen.getByText(/base element being used/i)).toBeInTheDocument();
    });

    it('uses the root base element for type and phrase on base element uses of use', () => {
      const useNameFieldIndex = useOfBaseElementInInclusions.fields.findIndex(({ id }) => id === 'element_name');

      // create new use of base element, add verified modifier, and change name
      let verifiedUseOfBaseElementInInclusions = _.cloneDeep(useOfBaseElementInInclusions);
      verifiedUseOfBaseElementInInclusions.modifiers = [
        {
          id: 'VerifiedObservation',
          name: 'Verified',
          inputTypes: ['list_of_observations'],
          returnType: 'list_of_observations',
          cqlTemplate: 'BaseModifier',
          cqlLibraryFunction: 'C3F.Verified'
        }
      ];
      verifiedUseOfBaseElementInInclusions.uniqueId = 'element-4';
      verifiedUseOfBaseElementInInclusions.fields[useNameFieldIndex].value =
        'Verified use of Base Element in Inclusions';

      // create new use of base element in base elements, add exists modifier, and change name
      const existsUseOfBaseElementInInclusions = _.cloneDeep(useOfBaseElementInInclusions);
      existsUseOfBaseElementInInclusions.modifiers = [
        {
          id: 'BooleanExists',
          name: 'Exists',
          inputTypes: ['list_of_observations'],
          returnType: 'boolean',
          cqlTemplate: 'BaseModifier',
          cqlLibraryFunction: 'exists'
        }
      ];
      existsUseOfBaseElementInInclusions.uniqueId = 'element-5';
      existsUseOfBaseElementInInclusions.fields[useNameFieldIndex].value = 'Exists use of Base Element in Inclusions';

      // reset the name of the base element being used for clarity
      const baseElement = { ...baseElementBeingUsed };
      baseElement.fields[0].value = 'Base Element Being Used';

      const { container } = renderComponentWithState({
        baseElements: [baseElement],
        expTreeInclude: { childInstances: [verifiedUseOfBaseElementInInclusions] },
        elementInstance: existsUseOfBaseElementInInclusions,
        label: 'Observation' // This is calculated by getLabelForInstance and passed in as a prop
      });

      // The base element the use came directly from
      expect(screen.getByDisplayValue(/exists use of base element in inclusions/i)).toBeInTheDocument();
      expect(screen.getByText('Base Element:').parentNode.textContent).toEqual('Base Element:Base Element Being Used ');

      // The top most base element's type
      expect(screen.getByText(/observation:/i)).toBeInTheDocument();

      // Only the current elements modifiers are listed
      expect(document.getElementById('modifiers-template')).toHaveTextContent('Exists');

      // All modifiers and VS included in the phrase
      expect(container.querySelector('[class^="ElementCard-expressionPhrase"]')).toHaveTextContent(
        'Thereexistsanobservationwith a code fromVS,VS2,123-4 (TestName),or...'
      );
    });

    describe('Base Element List instances have child instances inside which', () => {
      const templateWithModifiersInstance = createTemplateInstance(genericInstanceWithModifiers);

      it('cannot be indented/outdented ever', () => {
        const { container } = renderComponentWithState({
          allowIndent: false,
          elementInstance: templateWithModifiersInstance
        });

        expect(within(container).queryByLabelText('indent')).not.toBeInTheDocument();
      });

      it('can remove modifiers', async () => {
        const updateModifiers = jest.fn();
        renderComponentWithState({
          baseElementInUsedList: true,
          elementInstance: templateWithModifiersInstance,
          updateModifiers
        });

        updateModifiers.mockClear();

        await waitFor(() => userEvent.click(screen.getAllByRole('button', { name: 'remove modifier' })[2]));
        await waitFor(() => userEvent.click(screen.getByRole('button', { name: 'Delete' })));

        expect(updateModifiers).toHaveBeenCalledWith(templateWithModifiersInstance.modifiers.slice(0, -1));
      });

      it('cannot remove modifiers that change return type when in use', () => {
        const updateModifiers = jest.fn();
        renderComponentWithState({
          baseElementInUsedList: true,
          elementInstance: {
            ...templateWithModifiersInstance,
            modifiers: templateWithModifiersInstance.modifiers.slice(0, -1)
          },
          updateModifiers
        });

        updateModifiers.mockClear();

        const removeButton = screen.getAllByRole('button', { name: 'remove modifier' })[1];
        fireEvent.click(removeButton);

        expect(updateModifiers).not.toBeCalled();
        expect(removeButton).toBeDisabled();
      });

      it('cannot add modifiers that change return type when in use', async () => {
        renderComponentWithState({
          baseElementInUsedList: true,
          elementInstance: templateWithModifiersInstance
        });
        await waitFor(() => userEvent.click(screen.getAllByRole('button', { name: /Add Modifiers/i })[0]));
        const modal = within(await screen.findByRole('dialog'));
        await waitFor(() => userEvent.click(modal.getAllByRole('button', { name: 'Select Modifiers' })[0]));
        await waitFor(() => userEvent.click(modal.getByLabelText('Select modifier...')));

        await waitFor(() => {
          expect(screen.queryAllByText('Limited modifiers', { exact: false }).length).toBeGreaterThan(0);
        });
      });

      it('cannot be deleted when list in use', () => {
        const handleDeleteElement = jest.fn();
        const { getByLabelText } = renderComponentWithState({
          baseElementInUsedList: true,
          handleDeleteElement,
          elementInstance: templateWithModifiersInstance
        });

        fireEvent.click(getByLabelText('delete Observation'));
        expect(handleDeleteElement).not.toBeCalled();

        expect(getByLabelText('delete Observation')).toBeDisabled();
      });
    });

    describe('Base Element warnings', () => {
      const newBaseElementBeingUsed = _.cloneDeep(baseElementBeingUsed);
      newBaseElementBeingUsed.fields[0].value = 'Base Element Being Used';

      const newUseOfBaseElementInInclusions = _.cloneDeep(useOfBaseElementInInclusions);
      newUseOfBaseElementInInclusions.fields[0].value = 'Base Element Being Used'; // Name isn't changed on use (yet)

      it('should have no warnings on unmodified uses', () => {
        // Add Exists to ensure that there are no warnings (about changes or the need for boolean return type)
        const baseElement = _.cloneDeep(newBaseElementBeingUsed);
        baseElement.modifiers = [
          {
            id: 'BooleanExists',
            name: 'Exists',
            inputTypes: ['list_of_observations'],
            returnType: 'boolean',
            cqlTemplate: 'BaseModifier',
            cqlLibraryFunction: 'exists'
          }
        ];
        const elementInstance = newUseOfBaseElementInInclusions;
        const baseElements = [baseElement];
        const allInstancesInAllTrees = [baseElement, elementInstance];
        const alerts = getElementErrors(
          elementInstance,
          allInstancesInAllTrees,
          baseElements,
          [
            { id: 'element-1', name: 'Base Element Being Used' },
            { id: 'element-2', name: 'Base Element Being Used' }
          ],
          []
        );
        const { container } = renderComponentWithState({
          elementInstance,
          baseElements,
          expTreeInclude: { childInstances: [newUseOfBaseElementInInclusions] },
          alerts
        });

        // No warnings on unmodified use
        expect(within(container).queryAllByRole('alert')).toHaveLength(0);
        expect(alerts.filter(a => a.showAlert)).toHaveLength(0);
      });

      it('should have a warning on modified uses of base elements', () => {
        let notNullUseOfBaseElementInInclusions = _.cloneDeep(newUseOfBaseElementInInclusions);
        notNullUseOfBaseElementInInclusions.modifiers = [
          {
            id: 'CheckExistence',
            name: 'Is (Not) Null?',
            inputTypes: ['boolean'],
            returnType: 'boolean',
            values: {
              value: 'is not null'
            },
            cqlTemplate: 'postModifier'
          }
        ];
        const elementInstance = notNullUseOfBaseElementInInclusions;
        const baseElements = [newBaseElementBeingUsed];
        const allInstancesInAllTrees = [newBaseElementBeingUsed, notNullUseOfBaseElementInInclusions];
        const alerts = getElementErrors(
          elementInstance,
          allInstancesInAllTrees,
          baseElements,
          [
            { id: 'element-1', name: 'Base Element Being Used' },
            { id: 'element-2', name: 'Base Element Being Used' }
          ],
          []
        );

        const { container } = renderComponentWithState({
          elementInstance,
          baseElements,
          expTreeInclude: { childInstances: [notNullUseOfBaseElementInInclusions] },
          alerts
        });

        expect(within(container).queryAllByRole('alert')).toHaveLength(1);
        expect(
          screen.getByText('Warning: This use of the Base Element has changed. Choose another name.')
        ).toBeDefined();
        expect(alerts.filter(a => a.showAlert)).toHaveLength(1);
      });

      it('should have no warnings on unmodified uses of uses', () => {
        let useOfBaseElementInBaseElements = _.cloneDeep(useOfBaseElementInInclusions);
        useOfBaseElementInBaseElements.tab = 'baseElements';

        const elementInstance = useOfBaseElementInBaseElements;
        const baseElements = [newBaseElementBeingUsed, useOfBaseElementInBaseElements];
        const allInstancesInAllTrees = [newBaseElementBeingUsed, useOfBaseElementInBaseElements];
        const alerts = getElementErrors(
          elementInstance,
          allInstancesInAllTrees,
          baseElements,
          [
            { id: 'element-1', name: 'Base Element Being Used' },
            { id: 'element-2', name: 'Base Element Observation' }
          ],
          []
        );

        const { container } = renderComponentWithState({
          elementInstance,
          baseElements,
          expTreeInclude: { childInstances: [] },
          alerts
        });

        // No warnings on unmodified use
        expect(within(container).queryAllByRole('alert')).toHaveLength(0);
        expect(alerts.filter(a => a.showAlert)).toHaveLength(0);
      });

      it('should have no warnings on base element instance with no modified uses', () => {
        const elementInstance = newUseOfBaseElementInInclusions;
        const baseElements = [newBaseElementBeingUsed];
        const allInstancesInAllTrees = [newBaseElementBeingUsed, newUseOfBaseElementInInclusions];
        const alerts = getElementErrors(
          elementInstance,
          allInstancesInAllTrees,
          baseElements,
          [
            { id: 'element-1', name: 'Base Element Being Used' },
            { id: 'element-2', name: 'Base Element Being Used' }
          ],
          []
        );

        const { container } = renderComponentWithState({
          elementInstance,
          baseElements,
          expTreeInclude: { childInstances: [elementInstance] },
          alerts
        });

        expect(within(container).queryAllByRole('alert')).toHaveLength(0);
        expect(alerts.filter(a => a.showAlert)).toHaveLength(0);
      });

      it('should have a duplicate name warning on unmodified use with a different element with duplicate name (not a use)', () => {
        const copyOfBaseElementBeingUsed = _.cloneDeep(newBaseElementBeingUsed);
        copyOfBaseElementBeingUsed.uniqueId = 'element-6';
        copyOfBaseElementBeingUsed.usedBy = ['element-7'];

        const useOfCopyOfBaseElementInInclusions = _.cloneDeep(newUseOfBaseElementInInclusions);
        useOfCopyOfBaseElementInInclusions.uniqueId = 'element-7';

        const elementInstance = useOfCopyOfBaseElementInInclusions;
        const baseElements = [newBaseElementBeingUsed, copyOfBaseElementBeingUsed];
        const allInstancesInAllTrees = [
          newBaseElementBeingUsed,
          newUseOfBaseElementInInclusions,
          copyOfBaseElementBeingUsed,
          useOfCopyOfBaseElementInInclusions
        ];
        const alerts = getElementErrors(
          elementInstance,
          allInstancesInAllTrees,
          baseElements,
          [
            { id: 'element-1', name: 'Base Element Being Used' },
            { id: 'element-2', name: 'Base Element Being Used' },
            { id: 'element-6', name: 'Base Element Being Used' },
            { id: 'element-7', name: 'Base Element Being Used' }
          ],
          []
        );

        const { container, getByText } = renderComponentWithState({
          elementInstance,
          baseElements,
          expTreeInclude: { childInstances: [newUseOfBaseElementInInclusions, elementInstance] },
          alerts
        });

        expect(within(container).queryAllByRole('alert')).toHaveLength(1);
        expect(getByText('Warning: Name already in use. Choose another name.')).toBeDefined();
        expect(alerts.filter(a => a.showAlert)).toHaveLength(1);
      });

      it('should have no warning on unmodified use with another use with same name', () => {
        const copyOfNewUseOfBaseElementInInclusion = _.cloneDeep(newUseOfBaseElementInInclusions);
        copyOfNewUseOfBaseElementInInclusion.uniqueId = 'element-7';

        const elementInstance = copyOfNewUseOfBaseElementInInclusion;
        const baseElements = [newBaseElementBeingUsed];
        const allInstancesInAllTrees = [
          newBaseElementBeingUsed,
          newUseOfBaseElementInInclusions,
          copyOfNewUseOfBaseElementInInclusion
        ];
        const alerts = getElementErrors(
          elementInstance,
          allInstancesInAllTrees,
          baseElements,
          [
            { id: 'element-1', name: 'Base Element Being Used' },
            { id: 'element-2', name: 'Base Element Being Used' },
            { id: 'element-7', name: 'Base Element Being Used' }
          ],
          []
        );

        const { container } = renderComponentWithState({
          baseElements,
          elementInstance,
          expTreeInclude: { childInstances: [newUseOfBaseElementInInclusions, elementInstance] },
          alerts
        });

        expect(within(container).queryAllByRole('alert')).toHaveLength(0);
        expect(alerts.filter(a => a.showAlert)).toHaveLength(0);
      });
    });
  });
});
