import * as types from '../../actions/types';
import reducer from '../../reducers/resources';

describe.only('resources reducer', () => {
  it('should return the initial state', () => {
    expect(reducer(undefined, {})).toEqual({
      resources: null,
      loadResources: { isLoadingResources: null, loadResourcesStatus: null }
    });
  });

  it('should handle getting resources', () => {
    let action = { type: types.RESOURCES_REQUEST };
    let newState = { loadResources: { isLoadingResources: true, loadResourcesStatus: null } };
    expect(reducer([], action)).toEqual(newState);

    const previousState = { loadResources: { isLoadingResources: false, loadResourcesStatus: 'Test' } };
    expect(reducer(previousState, action)).toEqual(newState);

    action = { type: types.LOAD_RESOURCES_SUCCESS, resources: 'Test resources' };
    newState = {
      resources: action.resources,
      loadResources: { isLoadingResources: false, loadResourcesStatus: 'success' }
    };
    expect(reducer(previousState, action)).toEqual(newState);

    action = { type: types.LOAD_RESOURCES_FAILURE, status: 'Test status', statusText: 'Test status text' };
    newState = { loadResources: { isLoadingResources: false, loadResourcesStatus: 'failure' } };
    expect(reducer(previousState, action)).toEqual(newState);
  });
});
