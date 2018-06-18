import * as constants from './constants';


export function setStereographic(x) {
  let y;
  if (typeof x === 'undefined') {
    y = true;
  } else {
    y = x;
  }
  return {
    type: constants.SET_STEREOGRAPHIC,
    payload: {
      stereographic: y,
    },

  };
}

export function saveCanvas(x) {
  return {
    type: constants.SAVE_CANVAS,
    payload: {
      canvas: x,
    },
  };
}

export function setRotationMatrix(x) {
  return {
    type: constants.SET_ROTATION_MATRIX,
    payload: {
      rotationMatrix: x,
    },
  };
}

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
