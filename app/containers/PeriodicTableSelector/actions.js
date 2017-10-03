/*
 *
 * PeriodicTableSelector actions
 *
 */

import {
  DEFAULT_ACTION,
  ELEMENT_CLICKED,
  CLEAR_SELECTION,
} from './constants';

export function clickElement(element) {
  return {
    type: ELEMENT_CLICKED,
    payload: element,
  };
}

export function clearSelection() {
  return {
    type: CLEAR_SELECTION,
  };
}

export function defaultAction() {
  return {
    type: DEFAULT_ACTION,
  };
}
