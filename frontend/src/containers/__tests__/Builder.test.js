import React from 'react';
import { Provider } from 'react-redux';
import { createMockStore as reduxCreateMockStore } from 'redux-test-utils';
import _ from 'lodash';
import {
  instanceTree,
  emptyInstanceTree,
  artifact,
  reduxState
} from '../../utils/test_fixtures';
import { render, fireEvent, openSelect } from '../../utils/test-utils';
import Builder from '../Builder';
import { getFieldWithId } from '../../utils/instances';
import * as types from '../../actions/types';

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
    modifierMap: {
      ...reduxState.modifiers.modifierMap,
      CheckExistence: {
        id: 'CheckExistence',
        name: 'Is (Not) Null?',
        inputTypes: [
          'list_of_observations',
          'list_of_conditions',
          'list_of_medication_statements',
          'list_of_medication_requests',
          'list_of_procedures',
          'list_of_allergy_intolerances',
          'list_of_encounters',
          'list_of_immunizations',
          'list_of_devices',
          'list_of_any',
          'list_of_booleans',
          'list_of_system_quantities',
          'list_of_system_concepts',
          'list_of_system_codes',
          'list_of_integers',
          'list_of_datetimes',
          'list_of_strings',
          'list_of_decimals',
          'list_of_times',
          'list_of_others',
          'boolean',
          'system_quantity',
          'system_concept',
          'system_code',
          'observation',
          'condition',
          'medication_statement',
          'medication_request',
          'procedure',
          'allergy_intolerance',
          'encounter',
          'immunization',
          'device',
          'integer',
          'datetime',
          'decimal',
          'string',
          'time',
          'interval_of_integer',
          'interval_of_datetime',
          'interval_of_decimal',
          'interval_of_quantity',
          'any',
          'other'
        ],
        returnType: 'boolean',
        values: {},
        cqlTemplate: 'postModifier',
        comparisonOperator: null,
        validator: {
          type: 'require',
          fields: ['value'],
          args: null
        }
      }
    },
    modifiersByInputType: {
      ...reduxState.modifiers.modifiersByInputType,
      boolean: [
        {
          id: 'CheckExistence',
          name: 'Is (Not) Null?',
          inputTypes: [
            'list_of_observations',
            'list_of_conditions',
            'list_of_medication_statements',
            'list_of_medication_requests',
            'list_of_procedures',
            'list_of_allergy_intolerances',
            'list_of_encounters',
            'list_of_immunizations',
            'list_of_devices',
            'list_of_any',
            'list_of_booleans',
            'list_of_system_quantities',
            'list_of_system_concepts',
            'list_of_system_codes',
            'list_of_integers',
            'list_of_datetimes',
            'list_of_strings',
            'list_of_decimals',
            'list_of_times',
            'list_of_others',
            'boolean',
            'system_quantity',
            'system_concept',
            'system_code',
            'observation',
            'condition',
            'medication_statement',
            'medication_request',
            'procedure',
            'allergy_intolerance',
            'encounter',
            'immunization',
            'device',
            'integer',
            'datetime',
            'decimal',
            'string',
            'time',
            'interval_of_integer',
            'interval_of_datetime',
            'interval_of_decimal',
            'interval_of_quantity',
            'any',
            'other'
          ],
          returnType: 'boolean',
          values: {},
          cqlTemplate: 'postModifier',
          comparisonOperator: null,
          validator: {
            type: 'require',
            fields: ['value'],
            args: null
          }
        }
      ]
    }
  }
};

const createMockStore = (state) => {
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
  const renderComponent = ({
    store = createMockStore(defaultState),
    ...props
  } = {}) =>
    render(
      <Provider store={store}>
        <Builder match={{ params: {} }} {...props} />
      </Provider>
    );

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

    const { getByText, getByLabelText } = renderComponent({ store: store });

    openSelect(getByLabelText('Choose element type'));
    fireEvent.click(getByText('Demographics'));

    openSelect(getByLabelText('Select Demographics element'));
    fireEvent.click(getByText('Age Range'));

    const actions = store.getActions().map(expandAction);
    const updateAction = actions.find(
      ({ type }) => type === types.UPDATE_ARTIFACT
    );

    const [instance] = updateAction.artifact.expTreeInclude.childInstances;

    expect(instance).toBeDefined();
    expect(instance.id).toEqual('AgeRange');
  });

  it('can edit a template instance', () => {
    const store = createMockStore(defaultState);
    const { getByLabelText } = renderComponent({ store });

    fireEvent.change(getByLabelText('Age Range'), {
      target: { value: '30 to 45' }
    });

    const updateAction = expandAction(_.last(store.getActions()));
    const nameField = getFieldWithId(
      updateAction.artifact.expTreeInclude.childInstances[0].fields,
      'element_name'
    );

    expect(updateAction.type).toEqual(types.UPDATE_ARTIFACT);
    expect(nameField.value).toEqual('30 to 45');
  });

  it('can edit a conjunction instance', () => {
    const store = createMockStore(defaultState);
    const { container, getByText } = renderComponent({ store });

    openSelect(
      container.querySelector('.conjunction-select__single-value + input')
    );
    fireEvent.click(getByText('Or'));

    const updateAction = expandAction(_.last(store.getActions()));
    const instance = updateAction.artifact.expTreeInclude;

    expect(updateAction.type).toEqual(types.UPDATE_ARTIFACT);
    expect(instance.id).toEqual('Or');
    expect(instance.name).toEqual('Or');
  });

  it("can update an instance's modifiers", () => {
    const store = createMockStore(defaultState);
    const { getAllByLabelText, getByText } = renderComponent({
      store
    });

    fireEvent.click(getAllByLabelText('add expression')[0]);
    fireEvent.click(getByText('Is (Not) Null?'));

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

    const { getByLabelText } = renderComponent({ store });

    fireEvent.click(getByLabelText('remove Age Range'));

    const updateAction = expandAction(_.last(store.getActions()));

    expect(updateAction.type).toEqual(types.UPDATE_ARTIFACT);
    expect(updateAction.artifact.expTreeInclude.childInstances).toHaveLength(0);
  });

  describe('tabs', () => {
    it('can switch to the Base Elements tab', () => {
      const { getByText } = renderComponent();

      fireEvent.click(getByText('Base Elements'));
      expect(getByText('Base Elements')).toHaveClass(
        'react-tabs__tab--selected'
      );
    });

    it('can switch to the Parameters tab', () => {
      const { getByText } = renderComponent();

      fireEvent.click(getByText('Parameters'));
      expect(getByText('Parameters')).toHaveClass('react-tabs__tab--selected');
    });
  });
});
