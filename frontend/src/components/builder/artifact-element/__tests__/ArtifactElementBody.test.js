import React from 'react';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import nock from 'nock';
import { render, screen, within } from 'utils/test-utils';
import ArtifactElementBody from '../ArtifactElementBody';

describe('<ArtifactElementBody />', () => {
  const renderComponentWithState = ({
    allInstancesInAllTrees = [],
    baseElements = [],
    baseElementIsUsed = false,
    elementInstance = {},
    handleUpdateElement = jest.fn(),
    instanceNames = [],
    updateModifiers = jest.fn(),
    ...props
  } = {}) =>
    render(
      <Provider
        store={createStore(x => x, {
          artifacts: { artifact: { _id: 'artifact-id', fhirVersion: '4.0.1', baseElements, parameters: [] } },
          vsac: { apiKey: 'api-123' }
        })}
      >
        <ArtifactElementBody
          allInstancesInAllTrees={allInstancesInAllTrees}
          baseElementIsUsed={baseElementIsUsed}
          elementInstance={elementInstance}
          handleUpdateElement={handleUpdateElement}
          instanceNames={instanceNames}
          updateModifiers={updateModifiers}
          {...props}
        />
      </Provider>
    );

  beforeEach(() => {
    nock('http://localhost').persist().get(`/authoring/api/modifiers/artifact-id`).reply(200, []);
  });

  afterAll(() => nock.restore());

  it('should render validation errors', () => {
    const elementInstanceWithValidationError = {
      fields: [
        { id: 'element_name', type: 'string', name: 'Element Name', value: 'Example' },
        { id: 'min_age', type: 'number', typeOfNumber: 'integer', name: 'Minimum Age' },
        { id: 'max_age', type: 'number', typeOfNumber: 'integer', name: 'Maximum Age' },
        {
          id: 'unit_of_time',
          type: 'string', // Simpler unit_of_time modifier
          name: 'Unit of Time',
          value: { id: 'a', name: 'years', value: 'AgeInYears()' }
        }
      ],
      validator: { type: 'requiredIfThenOne', fields: ['unit_of_time', 'min_age', 'max_age'] }
    };
    renderComponentWithState({ elementInstance: elementInstanceWithValidationError });
    const validationError = screen.getByText(/you must specify unit of time and one of minimum age, maximum age/i);
    expect(validationError).toBeInTheDocument();
  });

  it('should render return type errors', () => {
    const elementInstanceWithReturnTypeError = {
      fields: [
        {
          id: 'element_name',
          type: 'string',
          name: 'Element Name',
          value: 'Complications of Pregnancy, Childbirth and the Puerperium'
        },
        { id: 'comment', type: 'textarea', name: 'Comment' },
        {
          id: 'condition',
          type: 'condition_vsac',
          name: 'Condition',
          static: true,
          valueSets: [
            {
              name: 'Complications',
              oid: '2.234.432.1'
            }
          ]
        }
      ]
    };
    renderComponentWithState({ elementInstance: elementInstanceWithReturnTypeError });
    const returnTypeError = screen.getByText(/element must have return type 'boolean' \(true\/false\)/i);
    expect(returnTypeError).toBeInTheDocument();
  });

  it('should render an expression phrase', () => {
    const elementInstance = {
      name: 'Age Range',
      returnType: 'boolean',
      modifiers: [],
      fields: [
        { id: 'element_name', type: 'string', name: 'Element Name', value: 'Adult' },
        { id: 'min_age', type: 'number', typeOfNumber: 'integer', name: 'Minimum Age', value: 18 },
        { id: 'max_age', type: 'number', typeOfNumber: 'integer', name: 'Maximum Age', value: null },
        {
          id: 'unit_of_time',
          type: 'string', // Simpler unit_of_time modifier
          name: 'Unit of Time',
          value: { id: 'a', name: 'years', value: 'AgeInYears()' }
        }
      ]
    };
    const { container } = renderComponentWithState({ elementInstance });
    expect(container.querySelectorAll('[class^="ElementCard-expressionPhrase"]')).toHaveLength(1);
  });

  it('should render element fields (but not name or comment)', () => {
    const elementInstance = {
      name: 'Age Range',
      returnType: 'boolean',
      modifiers: [],
      fields: [
        { id: 'element_name', type: 'string', name: 'Element Name', value: 'Adult' },
        { id: 'comment', type: 'textarea', name: 'Comment' },
        { id: 'min_age', type: 'number', typeOfNumber: 'integer', name: 'Minimum Age', value: 18 },
        { id: 'max_age', type: 'number', typeOfNumber: 'integer', name: 'Maximum Age', value: null },
        {
          id: 'unit_of_time',
          type: 'string', // Simpler unit_of_time modifier
          name: 'Unit of Time',
          value: { id: 'a', name: 'years', value: 'AgeInYears()' }
        }
      ]
    };
    const { container } = renderComponentWithState({ elementInstance });
    const fields = container.querySelectorAll('#field-template');
    expect(fields).toHaveLength(3); // min_age, max_age, unit_of_time
  });

  it('should render External CQL field arguments', () => {
    nock('http://localhost').persist().get(`/authoring/api/externalCQL/artifact-id`).reply(200);
    const externalCQLElementInstance = {
      type: 'externalCqlElement',
      tab: 'expTreeInclude',
      fields: [
        { id: 'element_name', type: 'string', name: 'Element Name', value: 'TestQuantity' },
        { id: 'comment', type: 'textarea', name: 'Comment', value: '' },
        {
          id: 'externalCqlReference',
          type: 'reference',
          name: 'reference',
          static: true,
          value: {
            id: 'Test (Function) from TestLibrary',
            element: 'Test',
            library: 'TestLibrary',
            arguments: [
              {
                name: 'quantity',
                operandTypeSpecifier: {
                  localId: '134',
                  locator: '44:39-44:53',
                  resultTypeName: '{urn:hl7-org:elm-types:r1}Quantity',
                  name: '{urn:hl7-org:elm-types:r1}Quantity',
                  type: 'NamedTypeSpecifier'
                },
                value: { argSource: 'editor', type: 'system_quantity' }
              }
            ]
          }
        }
      ]
    };
    renderComponentWithState({
      elementInstance: externalCQLElementInstance,
      allInstancesInAllTrees: [externalCQLElementInstance]
    });
    expect(screen.getByTestId('external-cql-template')).toBeInTheDocument();
  });

  it('should render value sets and codes', () => {
    const elementInstance = {
      id: 'GenericObservation_vsac',
      fields: [
        { id: 'element_name', type: 'string', name: 'Element Name', value: 'active ldld' },
        { id: 'comment', type: 'textarea', name: 'Comment' },
        {
          id: 'condition',
          type: 'condition_vsac',
          name: 'Condition',
          static: true,
          valueSets: [{ name: 'LDL', oid: '2.123.432' }],
          codes: [{ display: 'Fake Code', code: '123', codeSystem: { name: 'SNOMED', id: 'http://snomed.info/sct' } }]
        }
      ]
    };
    const { container } = renderComponentWithState({ elementInstance });
    const vs = container.querySelector('#value-set-list-template');
    expect(vs.textContent).toEqual('Value Set: LDL (2.123.432)');
    const codes = container.querySelector('#code-list-template');
    expect(codes.textContent).toEqual('Code:SNOMED (123)  - Fake Code');
  });

  it('should render references to other elements from External CQL arguments', () => {
    nock('http://localhost').persist().get(`/authoring/api/externalCQL/artifact-id`).reply(200);
    const externalCQLElementInstance = {
      type: 'externalCqlElement',
      tab: 'expTreeInclude',
      fields: [
        { id: 'element_name', type: 'string', name: 'Element Name', value: 'TestQuantity' },
        { id: 'comment', type: 'textarea', name: 'Comment', value: '' },
        {
          id: 'externalCqlReference',
          type: 'reference',
          name: 'reference',
          static: true,
          value: {
            id: 'Test (Function) from TestLibrary',
            element: 'Test',
            library: 'TestLibrary',
            arguments: [
              {
                name: 'quantity',
                operandTypeSpecifier: {
                  localId: '134',
                  locator: '44:39-44:53',
                  resultTypeName: '{urn:hl7-org:elm-types:r1}Quantity',
                  name: '{urn:hl7-org:elm-types:r1}Quantity',
                  type: 'NamedTypeSpecifier'
                },
                value: {
                  argSource: 'baseElement', // BaseElement source rather than editor
                  selected: 'GenericObservation_vsac-123',
                  elementName: 'Observation'
                }
              }
            ]
          }
        }
      ]
    };
    const observation = {
      name: 'Observation',
      id: 'GenericObservation_vsac',
      uniqueId: 'GenericObservation_vsac-123',
      returnType: 'list_of_observations',
      modifiers: [
        {
          id: 'HighestObservationValue',
          name: 'Highest Observation Value',
          inputTypes: ['list_of_observations'],
          returnType: 'system_quantity',
          cqlTemplate: 'BaseModifier',
          cqlLibraryFunction: 'C3F.HighestObservation',
          uniqueId: 'HighestObservationValue-413ca53a-c14e-428a-bd30-6cc4a47fbe71'
        }
      ],
      fields: [{ id: 'element_name', type: 'string', name: 'Element Name', value: 'Observation' }]
    };
    const { container } = renderComponentWithState({
      elementInstance: externalCQLElementInstance,
      baseElements: [observation],
      allInstancesInAllTrees: [externalCQLElementInstance, observation]
    });
    const baseElementReference = container.childNodes[3];
    // Because the external CQL uses an argument that references a base element, the base element reference template is displayed
    expect(baseElementReference.textContent).toEqual('Base Element:Observation ');
    expect(within(baseElementReference).getByRole('button')).toBeInTheDocument();
  });

  it('should render references to base elements with a link', () => {
    const baseElementUseElementInstance = {
      tab: 'expTreeInclude',
      uniqueId: '345',
      name: 'Procedure',
      returnType: 'list_of_procedures',
      modifiers: [],
      fields: [
        {
          id: 'element_name',
          type: 'string',
          name: 'Element Name',
          value: 'MyProcedure'
        },
        {
          id: 'baseElementReference',
          type: 'reference',
          name: 'reference',
          value: { id: 'GenericProcedure_vsac-123', type: 'Procedure' },
          static: true
        }
      ]
    };
    const procedureBaseElement = {
      tab: 'baseElements',
      name: 'Procedure',
      id: 'GenericProcedure_vsac',
      uniqueId: 'GenericProcedure_vsac-123',
      returnType: 'list_of_procedures',
      modifiers: [],
      fields: [
        { id: 'element_name', type: 'string', name: 'Element Name', value: 'ExampleProcedure' },
        {
          id: 'procedure',
          type: 'procedure_vsac',
          name: 'Procedure',
          static: true,
          valueSets: [{ name: 'FakeProcedure', oid: '2.3.345.3' }]
        }
      ]
    };
    const { container } = renderComponentWithState({
      elementInstance: baseElementUseElementInstance,
      baseElements: [procedureBaseElement],
      instanceNames: [
        { id: 'GenericProcedure_vsac-123', name: 'ExampleProcedure' },
        { id: '345', name: 'Procedure' }
      ],
      allInstancesInAllTrees: [baseElementUseElementInstance, procedureBaseElement]
    });
    const baseElementReference = container.childNodes[1];
    expect(baseElementReference.textContent).toEqual('Base Element:ExampleProcedure ');
    expect(within(baseElementReference).queryByRole('button')).toBeInTheDocument();
  });

  it('should render references to external CQL element without a link', () => {
    const externalCQLElementInstance = {
      tab: 'expTreeInclude',
      fields: [
        { id: 'element_name', type: 'string', name: 'Element Name', value: 'Age' },
        { id: 'comment', type: 'textarea', name: 'Comment', value: '' },
        {
          id: 'externalCqlReference',
          type: 'reference',
          name: 'reference',
          value: { id: 'Age from MyLibrary', element: 'Age', library: 'MyLibrary' },
          static: true
        }
      ]
    };
    const { container } = renderComponentWithState({
      elementInstance: externalCQLElementInstance,
      allInstancesInAllTrees: [externalCQLElementInstance]
    });
    const externalCQLReference = container.childNodes[2];
    expect(externalCQLReference.textContent).toEqual('External CQL Element:Age from MyLibrary ');
    expect(within(externalCQLReference).queryByRole('button')).not.toBeInTheDocument();
  });

  it("should render a reference to a BaseElement's uses", () => {
    const procedureBaseElement = {
      tab: 'baseElements',
      name: 'Procedure',
      id: 'GenericProcedure_vsac',
      uniqueId: 'GenericProcedure_vsac-123',
      returnType: 'list_of_procedures',
      modifiers: [],
      usedBy: ['345'],
      fields: [
        { id: 'element_name', type: 'string', name: 'Element Name', value: 'ExampleProcedure' },
        {
          id: 'procedure',
          type: 'procedure_vsac',
          name: 'Procedure',
          static: true,
          valueSets: [{ name: 'FakeProcedure', oid: '2.3.345.3' }]
        }
      ]
    };
    const baseElementUseElementInstance = {
      tab: 'expTreeInclude',
      uniqueId: '345',
      fields: [
        {
          id: 'element_name',
          type: 'string',
          name: 'Element Name',
          value: 'Procedure Exists'
        },
        {
          id: 'baseElementReference',
          type: 'reference',
          name: 'reference',
          value: { id: 'GenericProcedure_vsac-123', type: 'Procedure' },
          static: true
        },
        { id: 'comment', type: 'textarea', name: 'Comment', value: '' }
      ]
    };
    const { container } = renderComponentWithState({
      elementInstance: procedureBaseElement,
      baseElements: [procedureBaseElement],
      allInstancesInAllTrees: [procedureBaseElement, baseElementUseElementInstance],
      instanceNames: [
        { id: '345', name: 'Procedure Exists' },
        { id: 'GenericProcedure_vsac-123', name: 'ExampleProcedure' }
      ]
    });
    const elementUseReference = container.childNodes[4];
    expect(elementUseReference.textContent).toEqual('Element Use:Procedure Exists → Inclusions');
    expect(within(elementUseReference).getByRole('button')).toBeInTheDocument();
  });

  it('should render modifiers when present', () => {
    const elementInstance = {
      name: 'Age Range',
      returnType: 'boolean',
      modifiers: [
        {
          id: 'BooleanNot',
          name: 'Not',
          inputTypes: ['boolean'],
          returnType: 'boolean',
          cqlTemplate: 'BaseModifier',
          cqlLibraryFunction: 'not',
          uniqueId: 'BooleanNot-e7d04242-a739-4d9c-bc7a-2acd9e3ebb8a'
        }
      ],
      fields: [
        { id: 'element_name', type: 'string', name: 'Element Name', value: 'Adult' },
        { id: 'min_age', type: 'number', typeOfNumber: 'integer', name: 'Minimum Age', value: 18 },
        { id: 'max_age', type: 'number', typeOfNumber: 'integer', name: 'Maximum Age', value: null },
        {
          id: 'unit_of_time',
          type: 'string', // Simpler unit_of_time modifier
          name: 'Unit of Time',
          value: { id: 'a', name: 'years', value: 'AgeInYears()' }
        }
      ]
    };
    let { container } = renderComponentWithState({ elementInstance: elementInstance });
    const modifiers = container.childNodes[2];
    expect(modifiers.textContent).toEqual('Modifiers:Not');

    elementInstance.modifiers = [];
    ({ container } = renderComponentWithState({ elementInstance: elementInstance }));
    // Because there are no modifiers, the modifiers template is not rendered and the return type is rendered next
    const returnType = container.childNodes[2];
    expect(returnType.textContent).toEqual('Return Type:Boolean');
  });

  it('renders the return type', () => {
    const elementInstance = {
      name: 'Age Range',
      returnType: 'boolean',
      fields: [
        { id: 'element_name', type: 'string', name: 'Element Name', value: 'Adult' },
        { id: 'min_age', type: 'number', typeOfNumber: 'integer', name: 'Minimum Age', value: 18 },
        { id: 'max_age', type: 'number', typeOfNumber: 'integer', name: 'Maximum Age', value: null },
        {
          id: 'unit_of_time',
          type: 'string', // Simpler unit_of_time modifier
          name: 'Unit of Time',
          value: { id: 'a', name: 'years', value: 'AgeInYears()' }
        }
      ]
    };
    let { container } = renderComponentWithState({ elementInstance: elementInstance });
    const modifiers = container.childNodes[2];
    expect(modifiers.textContent).toEqual('Return Type:Boolean');
  });
});
