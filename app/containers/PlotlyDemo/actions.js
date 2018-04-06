/*
 *
 * PlotlyDemo actions
 *
 */

import {
  DEFAULT_ACTION,
  CLICK_DOT,
} from './constants';

export function clickDot(event) {
  const point = event.points[0];
  return {
    type: CLICK_DOT,
    payload: { x: point.x, y: point.y },
  };
}

export function defaultAction() {
  return {
    type: DEFAULT_ACTION,
  };
}
