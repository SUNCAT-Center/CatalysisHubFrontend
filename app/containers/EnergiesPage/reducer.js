/*
 *
 * EnergiesPage reducer
 *
 */

import _ from 'lodash';

import {
  DEFAULT_ACTION,
  RECEIVE_REACTIONS,
  SELECT_REACTION,
  RECEIVE_SYSTEMS,
  SAVE_SYSTEM,
  CLEAR_SYSTEMS,
  SUBMIT_SEARCH,
  UPDATE_FILTER,
} from './constants';

const initialState = {
  selectedReaction: {},
  matchingReactions: [],
  reactionSystems: [],
  searchSubmitted: false,
  searchParams: {},
  filter: {},
};


function energiesPageReducer(state = initialState, action) {
  const update = {};
  switch (action.type) {
    case UPDATE_FILTER:
      update[action.payload.field] = action.payload.value;
      return {
        ...state,
        filter: _.extend(state.filter, update),
      };

    case SUBMIT_SEARCH:
      return {
        ...state,
        searchSubmitted: true,
        searchParams: _.extend(state.searchParams, action.payload),
      };
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
    case SAVE_SYSTEM: {
      let reactionSystems = state.reactionSystems;
      reactionSystems = reactionSystems.concat(action.payload);

      const negativeDensity = (system) => {
        if (typeof system.mass !== 'undefined' && typeof system.volume !== 'undefined') {
          return system.mass / system.volume;
        }
        return 0.0;
      };

      reactionSystems.sort(negativeDensity);
      return {
        ...state,
        reactionSystems,
      };
    }
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
