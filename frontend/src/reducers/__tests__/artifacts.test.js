import * as types from 'actions/types';
import reducer from '../artifacts';

describe('artifacts reducer', () => {
  it('should return the initial state', () => {
    expect(reducer(undefined, {})).toEqual({
      artifact: null,
      artifactSaved: true,
      librariesInUse: []
    });
  });

  // ----------------------- UPDATE ARTIFACT ------------------------------- //
  it('should handle updating an artifact', () => {
    const action = { type: types.UPDATE_ARTIFACT, artifact: 'Test artifact', librariesInUse: ['MyCQL'] };
    const newState = { artifact: 'Test artifact', artifactSaved: false, librariesInUse: ['MyCQL'] };
    expect(reducer([], action)).toEqual(newState);

    const previousState = { artifact: 'Old artifact', artifactSaved: true, librariesInUse: ['MyOldCQL'] };
    expect(reducer(previousState, action)).toEqual(newState);
  });

  // ----------------------- SAVE ARTIFACT --------------------------------- //
  it('should handle saving an artifact', () => {
    let action = { type: types.SAVE_ARTIFACT_SUCCESS };
    let newState = { artifactSaved: true };
    expect(reducer([], action)).toEqual(newState);

    const previousState = { artifactSaved: false };
    expect(reducer(previousState, action)).toEqual(newState);
  });
});
