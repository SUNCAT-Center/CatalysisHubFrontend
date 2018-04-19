/*
 *
 * PrototypeSearch actions
 *
 */

import * as constants from './constants';

export function defaultAction() {
  return {
    type: constants.DEFAULT_ACTION,
  };
}

export function saveSearchTerms(searchTerm) {
  return {
    type: constants.SAVE_SEARCH_TERMS,
    payload: {
      searchTerm,
    },
  };
}

export function saveSearchResults(searchResults) {
  return {
    type: constants.SAVE_SEARCH_RESULTS,
    payload: {
      searchResults,
    },
  };
}

export function saveSearchLimit(searchLimit) {
  return {
    type: constants.SAVE_SEARCH_LIMIT,
    payload: {
      searchLimit,
    },
  };
}

export function addFacetFilter(facetFilter) {
  return {
    type: constants.ADD_FACET_FILTER,
    payload: {
      facetFilter,
    },
  };
}

export function removeFacetFilter(facetFilter) {
  return {
    type: constants.REMOVE_FACET_FILTER,
    payload: {
      facetFilter,
    },
  };
}

export function savePrototype(ptype) {
  return {
    type: constants.SAVE_PROTOTYPE,
    payload: {
      ptype,
    },
  };
}

export function saveRepoPrototypes(repoPrototypes) {
  return {
    type: constants.SAVE_REPO_PROTOTYPES,
    payload: {
      repoPrototypes,
    },
  };
}

