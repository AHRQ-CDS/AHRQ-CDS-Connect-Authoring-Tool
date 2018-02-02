import * as types from '../../actions/types';
import reducer from '../../reducers/templates';

describe.only('templates reducer', () => {
  it('should return the initial state', () => {
    expect(reducer(undefined, {})).toEqual({
      templates: null,
      loadTemplates: { isLoadingTemplates: null, loadTemplatesStatus: null }
    });
  });

  it('should handle getting templates', () => {
    let action = { type: types.TEMPLATES_REQUEST };
    let newState = { loadTemplates: { isLoadingTemplates: true, loadTemplatesStatus: null } };
    expect(reducer([], action)).toEqual(newState);

    const previousState = { loadTemplates: { isLoadingTemplates: false, loadTemplatesStatus: 'Test' } };
    expect(reducer(previousState, action)).toEqual(newState);

    action = { type: types.LOAD_TEMPLATES_SUCCESS, templates: 'Test templates' };
    newState = {
      templates: 'Test templates',
      loadTemplates: { isLoadingTemplates: false, loadTemplatesStatus: 'success' }
    };
    expect(reducer(previousState, action)).toEqual(newState);

    action = { type: types.LOAD_TEMPLATES_FAILURE, status: 'Test status', statusText: 'Test status text' };
    newState = { loadTemplates: { isLoadingTemplates: false, loadTemplatesStatus: 'failure' } };
    expect(reducer(previousState, action)).toEqual(newState);
  });
});
