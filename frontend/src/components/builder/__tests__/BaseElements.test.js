import React from 'react';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import nock from 'nock';

import BaseElements from '../BaseElements';
import { render, screen, userEvent } from 'utils/test-utils';
import { elementGroups, genericBaseElementInstance, genericBaseElementListInstance } from 'utils/test_fixtures';
import { mockArtifact } from 'mocks/artifacts';
import { mockExternalCqlLibrary } from 'mocks/external-cql';
import { mockTemplates } from 'mocks/templates';

describe('<BaseElements />', () => {
  const renderComponent = (props = {}) =>
    render(
      <Provider store={createStore(x => x, { artifacts: { artifact: mockArtifact }, vsac: { apiKey: '1234' } })}>
        <BaseElements
          addBaseElement={jest.fn()}
          addInstance={jest.fn()}
          baseElements={[]}
          conversionFunctions={[]}
          deleteInstance={jest.fn()}
          editInstance={jest.fn()}
          getAllInstances={jest.fn()}
          getAllInstancesInAllTrees={jest.fn(() => [])}
          instance={null}
          instanceNames={[]}
          isLoadingModifiers={false}
          modifierMap={{}}
          modifiersByInputType={{}}
          parameters={[]}
          templates={[]}
          treeName="baseElements"
          updateBaseElementLists={jest.fn()}
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

  it('renders separate template instances', () => {
    const genericBaseElementInstanceWithoutUsedBy = { ...genericBaseElementInstance, usedBy: [] };

    const baseElements = [genericBaseElementInstanceWithoutUsedBy, genericBaseElementInstanceWithoutUsedBy];

    const { container } = renderComponent({
      baseElements,
      instance: { baseElements }
    });

    const templateInstanceHeaders = container.querySelectorAll('.MuiCardHeader-root');
    expect(templateInstanceHeaders).toHaveLength(2);
    expect(templateInstanceHeaders[0]).toHaveTextContent('Observation');
    expect(templateInstanceHeaders[1]).toHaveTextContent('Observation');
  });

  it('can render a list group with conjunction and a template instance inside', async () => {
    const baseElements = [genericBaseElementListInstance];
    const { container } = renderComponent({
      baseElements,
      getAllInstances: () => genericBaseElementListInstance.childInstances,
      instance: { baseElements, uniqueId: 'uuid' },
      templates: elementGroups
    });

    // ListGroup renders a ConjunctionGroup
    const conjunctions = container.querySelectorAll('.subpopulations');
    expect(conjunctions).toHaveLength(1);

    // ConjunctionGroup renders a TemplateInstance and an ElementSelect
    const [conjunctionGroup] = conjunctions;
    const expressPhrase = conjunctionGroup.querySelectorAll(
      '[class^="ElementCard-expressionTag"], [class^="ElementCard-expressionText"]'
    );

    expect(expressPhrase[0]).toHaveTextContent('Union');
    expect(expressPhrase[1]).toHaveTextContent('of');
    expect(expressPhrase[2]).toHaveTextContent('VSAC Observation');

    // The Type options in the Conjunction group match the List options, not the usual operations
    userEvent.click(screen.getByRole('button', { name: 'Union' }));

    const listOperations = elementGroups[3].entries;
    const menuOptions = screen.getAllByRole('option');
    expect(menuOptions).toHaveLength(2);
    expect(menuOptions[0]).toHaveTextContent(listOperations[0].name);
    expect(menuOptions[1]).toHaveTextContent(listOperations[1].name);
  });
});
