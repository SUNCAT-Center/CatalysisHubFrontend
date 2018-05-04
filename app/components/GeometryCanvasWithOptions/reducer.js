import * as constants from './constants';

const initialState = {
  xRepeat: 2,
  yRepeat: 2,
  zRepeat: 2,
};

function geometryCanvasReducer(state = initialState, action) {
  switch (action.type) {
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
        zRepeat: action.payload.yRepeat,
      };
    }
    case constants.DEFAULT_ACTION:
      return state;
    default:
      return state;
  }
}

export default geometryCanvasReducer;
