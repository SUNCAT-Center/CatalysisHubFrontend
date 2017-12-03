/*
 *
 * ActivityMapsPage actions
 *
 */

import {
  DEFAULT_ACTION,
  CLICK_DOT,
} from './constants';

export function defaultAction() {
  return {
    type: DEFAULT_ACTION,
  };
}

export function clickDot(event) {
  const point = event.points[0];
  const miniPoint = { x: point.x, y: point.y, text: point.text };

  return {
    type: CLICK_DOT,
    payload: miniPoint,
  };
}
