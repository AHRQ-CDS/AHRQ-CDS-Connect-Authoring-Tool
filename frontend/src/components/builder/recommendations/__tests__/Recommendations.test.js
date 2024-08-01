import React from 'react';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import { fireEvent, render, screen, userEvent, within, waitFor } from 'utils/test-utils';
import Recommendations from '../Recommendations';
import { mockArtifact } from 'mocks/artifacts';

describe('<Recommendations />', () => {
  let recommendations, mockArtifactWithRecommendations, ui;
  beforeEach(() => {
    recommendations = [
      {
        uid: 'rec-101',
        grade: 'A',
        subpopulations: [
          {
            uniqueId: 'sp-001',
            subpopulationName: 'Subpopulation #1'
          }
        ],
        text: 'Recommendation #1',
        rationale: 'Test rationale',
        comment: 'Test comment',
        links: [
          {
            type: 'absolute',
            label: 'Test Link',
            url: 'https://test-link.com'
          }
        ],
        suggestions: []
      },
      {
        uid: 'rec-002',
        grade: 'A',
        subpopulations: [],
        text: 'Recommendation #2',
        rationale: '',
        comment: '',
        links: [],
        suggestions: [
          {
            uid: 'suggestion-02-01',
            label: 'First suggestion for second recommendation',
            actions: []
          }
        ]
      },
      {
        uid: 'rec-003',
        grade: 'A',
        subpopulations: [],
        text: 'Recommendation #3',
        rationale: '',
        comment: '',
        links: [],
        suggestions: [
          {
            uid: 'suggestion-03-01',
            label: 'First suggestion for third recommendation',
            actions: [
              {
                type: 'create',
                description: 'First action - a MedicationRequest',
                resource: {
                  resourceType: 'MedicationRequest',
                  medicationCodeableConcept: {
                    text: 'Any code for example med1',
                    code: 'example-med1',
                    display: '',
                    system: 'RXNORM',
                    uri: 'http://www.nlm.nih.gov/research/umls/rxnorm'
                  },
                  status: 'draft',
                  intent: 'proposal',
                  priority: 'routine',
                  reasonCode: {
                    text: 'Any code for reason',
                    code: '123',
                    display: '',
                    system: 'ICD-9-CM',
                    uri: 'http://hl7.org/fhir/sid/icd-9-cm'
                  },
                  category: {
                    text: 'Any code for category',
                    code: '345',
                    display: '',
                    system: 'NCI',
                    uri: 'http://ncimeta.nci.nih.gov'
                  }
                }
              },
              {
                type: 'create',
                description: 'Second action - a MedicationRequest',
                resource: {
                  resourceType: 'MedicationRequest',
                  medicationCodeableConcept: {
                    text: 'Any code for med2',
                    code: 'example-med2',
                    display: '',
                    system: 'RXNORM',
                    uri: 'http://www.nlm.nih.gov/research/umls/rxnorm'
                  },
                  status: 'draft',
                  intent: 'proposal',
                  priority: 'routine',
                  reasonCode: {
                    text: 'Any code for reason',
                    code: '',
                    display: '',
                    system: '',
                    uri: ''
                  },
                  category: {
                    text: 'Any code for reason',
                    code: '',
                    display: '',
                    system: '',
                    uri: ''
                  }
                }
              }
            ]
          },
          {
            uid: 'suggestion-03-02',
            label: 'Second suggestion for third recommendation',
            actions: [
              {
                type: 'create',
                description: 'First action - a ServiceRequest',
                resource: {
                  resourceType: 'ServiceRequest',
                  code: {
                    text: 'Any code for lab test',
                    code: 'lab-test1',
                    display: '',
                    system: 'LOINC',
                    uri: 'http://loinc.org'
                  },
                  status: 'draft',
                  intent: 'proposal',
                  priority: 'routine',
                  reasonCode: {
                    text: 'Any code for reason',
                    code: '123',
                    display: '',
                    system: 'ICD-9-CM',
                    uri: 'http://hl7.org/fhir/sid/icd-9-cm'
                  },
                  category: {
                    text: 'Any code for category',
                    code: '345',
                    display: '',
                    system: 'NCI',
                    uri: 'http://ncimeta.nci.nih.gov'
                  }
                }
              },
              {
                type: 'create',
                description: 'Second action - a ServiceRequest',
                resource: {
                  resourceType: 'ServiceRequest',
                  code: {
                    text: 'Any code for lab2',
                    code: 'example-lab2',
                    display: '',
                    system: 'LOINC',
                    uri: 'http://loinc.org'
                  },
                  status: 'draft',
                  intent: 'proposal',
                  priority: 'routine',
                  reasonCode: {
                    text: 'Any code for reason',
                    code: '123',
                    display: '',
                    system: 'ICD-9-CM',
                    uri: 'http://hl7.org/fhir/sid/icd-9-cm'
                  },
                  category: {
                    text: 'Any code for category',
                    code: '345',
                    display: '',
                    system: 'NCI',
                    uri: 'http://ncimeta.nci.nih.gov'
                  }
                }
              }
            ]
          }
        ]
      }
    ];

    mockArtifactWithRecommendations = { ...mockArtifact, recommendations };

    ui = ({ artifact = mockArtifactWithRecommendations, ...props } = {}) => (
      <Provider store={createStore(x => x, { artifacts: { artifact }, vsac: { apiKey: '1234' } })}>
        <Recommendations handleUpdateRecommendations={jest.fn()} {...props} />
      </Provider>
    );
  });

  it('can render a list of recommendations', () => {
    render(ui());

    expect(screen.getAllByText(/recommend\.\.\./i)).toHaveLength(3);
  });

  it('can add a recommendation', async () => {
    const handleUpdateRecommendations = jest.fn();
    render(ui({ handleUpdateRecommendations }));

    await waitFor(() => userEvent.click(screen.getByRole('button', { name: /new recommendation/i })));

    expect(handleUpdateRecommendations).toHaveBeenCalledWith(
      recommendations.concat({
        uid: expect.any(String),
        grade: 'A',
        subpopulations: [],
        text: '',
        rationale: '',
        comment: '',
        links: [],
        suggestions: []
      })
    );
  });

  it('can update a recommendation', () => {
    const handleUpdateRecommendations = jest.fn();
    render(ui({ handleUpdateRecommendations }));

    fireEvent.change(screen.queryAllByPlaceholderText('Describe your recommendation')[0], {
      target: { name: 'text', value: 'Recommendation #1 Edited' }
    });

    expect(handleUpdateRecommendations).toHaveBeenCalledWith([
      {
        ...recommendations[0],
        text: 'Recommendation #1 Edited'
      },
      recommendations[1],
      recommendations[2]
    ]);
  });

  it('can delete a recommendation', async () => {
    const handleUpdateRecommendations = jest.fn();
    render(ui({ handleUpdateRecommendations }));

    await waitFor(() => userEvent.click(screen.queryAllByRole('button', { name: /delete recommendation/i })[2]));

    const dialog = within(screen.getByRole('dialog'));
    expect(dialog.getByText(/delete recommendation confirmation/i)).toBeInTheDocument();
    await waitFor(() => userEvent.click(screen.getByRole('button', { name: /delete/i })));

    expect(handleUpdateRecommendations).toHaveBeenCalledWith([recommendations[0], recommendations[1]]);
  });

  it('can display a recommendation subpopulation', () => {
    render(ui());

    expect(screen.getByText(/if all of the following apply\.\.\./i)).toBeInTheDocument();
    expect(screen.getByText(/subpopulation #1/i)).toBeInTheDocument();
  });

  it('can display a recommendation text', () => {
    render(ui());

    expect(screen.queryAllByPlaceholderText('Describe your recommendation')[0]).toHaveValue('Recommendation #1');
  });

  it('can display a recommendation rationale', () => {
    render(ui());

    expect(screen.queryAllByPlaceholderText('Describe the rationale for your recommendation')[0]).toHaveValue(
      'Test rationale'
    );
  });

  it('can display a recommendation comment', async () => {
    render(ui());

    await waitFor(() => userEvent.click(screen.queryAllByRole('button', { name: /show comment/i })[0]));
    expect(screen.queryAllByPlaceholderText('Add an optional comment')[0]).toHaveValue('Test comment');
  });

  it('can display a recommendation link', async () => {
    render(ui());

    // we need to click the combobox in order for the options to be queryable (not irl, but in the test)
    await waitFor(() => userEvent.click(screen.getByRole('combobox', { name: /link type/i })));
    expect(screen.getByRole('option', { name: /absolute/i }).getAttribute('aria-selected')).toBe('true');
    expect(screen.getByRole('option', { name: /smart/i }).getAttribute('aria-selected')).toBe('false');
    expect(screen.queryAllByPlaceholderText('Link Text')[0]).toHaveValue('Test Link');
    expect(screen.queryAllByPlaceholderText('Link Address')[0]).toHaveValue('https://test-link.com');
  });

  it('can display a recommendation suggestion without actions', () => {
    render(ui());

    const allSuggestions = screen.queryAllByPlaceholderText('Label for your suggestion');
    expect(allSuggestions[0]).toHaveValue('First suggestion for second recommendation');
    expect(allSuggestions[1]).toHaveValue('First suggestion for third recommendation');
    expect(allSuggestions[2]).toHaveValue('Second suggestion for third recommendation');
  });

  it('can display a recommendation suggestion with actions', () => {
    const { getAllByTestId } = render(ui());

    const allActions = getAllByTestId('action');
    expect(allActions[0].firstChild).toHaveTextContent('MedicationRequest Create Action');
    expect(allActions[0].firstChild).toHaveTextContent('First action - a MedicationRequest');
    expect(allActions[1].firstChild).toHaveTextContent('MedicationRequest Create Action');
    expect(allActions[1].firstChild).toHaveTextContent('Second action - a MedicationRequest');
    expect(allActions[2].firstChild).toHaveTextContent('ServiceRequest Create Action');
    expect(allActions[2].firstChild).toHaveTextContent('First action - a ServiceRequest');
    expect(allActions[3].firstChild).toHaveTextContent('ServiceRequest Create Action');
    expect(allActions[3].firstChild).toHaveTextContent('Second action - a ServiceRequest');
  });

  it('can add a subpopulation to a recommendation', async () => {
    const handleUpdateRecommendations = jest.fn();
    render(ui({ handleUpdateRecommendations }));

    await waitFor(() => userEvent.click(screen.queryAllByRole('button', { name: /add subpopulation/i })[0]));
    await waitFor(() => userEvent.click(screen.queryAllByTestId('add-subpopulation')[0]));
    await waitFor(() => userEvent.click(screen.getByRole('option', { name: /meets exclusion criteria/i })));

    expect(handleUpdateRecommendations).toHaveBeenCalledWith([
      {
        ...recommendations[0],
        subpopulations: [
          recommendations[0].subpopulations[0],
          {
            special: true,
            special_subpopulationName: '"MeetsExclusionCriteria"',
            subpopulationName: 'Meets Exclusion Criteria',
            uniqueId: 'default-subpopulation-2'
          }
        ]
      },
      recommendations[1],
      recommendations[2]
    ]);
  });

  it('can add a rationale to a recommendation', async () => {
    const handleUpdateRecommendations = jest.fn();
    render(ui({ handleUpdateRecommendations }));

    expect(screen.queryAllByPlaceholderText('Describe the rationale for your recommendation')).toHaveLength(1);

    await waitFor(() => userEvent.click(screen.queryAllByRole('button', { name: /add rationale/i })[0]));
    expect(screen.queryAllByPlaceholderText('Describe the rationale for your recommendation')).toHaveLength(2);

    fireEvent.change(screen.queryAllByPlaceholderText('Describe the rationale for your recommendation')[1], {
      target: { name: 'text', value: 'Recommendation #2 Rationale' }
    });

    expect(handleUpdateRecommendations).toHaveBeenCalledWith([
      recommendations[0],
      {
        ...recommendations[1],
        rationale: 'Recommendation #2 Rationale'
      },
      recommendations[2]
    ]);
  });

  it('can add a comment to a recommendation', async () => {
    const handleUpdateRecommendations = jest.fn();
    render(ui({ handleUpdateRecommendations }));

    expect(screen.queryAllByPlaceholderText('Add an optional comment')).toHaveLength(0);

    await waitFor(() => userEvent.click(screen.queryAllByRole('button', { name: /show comment/i })[1]));
    expect(screen.getByPlaceholderText('Add an optional comment')).toBeInTheDocument();

    fireEvent.change(screen.getByPlaceholderText('Add an optional comment'), {
      target: { name: 'text', value: 'Recommendation #2 Comment' }
    });

    expect(handleUpdateRecommendations).toHaveBeenCalledWith([
      recommendations[0],
      {
        ...recommendations[1],
        comment: 'Recommendation #2 Comment'
      },
      recommendations[2]
    ]);
  });

  it('can add a link to a recommendation', async () => {
    const handleUpdateRecommendations = jest.fn();
    render(ui({ handleUpdateRecommendations }));

    expect(screen.getByText(/link\.\.\./i)).toBeInTheDocument();

    await waitFor(() => userEvent.click(screen.queryAllByRole('button', { name: /add link/i })[1]));
    expect(handleUpdateRecommendations).toHaveBeenCalledWith([
      recommendations[0],
      {
        ...recommendations[1],
        links: [
          {
            uid: expect.any(String),
            type: '',
            label: '',
            url: ''
          }
        ]
      },
      recommendations[2]
    ]);
  });

  it('can add a suggestion to a recommendation', async () => {
    const handleUpdateRecommendations = jest.fn();
    render(ui({ handleUpdateRecommendations }));

    await waitFor(() => userEvent.click(screen.queryAllByRole('button', { name: /add suggestion/i })[0])); // add suggestion to first rec
    expect(handleUpdateRecommendations).toHaveBeenLastCalledWith([
      {
        ...recommendations[0],
        suggestions: [
          {
            uid: expect.any(String),
            label: '',
            actions: []
          }
        ]
      },
      recommendations[1],
      recommendations[2]
    ]);
  });

  it('can add another suggestion to a recommendation that already has suggestions', async () => {
    const handleUpdateRecommendations = jest.fn();
    render(ui({ handleUpdateRecommendations }));

    await waitFor(() => userEvent.click(screen.queryAllByRole('button', { name: /add suggestion/i })[1])); // add another suggestion to second rec
    expect(handleUpdateRecommendations).toHaveBeenLastCalledWith([
      recommendations[0],
      {
        ...recommendations[1],
        suggestions: [
          {
            // existing suggestion
            uid: 'suggestion-02-01',
            label: 'First suggestion for second recommendation',
            actions: []
          },
          {
            // new suggestion
            uid: expect.any(String),
            label: '',
            actions: []
          }
        ]
      },
      recommendations[2]
    ]);
  });

  it('can add an action to a suggestion on a recommendation', async () => {
    const handleUpdateRecommendations = jest.fn();
    render(ui({ handleUpdateRecommendations }));

    // add an action to the blank suggestion on the second rec
    await waitFor(() => userEvent.click(screen.getAllByRole('button', { name: /add action/i })[0]));
    expect(screen.queryAllByRole('menuitem')[0]).toHaveTextContent('Medication Request');
    expect(screen.queryAllByRole('menuitem')[1]).toHaveTextContent('Service Request');
    await waitFor(() => userEvent.click(screen.queryAllByRole('menuitem')[0])); // select medication request action to open modal
    expect(await screen.findByText('New Action')).toBeInTheDocument();
    expect(await screen.findByRole('button', { name: 'Create' })).toBeInTheDocument();
    expect(await screen.findByRole('button', { name: 'Create' })).toBeDisabled();
    fireEvent.change(screen.getByPlaceholderText(/description of your action/i), {
      target: { name: 'text', value: 'First action of first suggestion of second rec' }
    });
    fireEvent.change(screen.getAllByPlaceholderText(/CodeableConcept text/i)[0], {
      target: { name: 'text', value: 'any code' }
    });
    await waitFor(() => userEvent.click(screen.getAllByRole('combobox')[0])); // status select
    await waitFor(() => userEvent.click(screen.getByRole('option', { name: 'draft' })));
    await waitFor(() => userEvent.click(screen.getAllByRole('combobox')[1])); // intent select
    await waitFor(() => userEvent.click(screen.getByRole('option', { name: 'proposal' })));
    expect(await screen.findByRole('button', { name: 'Create' })).toBeEnabled();
    await waitFor(() => userEvent.click(screen.getByRole('button', { name: 'Create' })));
    const updatedSuggestion = { ...recommendations[1] };
    updatedSuggestion.suggestions[0].actions[0] = {
      type: 'create',
      description: 'First action of first suggestion of second rec',
      resource: {
        resourceType: 'MedicationRequest',
        medicationCodeableConcept: {
          text: 'any code',
          code: '',
          display: '',
          system: '',
          uri: ''
        },
        status: 'draft',
        intent: 'proposal',
        priority: '',
        reasonCode: {
          text: '',
          code: '',
          display: '',
          system: '',
          uri: ''
        },
        category: {
          text: '',
          code: '',
          display: '',
          system: '',
          uri: ''
        }
      }
    };
    expect(handleUpdateRecommendations).toHaveBeenCalledWith([
      recommendations[0],
      updatedSuggestion,
      recommendations[2]
    ]);

    // add a second action to the same suggestion on the second rec
    await waitFor(() => userEvent.click(screen.getAllByRole('button', { name: /add action/i })[0]));
    await waitFor(() => userEvent.click(screen.queryAllByRole('menuitem')[1])); // select service request action to open modal
    expect(await screen.findByText('New Action')).toBeInTheDocument();
    expect(await screen.findByRole('button', { name: 'Create' })).toBeInTheDocument();
    expect(await screen.findByRole('button', { name: 'Create' })).toBeDisabled();
    fireEvent.change(screen.getByPlaceholderText(/description of your action/i), {
      target: { name: 'text', value: 'Second action of first suggestion of second rec' }
    });
    fireEvent.change(screen.getAllByPlaceholderText(/CodeableConcept text/i)[0], {
      target: { name: 'text', value: 'any code' }
    });
    await waitFor(() => userEvent.click(screen.getAllByRole('combobox')[0])); // status select
    await waitFor(() => userEvent.click(screen.getByRole('option', { name: 'draft' })));
    await waitFor(() => userEvent.click(screen.getAllByRole('combobox')[1])); // intent select
    await waitFor(() => userEvent.click(screen.getByRole('option', { name: 'proposal' })));
    expect(await screen.findByRole('button', { name: 'Create' })).toBeEnabled();
    await waitFor(() => userEvent.click(screen.getByRole('button', { name: 'Create' })));
    updatedSuggestion.suggestions[0].actions[1] = {
      type: 'create',
      description: 'Second action of first suggestion of second rec',
      resource: {
        resourceType: 'ServiceRequest',
        code: {
          text: 'any code',
          code: '',
          display: '',
          system: '',
          uri: ''
        },
        status: 'draft',
        intent: 'proposal',
        priority: '',
        reasonCode: {
          text: '',
          code: '',
          display: '',
          system: '',
          uri: ''
        },
        category: {
          text: '',
          code: '',
          display: '',
          system: '',
          uri: ''
        }
      }
    };
    expect(handleUpdateRecommendations).toHaveBeenCalledWith([
      recommendations[0],
      updatedSuggestion,
      recommendations[2]
    ]);
  });

  it('can edit an action already on a suggestion on a recommendation', async () => {
    const handleUpdateRecommendations = jest.fn();
    render(ui({ handleUpdateRecommendations }));

    const editButtons = screen.getAllByRole('button', { name: /edit action/i });
    expect(editButtons).toHaveLength(4);
    expect(await screen.queryByRole('dialog')).not.toBeInTheDocument(); // modal isn't open before editing
    await waitFor(() => userEvent.click(editButtons[0])); // edit first action on third suggestion
    expect(await screen.findByRole('dialog')).toBeInTheDocument(); // modal is open when editing
    expect(await screen.findByText('Update Action')).toBeInTheDocument(); // modal is in update mode
    expect(await screen.findByRole('button', { name: 'Update' })).toBeInTheDocument();

    // check form is pre-populated with current values
    expect(screen.getByPlaceholderText(/description of your action/i)).toHaveValue(
      'First action - a MedicationRequest'
    );
    expect(screen.getAllByPlaceholderText(/codeableconcept text/i)[0]).toHaveValue('Any code for example med1'); // medicationCodeableConcept info
    expect(screen.getByText('example-med1')).toBeInTheDocument();
    expect(screen.getByText('RXNORM')).toBeInTheDocument();
    expect(screen.getByText('http://www.nlm.nih.gov/research/umls/rxnorm')).toBeInTheDocument();
    expect(screen.getAllByRole('combobox')[0]).toHaveValue('draft'); // status select box
    expect(screen.getAllByRole('combobox')[1]).toHaveValue('proposal'); // intent select box
    expect(screen.getAllByRole('combobox')[2]).toHaveValue('routine'); // priority select box
    expect(screen.getAllByPlaceholderText(/codeableconcept text/i)[1]).toHaveValue('Any code for reason'); // reason codeableConcept info
    expect(screen.getByText('123')).toBeInTheDocument();
    expect(screen.getByText('ICD-9-CM')).toBeInTheDocument();
    expect(screen.getByText('http://hl7.org/fhir/sid/icd-9-cm')).toBeInTheDocument();
    expect(screen.getAllByPlaceholderText(/codeableconcept text/i)[2]).toHaveValue('Any code for category'); // category codeableConcept info
    expect(screen.getByText('345')).toBeInTheDocument();
    expect(screen.getByText('NCI')).toBeInTheDocument();
    expect(screen.getByText('http://ncimeta.nci.nih.gov')).toBeInTheDocument();

    // update some values
    fireEvent.change(screen.getByPlaceholderText(/description of your action/i), {
      target: { name: 'text', value: 'new and improved action' }
    });
    await waitFor(() => userEvent.click(screen.getAllByRole('combobox')[0]));
    await waitFor(() => userEvent.click(screen.getByRole('option', { name: 'active' })));
    expect(screen.getByPlaceholderText(/description of your action/i)).toHaveValue('new and improved action');
    expect(screen.getAllByRole('combobox')[0]).toHaveValue('active');
    await waitFor(() => userEvent.click(screen.getByRole('button', { name: 'Update' })));

    const updatedSuggestion = { ...recommendations[2] };
    updatedSuggestion.suggestions[0].actions[0] = {
      type: 'create',
      description: 'new and improved action', // updated
      resource: {
        resourceType: 'MedicationRequest',
        medicationCodeableConcept: {
          text: 'Any code for example med1',
          code: 'example-med1',
          display: '',
          system: 'RXNORM',
          uri: 'http://www.nlm.nih.gov/research/umls/rxnorm'
        },
        status: 'active', // updated
        intent: 'proposal',
        priority: 'routine',
        reasonCode: {
          text: 'Any code for reason',
          code: '123',
          display: '',
          system: 'ICD-9-CM',
          uri: 'http://hl7.org/fhir/sid/icd-9-cm'
        },
        category: {
          text: 'Any code for category',
          code: '345',
          display: '',
          system: 'NCI',
          uri: 'http://ncimeta.nci.nih.gov'
        }
      }
    };
    expect(handleUpdateRecommendations).toHaveBeenCalledWith([
      recommendations[0],
      recommendations[1],
      updatedSuggestion
    ]);
  });

  it('cannot add a suggestion to a recommendation when R4 is not available as a FHIR version', async () => {
    const noSuggestionsRecommendation = {
      uid: 'rec-101',
      grade: 'A',
      subpopulations: [
        {
          uniqueId: 'sp-001',
          subpopulationName: 'Subpopulation #1'
        }
      ],
      text: 'Recommendation #1',
      rationale: 'Test rationale',
      comment: 'Test comment',
      links: [
        {
          type: 'absolute',
          label: 'Test Link',
          url: 'https://test-link.com'
        }
      ],
      suggestions: []
    };

    // non-R4 disables suggestions button
    const { rerender } = render(
      ui({ artifact: { ...mockArtifact, recommendations: [noSuggestionsRecommendation], fhirVersion: '1.0.2' } })
    );
    let addSuggestionButton = screen.queryAllByRole('button', { name: /add suggestion/i });
    expect(addSuggestionButton).toHaveLength(1);
    expect(addSuggestionButton[0]).toBeDisabled();

    // R4 enables suggestions button
    rerender(
      ui({ artifact: { ...mockArtifact, recommendations: [noSuggestionsRecommendation], fhirVersion: '4.0.x' } })
    );
    addSuggestionButton = screen.queryAllByRole('button', { name: /add suggestion/i });
    expect(addSuggestionButton).toHaveLength(1);
    expect(addSuggestionButton[0]).toBeEnabled();

    // any FHIR version enables suggestions button
    rerender(ui({ artifact: { ...mockArtifact, recommendations: [noSuggestionsRecommendation], fhirVersion: '' } }));
    addSuggestionButton = screen.queryAllByRole('button', { name: /add suggestion/i });
    expect(addSuggestionButton).toHaveLength(1);
    expect(addSuggestionButton[0]).toBeEnabled();
  });

  it('can delete a subpopulation from a recommendation', async () => {
    const handleUpdateRecommendations = jest.fn();
    render(ui({ handleUpdateRecommendations }));

    await waitFor(() => userEvent.click(screen.getByRole('button', { name: /remove subpopulation/i })));
    expect(handleUpdateRecommendations).toHaveBeenCalledWith([
      {
        ...recommendations[0],
        subpopulations: []
      },
      recommendations[1],
      recommendations[2]
    ]);
  });

  it('can delete a rationale from a recommendation', async () => {
    const handleUpdateRecommendations = jest.fn();
    render(ui({ handleUpdateRecommendations }));

    await waitFor(() => userEvent.click(screen.queryAllByRole('button', { name: /remove field/i })[0]));
    expect(handleUpdateRecommendations).toHaveBeenCalledWith([
      {
        ...recommendations[0],
        rationale: ''
      },
      recommendations[1],
      recommendations[2]
    ]);
  });

  it('can delete a comment from a recommendation', async () => {
    const handleUpdateRecommendations = jest.fn();
    render(ui({ handleUpdateRecommendations }));

    await waitFor(() => userEvent.click(screen.queryAllByRole('button', { name: /show comment/i })[0]));
    fireEvent.change(screen.getByPlaceholderText('Add an optional comment'), {
      target: { name: 'text', value: '' }
    });
    expect(handleUpdateRecommendations).toHaveBeenCalledWith([
      {
        ...recommendations[0],
        comment: ''
      },
      recommendations[1],
      recommendations[2]
    ]);
  });

  it('can delete a link from a recommendation', async () => {
    const handleUpdateRecommendations = jest.fn();
    render(ui({ handleUpdateRecommendations }));

    await waitFor(() => userEvent.click(screen.getByRole('button', { name: /remove link/i })));
    expect(handleUpdateRecommendations).toHaveBeenCalledWith([
      {
        ...recommendations[0],
        links: []
      },
      recommendations[1],
      recommendations[2]
    ]);
  });

  it('can delete a suggestion from a recommendation', async () => {
    const handleUpdateRecommendations = jest.fn();
    render(ui({ handleUpdateRecommendations }));

    await waitFor(() => userEvent.click(screen.getAllByRole('button', { name: /remove suggestion/i })[0]));
    expect(handleUpdateRecommendations).toHaveBeenCalledWith([
      recommendations[0],
      { ...recommendations[1], suggestions: [] },
      recommendations[2]
    ]);
  });

  it('can delete an action from a suggestion on a recommendation', async () => {
    const handleUpdateRecommendations = jest.fn();
    render(ui({ handleUpdateRecommendations }));

    // delete first action within the suggestion
    await waitFor(() => userEvent.click(screen.getAllByRole('button', { name: /delete action/i })[0]));
    const updatedSuggestion = { ...recommendations[2] };
    updatedSuggestion.suggestions[0].actions = [
      {
        type: 'create',
        description: 'Second action - a MedicationRequest',
        resource: {
          resourceType: 'MedicationRequest',
          medicationCodeableConcept: {
            text: 'Any code for med2',
            code: 'example-med2',
            display: '',
            system: 'RXNORM',
            uri: 'http://www.nlm.nih.gov/research/umls/rxnorm'
          },
          status: 'draft',
          intent: 'proposal',
          priority: 'routine',
          reasonCode: {
            text: 'Any code for reason',
            code: '',
            display: '',
            system: '',
            uri: ''
          },
          category: {
            text: 'Any code for reason',
            code: '',
            display: '',
            system: '',
            uri: ''
          }
        }
      }
    ];
    expect(handleUpdateRecommendations).toHaveBeenCalledWith([
      recommendations[0],
      recommendations[1],
      updatedSuggestion
    ]);

    // delete the second action within the suggestion
    await waitFor(() => userEvent.click(screen.getAllByRole('button', { name: /delete action/i })[0]));
    const updatedSuggestion2 = { ...recommendations[2] };
    updatedSuggestion2.suggestions[0].actions = [];
    expect(handleUpdateRecommendations).toHaveBeenCalledWith([
      recommendations[0],
      recommendations[1],
      updatedSuggestion
    ]);
  });
});
