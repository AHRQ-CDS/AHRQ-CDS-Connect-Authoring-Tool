import React from 'react';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import nock from 'nock';
import pluralize from 'pluralize';
import { fireEvent, render, screen, userEvent, waitFor, within } from 'utils/test-utils';
import mockArtifact from 'mocks/mockArtifact';
import mockExternalCqlLibrary from 'mocks/mockExternalCQLLibrary';
import { mockTemplates2 } from 'mocks/mockTemplates';
import changeToCase from 'utils/strings';
import ElementSelect, { VSAC_OPTIONS } from '../ElementSelect';

describe('<ElementSelect />', () => {
  const mockElementSelectArtifact = {
    ...mockArtifact,
    baseElements: [
      {
        id: 'Gender',
        name: 'Gender',
        uniqueId: 'base-element-1',
        returnType: 'boolean',
        fields: [{ id: 'element_name', value: 'isFemale' }]
      }
    ],
    parameters: [{ name: 'isTrue', uniqueId: 'parameter-0', type: 'boolean', value: 'true' }]
  };

  const renderComponent = ({ apiKey = null, artifact = mockElementSelectArtifact, ...props } = {}) =>
    render(
      <Provider
        store={createStore(x => x, {
          artifacts: { artifact },
          vsac: { apiKey }
        })}
      >
        <ElementSelect excludeListOperations={true} handleAddElement={jest.fn()} isDisabled={false} {...props} />
      </Provider>
    );

  beforeEach(() => {
    nock('http://localhost')
      .persist()
      .get(`/authoring/api/externalCQL/${mockArtifact._id}`)
      .reply(200, [mockExternalCqlLibrary])
      .get('/authoring/api/config/templates')
      .reply(200, mockTemplates2);
  });
  afterEach(() => nock.cleanAll());

  it('renders the component with proper elements', () => {
    renderComponent();

    expect(screen.getByText(/new element:/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /element type ​/i })).toBeInTheDocument();
  });

  describe('select element field', () => {
    it('starts with correct placeholder text', () => {
      renderComponent();

      expect(screen.getByLabelText(/element type/i)).toBeInTheDocument();
    });

    it('starts with a list of all elements', async () => {
      renderComponent();

      userEvent.click(screen.getByLabelText('Element type'));
      await waitFor(() => expect(screen.queryAllByRole('option').length).toEqual(16));
    });

    it('options display correct values and have key icon if VSAC auth required', async () => {
      renderComponent();

      userEvent.click(screen.getByLabelText('Element type'));
      await waitFor(() => expect(screen.queryAllByRole('option').length).toEqual(16));

      const vsacOptions = VSAC_OPTIONS.map(option => pluralize.singular(changeToCase(option, 'capitalCase')));
      vsacOptions.forEach(vsacOptionName => {
        const option = screen.getByRole('option', { name: vsacOptionName });
        expect(option.querySelector('[data-testid="vsac-auth-required-icon"]')).toBeInTheDocument();
      });
    });

    it('selects a demographic option and calls handleAddElement with the correct element', async () => {
      const handleAddElement = jest.fn();
      renderComponent({ handleAddElement });

      userEvent.click(screen.getByLabelText('Element type'));
      userEvent.click(await screen.findByRole('option', { name: /demographics/i }));
      userEvent.click(await screen.findByLabelText('Demographics Element'));
      userEvent.click(await screen.findByRole('option', { name: /age range/i }));

      const element = {
        fields: [
          { id: 'element_name', name: 'Element Name', type: 'string' },
          { id: 'comment', name: 'Comment', type: 'textarea' },
          { id: 'min_age', name: 'Minimum Age', type: 'number', typeOfNumber: 'integer' },
          { id: 'max_age', name: 'Maximum Age', type: 'number', typeOfNumber: 'integer' },
          { id: 'unit_of_time', name: 'Unit of Time', select: 'demographics/units_of_time', type: 'valueset' }
        ],
        id: 'AgeRange',
        name: 'Age Range',
        returnType: 'boolean',
        suppressedModifiers: ['BooleanNot', 'BooleanComparison'],
        validator: { fields: ['unit_of_time', 'min_age', 'max_age'], type: 'requiredIfThenOne' }
      };
      expect(handleAddElement).toBeCalledWith(element);
    });

    it('selects a base element option and calls handleAddElement with the correct element', async () => {
      const handleAddElement = jest.fn();
      renderComponent({ handleAddElement });

      userEvent.click(screen.getByLabelText('Element type'));
      userEvent.click(await screen.findByRole('option', { name: /base elements/i }));
      userEvent.click(await screen.findByLabelText('Base Element'));
      userEvent.click(await screen.findByRole('option', { name: /isFemale/i }));

      const element = {
        fields: [
          { id: 'element_name', name: 'Element Name', type: 'string', value: 'isFemale' },
          {
            id: 'baseElementReference',
            name: 'reference',
            static: true,
            type: 'reference',
            value: { id: 'base-element-1', type: 'Gender' }
          },
          { id: 'comment', name: 'Comment', type: 'textarea', value: '' }
        ],
        id: expect.any(String),
        name: 'Base Element',
        returnType: 'boolean',
        template: 'GenericStatement',
        type: 'baseElement'
      };
      expect(handleAddElement).toBeCalledWith(element);
    });

    it('selects a parameter option and calls handleAddElement with the correct element', async () => {
      const handleAddElement = jest.fn();
      renderComponent({ handleAddElement });

      userEvent.click(screen.getByLabelText('Element type'));
      userEvent.click(await screen.findByRole('option', { name: /parameters/i }));
      userEvent.click(await screen.findByLabelText('Parameters Element'));
      userEvent.click(await screen.findByRole('option', { name: /isTrue/i }));

      const element = {
        fields: [
          { id: 'element_name', name: 'Element Name', type: 'string', value: 'isTrue' },
          { id: 'default', name: 'Default', type: 'boolean', value: 'true' },
          {
            id: 'parameterReference',
            name: 'reference',
            static: true,
            type: 'reference',
            value: { id: 'parameter-0' }
          },
          { id: 'comment', name: 'Comment', type: 'textarea', value: '' }
        ],
        id: expect.any(String),
        name: 'isTrue',
        returnType: 'boolean',
        template: 'GenericStatement',
        type: 'parameter'
      };
      expect(handleAddElement).toBeCalledWith(element);
    });

    it('selects an external cql option and calls handleAddElement with the correct element', async () => {
      const handleAddElement = jest.fn();
      renderComponent({ handleAddElement });

      userEvent.click(screen.getByLabelText('Element type'));
      userEvent.click(await screen.findByRole('option', { name: /external cql/i }));
      userEvent.click(await screen.findByLabelText('External CQL Element'));
      userEvent.click(await screen.findByRole('option', { name: /cql-upload/i }));
      userEvent.click(await screen.findByLabelText('Definition, function, or parameter'));
      userEvent.click(await screen.findByRole('option', { name: /age/i }));

      const element = {
        fields: [
          { id: 'element_name', name: 'Element Name', type: 'string', value: 'Age' },
          {
            id: 'externalCqlReference',
            name: 'reference',
            static: true,
            type: 'reference',
            value: { arguments: undefined, element: 'Age', id: 'Age from CQL-Upload', library: 'CQL-Upload' }
          },
          { id: 'comment', name: 'Comment', type: 'textarea', value: '' }
        ],
        id: expect.any(String),
        name: 'External CQL Element',
        returnType: 'boolean',
        template: 'GenericStatement',
        type: 'externalCqlElement'
      };
      expect(handleAddElement).toBeCalledWith(element);
    });

    it('displays the Authenticate VSAC button when not logged in after selecting a vsac auth option', async () => {
      const handleAddElement = jest.fn();
      renderComponent({ handleAddElement });

      userEvent.click(screen.getByLabelText('Element type'));
      userEvent.click(await screen.findByRole('option', { name: /condition/i }));

      await waitFor(() => expect(screen.getByText('Authenticate VSAC')).toBeInTheDocument());
    });

    it('selects a value set option and calls handleAddElement with the correct element', async () => {
      const apiKey = 'abc123';

      const testVsacSearchResults = [
        {
          name: 'Test VS',
          type: 'Grouping',
          steward: 'Test Steward',
          oid: '1.2.3',
          codeCount: 4,
          codeSystem: ['Test CS']
        },
        {
          name: 'New VS',
          type: 'Extentional',
          steward: 'New Steward',
          oid: '3.4.5',
          codeCount: 8,
          codeSystem: ['New CS']
        }
      ];

      const testVsacDetails = [
        {
          code: '123-4',
          codeSystem: '1.2.3',
          codeSystemName: 'CodeSysName',
          codeSystemVersion: '1.2',
          displayName: 'Code Display Name'
        }
      ];

      nock('http://localhost')
        .persist()
        .get('/authoring/api/fhir/search?keyword=TestCondition')
        .basicAuth({ user: '', pass: apiKey })
        .reply(200, {
          count: 2,
          results: testVsacSearchResults
        })
        .get('/authoring/api/fhir/vs/3.4.5')
        .basicAuth({ user: '', pass: apiKey })
        .reply(200, {
          codes: testVsacDetails
        })
        .get('/authoring/api/fhir/vs/1.2.3')
        .basicAuth({ user: '', pass: apiKey })
        .reply(404);

      const handleAddElement = jest.fn();
      renderComponent({ handleAddElement, apiKey });

      userEvent.click(screen.getByLabelText('Element type'));
      userEvent.click(await screen.findByRole('option', { name: /condition/i }));

      await waitFor(() => expect(screen.queryByText('Authenticate VSAC')).not.toBeInTheDocument());
      expect(screen.getByText('VSAC Authenticated')).toBeInTheDocument();
      expect(screen.getByText('Add Value Set')).toBeInTheDocument();

      userEvent.click(screen.getByRole('button', { name: /add value set/i }));
      expect(screen.queryByRole('dialog')).toBeInTheDocument();

      const dialog = within(screen.getByRole('dialog'));
      fireEvent.change(dialog.getByRole('textbox'), { target: { value: 'TestCondition' } });
      userEvent.click(dialog.getByRole('button', { name: 'Search' }));
      userEvent.click(await dialog.findByText('New VS'));
      userEvent.click(dialog.getByRole('button', { name: 'Select' }));

      const element = {
        extends: 'Base',
        fields: [
          { id: 'element_name', name: 'Element Name', type: 'string', value: 'New VS' },
          { id: 'comment', name: 'Comment', type: 'textarea' },
          {
            id: 'condition',
            name: 'Condition',
            static: true,
            type: 'condition_vsac',
            valueSets: [{ name: 'New VS', oid: '3.4.5' }]
          }
        ],
        id: 'GenericCondition_vsac',
        name: 'Condition',
        returnType: 'list_of_conditions',
        suppress: true,
        template: 'GenericCondition',
        type: 'element'
      };
      expect(handleAddElement).toBeCalledWith(element);
    });

    it('selects a code option and calls handleAddElement with the correct element', async () => {
      const code = '123-4';

      nock('http://localhost')
        .get('/authoring/api/fhir/code')
        .query({ code, system: 'http://snomed.info/sct' })
        .reply(200, {
          code,
          systemName: 'SNOMED',
          display: 'One Two Three-Four'
        });

      const handleAddElement = jest.fn();
      renderComponent({ handleAddElement, apiKey: 'abc123' });

      userEvent.click(screen.getByLabelText('Element type'));
      userEvent.click(await screen.findByRole('option', { name: /condition/i }));

      await waitFor(() => expect(screen.queryByText('Authenticate VSAC')).not.toBeInTheDocument());
      expect(screen.getByText('VSAC Authenticated')).toBeInTheDocument();
      expect(screen.getByText('Add Code')).toBeInTheDocument();

      userEvent.click(screen.getByRole('button', { name: /add code/i }));
      expect(screen.queryByRole('dialog')).toBeInTheDocument();

      const dialog = within(screen.getByRole('dialog'));
      fireEvent.change(dialog.getByLabelText('Code'), { target: { value: code } });
      userEvent.click(dialog.getByLabelText('Code system'));
      userEvent.click(screen.getByRole('option', { name: 'SNOMED' }));
      userEvent.click(dialog.getByRole('button', { name: 'Validate' }));
      userEvent.click(await dialog.findByRole('button', { name: 'Select' }));

      const element = {
        id: 'GenericCondition_vsac',
        name: 'Condition',
        returnType: 'list_of_conditions',
        suppress: true,
        extends: 'Base',
        template: 'GenericCondition',
        fields: [
          { id: 'element_name', type: 'string', name: 'Element Name', value: '' },
          { id: 'comment', type: 'textarea', name: 'Comment' },
          {
            id: 'condition',
            type: 'condition_vsac',
            name: 'Condition',
            static: true,
            codes: [
              {
                code: '123-4',
                codeSystem: { id: 'http://snomed.info/sct', name: 'SNOMED' },
                display: ''
              }
            ]
          }
        ],
        type: 'element'
      };

      expect(handleAddElement).toBeCalledWith(element);
    });
  });

  it('does not allow an option to be selected if no suboptions exist', async () => {
    nock.cleanAll();
    nock('http://localhost')
      .get(`/authoring/api/externalCQL/${mockArtifact._id}`)
      .reply(200, [])
      .get('/authoring/api/config/templates')
      .reply(200, mockTemplates2);

    renderComponent({ artifact: mockArtifact });

    userEvent.click(screen.getByLabelText('Element type'));
    await waitFor(() => expect(screen.queryAllByRole('option').length).toEqual(16));

    expect(screen.getByRole('option', { name: /base elements/i })).toHaveAttribute('aria-disabled', 'true');
    expect(screen.getByRole('option', { name: /parameters/i })).toHaveAttribute('aria-disabled', 'true');
    expect(screen.getByRole('option', { name: /external cql/i })).toHaveAttribute('aria-disabled', 'true');
  });
});
