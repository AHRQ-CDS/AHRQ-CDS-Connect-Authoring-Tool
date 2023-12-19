import React from 'react';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import nock from 'nock';
import {
  render,
  userEvent,
  screen,
  waitForElementToBeRemoved,
  waitFor,
  PointerEventsCheckLevel
} from 'utils/test-utils';
import { ModifierModal } from 'components/modals';
import { updateArtifact } from 'actions/artifacts';
import { mockArtifact } from 'mocks/artifacts';
import mockModifiers from 'mocks/modifiers/mockModifiers';
import { mockConditionResourceR4, mockObservationResourceR4 } from 'mocks/modifiers/mockResources';
import {
  genericInstanceWithModifiers,
  instanceTree,
  simpleConditionInstanceTree,
  simpleObservationInstanceTree
} from 'utils/test_fixtures';

jest.mock('actions/artifacts', () => ({
  __esModule: true,
  updateArtifact: jest.fn()
}));

describe('<ModifierModal />', () => {
  const apiKey = 'api-1234';
  const renderComponent = ({ artifact = mockArtifact, useObservation = false, ...props } = {}) =>
    render(
      <Provider store={createStore(x => x, { artifacts: { artifact }, vsac: { apiKey } })}>
        <ModifierModal
          elementInstance={
            (useObservation ? simpleObservationInstanceTree : simpleConditionInstanceTree).childInstances[0]
          }
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
      .get(new RegExp(`/authoring/api/query/resources/.*`))
      .reply(200, uri => (/Condition/.test(uri) ? [mockConditionResourceR4] : [mockObservationResourceR4]))
      .get('/authoring/api/query/implicitconversion')
      .reply(200, {
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
      .get(
        RegExp(
          '/authoring/api/query/operator\\?typeSpecifier=(Named|List)TypeSpecifier&elementType=(System\\.Concept|FHIR\\.code)'
        )
      )
      .reply(200, uri => {
        // For simplicity, don't put ALL the possible operators in the mock. Only include ones we use in testing.
        // NOTE: Operators last synced w/ operators.json on Sep 1, 2021.
        const operators = [
          {
            id: 'isNull',
            name: 'Is Null',
            description: 'Check to see if the element is null',
            operatorTemplate: 'isNull',
            primaryOperand: {
              typeSpecifier: 'NamedTypeSpecifier',
              elementTypes: ['System.Any']
            }
          },
          {
            id: 'isNotNull',
            name: 'Is Not Null',
            description: 'Check to see if the element is not null',
            operatorTemplate: 'isNotNull',
            primaryOperand: {
              typeSpecifier: 'NamedTypeSpecifier',
              elementTypes: ['System.Any']
            }
          }
        ];
        if (/NamedTypeSpecifier/.test(uri)) {
          operators.push(
            {
              id: 'codeConceptMatchesConcept',
              name: 'Matches',
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
                  typeSpecifier: {
                    type: 'NamedTypeSpecifier',
                    editorType: 'System.Concept'
                  }
                }
              ]
            },
            {
              id: 'predefinedConceptComparisonSingular',
              note: 'Used for single (NamedTypeSpecifier) System.Concept (FHIR.ValueCodeableConcept) and System.Code (FHIR.Coding)',
              name: 'Matches Standard Code in',
              description: 'Check to see if a predefined concept matches an element in a list of predefined concepts',
              operatorTemplate: 'predefinedConceptComparisonSingular',
              primaryOperand: {
                typeSpecifier: 'NamedTypeSpecifier',
                elementTypes: ['FHIR.code', 'System.Code', 'System.Concept']
              },
              userSelectedOperands: [
                {
                  id: 'codeValue',
                  type: 'selector',
                  selectionRequiresPredefinedCodes: true
                }
              ]
            }
          );
        } else {
          // Operators for ListTypeSpecifier
          operators.push(
            {
              id: 'listCodeConceptIsPerfectSubsetOfListConcept',
              name: 'Has Only Codes in',
              description:
                'Check to see if a list of System.Code or System.Concept is a perfect subset of another list of System.Concept',
              operatorTemplate: '',
              primaryOperand: {
                typeSpecifier: 'ListTypeSpecifier',
                elementTypes: ['FHIR.code', 'System.Code', 'System.Concept']
              },
              userSelectedOperands: [
                {
                  id: 'conceptValues',
                  type: 'editor',
                  typeSpecifier: {
                    type: 'ListTypeSpecifier',
                    editorType: 'System.Concept'
                  }
                }
              ]
            },
            {
              id: 'predefinedConceptComparisonPlural',
              note: 'Used for plural (ListTypeSpecifier) FHIR.code',
              name: 'Has at Least One Standard Code in',
              description: 'Check to see if a predefined concept matches an element in a list of predefined concepts',
              operatorTemplate: 'predefinedConceptComparisonPlural',
              primaryOperand: {
                typeSpecifier: 'ListTypeSpecifier',
                elementTypes: ['FHIR.code', 'System.Code', 'System.Concept']
              },
              userSelectedOperands: [
                {
                  id: 'codeValue',
                  type: 'selector',
                  selectionRequiresPredefinedCodes: true
                }
              ]
            }
          );
        }
        return operators;
      })
      .get(
        RegExp(
          '/authoring/api/query/operator\\?typeSpecifier=(Named|List)TypeSpecifier&elementType=FHIR\\.CodeableConcept'
        )
      )
      .reply(200, [
        {
          id: 'isNull',
          name: 'Is Null',
          description: 'Check to see if the element is null',
          operatorTemplate: 'isNull',
          primaryOperand: {
            typeSpecifier: 'NamedTypeSpecifier',
            elementTypes: ['System.Any']
          }
        },
        {
          id: 'isNotNull',
          name: 'Is Not Null',
          description: 'Check to see if the element is not null',
          operatorTemplate: 'isNotNull',
          primaryOperand: {
            typeSpecifier: 'NamedTypeSpecifier',
            elementTypes: ['System.Any']
          }
        }
      ]);

    updateArtifact.mockImplementation(() => ({ type: 'foo' }));
  });

  afterEach(() => nock.cleanAll());

  afterAll(() => nock.restore());

  it('can close the modal with the "Cancel" button', async () => {
    const handleCloseModal = jest.fn();
    renderComponent({ handleCloseModal });

    expect(screen.queryByRole('dialog')).toBeInTheDocument();
    await waitFor(() => userEvent.click(screen.getByRole('button', { name: 'Cancel' })));
    expect(handleCloseModal).toHaveBeenCalled();
  });

  describe('Select Modifiers', () => {
    it('can navigate to the Select Modifiers view', async () => {
      renderComponent();

      await waitFor(() => userEvent.click(screen.getByRole('button', { name: /select modifiers/i })));
      expect(screen.getByTestId(/select modifiers/i)).toBeInTheDocument();
    });

    it('can go back to the Add Modifiers view', async () => {
      renderComponent();

      await waitFor(() => userEvent.click(screen.getByRole('button', { name: /select modifiers/i })));
      expect(screen.getByTestId(/select modifiers/i)).toBeInTheDocument();

      await waitFor(() => userEvent.click(screen.getByRole('button', { name: /go back/i })));
      expect(screen.getByTestId(/add modifiers/i)).toBeInTheDocument();
    });

    it('can select a modifier to add', async () => {
      renderComponent();

      await waitFor(() => userEvent.click(screen.getByRole('button', { name: /select modifiers/i })));
      await waitFor(() => userEvent.click(screen.getByRole('combobox', { name: 'Select modifier...' })));
      expect(screen.queryAllByTestId('modifier-card')).toHaveLength(0);

      await waitFor(() => userEvent.click(screen.getByRole('option', { name: 'Exists' })));
      expect(screen.queryAllByTestId('modifier-card')).toHaveLength(1);
      expect(screen.getByTestId('modifier-card')).toHaveTextContent('Exists');
    });

    it('updates the modal header with the new return type if a selected modifier changes the return type', async () => {
      renderComponent();

      await waitFor(() => userEvent.click(screen.getByRole('button', { name: /select modifiers/i })));
      await waitFor(() => userEvent.click(screen.getByRole('combobox', { name: 'Select modifier...' })));
      expect(screen.getByTestId('modifier-return-type')).toHaveTextContent('Return Type:List Of Conditions');

      await waitFor(() => userEvent.click(screen.getByRole('option', { name: 'Exists' })));
      expect(screen.getByTestId('modifier-return-type')).toHaveTextContent('Return Type:List Of ConditionsBoolean');
    });

    it('can remove a modifier to add', async () => {
      renderComponent();

      await waitFor(() => userEvent.click(screen.getByRole('button', { name: /select modifiers/i })));
      await waitFor(() => userEvent.click(screen.getByRole('combobox', { name: 'Select modifier...' })));
      await waitFor(() => userEvent.click(screen.getByRole('option', { name: 'Exists' })));
      expect(screen.queryAllByTestId('modifier-card')).toHaveLength(1);

      await waitFor(() => userEvent.click(screen.getByRole('button', { name: /delete modifier/i })));
      expect(screen.queryAllByTestId('modifier-card')).toHaveLength(0);
    });

    it('cannot remove a modifier to add if the return type does not match the next modifier input type ', async () => {
      renderComponent();

      await waitFor(() => userEvent.click(screen.getByRole('button', { name: /select modifiers/i })));
      await waitFor(() => userEvent.click(screen.getByRole('combobox', { name: 'Select modifier...' })));
      await waitFor(() => userEvent.click(screen.getByRole('option', { name: 'Exists' })));
      expect(screen.queryAllByTestId('modifier-card')).toHaveLength(1);

      await waitFor(() => userEvent.click(screen.getByRole('combobox', { name: 'Select modifier...' })));
      await waitFor(() => userEvent.click(screen.getByRole('option', { name: 'Not' })));
      expect(screen.queryAllByTestId('modifier-card')).toHaveLength(2);
      expect(
        screen.getByLabelText('Cannot remove expression because return type does not match next input type.')
      ).toBeInTheDocument();

      await waitFor(() =>
        userEvent.click(screen.queryAllByRole('button', { name: /delete modifier/i })[0], {
          pointerEventsCheck: PointerEventsCheckLevel.Never
        })
      );
      expect(screen.queryAllByTestId('modifier-card')).toHaveLength(2);
    });

    it('can select a modifier to add that requires input', async () => {
      renderComponent();

      await waitFor(() => userEvent.click(screen.getByRole('button', { name: /select modifiers/i })));
      await waitFor(() => userEvent.click(screen.getByRole('combobox', { name: 'Select modifier...' })));
      await waitFor(() => userEvent.click(screen.getByRole('option', { name: 'Is (Not) Null?' })));
      await waitFor(() => userEvent.click(screen.getByRole('combobox', { name: /check existence/i })));
      await waitFor(() => userEvent.click(screen.getByRole('option', { name: 'is null' })));
      expect(screen.queryAllByTestId('modifier-card')).toHaveLength(1);
      expect(screen.getByTestId('modifier-card')).toHaveTextContent('is null');
    });

    it('can add a single modifier', async () => {
      const handleUpdateModifiers = jest.fn();
      renderComponent({ handleUpdateModifiers });

      await waitFor(() => userEvent.click(screen.getByRole('button', { name: /select modifiers/i })));
      await waitFor(() => userEvent.click(screen.getByRole('combobox', { name: 'Select modifier...' })));
      await waitFor(() => userEvent.click(screen.getByRole('option', { name: 'Exists' })));
      expect(screen.queryAllByTestId('modifier-card')).toHaveLength(1);

      await waitFor(() => userEvent.click(screen.getByRole('button', { name: /add/i })));
      const existsModifier = mockModifiers.find(({ id }) => id === 'BooleanExists');
      expect(handleUpdateModifiers).toHaveBeenCalledWith([{ ...existsModifier, uniqueId: expect.any(String) }], ''); // '' is any fhir version
    });

    it('can add more than one modifier', async () => {
      const handleUpdateModifiers = jest.fn();
      renderComponent({ handleUpdateModifiers });

      await waitFor(() => userEvent.click(screen.getByRole('button', { name: /select modifiers/i })));
      await waitFor(() => userEvent.click(screen.getByRole('combobox', { name: 'Select modifier...' })));
      await waitFor(() => userEvent.click(screen.getByRole('option', { name: 'Exists' })));
      expect(screen.queryAllByTestId('modifier-card')).toHaveLength(1);

      await waitFor(() => userEvent.click(screen.getByRole('combobox', { name: 'Select modifier...' })));
      await waitFor(() => userEvent.click(screen.getByRole('option', { name: 'Not' })));
      expect(screen.queryAllByTestId('modifier-card')).toHaveLength(2);

      await waitFor(() => userEvent.click(screen.getByRole('button', { name: /add/i })));
      const existsModifier = mockModifiers.find(({ id }) => id === 'BooleanExists');
      const notModifier = mockModifiers.find(({ id }) => id === 'BooleanNot');
      expect(handleUpdateModifiers).toHaveBeenCalledWith(
        [
          { ...existsModifier, uniqueId: expect.any(String) },
          { ...notModifier, uniqueId: expect.any(String) }
        ],
        '' // any fhir version
      );
    });
  });

  describe('Build Modifier', () => {
    it('can select a fhir version and navigate to the Build Modifier view', async () => {
      renderComponent();

      await waitFor(() => userEvent.click(screen.getByRole('button', { name: /build new modifier/i })));
      expect(screen.getByText(/select fhir version to use:/i)).toBeInTheDocument();

      await waitFor(() => userEvent.click(screen.getByRole('button', { name: /r4/i })));
      expect(screen.getByTestId(/build modifier/i)).toBeInTheDocument();
    });

    it('cannot navigate to the Build Modifier view if the return type is not supported', () => {
      renderComponent({ elementInstance: instanceTree.childInstances[0] });

      expect(screen.getByRole('button', { name: /build new modifier/i })).toBeDisabled();
      expect(screen.getByLabelText('Return type not supported')).toBeInTheDocument();
    });

    it('cannot navigate to the Build Modifier view if the element already has a modifier ', () => {
      renderComponent({ elementInstance: genericInstanceWithModifiers });

      expect(screen.getByRole('button', { name: /build new modifier/i })).toBeDisabled();
      expect(screen.getByLabelText('Cannot add a custom modifier to another modifier')).toBeInTheDocument();
    });

    it('can add a rule', async () => {
      renderComponent();

      await waitFor(() => userEvent.click(screen.getByRole('button', { name: /build new modifier/i })));
      await waitFor(() => userEvent.click(screen.getByRole('button', { name: /r4/i })));
      await waitForElementToBeRemoved(screen.getByRole('progressbar'));
      expect(screen.queryAllByTestId('modifier-rule')).toHaveLength(0);

      await waitFor(() => userEvent.click(screen.getByRole('button', { name: /add rule/i })));
      expect(screen.queryAllByTestId('modifier-rule')).toHaveLength(1);
    });

    it('can remove a rule', async () => {
      renderComponent();

      await waitFor(() => userEvent.click(screen.getByRole('button', { name: /build new modifier/i })));
      await waitFor(() => userEvent.click(screen.getByRole('button', { name: /r4/i })));
      await waitForElementToBeRemoved(screen.getByRole('progressbar'));
      expect(screen.queryAllByTestId('modifier-rule')).toHaveLength(0);

      await waitFor(() => userEvent.click(screen.getByRole('button', { name: /add rule/i })));
      expect(screen.queryAllByTestId('modifier-rule')).toHaveLength(1);

      await waitFor(() => userEvent.click(screen.getByRole('button', { name: /remove rule/i })));
      expect(screen.queryAllByTestId('modifier-rule')).toHaveLength(0);
    });

    it('can add a group', async () => {
      renderComponent();

      await waitFor(() => userEvent.click(screen.getByRole('button', { name: /build new modifier/i })));
      await waitFor(() => userEvent.click(screen.getByRole('button', { name: /r4/i })));
      await waitForElementToBeRemoved(screen.getByRole('progressbar'));
      expect(screen.queryAllByTestId('modifier-group')).toHaveLength(1);

      await waitFor(() => userEvent.click(screen.getByRole('button', { name: /add group/i })));
      expect(screen.queryAllByTestId('modifier-group')).toHaveLength(2);
    });

    it('can remove a group', async () => {
      renderComponent();

      await waitFor(() => userEvent.click(screen.getByRole('button', { name: /build new modifier/i })));
      await waitFor(() => userEvent.click(screen.getByRole('button', { name: /r4/i })));
      await waitForElementToBeRemoved(screen.getByRole('progressbar'));
      expect(screen.queryAllByTestId('modifier-group')).toHaveLength(1);

      await waitFor(() => userEvent.click(screen.getByRole('button', { name: /add group/i })));
      expect(screen.queryAllByTestId('modifier-group')).toHaveLength(2);

      await waitFor(() => userEvent.click(screen.getByRole('button', { name: /remove group/i })));
      expect(screen.queryAllByTestId('modifier-group')).toHaveLength(1);
    });

    it('can toggle conjunction types', async () => {
      renderComponent();

      await waitFor(() => userEvent.click(screen.getByRole('button', { name: /build new modifier/i })));
      await waitFor(() => userEvent.click(screen.getByRole('button', { name: /r4/i })));
      await waitForElementToBeRemoved(screen.getByRole('progressbar'));
      expect(screen.getByRole('button', { name: /and/i })).toHaveAttribute('class', expect.stringContaining('active'));
      expect(screen.getByRole('button', { name: /or/i })).not.toHaveAttribute(
        'class',
        expect.stringContaining('active')
      );

      await waitFor(() => userEvent.click(screen.getByRole('button', { name: /or/i })));
      expect(screen.getByRole('button', { name: /and/i })).not.toHaveAttribute(
        'class',
        expect.stringContaining('active')
      );
      expect(screen.getByRole('button', { name: /or/i })).toHaveAttribute('class', expect.stringContaining('active'));
    });

    it('can add a property', async () => {
      renderComponent();

      await waitFor(() => userEvent.click(screen.getByRole('button', { name: /build new modifier/i })));
      await waitFor(() => userEvent.click(screen.getByRole('button', { name: /r4/i })));
      await waitForElementToBeRemoved(screen.getByRole('progressbar'));
      await waitFor(() => userEvent.click(screen.getByRole('button', { name: /add rule/i })));

      await waitFor(() => userEvent.click(screen.getByTestId('property-select')));
      const clinicalStatusOption = await screen.findByRole('option', { name: 'Clinical Status' });
      expect(clinicalStatusOption.getAttribute('aria-selected')).toBe('false');
      await userEvent.click(clinicalStatusOption);
      expect(clinicalStatusOption.getAttribute('aria-selected')).toBe('true');
    });

    it('can add an operator', async () => {
      renderComponent();

      await waitFor(() => userEvent.click(screen.getByRole('button', { name: /build new modifier/i })));
      await waitFor(() => userEvent.click(screen.getByRole('button', { name: /r4/i })));
      await waitForElementToBeRemoved(screen.getByRole('progressbar'));
      await waitFor(() => userEvent.click(screen.getByRole('button', { name: /add rule/i })));
      await waitFor(() => userEvent.click(screen.getByTestId('property-select')));
      const clinicalStatusOption = await screen.findByRole('option', { name: 'Clinical Status' });
      await userEvent.click(clinicalStatusOption);

      await waitFor(() => userEvent.click(screen.getByTestId('operator-select')));
      const isNullOption = screen.getByRole('option', { name: /^is null$/i });
      expect(isNullOption.getAttribute('aria-selected')).toBe('false');
      await userEvent.click(isNullOption);
      expect(isNullOption.getAttribute('aria-selected')).toBe('true');
    });

    it('includes only predefined code operators when predefined codes are required and custom codes not allowed', async () => {
      renderComponent({ useObservation: true });

      await waitFor(() => userEvent.click(screen.getByRole('button', { name: /build new modifier/i })));
      await waitFor(() => userEvent.click(screen.getByRole('button', { name: /r4/i })));
      await waitForElementToBeRemoved(screen.getByRole('progressbar'));
      await waitFor(() => userEvent.click(screen.getByRole('button', { name: /add rule/i })));
      await waitFor(() => userEvent.click(screen.getByTestId('property-select')));
      const clinicalStatusOption = await screen.findByRole('option', { name: 'Status' });
      await userEvent.click(clinicalStatusOption);

      await waitFor(() => userEvent.click(screen.getByTestId('operator-select')));
      expect(screen.queryAllByRole('option', { name: /^matches standard code in$/i })).toHaveLength(1);
      expect(screen.queryAllByRole('option', { name: /^matches$/i })).toHaveLength(0);
    });

    it('includes predefined code operators and custom code operators when predefined codes are required and custom codes are allowed', async () => {
      renderComponent({ useObservation: true });

      await waitFor(() => userEvent.click(screen.getByRole('button', { name: /build new modifier/i })));
      await waitFor(() => userEvent.click(screen.getByRole('button', { name: /r4/i })));
      await waitForElementToBeRemoved(screen.getByRole('progressbar'));
      await waitFor(() => userEvent.click(screen.getByRole('button', { name: /add rule/i })));
      await waitFor(() => userEvent.click(screen.getByTestId('property-select')));
      const clinicalStatusOption = await screen.findByRole('option', { name: 'Category' });
      await userEvent.click(clinicalStatusOption);

      await waitFor(() => userEvent.click(screen.getByTestId('operator-select')));
      expect(screen.queryAllByRole('option', { name: /^has at least one standard code in$/i })).toHaveLength(1);
      expect(screen.queryAllByRole('option', { name: /^has only codes in$/i })).toHaveLength(1);
    });

    it('does not include predefined code operators when no predefined codes are defined', async () => {
      renderComponent({ useObservation: true });

      await waitFor(() => userEvent.click(screen.getByRole('button', { name: /build new modifier/i })));
      await waitFor(() => userEvent.click(screen.getByRole('button', { name: /r4/i })));
      await waitForElementToBeRemoved(screen.getByRole('progressbar'));
      await waitFor(() => userEvent.click(screen.getByRole('button', { name: /add rule/i })));
      await waitFor(() => userEvent.click(screen.getByTestId('property-select')));
      const clinicalStatusOption = await screen.findByRole('option', { name: 'Value Codeable Concept' });
      await userEvent.click(clinicalStatusOption);

      await waitFor(() => userEvent.click(screen.getByTestId('operator-select')));
      expect(screen.queryAllByRole('option', { name: /^matches standard code in$/i })).toHaveLength(0);
      expect(screen.queryAllByRole('option', { name: /^matches$/i })).toHaveLength(1);
    });

    it('can correctly determine when a rule is complete and display the correct modifier expression', async () => {
      renderComponent();

      await waitFor(() => userEvent.click(screen.getByRole('button', { name: /build new modifier/i })));
      await waitFor(() => userEvent.click(screen.getByRole('button', { name: /r4/i })));
      await waitForElementToBeRemoved(screen.getByRole('progressbar'));
      await waitFor(() => userEvent.click(screen.getByRole('button', { name: /add rule/i })));
      await waitFor(() => userEvent.click(screen.getByTestId('property-select')));
      const clinicalStatusOption = await screen.findByRole('option', { name: 'Clinical Status' });
      await userEvent.click(clinicalStatusOption);
      expect(screen.queryAllByText(/clinical status is null/i)).toHaveLength(0);

      await waitFor(() => userEvent.click(screen.getByTestId('operator-select')));
      const isNullOption = screen.getByRole('option', { name: /^is null$/i });
      await userEvent.click(isNullOption);
      expect(screen.queryAllByText(/clinical status is null/i)).toHaveLength(2);
    });

    it('can add a custom modifier to the element', async () => {
      const handleUpdateModifiers = jest.fn();
      renderComponent({ handleUpdateModifiers });

      await waitFor(() => userEvent.click(screen.getByRole('button', { name: /build new modifier/i })));
      await waitFor(() => userEvent.click(screen.getByRole('button', { name: /r4/i })));
      await waitForElementToBeRemoved(screen.getByRole('progressbar'));
      await waitFor(() => userEvent.click(screen.getByRole('button', { name: /add rule/i })));
      await waitFor(() => userEvent.click(screen.getByTestId('property-select')));
      const clinicalStatusOption = await screen.findByRole('option', { name: 'Clinical Status' });
      await userEvent.click(clinicalStatusOption);
      await waitFor(() => userEvent.click(screen.getByTestId('operator-select')));
      const isNullOption = screen.getByRole('option', { name: /^is null$/i });
      await userEvent.click(isNullOption);
      expect(screen.queryAllByTestId('modifier-rule')).toHaveLength(1);

      await waitFor(() => userEvent.click(screen.getByRole('button', { name: 'Add' })));

      await waitFor(() => {
        expect(handleUpdateModifiers).toHaveBeenCalledWith(
          [
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
          ],
          '4.0.x' // R4 was selected
        );
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
      renderComponent({ artifact: { ...mockArtifact, fhirVersion: '4.0.1' }, handleUpdateModifiers, modifierToEdit });

      expect(screen.getByTestId(/edit modifier/i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /save/i })).toBeInTheDocument();

      await waitFor(() => userEvent.click(screen.getByTestId('operator-select')));
      const isNotNullOption = screen.getByRole('option', { name: /^is not null$/i });
      await userEvent.click(isNotNullOption);
      expect(screen.queryAllByText(/clinical status is not null/i)).toHaveLength(2);

      await waitFor(() => userEvent.click(screen.getByRole('button', { name: 'Save' })));

      await waitFor(() => {
        expect(handleUpdateModifiers).toHaveBeenCalledWith(
          [
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
          ],
          '4.0.1'
        );
      });
    });
  });
});
