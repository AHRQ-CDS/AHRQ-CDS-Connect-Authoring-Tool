import * as types from 'actions/types';

const defaultState = {
  artifact: null,
  artifactSaved: true,
  librariesInUse: []
};

export default function auth(state = defaultState, action) {
  switch (action.type) {
    case types.UPDATE_ARTIFACT:
    case types.LOAD_ARTIFACT:
      return {
        ...state,
        artifact: action.artifact,
        artifactSaved: false,
        librariesInUse: action.librariesInUse
      };
    case types.SAVE_ARTIFACT_SUCCESS:
      return {
        ...state,
        artifactSaved: true,
        artifact: action.artifact
      };
    default:
      return state;
  }
}
