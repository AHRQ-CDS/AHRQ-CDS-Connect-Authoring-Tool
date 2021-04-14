import React from 'react';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import nock from 'nock';
import { render, fireEvent, userEvent, screen } from 'utils/test-utils';
import { elementGroups } from 'utils/test_fixtures';
import Subpopulation from '../Subpopulation';
import mockArtifact from 'mocks/mockArtifact';
import mockExternalCqlLibrary from 'mocks/mockExternalCQLLibrary';
import { mockTemplates2 } from 'mocks/mockTemplates';

const subpopulationName = 'Subpopulation 1';
const subpopulation = {
  id: 'And',
  name: '',
  conjunction: true,
  returnType: 'boolean',
  fields: [{ id: 'element_name', type: 'string', name: 'Group Name' }],
  uniqueId: 'foo123',
  childInstances: [],
  path: '',
  subpopulationName,
  expanded: true
};

describe('<Subpopulation />', () => {
  const renderComponent = (props = {}) =>
    render(
      <Provider store={createStore(x => x, { artifacts: { artifact: mockArtifact } })}>
        <Subpopulation
          addInstance={jest.fn()}
          artifact={{}}
          baseElements={[]}
          checkSubpopulationUsage={jest.fn()}
          conversionFunctions={[]}
          deleteInstance={jest.fn()}
          editInstance={jest.fn()}
          externalCqlList={[]}
          getAllInstances={jest.fn()}
          getAllInstancesInAllTrees={jest.fn()}
          instanceNames={[]}
          isLoadingModifiers={false}
          loadExternalCqlList={jest.fn()}
          modifierMap={{}}
          modifiersByInputType={{}}
          name=""
          parameters={[]}
          scrollToElement={jest.fn()}
          setSubpopulationName={jest.fn()}
          subpopulation={subpopulation}
          subpopulationIndex={0}
          templates={elementGroups}
          treeName="testtree"
          updateInstanceModifiers={jest.fn()}
          updateSubpopulations={jest.fn()}
          vsaApiKey="key"
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
      .reply(200, mockTemplates2);
  });

  afterEach(() => nock.cleanAll());

  it('starts expanded if expanded property is set to true on subpop object', () => {
    const { container } = renderComponent();

    expect(container.querySelectorAll('.card-element__body')).toHaveLength(1);
  });

  it('can be expanded and collapsed via header', () => {
    const { container } = renderComponent();

    userEvent.click(screen.getByLabelText(`hide ${subpopulationName}`));
    expect(container.querySelectorAll('.card-element__body')).toHaveLength(0);

    userEvent.click(screen.getByLabelText(`show ${subpopulationName}`));
    expect(container.querySelectorAll('.card-element__body')).toHaveLength(1);
  });

  it('calls setSubpopulationName when the subpopulation name is changed', () => {
    const setSubpopulationName = jest.fn();
    renderComponent({ setSubpopulationName });

    fireEvent.change(document.querySelector('input[type=text]'), { target: { value: 'New name' } });

    expect(setSubpopulationName).toBeCalledWith('New name', subpopulation.uniqueId);
  });
});
