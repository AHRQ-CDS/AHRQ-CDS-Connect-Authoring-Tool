import React from 'react';
import TemplateInstance from '../TemplateInstance';
import { render, fireEvent } from '../../../utils/test-utils';
import { createTemplateInstance } from '../../../utils/test_helpers';
import {
  genericInstance,
  genericInstanceWithModifiers,
  genericBaseElementInstance,
  genericBaseElementUseInstance
} from '../../../utils/test_fixtures';
import { getFieldWithType } from '../../../utils/instances';

const templateInstance = createTemplateInstance(genericInstance);
const baseElementTemplateInstance = {
  ...createTemplateInstance(genericBaseElementInstance),
  uniqueId: 'originalBaseElementId',
  usedBy: ['baseElementUseId']
};
const baseElementUseTemplateInstance = {
  ...createTemplateInstance(genericBaseElementUseInstance),
  uniqueId: 'baseElementUseId',
  tab: 'expTreeInclude'
};

describe('<TemplateInstance />', () => {
  const renderComponent = (props = {}) =>
    render(
      <TemplateInstance
        allInstancesInAllTrees={[]}
        baseElements={[]}
        codeData={{}}
        deleteInstance={jest.fn()}
        disableElement={false}
        disableIndent={false}
        editInstance={jest.fn()}
        getPath={(path) => path}
        getVSDetails={jest.fn()}
        instanceNames={[]}
        isRetrievingDetails={false}
        isSearchingVSAC={false}
        isValidatingCode={false}
        isValidCode={false}
        loadValueSets={jest.fn()}
        loginVSACUser={jest.fn()}
        otherInstances={[]}
        parameters={[]}
        renderIndentButtons={jest.fn()}
        resetCodeValidation={jest.fn()}
        scrollToElement={jest.fn()}
        searchVSACByKeyword={jest.fn()}
        setVSACAuthStatus={jest.fn()}
        subpopulationIndex={0}
        templateInstance={templateInstance}
        treeName="MeetsInclusionCriteria"
        updateInstanceModifiers={jest.fn()}
        validateCode={jest.fn()}
        validateReturnType={false}
        valueSets={[]}
        vsacDetailsCodes={[]}
        vsacDetailsCodesError=""
        vsacFHIRCredentials={{ username: 'name', password: 'pass' }}
        vsacSearchCount={0}
        vsacSearchResults={[]}
        vsacStatus=""
        vsacStatusText=""
        {...props}
      />
    );

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
      const { getByText } = renderComponent({ vsacFHIRCredentials: { username: null, password: null } });

      expect(getByText('Authenticate VSAC')).not.toHaveAttribute('disabled');
    });

    it('disables the VSAC controls if logged in', () => {
      const { getByText } = renderComponent();

      expect(getByText('VSAC Authenticated')).toHaveAttribute('disabled');
    });

    it('can view value set details from template instance without editing', () => {
      const { valueSets } = getFieldWithType(templateInstance.fields, '_vsac');
      const { container } = renderComponent();

      const [selectedValueSet] = container.querySelectorAll('.vs-info');
      expect(selectedValueSet).toHaveTextContent(`Value Set 1: ${valueSets[0].name} (${valueSets[0].oid})`);
    });

    it('can delete a value set from a template instance', () => {
      const vsacField = getFieldWithType(templateInstance.fields, '_vsac');
      const { valueSets } = vsacField;
      const editInstance = jest.fn();

      const { container }  = renderComponent({ editInstance });

      const deleteValueSetIcon = container.querySelector('#delete-valueset');
      fireEvent.click(deleteValueSetIcon);

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

      const { container } = renderComponent({ editInstance });

      const deleteCodeIcon = container.querySelector('#delete-code');
      fireEvent.click(deleteCodeIcon);

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
        allInstancesInAllTrees: [baseElementTemplateInstance, baseElementUseTemplateInstance],
        baseElements: [baseElementTemplateInstance],
        templateInstance: baseElementTemplateInstance,
        ...props
      });

    it('can navigate to its uses', () => {
      const scrollToElement = jest.fn();
      const { getByLabelText } = renderBaseElementComponent({ scrollToElement });

      fireEvent.click(getByLabelText('see element definition'));

      expect(scrollToElement).toHaveBeenCalledWith('baseElementUseId', 'baseElementUse', 0);
    });

    it('cannot be deleted if in use in the artifact', () => {
      const deleteInstance = jest.fn();
      const { getByLabelText } = renderBaseElementComponent({ deleteInstance });

      fireEvent.click(getByLabelText(`remove ${baseElementTemplateInstance.name}`));
      expect(deleteInstance).not.toBeCalled();
    });


    it('can be deleted if not in use in the artifact', () => {
      const deleteInstance = jest.fn();
      const { getByLabelText } = renderBaseElementComponent({
        deleteInstance,
        templateInstance: {
          ...baseElementTemplateInstance,
          usedBy: []
        }
      });

      fireEvent.click(getByLabelText(`remove ${baseElementTemplateInstance.name}`));
      expect(deleteInstance).toHaveBeenCalledWith('MeetsInclusionCriteria', 'originalBaseElementId');
    });

    it('cannot add modifiers that change the return type if in use in the artifact', () => {
      const { container, getByText, getByLabelText } = renderBaseElementComponent();

      fireEvent.click(getByLabelText('add expression'));

      expect(getByText('Limited expressions displayed because return type cannot change while in use.')).toBeDefined();

      const modifierOptions = [...container.querySelectorAll('.modifier__button')].map(node => node.textContent);
      expect(modifierOptions).toEqual(['Verified', 'With Unit', 'Look Back']);
    });

    it('displays all modifiers when not in use', () => {
      const { container, getByLabelText } = renderBaseElementComponent({
        templateInstance: {
          ...baseElementTemplateInstance,
          usedBy: []
        }
      });

      fireEvent.click(getByLabelText('add expression'));

      const modifierOptions = [...container.querySelectorAll('.modifier__button')].map(node => node.textContent);
      expect(modifierOptions).toEqual([
        'Verified',
        'With Unit',
        'Highest Observation Value',
        'Most Recent',
        'Look Back',
        'Count',
        'Exists',
        'Is (Not) Null?'
      ]);
    });

    it('cannot remove modifiers that change the return type if in use in the artifact', () => {
      const modifiers = genericInstanceWithModifiers.modifiers.slice(0, -1);
      const updateInstanceModifiers = jest.fn();
      const { getByLabelText } = renderBaseElementComponent({
        templateInstance: {
          ...baseElementTemplateInstance,
          modifiers
        },
        updateInstanceModifiers
      });

      updateInstanceModifiers.mockClear();
      fireEvent.click(getByLabelText('remove last expression'));

      expect(updateInstanceModifiers).not.toBeCalled();
    });

    it('can remove modifiers', () => {
      const updateInstanceModifiers = jest.fn();
      const { getByLabelText } = renderBaseElementComponent({
        templateInstance: {
          ...baseElementTemplateInstance,
          modifiers: genericInstanceWithModifiers.modifiers
        },
        updateInstanceModifiers
      });

      updateInstanceModifiers.mockClear();
      fireEvent.click(getByLabelText('remove last expression'));

      expect(updateInstanceModifiers).toHaveBeenCalledWith(
        'MeetsInclusionCriteria',
        genericInstanceWithModifiers.modifiers.slice(0, -1),
        'originalBaseElementId',
        0
      );
    });
  });

  describe('Base Element uses', () => {
    const renderBaseElementUseComponent = (props = {}) =>
      renderComponent({
        baseElements: [baseElementTemplateInstance],
        instanceNames: [
          { id: 'originalBaseElementId', name: 'My Base Element' },
          { id: baseElementUseTemplateInstance.uniqueId, name: 'Base Element Observation' }
        ],
        templateInstance: baseElementUseTemplateInstance,
        ...props
      });

    it('visualizes original base element information', () => {
      const { container } = renderBaseElementUseComponent();

      expect(container.querySelector('#base-element-list')).toHaveTextContent('Base Element:My Base Element');
    });

    it('can navigate to original definition', () => {
      const scrollToElement = jest.fn();
      const { getByLabelText } = renderBaseElementUseComponent({ scrollToElement });

      fireEvent.click(getByLabelText('see element definition'));

      expect(scrollToElement).toHaveBeenCalledWith('originalBaseElementId', 'baseElementReference', undefined);
    });
  });

  describe('Base Element Uses of Use', () => {
    it('uses root base element for type and phrase', () => {
      const { fields: useFields } = baseElementUseTemplateInstance;
      const { fields: baseFields } = baseElementTemplateInstance;
      const useNameFieldIndex = useFields.findIndex(({ id }) => id === 'element_name');
      const useReferenceFieldIndex = useFields.findIndex(({ id }) => id === 'baseElementReference');
      const baseNameFieldIndex = baseFields.findIndex(({ id }) => id === 'element_name');

      const useElement = {
        ...baseElementUseTemplateInstance,
        fields: [...useFields],
        modifiers: [{
          id: 'VerifiedObservation',
          name: 'Verified',
          inputTypes: ['list_of_observations'],
          returnType: 'list_of_observations',
          cqlTemplate: 'BaseModifier',
          cqlLibraryFunction: 'C3F.Verified'
        }]
      };
      useElement.fields.splice(useNameFieldIndex, 1, {
        ...useFields[useNameFieldIndex],
        value: 'B'
      });

      const originalBaseElement = {
        ...baseElementTemplateInstance,
        fields: [...baseFields],
        usedBy: [useElement.uniqueId],
        uniqueId: 'originalBaseElementId'
      };
      originalBaseElement.fields.splice(baseNameFieldIndex, 1, {
        ...baseFields[baseNameFieldIndex],
        value: 'A'
      });

      const useOfUseElement = {
        ...baseElementUseTemplateInstance,
        fields: [...useFields],
        modifiers: [{
          id: 'BooleanExists',
          name: 'Exists',
          inputTypes: ['list_of_observations'],
          returnType: 'boolean',
          cqlTemplate: 'BaseModifier',
          cqlLibraryFunction: 'exists'
        }],
        uniqueId: 'useOfUseId'
      };
      useOfUseElement.fields.splice(useNameFieldIndex, 1, {
        ...useFields[useNameFieldIndex],
        value: 'C'
      });
      useOfUseElement.fields.splice(useReferenceFieldIndex, 1, {
        ...useFields[useReferenceFieldIndex],
        value: {
          id: useElement.uniqueId,
          type: 'Base Element'
        }
      });
      useElement.usedBy = [useOfUseElement.uniqueId];

      const { container } = renderComponent({
        baseElements: [originalBaseElement, useElement, useOfUseElement],
        instanceNames: [
          { id: 'originalBaseElementId', name: 'A' },
          { id: 'useOfUseId', name: 'C' },
          { id: useElement.uniqueId, name: 'B' }
        ],
        templateInstance: useOfUseElement
      });

      // The base element the use came directly from
      expect(container.querySelector('#base-element-list')).toHaveTextContent('Base Element:B');

      // The topmost base element's type
      expect(container.querySelector('.card-element__heading .label')).toHaveTextContent('Observation');

      // Only the current elements expressions are listed
      expect(container.querySelector('.applied-modifiers__info-expressions .modifier__list'))
        .toHaveTextContent('Exists');

      // All expressions and VS included in the phrase
      expect(container.querySelector('.expression-logic'))
        .toHaveTextContent('Thereexistsaverifiedobservationwith a code fromVS,VS2,123-4 (TestName),or...');
    });
  });

  describe('Base Element List instance\'s have child instances inside which', () => {
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
      const { getByLabelText } = renderComponent({
        disableElement: true,
        templateInstance: templateWithModifiersInstance,
        updateInstanceModifiers
      });

      updateInstanceModifiers.mockClear();

      fireEvent.click(getByLabelText('remove last expression'));

      expect(updateInstanceModifiers).toHaveBeenCalledWith(
        'MeetsInclusionCriteria',
        templateWithModifiersInstance.modifiers.slice(0, -1),
        templateWithModifiersInstance.uniqueId,
        0
      );
    });

    it('cannot remove modifiers that change return type when in use', () => {
      const updateInstanceModifiers = jest.fn();
      const { getByLabelText } = renderComponent({
        disableElement: true,
        templateInstance: {
          ...templateWithModifiersInstance,
          modifiers: templateWithModifiersInstance.modifiers.slice(0, -1)
        },
        updateInstanceModifiers
      });

      updateInstanceModifiers.mockClear();

      fireEvent.click(getByLabelText('remove last expression'));

      expect(updateInstanceModifiers).not.toBeCalled();
    });

    it('cannot add modifiers that change return type when in use', () => {
      const { getByLabelText, getByText } = renderComponent({
        disableElement: true,
        templateInstance: templateWithModifiersInstance
      });

      fireEvent.click(getByLabelText('add expression'));

      expect(getByText('Limited expressions displayed because return type cannot change while in use.')).toBeDefined();
    });

    it('cannot be deleted when list in use', () => {
      const deleteInstance = jest.fn();
      const { getByLabelText } = renderComponent({
        disableElement: true,
        deleteInstance,
        templateInstance: templateWithModifiersInstance
      });

      fireEvent.click(getByLabelText(`remove ${templateWithModifiersInstance.name}`));

      expect(deleteInstance).not.toBeCalled();
    });
  });

  describe('Base Element warnings', () => {
    const nameFieldIndex = baseElementTemplateInstance.fields.findIndex(({ id }) => id === 'element_name');
    const originalBaseElement = {
      ...baseElementTemplateInstance,
      fields: [...baseElementTemplateInstance.fields],
      uniqueId: 'originalBaseElementId'
    };
    originalBaseElement.fields.splice(nameFieldIndex, 1, {
      ...originalBaseElement.fields[nameFieldIndex],
      value: 'Base Element Observation'
    });

    it('unmodified uses have no warnings', () => {
      const { container } = renderComponent({
        baseElements: [
          originalBaseElement
        ],
        templateInstance: {
          ...baseElementUseTemplateInstance,
          instanceNames: [
            { id: 'originalBaseElementId', name: 'Base Element Observation' },
            { id: baseElementUseTemplateInstance.uniqueId, name: 'Base Element Observation' }
          ]
        }
      });

      // No warnings on unmodified use
      expect(container.querySelectorAll('.warning')).toHaveLength(0);
    });

    it('modified uses to have a warning', () => {
      const { container, getByText } = renderComponent({
        baseElements: [originalBaseElement],
        instanceNames: [
          { id: 'originalBaseElementId', name: 'Base Element Observation' },
          { id: baseElementUseTemplateInstance.uniqueId, name: 'Base Element Observation' }
        ],
        templateInstance: {
          ...baseElementUseTemplateInstance,
          modifiers: [{
            id: 'BooleanExists',
            name: 'Exists',
            inputTypes: ['list_of_observations'],
            returnType: 'boolean',
            cqlTemplate: 'BaseModifier',
            cqlLibraryFunction: 'exists'
          }]
        }
      });

      expect(container.querySelectorAll('.warning')).toHaveLength(1);
      expect(getByText('Warning: This use of the Base Element has changed. Choose another name.')).toBeDefined();
    });

    it('unmodified uses of uses have no warnings', () => {
      const useNameFieldIndex = baseElementUseTemplateInstance.fields.findIndex(({ id }) => id === 'element_name');
      const useOfUseElement = {
        ...baseElementUseTemplateInstance,
        uniqueId: 'useOfUseId'
      };
      useOfUseElement.fields.splice(useNameFieldIndex, 1, {
        ...useOfUseElement.fields[useNameFieldIndex],
        value: 'Base Element Observation'
      });

      const { container } = renderComponent({
        allInstancesInAllTrees: [originalBaseElement, templateInstance, useOfUseElement],
        baseElements: [originalBaseElement, templateInstance, useOfUseElement],
        instanceNames: [
          { id: 'originalBaseElementId', name: 'Base Element Observation' },
          { id: 'useOfUseId', name: 'Base Element Observation' },
          { id: baseElementUseTemplateInstance.uniqueId, name: 'Base Element Observation' }
        ],
        templateInstance: {
          ...baseElementUseTemplateInstance,
          usedBy: ['useOfUseId']
        }
      });

      // No warnings on unmodified use
      expect(container.querySelectorAll('.warning')).toHaveLength(0);
    });

    it('instance with no modified uses to have no warning', () => {
      const { container } = renderComponent({
        instanceNames: [
          { id: 'originalBaseElementId', name: 'Base Element Observation' },
          { id: baseElementUseTemplateInstance.uniqueId, name: 'Base Element Observation' }
        ],
        templateInstance: {
          ...baseElementTemplateInstance,
          allInstancesInAllTrees: [
            baseElementTemplateInstance,
            baseElementUseTemplateInstance
          ],
          modifiers: [{
            id: 'BooleanExists',
            name: 'Exists',
            inputTypes: ['list_of_observations'],
            returnType: 'boolean',
            cqlTemplate: 'BaseModifier',
            cqlLibraryFunction: 'exists'
          }],
          usedBy: [baseElementUseTemplateInstance.uniqueId]
        }
      });

      expect(container.querySelectorAll('.warning')).toHaveLength(0);
    });

    it.skip('instances with modified use have a warning', () => {
      const modifiedUse = {
        ...baseElementUseTemplateInstance,
        modifiers: [{
          id: 'BooleanNot',
          name: 'Not',
          inputTypes: ['boolean'],
          returnType: 'boolean',
          cqlTemplate: 'BaseModifier',
          cqlLibraryFunction: 'not'
        }]
      };

      const { container, getByText } = renderComponent({
        allInstancesInAllTrees: [baseElementTemplateInstance, modifiedUse],
        instanceNames: [
          { id: 'originalBaseElementId', name: 'Base Element Observation' },
          { id: modifiedUse.uniqueId, name: 'Base Element Observation' }
        ],
        templateInstance: {
          ...baseElementTemplateInstance,
          modifiers: [{
            id: 'BooleanExists',
            name: 'Exists',
            inputTypes: ['list_of_observations'],
            returnType: 'boolean',
            cqlTemplate: 'BaseModifier',
            cqlLibraryFunction: 'exists'
          }],
          usedBy: [modifiedUse.uniqueId]
        }
      });

      expect(container.querySelectorAll('.warning')).toHaveLength(1);
      expect(getByText('Warning: One or more uses of this Base Element have changed. Choose another name.'))
        .toBeDefined();
    });

    it.skip(
      'unmodified use with a different element with duplicate name (not a use) has duplicate name warning',
      () => {
        const useNameFieldIndex = baseElementUseTemplateInstance.fields.findIndex(({ id }) => id === 'element_name');
        const unmodifiedUse = {
          ...baseElementUseTemplateInstance
        };

        const tempInstanceWithSameName = {
          ...templateInstance,
          fields: [...templateInstance.fields]
        };

        const { container, getByText } = renderComponent({
          allInstancesInAllTrees: [
            originalBaseElement,
            unmodifiedUse,
            tempInstanceWithSameName
          ],
          baseElements: [originalBaseElement],
          instanceNames: [
            { id: 'originalBaseElementId', name: 'Base Element Observation' },
            { id: unmodifiedUse.uniqueId, name: unmodifiedUse.fields[useNameFieldIndex].value },
            {
              id: tempInstanceWithSameName.uniqueId,
              name: templateInstance.fields.find(({ id }) => id === 'element_name').value
            }
          ],
          templateInstance: unmodifiedUse
        });

        expect(container.querySelectorAll('.warning')).toHaveLength(1);
        expect(getByText('Warning: One or more uses of this Base Element have changed. Choose another name.'))
          .toBeDefined();
      }
    );

    it('unmodified use with another use with same name gives no duplicate name warning', () => {
      const unmodifiedUse = { ...baseElementUseTemplateInstance };
      const secondUse = { ...baseElementUseTemplateInstance };
      const usedOriginalBaseElement = {
        ...originalBaseElement,
        usedBy: [
          unmodifiedUse.uniqueId,
          secondUse.uniqueId
        ]
      };

      const getElementNameField = ({ id }) => id === 'element_name';

      const { container } = renderComponent({
        allInstancesInAllTrees: [
          originalBaseElement,
          unmodifiedUse,
          secondUse
        ],
        baseElements: [usedOriginalBaseElement],
        instanceNames: [
          { id: 'originalBaseElementId', name: 'Base Element Observation' },
          { id: unmodifiedUse.uniqueId, name: getElementNameField(unmodifiedUse.fields).value },
          { id: secondUse.uniqueId, name: getElementNameField(secondUse.fields).value }
        ],
        templateInstance: unmodifiedUse
      });

      expect(container.querySelectorAll('.warning')).toHaveLength(0);
    });
  });
});
