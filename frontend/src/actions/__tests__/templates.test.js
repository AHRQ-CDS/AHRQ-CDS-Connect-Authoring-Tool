import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import nock from 'nock';

import loadTemplates from '../templates';
import * as types from '../types';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

describe('template actions', () => {
  describe('loadTemplates', () => {
    it('dispatches a LOAD_TEMPLATES_SUCCESS action on successful load', () => {
      const store = mockStore({});

      nock('http://localhost').get('/authoring/api/config/templates').reply(200, []);

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

      nock('http://localhost')
        .get('/authoring/api/config/templates')
        .reply(401, function () {
          this.req.response.statusMessage = 'Unauthorized';
          return { status: 401 };
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
