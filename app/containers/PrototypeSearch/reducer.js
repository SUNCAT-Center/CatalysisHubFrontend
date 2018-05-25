/*
 *
 * PrototypeSearch reducer
 *
 */


import _ from 'lodash';
import * as constants from './constants';

const initialState = {
  searchTerms: '',
  searchResults: {},
  searchLimit: 50,
  facetFilters: [],
  ptype: '',
  repoPrototypes: [],
  groupedRepoPrototypes: {},
};

function prototypeSearchReducer(state = initialState, action) {
  switch (action.type) {
    case constants.SAVE_GROUPED_REPO_PROTOTYPES: {
      return {
        ...state,
        groupedRepoPrototypes: action.payload.groupedRepoPrototypes,
      };
    }
    case constants.SAVE_REPO_PROTOTYPES: {
      return {
        ...state,
        repoPrototypes: action.payload.repoPrototypes,
      };
    }
    case constants.SAVE_PROTOTYPE: {
      return {
        ...state,
        ptype: action.payload.ptype,
      };
    }
    case constants.REMOVE_FACET_FILTER: {
      return {
        ...state,
        facetFilters: state.facetFilters.filter((x) => x !== action.payload.facetFilter),
      };
    }
    case constants.ADD_FACET_FILTER: {
      return {
        ...state,
        facetFilters: _.concat(state.facetFilters, [action.payload.facetFilter]),
      };
    }
    case constants.SAVE_SEARCH_LIMIT: {
      return {
        ...state,
        searchLimit: action.payload.searchLimit,
      };
    }
    case constants.SAVE_SEARCH_TERMS: {
      return {
        ...state,
        searchTerms: action.payload.searchTerms,
      };
    }
    case constants.SAVE_SEARCH_RESULTS: {
      return {
        ...state,
        searchResults: action.payload.searchResults,
      };
    }
    case constants.DEFAULT_ACTION:
    default:
      return state;
  }
}

export default prototypeSearchReducer;
