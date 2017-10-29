/*
 *
 * EnergiesPage reducer
 *
 */

import {
  DEFAULT_ACTION,
  RECEIVE_REACTIONS,
  SELECT_REACTION,
  RECEIVE_SYSTEMS,
  SAVE_SYSTEM,
  CLEAR_SYSTEMS,
} from './constants';

const initialState = {
  selectedReaction: {},
  matchingReactions: [],
  reactionSystems: [],
};

function energiesPageReducer(state = initialState, action) {
  switch (action.type) {
    case DEFAULT_ACTION:
      return state;
    case SELECT_REACTION:
      return {
        ...state,
        selectedReaction: action.payload,
      };
    case RECEIVE_REACTIONS:
      return {
        ...state,
        matchingReactions: action.payload,
      };
    case RECEIVE_SYSTEMS:
      return {
        ...state,
        reactionSystems: action.payload,
      };
    case SAVE_SYSTEM:
      return {
        ...state,
        reactionSystems: state.reactionSystems.concat(action.payload),
      };
    case CLEAR_SYSTEMS:
      return {
        ...state,
        reactionSystems: [],
      };
    default:
      return state;
  }
}

export default energiesPageReducer;
