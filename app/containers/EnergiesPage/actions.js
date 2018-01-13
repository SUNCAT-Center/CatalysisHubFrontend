/*
 *
 * EnergiesPage actions
 *
 */

import * as constants from './constants';

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
