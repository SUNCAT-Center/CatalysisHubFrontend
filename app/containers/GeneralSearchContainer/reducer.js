/*
 *
 * GeneralSearchContainer reducer
 *
 */

import {
  DEFAULT_ACTION,
  RECEIVE_RESULTS,
  SELECT_UUID,
  SAVE_SYSTEM,
} from './constants';

const initialState = {
  selectedUUID: '',
  searchResults: [],
  selectedSystem: {},
};

function generalSearchContainerReducer(state = initialState, action) {
  switch (action.type) {
    case SELECT_UUID:
      return {
        ...state,
        selectedUUID: action.payload,
      };
    case RECEIVE_RESULTS:
      return {
        ...state,
        searchResults: action.payload,
      };
    case SAVE_SYSTEM:
      return {
        ...state,
        selectedSystem: action.payload,
      };
    case DEFAULT_ACTION:
      return state;
    default:
      return state;
  }
}

export default generalSearchContainerReducer;
