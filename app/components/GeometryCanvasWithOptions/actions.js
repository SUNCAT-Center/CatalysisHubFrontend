import * as constants from './constants';

export function setXRepeat(x) {
  return {
    type: constants.SET_X_REPEAT,
    payload: {
      xRepeat: x,
    },
  };
}

export function setYRepeat(x) {
  return {
    type: constants.SET_Y_REPEAT,
    payload: {
      yRepeat: x,
    },
  };
}

export function setZRepeat(x) {
  return {
    type: constants.SET_Z_REPEAT,
    payload: {
      zRepeat: x,
    },
  };
}
