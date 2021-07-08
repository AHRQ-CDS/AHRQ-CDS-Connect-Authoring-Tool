import React from 'react';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import nock from 'nock';
import { render, fireEvent, userEvent, screen } from 'utils/test-utils';
import { createTemplateInstance } from 'utils/test_helpers';
import {
  genericInstance,
  genericInstanceWithModifiers,
  genericBaseElementInstance,
  genericBaseElementUseInstance
} from 'utils/test_fixtures';
import { getFieldWithType } from 'utils/instances';
import mockModifiers from 'mocks/mockModifiers';
import TemplateInstance from '../TemplateInstance';
import { mockArtifact } from 'mocks/artifacts';
import { mockExternalCqlLibrary } from 'mocks/external-cql';
import { mockTemplates } from 'mocks/templates';
import _ from 'lodash';

const templateInstance = createTemplateInstance(genericInstance);

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

const modifiersByInputType = {};

mockModifiers.forEach(modifier => {
  modifier.inputTypes.forEach(inputType => {
    modifiersByInputType[inputType] = (modifiersByInputType[inputType] || []).concat(modifier);
  });
});

describe('<TemplateInstance />', () => {
  const renderComponent = (props = {}) =>
    render(
      <Provider
        store={createStore(x => x, {
          artifacts: {
            artifact: mockArtifact,
            names: [
              { id: 'element-1', name: 'Base Element Being Used' },
              { id: 'element-2', name: 'Use of Base Element in Inclusions' },
              { id: 'element-3', name: 'Base Element Not Being Used' },
              { id: 'element-4', name: 'B' },
              { id: 'element-5', name: 'C' }
            ]
          },
          modifiers: { modifierMap: {} },
          vsac: { apiKey: 'key' }
        })}
      >
        <TemplateInstance
          allInstancesInAllTrees={[]}
          baseElements={[]}
          deleteInstance={jest.fn()}
          disableAddElement={false}
          disableIndent={false}
          editInstance={jest.fn()}
          getPath={path => path}
          instanceNames={[]}
          isLoadingModifiers={false}
          modifierMap={{}}
          modifiersByInputType={modifiersByInputType}
          otherInstances={[]}
          parameters={[]}
          renderIndentButtons={jest.fn()}
          subpopulationIndex={0}
          templateInstance={templateInstance}
          treeName="MeetsInclusionCriteria"
          updateInstanceModifiers={jest.fn()}
          validateReturnType={false}
          vsacApiKey="key"
          {...props}
        />
      </Provider>
    );

  beforeEach(() => {
    nock('http://localhost')
      .persist()
      .get(`/authoring/api/externalCQL/${mockArtifact._id}`)
      .reply(200, [mockExternalCqlLibrary])
      .get('/authoring/api/config/templates')
      .reply(200, mockTemplates);
  });

  afterEach(() => nock.cleanAll());

  let origCreateRange;

  beforeEach(() => {
    origCreateRange = global.document.createRange;
    document.createRange = () => ({
      setStart: () => {},
      setEnd: () => {},
      commonAncestorContainer: {
        nodeName: 'BODY',
        ownerDocument: document
      }
    });
  });

  afterEach(() => {
    global.document.createRange = origCreateRange;
  });

  describe('generic template instances', () => {
    it('enables the VSAC controls if not logged in', () => {
      renderComponent({ vsacApiKey: null });

      expect(screen.getByRole('button', { name: 'Authenticate VSAC' })).not.toBeDisabled();
    });

    it('disables the VSAC controls if logged in', () => {
      renderComponent();

      expect(screen.getByRole('button', { name: 'VSAC Authenticated' })).toBeDisabled();
    });

    it('can view value set details from template instance without editing', () => {
      const { valueSets } = getFieldWithType(templateInstance.fields, '_vsac');
      const { container } = renderComponent();

      const [selectedValueSet] = container.querySelectorAll('#value-set-list-template');
      expect(selectedValueSet).toHaveTextContent(`Value Set 1: ${valueSets[0].name} (${valueSets[0].oid})`);
    });

    it('can delete a value set from a template instance', () => {
      const vsacField = getFieldWithType(templateInstance.fields, '_vsac');
      const { valueSets } = vsacField;
      const editInstance = jest.fn();

      renderComponent({ editInstance });

      userEvent.click(screen.getByRole('button', { name: 'delete value set VS' }));

      expect(editInstance).toHaveBeenCalledWith(
        'MeetsInclusionCriteria',
        [{ [vsacField.id]: [valueSets[1]], attributeToEdit: 'valueSets' }],
        templateInstance.uniqueId,
        false
      );
    });

    it('can delete a code from a template instance', () => {
      const vsacField = getFieldWithType(templateInstance.fields, '_vsac');
      const { codes } = vsacField;
      const editInstance = jest.fn();

      renderComponent({ editInstance });

      userEvent.click(screen.getByRole('button', { name: 'delete code TestName (123-4)' }));

      expect(editInstance).toHaveBeenCalledWith(
        'MeetsInclusionCriteria',
        [{ [vsacField.id]: [codes[1]], attributeToEdit: 'codes' }],
        templateInstance.uniqueId,
        false
      );
    });

    it('can hides the body and footer when collapsed', () => {
      const { container, getByLabelText } = renderComponent();

      fireEvent.click(getByLabelText(`hide ${templateInstance.name}`));

      expect(container.querySelector('.card-element__body')).toBeNull();
      expect(container.querySelector('.card-element__footer')).toBeNull();
    });
  });

  describe('Base Element instances', () => {
    const renderBaseElementComponent = (props = {}) =>
      renderComponent({
        allInstancesInAllTrees: [baseElementBeingUsed, baseElementNotBeingUsed, useOfBaseElementInInclusions],
        baseElements: [baseElementBeingUsed, baseElementNotBeingUsed],
        templateInstance: baseElementBeingUsed,
        ...props
      });

    it('cannot be deleted if in use in the artifact', () => {
      const deleteInstance = jest.fn();
      const { getByLabelText, queryByText } = renderBaseElementComponent({ deleteInstance });

      fireEvent.click(getByLabelText(`remove ${baseElementBeingUsed.name}`));
      expect(queryByText('Delete')).toBeNull();
      expect(deleteInstance).not.toBeCalled();
    });

    it('can be deleted if not in use in the artifact', () => {
      const deleteInstance = jest.fn();
      const { getByLabelText, getByText } = renderBaseElementComponent({
        deleteInstance,
        templateInstance: baseElementNotBeingUsed
      });

      fireEvent.click(getByLabelText(`remove ${baseElementBeingUsed.name}`));
      fireEvent.click(getByText('Delete'));
      expect(deleteInstance).toHaveBeenCalledWith('MeetsInclusionCriteria', 'element-3');
    });

    it('cannot add modifiers that change the return type if in use in the artifact', () => {
      renderBaseElementComponent();

      userEvent.click(screen.getByRole('button', { name: 'Add expression' }));

      expect(
        screen.getByText('Limited expressions displayed because return type cannot change while in use.')
      ).toBeInTheDocument();

      expect(document.querySelectorAll('.modifier-select-button')).toHaveLength(3);
      expect(screen.getByRole('button', { name: 'Verified' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'With Unit' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Look Back' })).toBeInTheDocument();
    });

    it('displays all modifiers when not in use', () => {
      renderBaseElementComponent({
        templateInstance: {
          ...baseElementBeingUsed,
          usedBy: []
        }
      });

      userEvent.click(screen.getByRole('button', { name: 'Add expression' }));

      [
        'Verified',
        'With Unit',
        'Average Observation Value',
        'Highest Observation Value',
        'Most Recent',
        'First',
        'Look Back',
        'Count',
        'Exists',
        'Is (Not) Null?'
      ].forEach(name => {
        expect(screen.getByRole('button', { name })).toBeInTheDocument();
      });
      expect(document.querySelectorAll('.modifier-select-button')).toHaveLength(10);
    });

    it('can remove modifiers that do not change the return type', () => {
      const modifiers = genericInstanceWithModifiers.modifiers;
      const updateInstanceModifiers = jest.fn();
      renderBaseElementComponent({
        templateInstance: {
          ...baseElementBeingUsed,
          getAllInstancesInAllTrees: () => baseElementBeingUsed.childInstances,
          modifiers
        },
        updateInstanceModifiers
      });

      updateInstanceModifiers.mockClear();
      fireEvent.click(screen.getAllByRole('button', { name: 'remove expression' })[0]);

      expect(updateInstanceModifiers).toBeCalled();
    });

    it('cannot remove modifiers that change the return type if in use in the artifact', () => {
      const modifiers = genericInstanceWithModifiers.modifiers;
      const updateInstanceModifiers = jest.fn();
      renderBaseElementComponent({
        templateInstance: {
          ...baseElementBeingUsed,
          getAllInstancesInAllTrees: () => baseElementBeingUsed.childInstances,
          modifiers
        },
        updateInstanceModifiers
      });

      updateInstanceModifiers.mockClear();
      fireEvent.click(screen.getAllByRole('button', { name: 'remove expression' })[1]);

      expect(updateInstanceModifiers).not.toBeCalled();
    });

    it('can remove modifiers', () => {
      const updateInstanceModifiers = jest.fn();
      renderBaseElementComponent({
        templateInstance: {
          ...baseElementNotBeingUsed,
          modifiers: genericInstanceWithModifiers.modifiers
        },
        updateInstanceModifiers
      });

      updateInstanceModifiers.mockClear();
      fireEvent.click(screen.getAllByRole('button', { name: 'remove expression' })[2]);

      expect(updateInstanceModifiers).toHaveBeenCalledWith(
        'MeetsInclusionCriteria',
        genericInstanceWithModifiers.modifiers.slice(0, -1),
        'element-3',
        0
      );
    });
  });

  describe('Base Element uses', () => {
    const renderBaseElementUseComponent = (props = {}) =>
      renderComponent({
        allInstancesInAllTrees: [baseElementBeingUsed, useOfBaseElementInInclusions],
        baseElements: [baseElementBeingUsed],
        instanceNames: [
          { id: 'element-1', name: 'Base Element Being Used' },
          { id: 'element-2', name: 'Use of Base Element in Inclusions' }
        ],
        templateInstance: useOfBaseElementInInclusions,
        ...props
      });

    it('visualizes original base element information', () => {
      renderBaseElementUseComponent();

      expect(screen.getByText(/base element being used/i)).toBeInTheDocument();
    });
  });

  describe('Base Element Uses of Use', () => {
    it('uses root base element for type and phrase', () => {
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
      let existsUseOfBaseElementInInclusions = _.cloneDeep(useOfBaseElementInInclusions);
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

      const { container } = renderComponent({
        allInstancesInAllTrees: [
          baseElementBeingUsed,
          verifiedUseOfBaseElementInInclusions,
          existsUseOfBaseElementInInclusions
        ],
        baseElements: [baseElementBeingUsed],
        instanceNames: [
          { id: 'element-1', name: 'Base Element Being Used' },
          { id: 'element-4', name: 'Verified use of Base Element in Inclusions' },
          { id: 'element-5', name: 'Exists use of Base Element in Inclusions' }
        ],
        templateInstance: existsUseOfBaseElementInInclusions
      });

      // The base element the use came directly from
      expect(screen.getByDisplayValue(/exists use of base element in inclusions/i)).toBeInTheDocument();

      // The top most base element's type
      expect(screen.getByText(/observation:/i)).toBeInTheDocument();

      // Only the current elements expressions are listed
      expect(document.getElementById('modifiers-template')).toHaveTextContent('Expressions:Exists');

      // All expressions and VS included in the phrase
      expect(container.querySelector('.expression-logic')).toHaveTextContent(
        'Thereexistsanobservationwith a code fromVS,VS2,123-4 (TestName),or...'
      );
    });
  });

  describe("Base Element List instance's have child instances inside which", () => {
    const templateWithModifiersInstance = createTemplateInstance(genericInstanceWithModifiers);

    it('cannot be indented/outdented ever', () => {
      const renderIndentButtons = jest.fn();

      renderComponent({
        disableIndent: true,
        renderIndentButtons,
        templateInstance: templateWithModifiersInstance
      });

      expect(renderIndentButtons).not.toBeCalled();
    });

    it('can remove modifiers', () => {
      const updateInstanceModifiers = jest.fn();
      renderComponent({
        disableAddElement: true,
        templateInstance: templateWithModifiersInstance,
        updateInstanceModifiers
      });

      updateInstanceModifiers.mockClear();

      fireEvent.click(screen.getAllByRole('button', { name: 'remove expression' })[2]);

      expect(updateInstanceModifiers).toHaveBeenCalledWith(
        'MeetsInclusionCriteria',
        templateWithModifiersInstance.modifiers.slice(0, -1),
        templateWithModifiersInstance.uniqueId,
        0
      );
    });

    it('cannot remove modifiers that change return type when in use', () => {
      const updateInstanceModifiers = jest.fn();
      renderComponent({
        disableAddElement: true,
        templateInstance: {
          ...templateWithModifiersInstance,
          modifiers: templateWithModifiersInstance.modifiers.slice(0, -1)
        },
        updateInstanceModifiers
      });

      updateInstanceModifiers.mockClear();

      fireEvent.click(screen.getAllByRole('button', { name: 'remove expression' })[1]);

      expect(updateInstanceModifiers).not.toBeCalled();
    });

    it('cannot add modifiers that change return type when in use', () => {
      renderComponent({
        disableAddElement: true,
        templateInstance: templateWithModifiersInstance
      });

      userEvent.click(screen.getByRole('button', { name: 'Add expression' }));

      expect(
        screen.getByText('Limited expressions displayed because return type cannot change while in use.')
      ).toBeInTheDocument();
    });

    it('cannot be deleted when list in use', () => {
      const deleteInstance = jest.fn();
      const { getByLabelText } = renderComponent({
        disableAddElement: true,
        deleteInstance,
        templateInstance: templateWithModifiersInstance
      });

      fireEvent.click(getByLabelText(`remove ${templateWithModifiersInstance.name}`));

      expect(deleteInstance).not.toBeCalled();
    });
  });

  describe('Base Element warnings', () => {
    const newBaseElementBeingUsed = _.cloneDeep(baseElementBeingUsed);
    newBaseElementBeingUsed.fields[0].value = 'Base Element Being Used';

    const newUseOfBaseElementInInclusions = _.cloneDeep(useOfBaseElementInInclusions);
    newUseOfBaseElementInInclusions.fields[0].value = 'Base Element Being Used';

    const renderBaseElementComponent = instanceToTest =>
      renderComponent({
        allInstancesInAllTrees: [newBaseElementBeingUsed, instanceToTest],
        baseElements: [newBaseElementBeingUsed],
        templateInstance: instanceToTest
      });

    it('unmodified uses have no warnings', () => {
      const { container } = renderBaseElementComponent(newUseOfBaseElementInInclusions);

      // No warnings on unmodified use
      expect(container.querySelectorAll('.warning')).toHaveLength(0);
    });

    it('modified uses to have a warning', () => {
      let verifiedUseOfBaseElementInInclusions = _.cloneDeep(newUseOfBaseElementInInclusions);
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

      renderBaseElementComponent(verifiedUseOfBaseElementInInclusions);

      expect(screen.getByText('Warning: This use of the Base Element has changed. Choose another name.')).toBeDefined();
    });

    it('unmodified uses of uses have no warnings', () => {
      let useOfBaseElementInBaseElements = _.cloneDeep(useOfBaseElementInInclusions);
      useOfBaseElementInBaseElements.tab = 'baseElements';

      const { container } = renderBaseElementComponent(useOfBaseElementInBaseElements);

      // No warnings on unmodified use
      expect(container.querySelectorAll('.warning')).toHaveLength(0);
    });

    it('instance with no modified uses to have no warning', () => {
      const copyOfBaseElementBeingUsed = _.cloneDeep(newBaseElementBeingUsed);
      copyOfBaseElementBeingUsed.uniqueId = 'element-6';

      const { container } = renderBaseElementComponent(copyOfBaseElementBeingUsed);

      expect(container.querySelectorAll('.warning')).toHaveLength(0);
    });

    it('unmodified use with a different element with duplicate name (not a use) has duplicate name warning', () => {
      const copyOfBaseElementBeingUsed = _.cloneDeep(newBaseElementBeingUsed);
      copyOfBaseElementBeingUsed.uniqueId = 'element-6';
      copyOfBaseElementBeingUsed.usedBy = ['element-7'];

      const useOfCopyOfBaseElementInInclusions = _.cloneDeep(newUseOfBaseElementInInclusions);
      useOfCopyOfBaseElementInInclusions.uniqueId = 'element-7';

      const { container, getByText } = renderComponent({
        allInstancesInAllTrees: [
          newBaseElementBeingUsed,
          newUseOfBaseElementInInclusions,
          copyOfBaseElementBeingUsed,
          useOfCopyOfBaseElementInInclusions
        ],
        instanceNames: [
          { id: 'element-1', name: 'Base Element Being Used' },
          { id: 'element-2', name: 'Base Element Being Used' },
          { id: 'element-6', name: 'Base Element Being Used' },
          { id: 'element-7', name: 'Base Element Being Used' }
        ],
        baseElements: [newBaseElementBeingUsed, copyOfBaseElementBeingUsed],
        templateInstance: useOfCopyOfBaseElementInInclusions
      });

      expect(container.querySelectorAll('.warning')).toHaveLength(1);
      expect(getByText('Warning: Name already in use. Choose another name.')).toBeDefined();
    });

    it('unmodified use with another use with same name gives no duplicate name warning', () => {
      const copyOfNewUseOfBaseElementInInclusion = _.cloneDeep(newUseOfBaseElementInInclusions);
      copyOfNewUseOfBaseElementInInclusion.uniqueId = 'element-7';

      const { container } = renderComponent({
        allInstancesInAllTrees: [
          newBaseElementBeingUsed,
          newUseOfBaseElementInInclusions,
          copyOfNewUseOfBaseElementInInclusion
        ],
        instanceNames: [
          { id: 'element-1', name: 'Base Element Being Used' },
          { id: 'element-2', name: 'Base Element Being Used' },
          { id: 'element-7', name: 'Base Element Being Used' }
        ],
        baseElements: [newBaseElementBeingUsed],
        templateInstance: copyOfNewUseOfBaseElementInInclusion
      });

      expect(container.querySelectorAll('.warning')).toHaveLength(0);
    });
  });
});
