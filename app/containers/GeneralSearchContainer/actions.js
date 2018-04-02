/*
 *
 * GeneralSearchContainer actions
 *
 */

import {
  DEFAULT_ACTION,
  SELECT_UUID,
  RECEIVE_RESULTS,
  SAVE_SYSTEM,
} from './constants';

export function selectUUID(element) {
  return {
    type: SELECT_UUID,
    payload: element,
  };
}

export function receiveResults(elements) {
  return {
    type: RECEIVE_RESULTS,
    payload: elements,
  };
}

export function saveSystem(elements) {
  return {
    type: SAVE_SYSTEM,
    payload: elements,
  };
}

export function defaultAction() {
  return {
    type: DEFAULT_ACTION,
  };
}
