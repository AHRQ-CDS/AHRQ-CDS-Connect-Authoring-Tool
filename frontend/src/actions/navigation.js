import * as types from './types';

// sets the current tab in the element builder
export function setActiveTab(activeTab) {
  return {
    type: types.SET_ACTIVE_TAB,
    activeTab
  };
}

// sets the id to scroll to in the element builder
export function setScrollToId(scrollToId) {
  return {
    type: types.SET_SCROLL_TO_ID,
    scrollToId
  };
}
