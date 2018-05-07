import * as constants from './constants';

const initialState = {
  xRepeat: 2,
  yRepeat: 2,
  zRepeat: 2,
  rotationMatrix: [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1.3],
  canvas: {},
};

function geometryCanvasReducer(state = initialState, action) {
  switch (action.type) {
    case constants.SAVE_CANVAS: {
      return {
        ...state,
        canvas: action.payload.canvas,
      };
    }
    case constants.SET_ROTATION_MATRIX: {
      return {
        ...state,
        rotationMatrix: action.payload.rotationMatrix,
      };
    }
    case constants.SET_X_REPEAT: {
      return {
        ...state,
        xRepeat: action.payload.xRepeat,
      };
    }

    case constants.SET_Y_REPEAT: {
      return {
        ...state,
        yRepeat: action.payload.yRepeat,
      };
    }

    case constants.SET_Z_REPEAT: {
      return {
        ...state,
        zRepeat: action.payload.zRepeat,
      };
    }
    case constants.DEFAULT_ACTION:
      return state;
    default:
      return state;
  }
}

export default geometryCanvasReducer;
