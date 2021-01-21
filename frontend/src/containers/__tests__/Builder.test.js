import React from 'react';
import { Provider } from 'react-redux';
import { createMockStore as reduxCreateMockStore } from 'redux-test-utils';
import _ from 'lodash';
import nock from 'nock';
import * as types from 'actions/types';
import localModifiers from 'data/modifiers';
import { render, fireEvent, userEvent, screen } from 'utils/test-utils';
import { instanceTree, emptyInstanceTree, artifact, reduxState } from 'utils/test_fixtures';
import { getFieldWithId } from 'utils/instances';
import Builder from '../Builder';

const modifierMap = _.keyBy(localModifiers, 'id');
const modifiersByInputType = {};

localModifiers.forEach(modifier => {
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
    ...reduxState.modifiers,
    modifierMap,
    modifiersByInputType
  }
};

const createMockStore = state => {
  const store = reduxCreateMockStore(state);
  const { dispatch } = store;

  store.dispatch = (...args) => {
    dispatch(...args);
    return Promise.resolve({ templates: state.templates.templates });
  };

  return store;
};

const expandAction = action => {
  let args;
  action(actionArgs => (args = actionArgs));
  return args;
};

describe('<Builder />', () => {
  const renderComponent = ({ store = createMockStore(defaultState), ...props } = {}) =>
    render(
      <Provider store={store}>
        <Builder match={{ params: {} }} {...props} />
      </Provider>
    );

  beforeEach(() => {
    nock('http://localhost')
      .get('/authoring/api/config/valuesets/demographics/units_of_time')
      .reply(200, {expansion: []});
  });

  it('shows loading screen when artifact is not loaded', () => {
    const { getByText } = renderComponent({
      store: createMockStore({
        ...defaultState,
        artifacts: {
          ...defaultState.artifacts,
          artifact: null
        }
      })
    });

    expect(getByText('Loading...')).toBeDefined();
  });

  it('can add an Inclusion', () => {
    const store = createMockStore({
      ...defaultState,
      artifacts: {
        ...defaultState.artifacts,
        artifact: {
          ...artifact,
          expTreeInclude: emptyInstanceTree
        }
      }
    });

    renderComponent({ store: store });

    userEvent.click(screen.getByLabelText('Element type'));
    userEvent.click(screen.getByText('Demographics'));

    userEvent.click(screen.getByLabelText('Demographics element'));
    userEvent.click(screen.getByText('Age Range'));

    const actions = store.getActions().map(expandAction);
    const updateAction = actions.find(({ type }) => type === types.UPDATE_ARTIFACT);

    const [instance] = updateAction.artifact.expTreeInclude.childInstances;

    expect(instance).toBeDefined();
    expect(instance.id).toEqual('AgeRange');
  });

  it('can edit a template instance', () => {
    const store = createMockStore(defaultState);
    renderComponent({ store });

    fireEvent.change(document.querySelector('input[type=text]'), {
      target: { value: '30 to 45' }
    });

    const updateAction = expandAction(_.last(store.getActions()));
    const nameField = getFieldWithId(updateAction.artifact.expTreeInclude.childInstances[0].fields, 'element_name');

    expect(updateAction.type).toEqual(types.UPDATE_ARTIFACT);
    expect(nameField.value).toEqual('30 to 45');
  });

  it('can edit a conjunction instance', () => {
    const store = createMockStore(defaultState);
    renderComponent({ store });

    userEvent.click(screen.getAllByRole('button', { name: 'And' })[0]);
    userEvent.click(screen.getByText('Or'));

    const updateAction = expandAction(_.last(store.getActions()));
    const instance = updateAction.artifact.expTreeInclude;

    expect(updateAction.type).toEqual(types.UPDATE_ARTIFACT);
    expect(instance.id).toEqual('Or');
    expect(instance.name).toEqual('Or');
  });

  it("can update an instance's modifiers", () => {
    const store = createMockStore(defaultState);
    renderComponent({
      store
    });

    userEvent.click(screen.getAllByRole('button', { name: 'Add expression' })[0]);
    userEvent.click(screen.getByRole('button', { name: 'Is (Not) Null?' }));

    const updateAction = expandAction(_.last(store.getActions()));
    const [instance] = updateAction.artifact.expTreeInclude.childInstances;
    const [modifier] = instance.modifiers;

    expect(updateAction.type).toEqual(types.UPDATE_ARTIFACT);
    expect(modifier.id).toEqual('CheckExistence');
    expect(modifier.name).toEqual('Is (Not) Null?');
  });

  it('can delete an instance', () => {
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

    const { getByLabelText, getByText } = renderComponent({ store });

    fireEvent.click(getByLabelText('remove Age Range'));
    fireEvent.click(getByText('Delete'));

    const updateAction = expandAction(_.last(store.getActions()));

    expect(updateAction.type).toEqual(types.UPDATE_ARTIFACT);
    expect(updateAction.artifact.expTreeInclude.childInstances).toHaveLength(0);
  });

  describe('tabs', () => {
    it('can switch to the Base Elements tab', () => {
      const { getByText } = renderComponent();

      fireEvent.click(getByText('Base Elements'));
      expect(getByText('Base Elements')).toHaveClass('react-tabs__tab--selected');
    });

    it('can switch to the Parameters tab', () => {
      const { getByText } = renderComponent();

      fireEvent.click(getByText('Parameters'));
      expect(getByText('Parameters')).toHaveClass('react-tabs__tab--selected');
    });
  });
});
