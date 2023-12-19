import React from 'react';
import { Provider } from 'react-redux';
import { createMockStore as reduxCreateMockStore } from 'redux-test-utils';
import _ from 'lodash';
import nock from 'nock';
import * as types from 'actions/types';
import mockModifiers from 'mocks/modifiers/mockModifiers';
import { render, fireEvent, userEvent, screen, waitFor, within } from 'utils/test-utils';
import { instanceTree, artifact, reduxState } from 'utils/test_fixtures';
import { simpleObservationInstanceTree } from 'utils/test_fixtures';
import { simpleConditionInstanceTree } from 'utils/test_fixtures';
import { simpleProcedureInstanceTree } from 'utils/test_fixtures';
import { simpleImmunizationInstanceTree } from 'utils/test_fixtures';
import { getFieldWithId } from 'utils/instances';
import Workspace from '../Workspace';
import { mockArtifact } from 'mocks/artifacts';
import { mockExternalCqlLibrary } from 'mocks/external-cql';
import { mockTemplates } from 'mocks/templates';

const modifiersByInputType = {};

mockModifiers.forEach(modifier => {
  modifier.inputTypes.forEach(inputType => {
    modifiersByInputType[inputType] = (modifiersByInputType[inputType] || []).concat(modifier);
  });
});

const defaultState = {
  ...reduxState,
  artifacts: {
    ...reduxState.artifacts,
    artifact: {
      ...artifact,
      expTreeInclude: instanceTree
    }
  },
  modifiers: {
    ...reduxState.modifiers
  },
  navigation: {
    activeTab: 1,
    scrollToId: null
  }
};

const getDefaultStateWithInstanceTree = instanceTree => {
  return {
    ...reduxState,
    artifacts: {
      ...reduxState.artifacts,
      artifact: {
        ...artifact,
        expTreeInclude: instanceTree
      }
    },
    modifiers: {
      ...reduxState.modifiers
    },
    navigation: {
      activeTab: 1,
      scrollToId: null
    }
  };
};

const createMockStore = state => {
  const store = reduxCreateMockStore(state);
  const { dispatch } = store;

  store.dispatch = (...args) => {
    dispatch(...args);
    return Promise.resolve({});
  };

  return store;
};

const expandAction = action => {
  if (typeof action !== 'function') return action;
  let args;
  action(actionArgs => (args = actionArgs));
  return args;
};

