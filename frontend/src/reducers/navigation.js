import * as types from '../actions/types';

const defaultState = {
  activeTab: 0,
  scrollToId: null
};

export default function navigation(state = defaultState, action) {
  switch (action.type) {
    case types.SET_ACTIVE_TAB:
      return {
        ...state,
        activeTab: action.activeTab
      };
    case types.SET_SCROLL_TO_ID:
      return {
        ...state,
        scrollToId: action.scrollToId
      };
    default:
      return state;
  }
}
