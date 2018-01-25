import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import moxios from 'moxios';

import loadTemplates from '../../actions/templates';
import * as types from '../../actions/types';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

describe('template actions', () => {
  describe('loadTemplates', () => {
    beforeEach(() => { moxios.install(); });
    afterEach(() => { moxios.uninstall(); });

    it('dispatches a LOAD_TEMPLATES_SUCCESS action on successful load', () => {
      const store = mockStore({});

      moxios.stubs.track({
        url: '/authoring/api/config/templates',
        method: 'GET',
        response: { status: 200, response: [] }
      });

      const expectedActions = [
        { type: types.TEMPLATES_REQUEST },
        { type: types.LOAD_TEMPLATES_SUCCESS, templates: [] }
      ];

      return store.dispatch(loadTemplates()).then(() => {
        expect(store.getActions()).toEqual(expectedActions);
      });
    });

    it('dispatches a LOAD_TEMPLATES_FAILURE action on failure', () => {
      const store = mockStore({});

      moxios.stubs.track({
        url: '/authoring/api/config/templates',
        method: 'GET',
        response: { status: 401, statusText: 'Unauthorized' }
      });

      const expectedActions = [
        { type: types.TEMPLATES_REQUEST },
        { type: types.LOAD_TEMPLATES_FAILURE, status: 401, statusText: 'Unauthorized' }
      ];

      return store.dispatch(loadTemplates()).then(() => {
        expect(store.getActions()).toEqual(expectedActions);
      });
    });
  });
});
