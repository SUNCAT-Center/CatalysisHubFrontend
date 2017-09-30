/*
 *
 * PeriodicTableSelector actions
 *
 */

import {
  DEFAULT_ACTION,
  ELEMENT_CLICKED,
} from './constants';

export function clickElement() {
  return {
    type: ELEMENT_CLICKED,
  };
}

export function defaultAction() {
  return {
    type: DEFAULT_ACTION,
  };
}
