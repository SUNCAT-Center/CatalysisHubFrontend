/*
 *
 * EnergiesPage reducer
 *
 */

import _ from 'lodash';
import * as constants from './constants';

const initialState = {
  loading: false,
  selectedReaction: {},
  publication: {},
  matchingReactions: [],
  reactionSystems: [],
  searchSubmitted: false,
  searchParams: {},
  searchString: '',
  filter: {},
  search: {},
  resultSize: 0,
  withGeometry: true,
  simpleSearch: false,
  dbError: false,
  searchQuery: '',
  order: 'desc',
  orderBy: '',
};

let order;
let matchingReactions;
let orderBy;


function energiesPageReducer(state = initialState, action) {
  const update = {};
  switch (action.type) {
    case constants.SAVE_PUBLICATION:
      return {
        ...state,
        publication: action.payload.publication,
      };

    case constants.SAVE_LOADING:
      return {
        ...state,
        publication: action.payload.loading,
      };
    case constants.HANDLE_REQUEST_SORT:
      order = 'desc';
      orderBy = action.payload.property;
      if (state.orderBy === orderBy && state.order === 'desc') {
        order = 'asc';
      }

      if (order === 'desc') {
        matchingReactions = state.matchingReactions.sort((a, b) => (b.node[orderBy] < a.node[orderBy] ? -1 : 1));
      } else {
        matchingReactions = state.matchingReactions.sort((a, b) => (b.node[orderBy] > a.node[orderBy] ? -1 : 1));
      }
      return {
        ...state,
        order,
        orderBy,
        matchingReactions,
      };
    case constants.SAVE_SEARCH_QUERY:
      return {
        ...state,
        searchQuery: action.payload.searchQuery,
      };

    case constants.SAVE_SEARCH_STRING:
      return {
        ...state,
        searchString: action.payload.searchString,
        searchSubmitted: true,
      };
    case constants.TOGGLE_SIMPLE_SEARCH:
      return {
        ...state,
        simpleSearch: !state.simpleSearch,
        searchSubmitted: false,
      };
    case constants.TOGGLE_GEOMETRY:
      return {
        ...state,
        withGeometry: !state.withGeometry,
      };
    case constants.SAVE_RESULT_SIZE:
      return {
        ...state,
        resultSize: action.payload.resultSize,
      };
    case constants.SAVE_SEARCH:
      return {
        ...state,
        search: action.payload.search,
      };
    case constants.UPDATE_FILTER:
      update[action.payload.field] = action.payload.value;
      return {
        ...state,
        filter: _.extend(state.filter, update),
      };

    case constants.SUBMIT_SEARCH:
      return {
        ...state,
        searchSubmitted: true,
        searchParams: _.extend(state.searchParams, action.payload),
      };
    case constants.DEFAULT_ACTION:
      return state;
    case constants.SELECT_REACTION:
      return {
        ...state,
        selectedReaction: action.payload,
        reactionSystems: [],
        publication: [],
      };
    case constants.RECEIVE_REACTIONS:
      return {
        ...state,
        matchingReactions: action.payload,
        selectedReaction: [],
        reactionSystems: [],
        publication: [],
      };
    case constants.RECEIVE_SYSTEMS:
      return {
        ...state,
        reactionSystems: action.payload,
      };
    case constants.SAVE_SYSTEM: {
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
    case constants.CLEAR_SYSTEMS:
      return {
        ...state,
        reactionSystems: [],
        searchSubmitted: false,
      };
    default:
      return state;
  }
}

export default energiesPageReducer;