describe('<Workspace />', () => {
  const renderComponent = ({ store = createMockStore(defaultState), ...props } = {}) =>
    render(
      <Provider store={store}>
        <Workspace match={{ params: { id: 'artifact123' } }} {...props} />
      </Provider>
    );

  beforeEach(() => {
    nock('http://localhost')
      .persist()
      .put('/authoring/api/artifacts') // mock any put request so can make updates to artifact in tests
      .reply(200, 'OK')
      .get('/authoring/api/artifacts/artifact123')
      .reply(200, [{ ...artifact, expTreeInclude: instanceTree }])
      .get('/authoring/api/config/valuesets/demographics/units_of_time')
      .reply(200, { expansion: [] })
      .get(`/authoring/api/externalCQL/${mockArtifact._id}`)
      .reply(200, [mockExternalCqlLibrary])
      .get(`/authoring/api/modifiers/${mockArtifact._id}`)
      .reply(200, mockModifiers)
      .get('/authoring/api/config/templates')
      .reply(200, mockTemplates);
  });
  afterEach(() => nock.cleanAll());

  afterAll(() => nock.restore());

  it('can edit a template instance', async () => {
    const store = createMockStore(defaultState);
    const { unmount } = renderComponent({ store });

    await waitFor(() => {
      return fireEvent.click(screen.getByLabelText('Age Range'));
    });

    await waitFor(() => {
      return fireEvent.change(document.querySelector('input[type=text]'), {
        target: { value: '30 to 45' }
      });
    });

    const updateAction = expandAction(_.last(store.getActions()));
    const nameField = getFieldWithId(updateAction.artifact.expTreeInclude.childInstances[0].fields, 'element_name');

    expect(updateAction.type).toEqual(types.UPDATE_ARTIFACT);
    expect(nameField.value).toEqual('30 to 45');

    unmount();
  });

  it('can edit a conjunction instance', async () => {
    const store = createMockStore(defaultState);
    const { unmount } = renderComponent({ store });

    await waitFor(() => {
      return userEvent.click(screen.getAllByRole('combobox', { name: '' })[0]);
    });
    await waitFor(() => userEvent.click(screen.getByText('Or')));

    const updateAction = expandAction(_.last(store.getActions()));
    const instance = updateAction.artifact.expTreeInclude;

    expect(updateAction.type).toEqual(types.UPDATE_ARTIFACT);
    expect(instance.id).toEqual('Or');
    expect(instance.name).toEqual('Or');
    unmount();
  });

  it('can delete an instance', async () => {
    const store = createMockStore({
      ...defaultState,
      artifacts: {
        ...defaultState.artifacts,
        artifact: {
          ...artifact,
          expTreeInclude: {
            ...instanceTree,
            childInstances: instanceTree.childInstances.slice(0, 1)
          }
        }
      }
    });

    const { unmount } = renderComponent({ store });

    await waitFor(() => {
      return fireEvent.click(screen.getByLabelText('delete Age Range'));
    });
    fireEvent.click(screen.getByText('Delete'));

    const updateAction = expandAction(_.last(store.getActions()));

    expect(updateAction.type).toEqual(types.UPDATE_ARTIFACT);
    expect(updateAction.artifact.expTreeInclude.childInstances).toHaveLength(0);
    unmount();
  });

  describe('Test that certain modifiers appear given current return type of list_of_observations', () => {
    beforeEach(() => {
      nock('http://localhost')
        .get('/authoring/api/config/valuesets/demographics/units_of_time')
        .reply(200, { expansion: [] });
    });

    describe('Test FirstObservation modifier.', () => {
      const store = createMockStore(getDefaultStateWithInstanceTree(simpleObservationInstanceTree));

      it('should render as a modifier option within a button and dispatch UPDATE_ARTIFACT when added', async () => {
        const { unmount } = renderComponent({ store });

        await waitFor(() => userEvent.click(screen.getAllByRole('button', { name: /Add Modifiers/i })[0]));
        const modal = within(await screen.findByRole('dialog'));
        await waitFor(() => userEvent.click(modal.getAllByRole('button', { name: 'Select Modifiers' })[0]));
        await waitFor(() => userEvent.click(modal.getByLabelText('Select modifier...')));
        await waitFor(() => userEvent.click(within(screen.queryByRole('listbox')).getByText('First')));
        await waitFor(() => userEvent.click(modal.getByRole('button', { name: 'Add' })));

        const updateAction = expandAction(_.last(store.getActions()));
        const [instance] = updateAction.artifact.expTreeInclude.childInstances;
        const [modifier] = instance.modifiers;

        expect(updateAction).toBeDefined();
        expect(updateAction.type).toEqual(types.UPDATE_ARTIFACT);
        expect(modifier.id).toEqual('FirstObservation');
        expect(modifier.name).toEqual('First');
        unmount();
      });
    });

    describe('Test AverageObservationValue modifier.', () => {
      const store = createMockStore(getDefaultStateWithInstanceTree(simpleObservationInstanceTree));

      it('should render as a modifier option within a button and dispatch UPDATE_ARTIFACT when added', async () => {
        const { unmount } = renderComponent({ store });

        await waitFor(() => userEvent.click(screen.getAllByRole('button', { name: /Add Modifiers/i })[0]));
        const modal = within(await screen.findByRole('dialog'));
        await waitFor(() => userEvent.click(modal.getAllByRole('button', { name: 'Select Modifiers' })[0]));
        await waitFor(() => userEvent.click(modal.getByLabelText('Select modifier...')));
        await waitFor(() =>
          userEvent.click(within(screen.queryByRole('listbox')).getByText('Average Observation Value'))
        );
        await waitFor(() => userEvent.click(modal.getByRole('button', { name: 'Add' })));

        const updateAction = expandAction(_.last(store.getActions()));
        const [instance] = updateAction.artifact.expTreeInclude.childInstances;
        const [modifier] = instance.modifiers;

        expect(updateAction).toBeDefined();
        expect(updateAction.type).toEqual(types.UPDATE_ARTIFACT);
        expect(modifier.id).toEqual('AverageObservationValue');
        expect(modifier.name).toEqual('Average Observation Value');
        unmount();
      });
    });

    describe('Test FirstCondition Modifier.', () => {
      const store = createMockStore(getDefaultStateWithInstanceTree(simpleConditionInstanceTree));

      it('should render as a modifier option within a button and dispatch UPDATE_ARTIFACT when added', async () => {
        const { unmount } = renderComponent({ store });

        await waitFor(() => userEvent.click(screen.getAllByRole('button', { name: /Add Modifiers/i })[0]));
        const modal = within(await screen.findByRole('dialog'));
        await waitFor(() => userEvent.click(modal.getAllByRole('button', { name: 'Select Modifiers' })[0]));
        await waitFor(() => userEvent.click(modal.getByLabelText('Select modifier...')));
        await waitFor(() => userEvent.click(within(screen.queryByRole('listbox')).getByText('First')));
        await waitFor(() => userEvent.click(modal.getByRole('button', { name: 'Add' })));

        const updateAction = expandAction(_.last(store.getActions()));
        const [instance] = updateAction.artifact.expTreeInclude.childInstances;
        const [modifier] = instance.modifiers;

        expect(updateAction).toBeDefined();
        expect(updateAction.type).toEqual(types.UPDATE_ARTIFACT);
        expect(modifier.id).toEqual('FirstCondition');
        expect(modifier.name).toEqual('First');
        unmount();
      });
    });

    describe('Test FirstProcedure Modifier.', () => {
      const store = createMockStore(getDefaultStateWithInstanceTree(simpleProcedureInstanceTree));

      it('should render as a modifier option within a button and dispatch UPDATE_ARTIFACT when added', async () => {
        const { unmount } = renderComponent({ store });

        await waitFor(() => userEvent.click(screen.getAllByRole('button', { name: /Add Modifiers/i })[0]), {
          timeout: 15000
        });
        const modal = within(await screen.findByRole('dialog'));
        await waitFor(() => userEvent.click(modal.getAllByRole('button', { name: 'Select Modifiers' })[0]));
        await waitFor(() => userEvent.click(modal.getByLabelText('Select modifier...')));
        await waitFor(() => userEvent.click(within(screen.queryByRole('listbox')).getByText('First')));
        await waitFor(() => userEvent.click(modal.getByRole('button', { name: 'Add' })));

        const updateAction = expandAction(_.last(store.getActions()));
        const [instance] = updateAction.artifact.expTreeInclude.childInstances;
        const [modifier] = instance.modifiers;

        expect(updateAction).toBeDefined();
        expect(updateAction.type).toEqual(types.UPDATE_ARTIFACT);
        expect(modifier.id).toEqual('FirstProcedure');
        expect(modifier.name).toEqual('First');
        unmount();
      });
    });

    describe('Test FirstImmunization Modifier.', () => {
      const store = createMockStore(getDefaultStateWithInstanceTree(simpleImmunizationInstanceTree));

      it('should render as a modifier option within a button and dispatch UPDATE_ARTIFACT when added', async () => {
        const { unmount } = renderComponent({ store });

        await waitFor(() => userEvent.click(screen.getAllByRole('button', { name: /Add Modifiers/i })[0]));
        const modal = within(await screen.findByRole('dialog'));
        await waitFor(() => userEvent.click(modal.getAllByRole('button', { name: 'Select Modifiers' })[0]));
        await waitFor(() => userEvent.click(modal.getByLabelText('Select modifier...')));
        await waitFor(() => userEvent.click(within(screen.queryByRole('listbox')).getByText('First')));
        await waitFor(() => userEvent.click(modal.getByRole('button', { name: 'Add' })));

        const updateAction = expandAction(_.last(store.getActions()));
        const [instance] = updateAction.artifact.expTreeInclude.childInstances;
        const [modifier] = instance.modifiers;

        expect(updateAction).toBeDefined();
        expect(updateAction.type).toEqual(types.UPDATE_ARTIFACT);
        expect(modifier.id).toEqual('FirstImmunization');
        expect(modifier.name).toEqual('First');
        unmount();
      });
    });
  });
});
