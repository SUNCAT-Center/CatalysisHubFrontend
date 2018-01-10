/*
 *
 * EnergiesPage actions
 *
 */

import {
  DEFAULT_ACTION,
  RECEIVE_SYSTEMS,
  RECEIVE_REACTIONS,
  SELECT_REACTION,
  CLEAR_SYSTEMS,
  SAVE_SYSTEM,
  SUBMIT_SEARCH,
} from './constants';


export function submitSearch(params) {
  return {
    type: SUBMIT_SEARCH,
    payload: params,
  };
}

export function selectReaction(element) {
  return {
    type: SELECT_REACTION,
    payload: element,
  };
}

export function receiveReactions(element) {
  return {
    type: RECEIVE_REACTIONS,
    payload: element,
  };
}

export function receiveSystems(element) {
  return {
    type: RECEIVE_SYSTEMS,
    payload: element,
  };
}

export function clearSystems() {
  return {
    type: CLEAR_SYSTEMS,
  };
}

export function saveSystem(system) {
  return {
    type: SAVE_SYSTEM,
    payload: system,
  };
}

export function defaultAction() {
  return {
    type: DEFAULT_ACTION,
  };
}
