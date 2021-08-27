import React from 'react';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import nock from 'nock';
import { render, userEvent, screen, waitForElementToBeRemoved, waitFor } from 'utils/test-utils';
import { ModifierModal } from 'components/modals';
import { updateArtifact } from 'actions/artifacts';
import { mockArtifact } from 'mocks/artifacts';
import mockModifiers from 'mocks/modifiers/mockModifiers';
import { mockConditionResourceR4 } from 'mocks/modifiers/mockResources';
import { genericInstanceWithModifiers, instanceTree, simpleConditionInstanceTree } from 'utils/test_fixtures';

jest.mock('actions/artifacts', () => ({
  __esModule: true,
  updateArtifact: jest.fn()
}));

describe('<ModifierModal />', () => {
  const apiKey = 'api-1234';
  const renderComponent = ({ artifact = mockArtifact, ...props } = {}) =>
    render(
      <Provider store={createStore(x => x, { artifacts: { artifact }, vsac: { apiKey } })}>
        <ModifierModal
          elementInstance={simpleConditionInstanceTree.childInstances[0]}
          handleCloseModal={jest.fn()}
          handleUpdateModifiers={jest.fn()}
          hasLimitedModifiers={false}
          modifierToEdit={null}
          {...props}
        />
      </Provider>
    );

  beforeEach(() => {
    nock('http://localhost')
      .persist()
      .get(`/authoring/api/modifiers/${mockArtifact._id}`)
      .reply(200, mockModifiers)
      .get(`/authoring/api/query/resources/Condition?fhirVersion=4.0.0`)
      .reply(200, [mockConditionResourceR4])
      .get('/authoring/api/query/implicitconversion')
      .reply(200, {
        systemToFHIR: {
          'System.Boolean': 'FHIR.boolean',
          'System.Integer': 'FHIR.integer',
          'System.Decimal': 'FHIR.decimal',
          'System.Date': 'FHIR.date',
          'System.DateTime': 'FHIR.dateTime',
          'System.Time': 'FHIR.time',
          'System.String': 'FHIR.string',
          'System.Quantity': 'FHIR.Quantity',
          'System.Ratio': 'FHIR.Ratio',
          'System.Any': 'FHIR.Any',
          'System.Code': 'FHIR.Coding',
          'System.Concept': 'FHIR.CodeableConcept',
          'Interval<System.Date>': 'FHIR.Period',
          'Interval<System.DateTime>': 'FHIR.Period',
          'Interval<System.Quantity>': 'FHIR.Range'
        },
        FHIRToSystem: {
          'FHIR.boolean': 'System.Boolean',
          'FHIR.integer': 'System.Integer',
          'FHIR.decimal': 'System.Decimal',
          'FHIR.date': 'System.Date',
          'FHIR.dateTime': 'System.DateTime',
          'FHIR.time': 'System.Time',
          'FHIR.string': 'System.String',
          'FHIR.Quantity': 'System.Quantity',
          'FHIR.Ratio': 'System.Ratio',
          'FHIR.Any': 'System.Any',
          'FHIR.Coding': 'System.Code',
          'FHIR.CodeableConcept': 'System.Concept',
          'FHIR.Period': 'Interval<System.DateTime>',
          'FHIR.Range': 'Interval<System.Quantity>'
        }
      })
      .get('/authoring/api/query/operator?typeSpecifier=NamedTypeSpecifier&elementType=System.Concept')
      .reply(200, [
        {
          id: 'isNull',
          name: 'Is Null',
          description: 'Check to see if the element is null',
          operatorTemplate: 'isNull',
          primaryOperand: { typeSpecifier: 'NamedTypeSpecifier', elementTypes: ['System.Any'] }
        },
        {
          id: 'isNotNull',
          name: 'Is Not Null',
          description: 'Check to see if the element is not null',
          operatorTemplate: 'isNotNull',
          primaryOperand: { typeSpecifier: 'NamedTypeSpecifier', elementTypes: ['System.Any'] }
        },
        {
          id: 'codeConceptMatchesConcept',
          name: 'Matches Concept',
          description: 'Check to see if a code, coding, or codable concept matches given concept',
          operatorTemplate: 'codeConceptMatchesConcept',
          primaryOperand: {
            typeSpecifier: 'NamedTypeSpecifier',
            elementTypes: ['FHIR.code', 'System.Code', 'System.Concept']
          },
          userSelectedOperands: [
            {
              id: 'conceptValue',
              type: 'editor',
              typeSpecifier: { type: 'NamedTypeSpecifier', editorType: 'System.Concept' }
            }
          ]
        },
        {
          id: 'codeConceptNotMatchesConcept',
          name: 'Does not Match Concept',
          description: 'Check to see if a code, coding, or codable concept does not match a given concept',
          operatorTemplate: '',
          primaryOperand: {
            typeSpecifier: 'NamedTypeSpecifier',
            elementTypes: ['FHIR.code', 'System.Code', 'System.Concept']
          },
          userSelectedOperands: [
            {
              id: 'conceptValue',
              type: 'editor',
              typeSpecifier: { type: 'NamedTypeSpecifier', editorType: 'System.Concept' }
            }
          ]
        },
        {
          id: 'codeConceptInListOfConcept',
          name: 'Is Within List of Concepts',
          description: 'Check to see if a code, coding, or codable concept matches an element of a list of concepts',
          operatorTemplate: '',
          primaryOperand: {
            typeSpecifier: 'NamedTypeSpecifier',
            elementTypes: ['FHIR.code', 'System.Code', 'System.Concept']
          },
          userSelectedOperands: [
            {
              id: 'conceptValues',
              type: 'editor',
              typeSpecifier: { type: 'ListTypeSpecifier', editorType: 'System.Concept' }
            }
          ]
        },
        {
          id: 'codeConceptNotInListOfConcept',
          name: 'Is Not Within List of Concepts',
          description:
            'Check to see if a code, coding, or codable concept does not match any element of a list of concepts',
          operatorTemplate: '',
          primaryOperand: {
            typeSpecifier: 'NamedTypeSpecifier',
            elementTypes: ['FHIR.code', 'System.Code', 'System.Concept']
          },
          userSelectedOperands: [
            {
              id: 'conceptValues',
              type: 'editor',
              typeSpecifier: { type: 'ListTypeSpecifier', editorType: 'System.Concept' }
            }
          ]
        },
        {
          id: 'codeConceptInValueSet',
          name: 'Is in Value Set',
          description: 'Check to see if a code, coding, or codable concept is within a valueset',
          operatorTemplate: 'codeConceptInValueSet',
          primaryOperand: {
            typeSpecifier: 'NamedTypeSpecifier',
            elementTypes: ['FHIR.code', 'System.Code', 'System.Concept']
          },
          userSelectedOperands: [
            { id: 'valueset', type: 'editor', typeSpecifier: { type: 'NamedTypeSpecifier', editorType: 'valueset' } }
          ]
        },
        {
          id: 'codeConceptNotInValueSet',
          name: 'Is Not in Value Set',
          description: 'Check to see if a code, coding, or codable concept is not within a valueset',
          operatorTemplate: '',
          primaryOperand: {
            typeSpecifier: 'NamedTypeSpecifier',
            elementTypes: ['FHIR.code', 'System.Code', 'System.Concept']
          },
          userSelectedOperands: [
            { id: 'valueset', type: 'editor', typeSpecifier: { type: 'NamedTypeSpecifier', editorType: 'valueset' } }
          ]
        },
        {
          id: 'predefinedConceptComparisonSingular',
          note:
            'Used for single (NamedTypeSpecifier) System.Concept (FHIR.ValueCodeableConcept) and System.Code (FHIR.Coding)',
          name: 'Concept Has Value',
          description: 'Check to see if a predefined concept matches an element in a list of predefined concepts',
          operatorTemplate: '',
          primaryOperand: {
            typeSpecifier: 'NamedTypeSpecifier',
            elementTypes: ['FHIR.code', 'System.Code', 'System.Concept']
          },
          userSelectedOperands: [{ id: 'codeValue', type: 'selector', selectionRequiresPredefinedCodes: true }]
        }
      ])
      .get('/authoring/api/query/operator?typeSpecifier=NamedTypeSpecifier&elementType=FHIR.CodeableConcept')
      .reply(200, [
        {
          id: 'isNull',
          name: 'Is Null',
          description: 'Check to see if the element is null',
          operatorTemplate: 'isNull',
          primaryOperand: { typeSpecifier: 'NamedTypeSpecifier', elementTypes: ['System.Any'] }
        },
        {
          id: 'isNotNull',
          name: 'Is Not Null',
          description: 'Check to see if the element is not null',
          operatorTemplate: 'isNotNull',
          primaryOperand: { typeSpecifier: 'NamedTypeSpecifier', elementTypes: ['System.Any'] }
        }
      ]);

    updateArtifact.mockImplementation(() => ({ type: 'foo' }));
  });

  afterEach(() => nock.cleanAll());

  it('can close the modal with the "Cancel" button', () => {
    const handleCloseModal = jest.fn();
    renderComponent({ handleCloseModal });

    expect(screen.queryByRole('dialog')).toBeInTheDocument();
    userEvent.click(screen.getByRole('button', { name: 'Cancel' }));
    expect(handleCloseModal).toHaveBeenCalled();
  });

  describe('Select Modifiers', () => {
    it('can navigate to the Select Modifiers view', () => {
      renderComponent();

      userEvent.click(screen.getByRole('button', { name: /select modifiers/i }));
      expect(screen.getByTestId(/select modifiers/i)).toBeInTheDocument();
    });

    it('can go back to the Add Modifiers view', () => {
      renderComponent();

      userEvent.click(screen.getByRole('button', { name: /select modifiers/i }));
      expect(screen.getByTestId(/select modifiers/i)).toBeInTheDocument();

      userEvent.click(screen.getByRole('button', { name: /go back/i }));
      expect(screen.getByTestId(/add modifiers/i)).toBeInTheDocument();
    });

    it('can select a modifier to add', async () => {
      renderComponent();

      userEvent.click(screen.getByRole('button', { name: /select modifiers/i }));
      userEvent.click(screen.getByRole('button', { name: 'Select modifier... ​' }));
      expect(screen.queryAllByTestId('modifier-card')).toHaveLength(0);

      userEvent.click(await screen.findByRole('option', { name: 'Exists' }));
      expect(screen.queryAllByTestId('modifier-card')).toHaveLength(1);
      expect(screen.getByTestId('modifier-card')).toHaveTextContent('Exists');
    });

    it('updates the modal header with the new return type if a selected modifier changes the return type', async () => {
      renderComponent();

      userEvent.click(screen.getByRole('button', { name: /select modifiers/i }));
      userEvent.click(screen.getByRole('button', { name: 'Select modifier... ​' }));
      expect(screen.getByTestId('modifier-return-type')).toHaveTextContent('Return Type:List Of Conditions');

      userEvent.click(await screen.findByRole('option', { name: 'Exists' }));
      expect(screen.getByTestId('modifier-return-type')).toHaveTextContent('Return Type:List Of ConditionsBoolean');
    });

    it('can remove a modifier to add', async () => {
      renderComponent();

      userEvent.click(screen.getByRole('button', { name: /select modifiers/i }));
      userEvent.click(screen.getByRole('button', { name: 'Select modifier... ​' }));
      userEvent.click(await screen.findByRole('option', { name: 'Exists' }));
      expect(screen.queryAllByTestId('modifier-card')).toHaveLength(1);

      userEvent.click(screen.getByRole('button', { name: /delete modifier/i }));
      expect(screen.queryAllByTestId('modifier-card')).toHaveLength(0);
    });

    it('cannot remove a modifier to add if the return type does not match the next modifier input type ', async () => {
      renderComponent();

      userEvent.click(screen.getByRole('button', { name: /select modifiers/i }));
      userEvent.click(screen.getByRole('button', { name: 'Select modifier... ​' }));
      userEvent.click(await screen.findByRole('option', { name: 'Exists' }));
      expect(screen.queryAllByTestId('modifier-card')).toHaveLength(1);

      userEvent.click(screen.getByRole('button', { name: 'Select modifier... ​' }));
      userEvent.click(await screen.findByRole('option', { name: 'Not' }));
      expect(screen.queryAllByTestId('modifier-card')).toHaveLength(2);
      expect(
        screen.getByTitle('Cannot remove expression because return type does not match next input type.')
      ).toBeInTheDocument();

      userEvent.click(screen.queryAllByRole('button', { name: /delete modifier/i })[0]);
      expect(screen.queryAllByTestId('modifier-card')).toHaveLength(2);
    });

    it('can select a modifier to add that requires input', async () => {
      renderComponent();

      userEvent.click(screen.getByRole('button', { name: /select modifiers/i }));
      userEvent.click(screen.getByRole('button', { name: 'Select modifier... ​' }));
      userEvent.click(await screen.findByRole('option', { name: 'Is (Not) Null?' }));
      userEvent.click(screen.getByRole('button', { name: /check existence/i }));
      userEvent.click(await screen.findByRole('option', { name: 'is null' }));
      expect(screen.queryAllByTestId('modifier-card')).toHaveLength(1);
      expect(screen.getByTestId('modifier-card')).toHaveTextContent('is null');
    });

    it('can add a single modifier', async () => {
      const handleUpdateModifiers = jest.fn();
      renderComponent({ handleUpdateModifiers });

      userEvent.click(screen.getByRole('button', { name: /select modifiers/i }));
      userEvent.click(screen.getByRole('button', { name: 'Select modifier... ​' }));
      userEvent.click(await screen.findByRole('option', { name: 'Exists' }));
      expect(screen.queryAllByTestId('modifier-card')).toHaveLength(1);

      userEvent.click(screen.getByRole('button', { name: /add/i }));
      const existsModifier = mockModifiers.find(({ id }) => id === 'BooleanExists');
      expect(handleUpdateModifiers).toHaveBeenCalledWith([{ ...existsModifier, uniqueId: expect.any(String) }]);
    });

    it('can add more than one modifier', async () => {
      const handleUpdateModifiers = jest.fn();
      renderComponent({ handleUpdateModifiers });

      userEvent.click(screen.getByRole('button', { name: /select modifiers/i }));
      userEvent.click(screen.getByRole('button', { name: 'Select modifier... ​' }));
      userEvent.click(await screen.findByRole('option', { name: 'Exists' }));
      expect(screen.queryAllByTestId('modifier-card')).toHaveLength(1);

      userEvent.click(screen.getByRole('button', { name: 'Select modifier... ​' }));
      userEvent.click(await screen.findByRole('option', { name: 'Not' }));
      expect(screen.queryAllByTestId('modifier-card')).toHaveLength(2);

      userEvent.click(screen.getByRole('button', { name: /add/i }));
      const existsModifier = mockModifiers.find(({ id }) => id === 'BooleanExists');
      const notModifier = mockModifiers.find(({ id }) => id === 'BooleanNot');
      expect(handleUpdateModifiers).toHaveBeenCalledWith([
        { ...existsModifier, uniqueId: expect.any(String) },
        { ...notModifier, uniqueId: expect.any(String) }
      ]);
    });
  });

  describe('Build Modifier', () => {
    it('can select a fhir version and navigate to the Build Modifier view', () => {
      renderComponent();

      userEvent.click(screen.getByRole('button', { name: /build new modifier/i }));
      expect(screen.getByText(/select fhir version to use:/i)).toBeInTheDocument();

      userEvent.click(screen.getByRole('button', { name: /r4/i }));
      expect(screen.getByTestId(/build modifier/i)).toBeInTheDocument();
    });

    it('cannot navigate to the Build Modifier view if the return type is not supported', () => {
      renderComponent({ elementInstance: instanceTree.childInstances[0] });

      expect(screen.getByRole('button', { name: /build new modifier/i })).toBeDisabled();
      expect(screen.getByTitle('Return type not supported')).toBeInTheDocument();
    });

    it('cannot navigate to the Build Modifier view if the element already has a modifier ', () => {
      renderComponent({ elementInstance: genericInstanceWithModifiers });

      expect(screen.getByRole('button', { name: /build new modifier/i })).toBeDisabled();
      expect(screen.getByTitle('Cannot add a custom modifier to another modifier')).toBeInTheDocument();
    });

    it('can add a rule', async () => {
      renderComponent();

      userEvent.click(screen.getByRole('button', { name: /build new modifier/i }));
      userEvent.click(screen.getByRole('button', { name: /r4/i }));
      await waitForElementToBeRemoved(screen.getByRole('progressbar'));
      expect(screen.queryAllByTestId('modifier-rule')).toHaveLength(0);

      userEvent.click(screen.getByRole('button', { name: /add rule/i }));
      expect(screen.queryAllByTestId('modifier-rule')).toHaveLength(1);
    });

    it('can remove a rule', async () => {
      renderComponent();

      userEvent.click(screen.getByRole('button', { name: /build new modifier/i }));
      userEvent.click(screen.getByRole('button', { name: /r4/i }));
      await waitForElementToBeRemoved(screen.getByRole('progressbar'));
      expect(screen.queryAllByTestId('modifier-rule')).toHaveLength(0);

      userEvent.click(screen.getByRole('button', { name: /add rule/i }));
      expect(screen.queryAllByTestId('modifier-rule')).toHaveLength(1);

      userEvent.click(screen.getByRole('button', { name: /remove rule/i }));
      expect(screen.queryAllByTestId('modifier-rule')).toHaveLength(0);
    });

    it('can add a group', async () => {
      renderComponent();

      userEvent.click(screen.getByRole('button', { name: /build new modifier/i }));
      userEvent.click(screen.getByRole('button', { name: /r4/i }));
      await waitForElementToBeRemoved(screen.getByRole('progressbar'));
      expect(screen.queryAllByTestId('modifier-group')).toHaveLength(1);

      userEvent.click(screen.getByRole('button', { name: /add group/i }));
      expect(screen.queryAllByTestId('modifier-group')).toHaveLength(2);
    });

    it('can remove a group', async () => {
      renderComponent();

      userEvent.click(screen.getByRole('button', { name: /build new modifier/i }));
      userEvent.click(screen.getByRole('button', { name: /r4/i }));
      await waitForElementToBeRemoved(screen.getByRole('progressbar'));
      expect(screen.queryAllByTestId('modifier-group')).toHaveLength(1);

      userEvent.click(screen.getByRole('button', { name: /add group/i }));
      expect(screen.queryAllByTestId('modifier-group')).toHaveLength(2);

      userEvent.click(screen.getByRole('button', { name: /remove group/i }));
      expect(screen.queryAllByTestId('modifier-group')).toHaveLength(1);
    });

    it('can toggle conjunction types', async () => {
      renderComponent();

      userEvent.click(screen.getByRole('button', { name: /build new modifier/i }));
      userEvent.click(screen.getByRole('button', { name: /r4/i }));
      await waitForElementToBeRemoved(screen.getByRole('progressbar'));
      expect(screen.getByRole('button', { name: /and/i })).toHaveAttribute('class', expect.stringContaining('active'));
      expect(screen.getByRole('button', { name: /or/i })).not.toHaveAttribute(
        'class',
        expect.stringContaining('active')
      );

      userEvent.click(screen.getByRole('button', { name: /or/i }));
      expect(screen.getByRole('button', { name: /and/i })).not.toHaveAttribute(
        'class',
        expect.stringContaining('active')
      );
      expect(screen.getByRole('button', { name: /or/i })).toHaveAttribute('class', expect.stringContaining('active'));
    });

    it('can add a property', async () => {
      renderComponent();

      userEvent.click(screen.getByRole('button', { name: /build new modifier/i }));
      userEvent.click(screen.getByRole('button', { name: /r4/i }));
      await waitForElementToBeRemoved(screen.getByRole('progressbar'));
      userEvent.click(screen.getByRole('button', { name: /add rule/i }));
      expect(screen.queryAllByRole('button', { name: /clinical status/i })).toHaveLength(0);

      userEvent.click(screen.getByTestId('property-select'));
      userEvent.click(await screen.findByRole('option', { name: 'Clinical Status' }));
      expect(screen.getByRole('button', { name: /clinical status/i })).toBeInTheDocument();
    });

    it('can add an operator', async () => {
      renderComponent();

      userEvent.click(screen.getByRole('button', { name: /build new modifier/i }));
      userEvent.click(screen.getByRole('button', { name: /r4/i }));
      await waitForElementToBeRemoved(screen.getByRole('progressbar'));
      userEvent.click(screen.getByRole('button', { name: /add rule/i }));
      userEvent.click(screen.getByTestId('property-select'));
      const clinicalStatusOption = await screen.findByRole('option', { name: 'Clinical Status' });
      userEvent.click(clinicalStatusOption);
      await waitForElementToBeRemoved(clinicalStatusOption);
      expect(screen.queryAllByRole('button', { name: /is null/i })).toHaveLength(0);

      userEvent.click(await screen.findByTestId('operator-select'));
      const isNullOption = screen.getByRole('option', { name: /is null/i });
      userEvent.click(isNullOption);
      await waitForElementToBeRemoved(isNullOption);
      expect(screen.getByRole('button', { name: /is null/i })).toBeInTheDocument();
    });

    it('can correctly determine when a rule is complete and display the correct modifier expression', async () => {
      renderComponent();

      userEvent.click(screen.getByRole('button', { name: /build new modifier/i }));
      userEvent.click(screen.getByRole('button', { name: /r4/i }));
      await waitForElementToBeRemoved(screen.getByRole('progressbar'));
      userEvent.click(screen.getByRole('button', { name: /add rule/i }));
      userEvent.click(screen.getByTestId('property-select'));
      const clinicalStatusOption = await screen.findByRole('option', { name: 'Clinical Status' });
      userEvent.click(clinicalStatusOption);
      await waitForElementToBeRemoved(clinicalStatusOption);
      expect(screen.queryAllByText(/clinical status is null/i)).toHaveLength(0);

      userEvent.click(await screen.findByTestId('operator-select'));
      const isNullOption = screen.getByRole('option', { name: /is null/i });
      userEvent.click(isNullOption);
      await waitForElementToBeRemoved(isNullOption);
      expect(screen.queryAllByText(/clinical status is null/i)).toHaveLength(2);
    });

    it('can add a custom modifier to the element', async () => {
      const handleUpdateModifiers = jest.fn();
      renderComponent({ handleUpdateModifiers });

      userEvent.click(screen.getByRole('button', { name: /build new modifier/i }));
      userEvent.click(screen.getByRole('button', { name: /r4/i }));
      await waitForElementToBeRemoved(screen.getByRole('progressbar'));
      userEvent.click(screen.getByRole('button', { name: /add rule/i }));
      userEvent.click(screen.getByTestId('property-select'));
      const clinicalStatusOption = await screen.findByRole('option', { name: 'Clinical Status' });
      userEvent.click(clinicalStatusOption);
      await waitForElementToBeRemoved(clinicalStatusOption);
      userEvent.click(await screen.findByTestId('operator-select'));
      const isNullOption = screen.getByRole('option', { name: /is null/i });
      userEvent.click(isNullOption);
      await waitForElementToBeRemoved(isNullOption);
      expect(screen.queryAllByTestId('modifier-rule')).toHaveLength(1);

      userEvent.click(screen.getByRole('button', { name: 'Add' }));

      await waitFor(() => {
        expect(handleUpdateModifiers).toHaveBeenCalledWith([
          {
            inputTypes: ['list_of_conditions'],
            returnType: 'list_of_conditions',
            type: 'UserDefinedModifier',
            where: {
              id: 'root',
              conjunctionType: 'and',
              rules: [
                {
                  id: expect.any(String),
                  resourceProperty: 'clinicalStatus',
                  operator: {
                    id: 'isNull',
                    name: 'Is Null',
                    description: 'Check to see if the element is null',
                    operatorTemplate: 'isNull',
                    primaryOperand: {
                      typeSpecifier: 'NamedTypeSpecifier',
                      elementTypes: ['System.Any']
                    }
                  }
                }
              ]
            }
          }
        ]);
      });
    });

    it('can edit a custom modifier', async () => {
      const handleUpdateModifiers = jest.fn();
      const modifierToEdit = {
        inputTypes: ['list_of_conditions'],
        returnType: 'list_of_conditions',
        type: 'UserDefinedModifier',
        where: {
          id: 'root',
          conjunctionType: 'and',
          rules: [
            {
              id: 'a75903ba-27d0-4867-b094-2fe2404ac320',
              resourceProperty: 'clinicalStatus',
              operator: {
                id: 'isNull',
                name: 'Is Null',
                description: 'Check to see if the element is null',
                operatorTemplate: 'isNull',
                primaryOperand: {
                  typeSpecifier: 'NamedTypeSpecifier',
                  elementTypes: ['System.Any']
                }
              }
            }
          ]
        }
      };
      renderComponent({ artifact: { ...mockArtifact, fhirVersion: '4.0.0' }, handleUpdateModifiers, modifierToEdit });

      expect(screen.getByTestId(/edit modifier/i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /save/i })).toBeInTheDocument();

      userEvent.click(await screen.findByTestId('operator-select'));
      const isNotNullOption = screen.getByRole('option', { name: /is not null/i });
      userEvent.click(isNotNullOption);
      expect(screen.queryAllByText(/clinical status is not null/i)).toHaveLength(2);

      userEvent.click(screen.getByRole('button', { name: 'Save' }));

      await waitFor(() => {
        expect(handleUpdateModifiers).toHaveBeenCalledWith([
          {
            inputTypes: ['list_of_conditions'],
            returnType: 'list_of_conditions',
            type: 'UserDefinedModifier',
            where: {
              id: 'root',
              conjunctionType: 'and',
              rules: [
                {
                  id: expect.any(String),
                  resourceProperty: 'clinicalStatus',
                  operator: {
                    id: 'isNotNull',
                    name: 'Is Not Null',
                    description: 'Check to see if the element is not null',
                    operatorTemplate: 'isNotNull',
                    primaryOperand: {
                      typeSpecifier: 'NamedTypeSpecifier',
                      elementTypes: ['System.Any']
                    }
                  }
                }
              ]
            }
          }
        ]);
      });
    });
  });
});
