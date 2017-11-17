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
  const miniPoint = { x: point.x, y: point.y };
  console.log(miniPoint);

  return {
    type: CLICK_DOT,
    payload: { x: point.x, y: point.y },
    /* payload: point,*/

  };
}

export function defaultAction() {
  return {
    type: DEFAULT_ACTION,
  };
}
