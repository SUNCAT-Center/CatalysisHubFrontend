/*
 *
 * PlotlyDemo reducer
 *
 */

import {
  DEFAULT_ACTION,
  CLICK_DOT,
} from './constants';

const initialState = {
  selectedDot: {},
};

function plotlyDemoReducer(state = initialState, action) {
  switch (action.type) {
    case CLICK_DOT:
      return {
        ...state,
        selectedDot: action.payload,
      };
    case DEFAULT_ACTION:
      return state;
    default:
      return state;
  }
}

export default plotlyDemoReducer;
