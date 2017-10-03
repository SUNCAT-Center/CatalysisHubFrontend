/*
 *
 * PeriodicTableSelector actions
 *
 */

import {
  DEFAULT_ACTION,
  ELEMENT_CLICKED,
} from './constants';

export function clickElement(element) {
  return {
    type: ELEMENT_CLICKED,
    payload: element,
  };
}

export function defaultAction() {
  return {
    type: DEFAULT_ACTION,
  };
}
