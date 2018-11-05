/*
 *
 * EnergiesPage actions
 *
 */

import * as constants from './constants';


export function handleRequestSort(event, property) {
  return {
    type: constants.HANDLE_REQUEST_SORT,
    payload: {
      event,
      property,
    },


  };
}

export function saveSearchQuery(searchQuery) {
  return {
    type: constants.SAVE_SEARCH_QUERY,
    payload: {
      searchQuery,
    },
  };
}

export function saveSearchString(searchString) {
  return {
    type: constants.SAVE_SEARCH_STRING,
    payload: {
      searchString,
    },
  };
}

export function setDbError() {
  return {
    type: constants.DB_ERROR,
  };
}

export function toggleSimpleSearch() {
  return {
    type: constants.TOGGLE_SIMPLE_SEARCH,
  };
}

export function toggleGeometry() {
  return {
    type: constants.TOGGLE_GEOMETRY,
  };
}

export function saveResultSize(resultSize) {
  return {
    type: constants.SAVE_RESULT_SIZE,
    payload: {
      resultSize,
    },
  };
}

export function saveSearch(search) {
  return {
    type: constants.SAVE_SEARCH,
    payload: {
      search,
    },
  };
}

export function updateFilter(field, value) {
  return {
    type: constants.UPDATE_FILTER,
    payload: {
      field,
      value,
    },
  };
}

export function submitSearch(params) {
  return {
    type: constants.SUBMIT_SEARCH,
    payload: params,
  };
}

export function selectReaction(element) {
  return {
    type: constants.SELECT_REACTION,
    payload: element,
  };
}

export function receiveReactions(element) {
  return {
    type: constants.RECEIVE_REACTIONS,
    payload: element,
  };
}

export function receiveSystems(element) {
  return {
    type: constants.RECEIVE_SYSTEMS,
    payload: element,
  };
}

export function clearSystems() {
  return {
    type: constants.CLEAR_SYSTEMS,
  };
}

export function savePublication(x) {
  return {
    type: constants.SAVE_PUBLICATION,
    payload: {
      publication: x,
    },
  };
}

export function saveLoading(x) {
  return {
    type: constants.SAVE_LOADING,
    payload: {
      loading: x,
    },
  };
}

export function saveSystem(system) {
  return {
    type: constants.SAVE_SYSTEM,
    payload: system,
  };
}

export function defaultAction() {
  return {
    type: constants.DEFAULT_ACTION,
  };
}
